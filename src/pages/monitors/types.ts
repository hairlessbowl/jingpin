export type MonitorStatus = 'active' | 'paused' | 'stopped';
export type MonitorFrequency = 'hourly' | 'daily' | 'weekly';
export type MonitorTargetType = 'page' | 'flow';

export interface FlowStep {
  stepIndex: number;
  stepName: string;
  action: string;
  screenshotUrl?: string;
}

export interface MonitorTask {
  id: string;
  name: string;
  competitorName: string;
  targetType: MonitorTargetType;
  targetUrl: string;
  pageType: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  frequency: MonitorFrequency;
  status: MonitorStatus;
  lastExecutedAt?: string;
  nextExecuteAt?: string;
  totalExecutions: number;
  changesDetected: number;
  lastChangeSummary?: string;
  notifyDingTalk: boolean;
  dingTalkWebhook?: string;
  createdAt: string;
}

export interface ScreenshotCapture {
  stepName: string;
  screenshotUrl: string;
  capturedAt: string;
}

export interface ExecutionChangeDetail {
  dimension: string;
  description: string;
  beforeScreenshotUrl: string;
  afterScreenshotUrl: string;
  impact: 'high' | 'medium' | 'low';
  beforeDescription: string;
  afterDescription: string;
}

export interface ExecutionReport {
  summary: string;
  changeDetails: ExecutionChangeDetail[];
  screenshots: ScreenshotCapture[];
  recommendations: string[];
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
  screenshots?: ScreenshotCapture[];
  report?: ExecutionReport;
}
