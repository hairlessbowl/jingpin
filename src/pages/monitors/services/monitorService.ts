import type { MonitorTask, MonitorExecution } from '../types';

const mockMonitors: MonitorTask[] = [
  {
    id: 'monitor_001',
    name: '京东百亿补贴-手机品类',
    competitorName: '京东',
    targetUrl: 'https://www.jd.com/100billion',
    pageType: '活动页',
    deviceType: 'mobile',
    frequency: 'daily',
    status: 'active',
    lastExecutedAt: '2026-05-11T10:05:00Z',
    nextExecuteAt: '2026-05-12T10:05:00Z',
    totalExecutions: 30,
    changesDetected: 3,
    notifyDingTalk: true,
    dingTalkWebhook: 'https://oapi.dingtalk.com/robot/send?access_token=xxx',
    createdAt: '2026-04-11T09:00:00Z',
  },
  {
    id: 'monitor_002',
    name: '拼多多首页-大促入口',
    competitorName: '拼多多',
    targetUrl: 'https://www.pinduoduo.com',
    pageType: '首页',
    deviceType: 'mobile',
    frequency: 'hourly',
    status: 'active',
    lastExecutedAt: '2026-05-11T14:00:00Z',
    nextExecuteAt: '2026-05-11T15:00:00Z',
    totalExecutions: 720,
    changesDetected: 12,
    notifyDingTalk: false,
    createdAt: '2026-04-01T09:00:00Z',
  },
  {
    id: 'monitor_003',
    name: '美团外卖-下单确认页',
    competitorName: '美团',
    targetUrl: 'https://h5.meituan.com/order/confirm',
    pageType: '下单确认页',
    deviceType: 'mobile',
    frequency: 'weekly',
    status: 'paused',
    lastExecutedAt: '2026-05-05T09:00:00Z',
    nextExecuteAt: '2026-05-12T09:00:00Z',
    totalExecutions: 8,
    changesDetected: 0,
    notifyDingTalk: false,
    createdAt: '2026-03-15T09:00:00Z',
  },
];

const mockExecutions: MonitorExecution[] = [
  { id: 'exec_001', monitorId: 'monitor_001', executedAt: '2026-05-11T10:05:00Z', duration: 45, hasChanges: true, changeCount: 2, status: 'success' },
  { id: 'exec_002', monitorId: 'monitor_001', executedAt: '2026-05-10T10:05:00Z', duration: 38, hasChanges: false, changeCount: 0, status: 'success' },
  { id: 'exec_003', monitorId: 'monitor_001', executedAt: '2026-05-09T10:05:00Z', duration: 52, hasChanges: true, changeCount: 1, status: 'success' },
  { id: 'exec_004', monitorId: 'monitor_001', executedAt: '2026-05-08T10:05:00Z', duration: 0, hasChanges: false, changeCount: 0, status: 'failed', errorMessage: '目标页面无法访问' },
  { id: 'exec_005', monitorId: 'monitor_001', executedAt: '2026-05-07T10:05:00Z', duration: 41, hasChanges: false, changeCount: 0, status: 'success' },
];

export const getMonitorList = async (): Promise<MonitorTask[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return [...mockMonitors];
};

export const getMonitorDetail = async (id: string): Promise<MonitorTask | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockMonitors.find((m) => m.id === id) ?? null;
};

export const getMonitorExecutions = async (monitorId: string): Promise<MonitorExecution[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockExecutions.filter((e) => e.monitorId === monitorId);
};

export const createMonitor = async (params: Omit<MonitorTask, 'id' | 'totalExecutions' | 'changesDetected' | 'createdAt'>): Promise<MonitorTask> => {
  const newMonitor: MonitorTask = {
    ...params,
    id: `monitor_${Date.now()}`,
    totalExecutions: 0,
    changesDetected: 0,
    createdAt: new Date().toISOString(),
  };
  mockMonitors.unshift(newMonitor);
  return newMonitor;
};

export const updateMonitorStatus = async (id: string, status: MonitorTask['status']): Promise<void> => {
  const monitor = mockMonitors.find((m) => m.id === id);
  if (monitor) monitor.status = status;
};

export const deleteMonitor = async (id: string): Promise<void> => {
  const index = mockMonitors.findIndex((m) => m.id === id);
  if (index !== -1) mockMonitors.splice(index, 1);
};
