import type { AnalysisTask, AnalysisBrief } from '../types';
import type { PaginationParams, PaginatedResponse } from '@/types/common';

const USE_MOCK = true;

const mockTasks: AnalysisTask[] = [
  {
    id: 'task_001',
    type: 'manual',
    status: 'completed',
    competitorName: '拼多多',
    pageType: '商品详情页',
    deviceType: 'mobile',
    materialCount: 2,
    createdAt: '2026-05-11T14:30:00Z',
    completedAt: '2026-05-11T14:31:45Z',
    brief: {
      businessScenario: '电商商品详情页，展示商品信息和购买入口',
      targetUser: 'C 端消费者',
      currentProblem: '我方商详页转化率低于竞品',
      optimizationGoal: '提升加购和购买转化率',
    },
    result: {
      breakdown: {
        layoutSummary: '页面采用垂直滚动布局，顶部为商品主图轮播，中部为商品信息区，底部固定购买操作栏',
        components: [
          { id: 'c1', type: 'image', name: '商品主图轮播', description: '全屏沉浸式商品图展示，支持左右滑动', region: 'Header' },
          { id: 'c2', type: 'heading', name: '商品标题', description: '2行文字，字号16px，加粗', region: 'Content' },
          { id: 'c3', type: 'label', name: '价格标签', description: '红色大字价格 ¥99.9，旁边有划线原价', region: 'Content' },
          { id: 'c4', type: 'button', name: '加入购物车', description: '橙色按钮，固定在底部操作栏左侧', region: 'Footer' },
          { id: 'c5', type: 'button', name: '立即购买', description: '红色按钮，固定在底部操作栏右侧', region: 'Footer' },
          { id: 'c6', type: 'tag', name: '活动标签', description: '限时特惠、百亿补贴等活动标签', region: 'Content' },
        ],
        designPatterns: ['底部固定购买栏', '卡片式信息分组', '价格红色强调', '沉浸式商品图'],
        colorPalette: {
          primary: '#E02E24',
          secondary: '#FF6B00',
          background: '#F5F5F5',
          text: '#222222',
          accent: ['#FFE4E1', '#FFF3E0'],
        },
      },
      diffAnalysis: {
        summary: '拼多多商详页在视觉冲击力和价格展示上明显强于我方，沉浸式商品图和底部固定操作栏是核心差异点',
        differences: [
          {
            dimension: '布局',
            description: '竞品采用全屏沉浸式商品图，我方为固定高度图片区域',
            competitorApproach: '全屏沉浸式轮播图，图片占屏幕 60% 高度',
            ourApproach: '固定 300px 高度的商品图区域',
            impact: 'high',
            competitorScreenshotUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=375&h=667&fit=crop',
            ourScreenshotUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=375&h=667&fit=crop',
          },
          {
            dimension: '价格展示',
            description: '竞品价格对比设计更直观，划线原价与现价对比强烈',
            competitorApproach: '红色大字现价 + 灰色划线原价 + 折扣标签三元素组合',
            ourApproach: '仅展示现价，无原价对比',
            impact: 'high',
            competitorScreenshotUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=375&h=667&fit=crop',
            ourScreenshotUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=375&h=667&fit=crop',
          },
          {
            dimension: '活动标签',
            description: '竞品活动标签丰富，营造紧迫感',
            competitorApproach: '限时特惠、百亿补贴、倒计时等多种标签',
            ourApproach: '无活动标签',
            impact: 'medium',
            competitorScreenshotUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=375&h=667&fit=crop',
            ourScreenshotUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=375&h=667&fit=crop',
          },
        ],
        borrowablePoints: [
          '底部操作栏按钮对比度高，加购/购买区分明确',
          '价格打折前后价对比设计直观，突出优惠力度',
          '活动标签营造紧迫感，有效提升转化',
        ],
        incompatiblePoints: [
          '拼多多特有的拼团入口不适用于我方业务模式',
          '百亿补贴标签为平台专属，不可直接使用',
        ],
      },
      fusionSuggestions: [
        {
          id: 's1',
          title: '升级商品图展示区域',
          description: '参考竞品沉浸式商品图设计，将商品图区域高度提升至屏幕 55-60%，支持全屏预览',
          referenceElement: '商品主图轮播',
          priority: 'high',
          expectedEffect: '提升商品视觉吸引力，预计加购率提升 8-12%',
        },
        {
          id: 's2',
          title: '优化价格展示设计',
          description: '增加划线原价展示，配合折扣标签，形成价格对比视觉冲击',
          referenceElement: '价格标签',
          priority: 'high',
          expectedEffect: '强化优惠感知，预计转化率提升 5-8%',
        },
        {
          id: 's3',
          title: '增加活动紧迫感设计',
          description: '在价格区域增加限时活动标签和倒计时，营造购买紧迫感',
          referenceElement: '活动标签',
          priority: 'medium',
          expectedEffect: '提升用户决策速度，减少跳出率',
        },
      ],
      figmaStructure: {
        rootFrame: '拼多多-商品详情页-拆解 (375×812)',
        sections: [
          { name: 'Header/ProductImage', type: 'header', layoutMode: 'VERTICAL', children: ['商品主图轮播', '图片指示器'] },
          { name: 'Content/ProductInfo', type: 'content', layoutMode: 'VERTICAL', children: ['商品标题', '价格区域', '活动标签组'] },
          { name: 'Content/Details', type: 'content', layoutMode: 'VERTICAL', children: ['商品参数', '评价入口', '商品详情'] },
          { name: 'Footer/ActionBar', type: 'footer', layoutMode: 'HORIZONTAL', children: ['收藏按钮', '加购按钮', '购买按钮'] },
        ],
        copyPlaceholders: [
          { location: 'Content/ProductInfo/商品标题', content: '商品名称（最多2行）', fontSize: 16, fontWeight: 'semibold' },
          { location: 'Content/ProductInfo/价格区域/现价', content: '¥99.9', fontSize: 22, fontWeight: 'bold' },
          { location: 'Footer/ActionBar/加购按钮', content: '加入购物车', fontSize: 14, fontWeight: 'medium' },
        ],
      },
    },
  },
  {
    id: 'task_002',
    type: 'auto_monitor',
    status: 'completed',
    competitorName: '京东',
    pageType: '活动页',
    deviceType: 'mobile',
    materialCount: 1,
    createdAt: '2026-05-11T10:05:00Z',
    completedAt: '2026-05-11T10:07:30Z',
  },
  {
    id: 'task_003',
    type: 'manual',
    status: 'processing',
    competitorName: '淘宝',
    pageType: '购物车',
    deviceType: 'mobile',
    materialCount: 3,
    createdAt: '2026-05-11T09:15:00Z',
  },
  {
    id: 'task_004',
    type: 'manual',
    status: 'failed',
    competitorName: '美团',
    pageType: '下单确认页',
    deviceType: 'mobile',
    materialCount: 1,
    createdAt: '2026-05-10T16:20:00Z',
  },
  {
    id: 'task_005',
    type: 'auto_monitor',
    status: 'completed',
    competitorName: '拼多多',
    pageType: '首页',
    deviceType: 'mobile',
    materialCount: 1,
    createdAt: '2026-05-10T10:00:00Z',
    completedAt: '2026-05-10T10:03:00Z',
  },
];

