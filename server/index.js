require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { query, transaction } = require('./db');
const { generateAnalysisReport } = require('./reportTemplate');
const { toCamelTask, toCamelMonitor, toCamelRun } = require('./serializers');

const app = express();
const port = Number(process.env.PORT || 4000);
const uploadLimitMb = Number(process.env.UPLOAD_LIMIT_MB || 4);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: uploadLimitMb * 1024 * 1024, files: 8 },
});

app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json({ limit: `${Math.max(uploadLimitMb * 8, 16)}mb` }));

function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

async function fetchTaskWithReport(id) {
  const result = await query(
    `SELECT t.*, r.result
     FROM analysis_tasks t
     LEFT JOIN analysis_reports r ON r.task_id = t.id
     WHERE t.id = $1`,
    [id],
  );
  const row = result.rows[0];
  return row ? toCamelTask(row, row.result || undefined) : null;
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'design-intelligence-api' });
});

app.get('/api/analysis/tasks', asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const pageSize = Math.min(Math.max(Number(req.query.pageSize || 10), 1), 50);
  const filters = [];
  const values = [];

  const addFilter = (sql, value) => {
    values.push(value);
    filters.push(sql.replace('?', `$${values.length}`));
  };

  if (req.query.type) addFilter('type = ?', req.query.type);
  if (req.query.status) addFilter('status = ANY(string_to_array(?, \',\'))', req.query.status);
  if (req.query.pageType) addFilter('page_type = ?', req.query.pageType);
  if (req.query.competitor) addFilter('competitor_name ILIKE ?', `%${req.query.competitor}%`);
  if (req.query.startDate) addFilter('created_at >= ?', req.query.startDate);
  if (req.query.endDate) addFilter('created_at <= ?', req.query.endDate);

  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const countResult = await query(`SELECT COUNT(*)::INTEGER AS total FROM analysis_tasks ${where}`, values);
  values.push(pageSize, (page - 1) * pageSize);
  const listResult = await query(
    `SELECT * FROM analysis_tasks ${where} ORDER BY created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values,
  );

  res.json({ data: listResult.rows.map(row => toCamelTask(row)), total: countResult.rows[0].total });
}));

app.post('/api/analysis/tasks', asyncHandler(async (req, res) => {
  const { competitorName, pageType, deviceType, brief, materials = [] } = req.body;
  if (!competitorName || !pageType || !deviceType) {
    res.status(400).json({ message: 'competitorName, pageType and deviceType are required.' });
    return;
  }

  const task = await transaction(async (client) => {
    const taskResult = await client.query(
      `INSERT INTO analysis_tasks
        (type, status, competitor_name, page_type, device_type, brief, material_count, completed_at)
       VALUES ('manual', 'completed', $1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [competitorName, pageType, deviceType, brief || {}, materials.length],
    );
    const taskRow = taskResult.rows[0];
    const materialRows = [];

    for (const item of materials) {
      if (!item.contentBase64) continue;
      const inserted = await client.query(
        `INSERT INTO analysis_materials
          (task_id, category, file_name, mime_type, size_bytes, content_base64, recognition)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          taskRow.id,
          item.category === 'own' ? 'own' : 'competitor',
          item.fileName || 'material',
          item.mimeType || 'application/octet-stream',
          Number(item.sizeBytes || 0),
          item.contentBase64,
          item.recognition || {},
        ],
      );
      materialRows.push(inserted.rows[0]);
    }

    const report = generateAnalysisReport(taskRow, materialRows);
    await client.query(
      `INSERT INTO analysis_reports (task_id, result)
       VALUES ($1, $2)
       ON CONFLICT (task_id) DO UPDATE SET result = EXCLUDED.result, updated_at = NOW()`,
      [taskRow.id, report],
    );
    return toCamelTask(taskRow, report);
  });

  res.status(201).json(task);
}));

app.post('/api/analysis/tasks/:id/materials', upload.array('files'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = req.body.category === 'own' ? 'own' : 'competitor';
  const files = req.files || [];

  const inserted = await transaction(async (client) => {
    const rows = [];
    for (const file of files) {
      const result = await client.query(
        `INSERT INTO analysis_materials
          (task_id, category, file_name, mime_type, size_bytes, content_base64, recognition)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, file_name, mime_type, size_bytes, category, recognition, created_at`,
        [id, category, file.originalname, file.mimetype, file.size, file.buffer.toString('base64'), {}],
      );
      rows.push(result.rows[0]);
    }
    await client.query('UPDATE analysis_tasks SET material_count = material_count + $1 WHERE id = $2', [rows.length, id]);
    return rows;
  });

  res.status(201).json({ data: inserted });
}));

app.get('/api/analysis/tasks/:id', asyncHandler(async (req, res) => {
  const task = await fetchTaskWithReport(req.params.id);
  if (!task) {
    res.status(404).json({ message: 'Task not found.' });
    return;
  }
  res.json(task);
}));

app.delete('/api/analysis/tasks/:id', asyncHandler(async (req, res) => {
  await query('DELETE FROM analysis_tasks WHERE id = $1', [req.params.id]);
  res.status(204).end();
}));

app.post('/api/analysis/tasks/:id/retry', asyncHandler(async (req, res) => {
  const result = await transaction(async (client) => {
    const taskResult = await client.query('SELECT * FROM analysis_tasks WHERE id = $1', [req.params.id]);
    const taskRow = taskResult.rows[0];
    if (!taskRow) return null;
    const materialResult = await client.query('SELECT * FROM analysis_materials WHERE task_id = $1', [req.params.id]);
    const report = generateAnalysisReport(taskRow, materialResult.rows);
    await client.query(
      `UPDATE analysis_tasks SET status = 'completed', completed_at = NOW() WHERE id = $1`,
      [req.params.id],
    );
    await client.query(
      `INSERT INTO analysis_reports (task_id, result)
       VALUES ($1, $2)
       ON CONFLICT (task_id) DO UPDATE SET result = EXCLUDED.result, updated_at = NOW()`,
      [req.params.id, report],
    );
    return toCamelTask({ ...taskRow, status: 'completed', completed_at: new Date().toISOString() }, report);
  });

  if (!result) {
    res.status(404).json({ message: 'Task not found.' });
    return;
  }
  res.json(result);
}));

app.get('/api/dashboard/summary', asyncHandler(async (_req, res) => {
  const [stats, recent, activeMonitors, weeklyChanges] = await Promise.all([
    query(`SELECT COUNT(*)::INTEGER AS total_tasks,
                  COUNT(*) FILTER (WHERE completed_at >= NOW() - INTERVAL '7 days')::INTEGER AS weekly_completed
           FROM analysis_tasks`),
    query('SELECT * FROM analysis_tasks ORDER BY created_at DESC LIMIT 5'),
    query(`SELECT COUNT(*)::INTEGER AS active_count FROM monitors WHERE status = 'active'`),
    query(`SELECT COALESCE(SUM(change_count), 0)::INTEGER AS weekly_changes
           FROM monitor_runs WHERE executed_at >= NOW() - INTERVAL '7 days'`),
  ]);

  res.json({
    stats: {
      totalTasks: stats.rows[0].total_tasks,
      weeklyCompleted: stats.rows[0].weekly_completed,
      activeMonitors: activeMonitors.rows[0].active_count,
      weeklyChanges: weeklyChanges.rows[0].weekly_changes,
    },
    recentTasks: recent.rows.map(row => toCamelTask(row)),
    monitorSummary: {
      activeCount: activeMonitors.rows[0].active_count,
      todayExecutions: 0,
      weeklyChanges: weeklyChanges.rows[0].weekly_changes,
      lastChangeName: '',
      lastChangeTime: '',
    },
  });
}));

app.get('/api/monitors', asyncHandler(async (_req, res) => {
  const result = await query('SELECT * FROM monitors ORDER BY created_at DESC');
  res.json(result.rows.map(row => toCamelMonitor(row)));
}));

app.post('/api/monitors', asyncHandler(async (req, res) => {
  const body = req.body;
  const result = await query(
    `INSERT INTO monitors
      (name, competitor_name, target_type, target_url, page_type, device_type, frequency, status, notify_ding_talk, ding_talk_webhook, next_execute_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW() + INTERVAL '1 day')
     RETURNING *`,
    [
      body.name,
      body.competitorName,
      body.targetType || 'page',
      body.targetUrl,
      body.pageType,
      body.deviceType || 'mobile',
      body.frequency || 'daily',
      body.status || 'active',
      Boolean(body.notifyDingTalk),
      body.dingTalkWebhook || null,
    ],
  );
  res.status(201).json(toCamelMonitor(result.rows[0]));
}));

app.get('/api/monitors/:id', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM monitors WHERE id = $1', [req.params.id]);
  const monitor = toCamelMonitor(result.rows[0]);
  if (!monitor) {
    res.status(404).json({ message: 'Monitor not found.' });
    return;
  }
  res.json(monitor);
}));

app.put('/api/monitors/:id', asyncHandler(async (req, res) => {
  const body = req.body;
  const result = await query(
    `UPDATE monitors
     SET status = COALESCE($2, status),
         name = COALESCE($3, name)
     WHERE id = $1
     RETURNING *`,
    [req.params.id, body.status || null, body.name || null],
  );
  res.json(toCamelMonitor(result.rows[0]));
}));

app.delete('/api/monitors/:id', asyncHandler(async (req, res) => {
  await query('DELETE FROM monitors WHERE id = $1', [req.params.id]);
  res.status(204).end();
}));

app.get('/api/monitors/:id/executions', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM monitor_runs WHERE monitor_id = $1 ORDER BY executed_at DESC', [req.params.id]);
  res.json(result.rows.map(row => toCamelRun(row)));
}));

const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.use((error, _req, res, _next) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    res.status(413).json({ message: `File is too large. Limit is ${uploadLimitMb}MB.` });
    return;
  }
  console.error(error);
  res.status(500).json({ message: error.message || 'Internal server error.' });
});

app.listen(port, () => {
  console.log(`Design Intelligence API listening on ${port}`);
});
