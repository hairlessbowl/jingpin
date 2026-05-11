function toCamelTask(row, result) {
  if (!row) return null;
  return {
    id: row.id,
    type: row.type,
    status: row.status,
    competitorName: row.competitor_name,
    pageType: row.page_type,
    deviceType: row.device_type,
    materialCount: row.material_count,
    createdAt: row.created_at,
    completedAt: row.completed_at || undefined,
    brief: row.brief || undefined,
    result,
  };
}

function toCamelMonitor(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    competitorName: row.competitor_name,
    targetType: row.target_type,
    targetUrl: row.target_url,
    pageType: row.page_type,
    deviceType: row.device_type,
    frequency: row.frequency,
    status: row.status,
    lastExecutedAt: row.last_executed_at || undefined,
    nextExecuteAt: row.next_execute_at || undefined,
    totalExecutions: row.total_executions,
    changesDetected: row.changes_detected,
    lastChangeSummary: row.last_change_summary || undefined,
    notifyDingTalk: row.notify_ding_talk,
    dingTalkWebhook: row.ding_talk_webhook || undefined,
    createdAt: row.created_at,
  };
}

function toCamelRun(row) {
  if (!row) return null;
  return {
    id: row.id,
    monitorId: row.monitor_id,
    executedAt: row.executed_at,
    duration: row.duration,
    hasChanges: row.has_changes,
    changeCount: row.change_count,
    status: row.status,
    errorMessage: row.error_message || undefined,
    screenshots: row.screenshots || [],
    report: row.report || undefined,
  };
}

module.exports = { toCamelTask, toCamelMonitor, toCamelRun };
