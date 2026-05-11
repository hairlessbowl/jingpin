export type MonitorStatus = 'active' | 'paused' | 'stopped';
export type MonitorFrequency = 'hourly' | 'daily' | 'weekly';

export interface MonitorTask {
  id: string;
  name: string;
  competitorName: string;
  targetUrl: string;
  pageType: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  frequency: MonitorFrequency;
  status: MonitorStatus;
  lastExecutedAt?: string;
  nextExecuteAt?: string;
  totalExecutions: number;
  changesDetected: number;
  notifyDingTalk: boolean;
  dingTalkWebhook?: string;
  createdAt: string;
}

export interface MonitorExecution {
  id: string;
  monitorId: string;
  executedAt: string;
  duration: number;
  hasChanges: boolean;
  changeCount: number;
  status: 'success' | 'failed';
  errorMessage?: string;
}
