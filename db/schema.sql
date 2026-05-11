CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS analysis_tasks (
  id TEXT PRIMARY KEY DEFAULT ('task_' || replace(gen_random_uuid()::TEXT, '-', '')),
  type TEXT NOT NULL DEFAULT 'manual',
  status TEXT NOT NULL DEFAULT 'completed',
  competitor_name TEXT NOT NULL,
  page_type TEXT NOT NULL,
  device_type TEXT NOT NULL,
  brief JSONB NOT NULL DEFAULT '{}'::JSONB,
  material_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS analysis_materials (
  id TEXT PRIMARY KEY DEFAULT ('mat_' || replace(gen_random_uuid()::TEXT, '-', '')),
  task_id TEXT NOT NULL REFERENCES analysis_tasks(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('competitor', 'own')),
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  content_base64 TEXT NOT NULL,
  recognition JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analysis_reports (
  id TEXT PRIMARY KEY DEFAULT ('report_' || replace(gen_random_uuid()::TEXT, '-', '')),
  task_id TEXT NOT NULL UNIQUE REFERENCES analysis_tasks(id) ON DELETE CASCADE,
  result JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS monitors (
  id TEXT PRIMARY KEY DEFAULT ('monitor_' || replace(gen_random_uuid()::TEXT, '-', '')),
  name TEXT NOT NULL,
  competitor_name TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_url TEXT NOT NULL,
  page_type TEXT NOT NULL,
  device_type TEXT NOT NULL,
  frequency TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  notify_ding_talk BOOLEAN NOT NULL DEFAULT FALSE,
  ding_talk_webhook TEXT,
  last_executed_at TIMESTAMPTZ,
  next_execute_at TIMESTAMPTZ,
  total_executions INTEGER NOT NULL DEFAULT 0,
  changes_detected INTEGER NOT NULL DEFAULT 0,
  last_change_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS monitor_runs (
  id TEXT PRIMARY KEY DEFAULT ('exec_' || replace(gen_random_uuid()::TEXT, '-', '')),
  monitor_id TEXT NOT NULL REFERENCES monitors(id) ON DELETE CASCADE,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration INTEGER NOT NULL DEFAULT 0,
  has_changes BOOLEAN NOT NULL DEFAULT FALSE,
  change_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'success',
  error_message TEXT,
  screenshots JSONB NOT NULL DEFAULT '[]'::JSONB,
  report JSONB
);

CREATE INDEX IF NOT EXISTS idx_analysis_tasks_created_at ON analysis_tasks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_materials_task_id ON analysis_materials(task_id);
CREATE INDEX IF NOT EXISTS idx_monitor_runs_monitor_id ON monitor_runs(monitor_id);
