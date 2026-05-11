import type { MonitorTask, MonitorExecution, ExecutionReport } from '../types';

const COMPETITOR_SCREENSHOT_URLS = [
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=375&h=667&fit=crop',
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=375&h=667&fit=crop',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=375&h=667&fit=crop',
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=375&h=667&fit=crop',
];

const OUR_SCREENSHOT_URLS = [
  'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=375&h=667&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=375&h=667&fit=crop',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=375&h=667&fit=crop',
];

const mockMonitors: MonitorTask[] = [
  {
    id: 'monitor_001',
    name: '京东百亿补贴-手机品类',
    competitorName: '京东',
    targetType: 'page',
    targetUrl: 'https://www.jd.com/100billion',
    pageType: '活动页',
    deviceType: 'mobile',
    frequency: 'daily',
    status: 'active',
    lastExecutedAt: '2026-05-11T10:05:00Z',
    nextExecuteAt: '2026-05-12T10:05:00Z',
    totalExecutions: 30,
    changesDetected: 3,
    lastChangeSummary: '底部购买按钮样式更新，价格区新增倒计时',
    notifyDingTalk: true,
    dingTalkWebhook: 'https://oapi.dingtalk.com/robot/send?access_token=xxx',
    createdAt: '2026-04-11T09:00:00Z',
  },
  {
    id: 'monitor_002',
    name: '拼多多首页-大促入口',
    competitorName: '拼多多',
    targetType: 'page',
    targetUrl: 'https://www.pinduoduo.com',
    pageType: '首页',
    deviceType: 'mobile',
    frequency: 'hourly',
    status: 'active',
    lastExecutedAt: '2026-05-11T14:00:00Z',
    nextExecuteAt: '2026-05-11T15:00:00Z',
    totalExecutions: 720,
    changesDetected: 12,
    lastChangeSummary: '首页大促 Banner 图更新，入口文案调整',
    notifyDingTalk: false,
    createdAt: '2026-04-01T09:00:00Z',
  },
  {
    id: 'monitor_003',
    name: '美团外卖-下单确认页',
    competitorName: '美团',
    targetType: 'page',
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
  {
    id: 'monitor_004',
    name: '美团外卖-完整下单流程',
    competitorName: '美团',
    targetType: 'flow',
    targetUrl: 'https://h5.meituan.com',
    pageType: '外卖下单流程',
    deviceType: 'mobile',
    frequency: 'daily',
    status: 'active',
    lastExecutedAt: '2026-05-11T17:00:00Z',
    nextExecuteAt: '2026-05-12T17:00:00Z',
    totalExecutions: 15,
    changesDetected: 2,
    lastChangeSummary: '确认订单页送达时间展示升级，支付页微信优先引导',
    notifyDingTalk: true,
    dingTalkWebhook: 'https://oapi.dingtalk.com/robot/send?access_token=yyy',
    createdAt: '2026-04-25T09:00:00Z',
  },
];

const mockReport001: ExecutionReport = {
  summary: '本次监控检测到京东百亿补贴活动页发生 2 处显著变化：底部购买按钮样式更新，价格展示区域新增倒计时组件。整体视觉冲击力进一步增强，对我方转化率提升有较高参考价值。',
  changeDetails: [
    {
      dimension: '底部操作栏',
      description: '购买按钮从圆角矩形改为全宽胶囊形，背景色从橙色改为渐变红橙色',
      beforeScreenshotUrl: COMPETITOR_SCREENSHOT_URLS[0],
      afterScreenshotUrl: COMPETITOR_SCREENSHOT_URLS[1],
      impact: 'high',
      beforeDescription: '橙色圆角矩形按钮，宽度约 60%，文字"立即购买"',
      afterDescription: '红橙渐变全宽胶囊按钮，文字"立即抢购"，右侧有倒计时',
    },
    {
      dimension: '价格展示区',
      description: '新增限时特惠倒计时标签，强化紧迫感设计',
      beforeScreenshotUrl: COMPETITOR_SCREENSHOT_URLS[2],
      afterScreenshotUrl: COMPETITOR_SCREENSHOT_URLS[3],
      impact: 'medium',
      beforeDescription: '仅展示现价 ¥299，无时间限制提示',
      afterDescription: '现价 ¥299 + 红色倒计时"距结束 02:14:33"',
    },
  ],
  screenshots: [
    { stepName: '页面整体截图', screenshotUrl: COMPETITOR_SCREENSHOT_URLS[0], capturedAt: '2026-05-11T10:05:12Z' },
    { stepName: '价格区域截图', screenshotUrl: COMPETITOR_SCREENSHOT_URLS[2], capturedAt: '2026-05-11T10:05:18Z' },
    { stepName: '底部操作栏截图', screenshotUrl: COMPETITOR_SCREENSHOT_URLS[1], capturedAt: '2026-05-11T10:05:24Z' },
  ],
  recommendations: [
    '建议参考竞品全宽胶囊按钮设计，提升我方购买按钮点击率',
    '可在价格区域增加限时倒计时，营造购买紧迫感',
    '渐变色按钮视觉冲击力更强，建议 A/B 测试验证效果',
  ],
};

const mockReport004: ExecutionReport = {
  summary: '本次流程监控完整跑通美团外卖下单流程（首页→搜索→商品详情→购物车→确认订单→提交支付），检测到确认订单页新增"预计送达时间"强调展示，以及支付页新增微信支付优先引导。',
  changeDetails: [
    {
      dimension: '确认订单页',
      description: '新增预计送达时间醒目展示，从灰色小字升级为绿色大字强调',
      beforeScreenshotUrl: COMPETITOR_SCREENSHOT_URLS[0],
      afterScreenshotUrl: COMPETITOR_SCREENSHOT_URLS[1],
      impact: 'high',
      beforeDescription: '送达时间以灰色 12px 小字展示在地址下方',
      afterDescription: '送达时间以绿色 16px 加粗展示，配送时间图标，视觉权重大幅提升',
    },
    {
      dimension: '支付页',
      description: '微信支付选项移至第一位，并增加"推荐"标签',
      beforeScreenshotUrl: COMPETITOR_SCREENSHOT_URLS[2],
      afterScreenshotUrl: COMPETITOR_SCREENSHOT_URLS[3],
      impact: 'medium',
      beforeDescription: '支付方式列表：美团支付 / 微信支付 / 支付宝',
      afterDescription: '支付方式列表：微信支付（推荐）/ 美团支付 / 支付宝',
    },
  ],
  screenshots: [
    { stepName: '首页', screenshotUrl: COMPETITOR_SCREENSHOT_URLS[0], capturedAt: '2026-05-11T17:00:05Z' },
    { stepName: '搜索结果页', screenshotUrl: COMPETITOR_SCREENSHOT_URLS[1], capturedAt: '2026-05-11T17:00:18Z' },
    { stepName: '商品详情页', screenshotUrl: COMPETITOR_SCREENSHOT_URLS[2], capturedAt: '2026-05-11T17:00:32Z' },
    { stepName: '购物车', screenshotUrl: OUR_SCREENSHOT_URLS[0], capturedAt: '2026-05-11T17:00:45Z' },
    { stepName: '确认订单页', screenshotUrl: OUR_SCREENSHOT_URLS[1], capturedAt: '2026-05-11T17:01:02Z' },
    { stepName: '提交支付页', screenshotUrl: OUR_SCREENSHOT_URLS[2], capturedAt: '2026-05-11T17:01:18Z' },
  ],
  recommendations: [
    '建议在我方确认订单页强化配送时间展示，提升用户决策信心',
    '可参考竞品支付引导策略，优化支付方式排序以提升支付成功率',
    '流程整体耗时约 73s，建议关注各步骤跳出率',
  ],
};

const mockExecutions: MonitorExecution[] = [
  {
    id: 'exec_001',
    monitorId: 'monitor_001',
    executedAt: '2026-05-11T10:05:00Z',
    duration: 45,
    hasChanges: true,
    changeCount: 2,
    status: 'success',
    screenshots: mockReport001.screenshots,
    report: mockReport001,
  },
  {
    id: 'exec_002',
    monitorId: 'monitor_001',
    executedAt: '2026-05-10T10:05:00Z',
    duration: 38,
    hasChanges: false,
    changeCount: 0,
    status: 'success',
    screenshots: [
      { stepName: '页面整体截图', screenshotUrl: COMPETITOR_SCREENSHOT_URLS[0], capturedAt: '2026-05-10T10:05:10Z' },
    ],
  },
  {
    id: 'exec_003',
    monitorId: 'monitor_001',
    executedAt: '2026-05-09T10:05:00Z',
    duration: 52,
    hasChanges: true,
    changeCount: 1,
    status: 'success',
  },
  {
    id: 'exec_004',
    monitorId: 'monitor_001',
    executedAt: '2026-05-08T10:05:00Z',
    duration: 0,
    hasChanges: false,
    changeCount: 0,
    status: 'failed',
    errorMessage: '目标页面无法访问',
  },
  {
    id: 'exec_005',
    monitorId: 'monitor_001',
    executedAt: '2026-05-07T10:05:00Z',
    duration: 41,
    hasChanges: false,
    changeCount: 0,
    status: 'success',
  },
  {
    id: 'exec_006',
    monitorId: 'monitor_004',
    executedAt: '2026-05-11T17:00:00Z',
    duration: 73,
    hasChanges: true,
    changeCount: 2,
    status: 'success',
    screenshots: mockReport004.screenshots,
    report: mockReport004,
  },
  {
    id: 'exec_007',
    monitorId: 'monitor_004',
    executedAt: '2026-05-10T17:00:00Z',
    duration: 68,
    hasChanges: false,
    changeCount: 0,
    status: 'success',
    screenshots: [
      { stepName: '首页', screenshotUrl: COMPETITOR_SCREENSHOT_URLS[0], capturedAt: '2026-05-10T17:00:05Z' },
      { stepName: '确认订单页', screenshotUrl: COMPETITOR_SCREENSHOT_URLS[2], capturedAt: '2026-05-10T17:00:55Z' },
    ],
  },
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

export const createMonitor = async (
  params: Omit<MonitorTask, 'id' | 'totalExecutions' | 'changesDetected' | 'createdAt'>
): Promise<MonitorTask> => {
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

export const updateMonitorStatus = async (
  id: string,
  status: MonitorTask['status']
): Promise<void> => {
  const monitor = mockMonitors.find((m) => m.id === id);
  if (monitor) monitor.status = status;
};

export const deleteMonitor = async (id: string): Promise<void> => {
  const index = mockMonitors.findIndex((m) => m.id === id);
  if (index !== -1) mockMonitors.splice(index, 1);
};