export interface TaskListParams extends PaginationParams {
  type?: string;
  status?: string;
  competitor?: string;
  pageType?: string;
  startDate?: string;
  endDate?: string;
}

export const getTaskList = async (
  params: TaskListParams
): Promise<PaginatedResponse<AnalysisTask>> => {
  if (USE_MOCK) {
    let filtered = [...mockTasks];
    if (params.type) filtered = filtered.filter((t) => t.type === params.type);
    if (params.status) filtered = filtered.filter((t) => params.status!.split(',').includes(t.status));
    if (params.competitor) filtered = filtered.filter((t) => t.competitorName.includes(params.competitor!));
    if (params.pageType) filtered = filtered.filter((t) => t.pageType === params.pageType);
    const start = (params.page - 1) * params.pageSize;
    return { data: filtered.slice(start, start + params.pageSize), total: filtered.length };
  }
  return { data: [], total: 0 };
};

export const getTaskDetail = async (id: string): Promise<AnalysisTask | null> => {
  if (USE_MOCK) {
    return mockTasks.find((t) => t.id === id) ?? null;
  }
  return null;
};

export const createAnalysisTask = async (params: {
  competitorName: string;
  pageType: string;
  deviceType: string;
  brief: AnalysisBrief;
}): Promise<AnalysisTask> => {
  if (USE_MOCK) {
    const newTask: AnalysisTask = {
      id: `task_${Date.now()}`,
      type: 'manual',
      status: 'pending',
      competitorName: params.competitorName,
      pageType: params.pageType,
      deviceType: params.deviceType as 'mobile' | 'desktop' | 'tablet',
      materialCount: 1,
      createdAt: new Date().toISOString(),
      brief: params.brief,
    };
    mockTasks.unshift(newTask);
    return newTask;
  }
  throw new Error('Not implemented');
};

export const deleteTask = async (id: string): Promise<void> => {
  if (USE_MOCK) {
    const index = mockTasks.findIndex((t) => t.id === id);
    if (index !== -1) mockTasks.splice(index, 1);
    return;
  }
};

export const retryTask = async (id: string): Promise<void> => {
  if (USE_MOCK) {
    const task = mockTasks.find((t) => t.id === id);
    if (task) task.status = 'pending';
    return;
  }
};
