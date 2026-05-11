import { request } from '@/services/request';
import type { AnalysisBrief, AnalysisResult, AnalysisTask } from '../types';
import type { PaginationParams, PaginatedResponse } from '@/types/common';

interface SerializedMaterial {
  category: 'competitor' | 'own';
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  contentBase64: string;
  recognition?: Record<string, unknown>;
}

export interface TaskListParams extends PaginationParams {
  type?: string;
  status?: string;
  competitor?: string;
  pageType?: string;
  startDate?: string;
  endDate?: string;
}

interface CreateTaskParams {
  competitorName: string;
  pageType: string;
  deviceType: string;
  brief: AnalysisBrief;
  materials?: SerializedMaterial[];
}

const fallbackTask: AnalysisTask = {
  id: 'task_demo_fallback',
  type: 'manual',
  status: 'completed',
  competitorName: '拼多多',
  pageType: '商品详情页',
  deviceType: 'mobile',
  materialCount: 2,
  createdAt: new Date().toISOString(),
  completedAt: new Date().toISOString(),
  brief: {
    businessScenario: '竞品页面流程体验优化',
    targetUser: 'C 端消费者',
    currentProblem: '我方商详页转化信息不够集中',
    optimizationGoal: '提升加购和购买转化率',
  },
  result: buildFallbackResult('拼多多', '商品详情页'),
};

function buildFallbackResult(competitorName: string, pageType: string): AnalysisResult {
  return {
    breakdown: {
      layoutSummary: `${competitorName}「${pageType}」已生成本地演示报告。系统识别到首屏视觉区、利益点表达区和底部行动区，可用于领导演示完整流程。`,
      components: [
        { id: 'c1', type: 'image', name: '首屏视觉区', description: '承载主视觉和第一注意力焦点。', region: 'Header' },
        { id: 'c2', type: 'label', name: '利益点标签', description: '突出优惠、时效、保障等决策信息。', region: 'Content' },
        { id: 'c3', type: 'button', name: '主行动按钮', description: '承担购买、提交或继续下一步。', region: 'Footer' },
      ],
      designPatterns: ['首屏聚焦', '利益点前置', '固定行动区'],
      colorPalette: {
        primary: '#1677FF',
        secondary: '#FA8C16',
        background: '#F5F7FA',
        text: '#262626',
        accent: ['#E6F4FF', '#FFF7E6'],
      },
    },
    diffAnalysis: {
      summary: '本地演示模式下，报告基于上传信息和业务 Brief 生成，用于验证完整 MVP 交互链路。',
      differences: [
        {
          dimension: '信息层级',
          description: '竞品更强调首屏快速理解和即时行动。',
          competitorApproach: '核心卖点、利益点、行动按钮组合呈现。',
          ourApproach: '建议对照我方素材重排首屏权重。',
          impact: 'high',
        },
      ],
      borrowablePoints: ['强化主按钮', '利益点前置', '减少首屏分散入口'],
      incompatiblePoints: ['竞品专属权益和品牌化文案不可直接照搬'],
    },
    fusionSuggestions: [
      {
        id: 's1',
        title: '重排首屏信息优先级',
        description: '把标题、利益点、关键状态和主按钮放在首屏可扫读区域。',
        referenceElement: '首屏视觉区',
        priority: 'high',
        expectedEffect: '提升用户理解速度，减少跳出。',
      },
      {
        id: 's2',
        title: '强化主行动按钮',
        description: '统一主按钮文案，补齐加载、成功、失败状态。',
        referenceElement: '主行动按钮',
        priority: 'high',
        expectedEffect: '提升关键动作完成率。',
      },
    ],
    changeReport: {
      summary: '本地兜底报告用于无数据库环境下完整演示流程。',
      added: ['本地任务记录', '本地模板报告'],
      removed: [],
      modified: [{ module: '分析流程', before: '后端不可用时无法查看新任务', after: '后端不可用时仍可本地演示完整流程' }],
      riskLevel: 'low',
      designOpportunities: ['接入 Render Postgres 后可跨设备持久化'],
    },
    figmaStructure: {
      rootFrame: `${competitorName}-${pageType}-优化转译稿`,
      sections: [
        { name: 'Header/Hero', type: 'header', layoutMode: 'VERTICAL', children: ['主视觉', '核心标题', '利益点标签'] },
        { name: 'Footer/ActionBar', type: 'footer', layoutMode: 'HORIZONTAL', children: ['辅助动作', '主行动按钮'] },
      ],
      copyPlaceholders: [
        { location: 'Header/Hero/核心标题', content: `${pageType}核心价值一句话`, fontSize: 18, fontWeight: 'semibold' },
      ],
    },
  };
}

const readLocalTasks = () => {
  if (typeof window === 'undefined') return [fallbackTask];
  const raw = window.localStorage.getItem('design-intelligence-demo-tasks');
  if (!raw) return [fallbackTask];
  try {
    const tasks = JSON.parse(raw) as AnalysisTask[];
    return tasks.length ? tasks : [fallbackTask];
  } catch {
    return [fallbackTask];
  }
};

const writeLocalTask = (task: AnalysisTask) => {
  if (typeof window === 'undefined') return;
  const tasks = [task, ...readLocalTasks().filter((item) => item.id !== task.id)];
  window.localStorage.setItem('design-intelligence-demo-tasks', JSON.stringify(tasks));
};

const fallbackList = (): PaginatedResponse<AnalysisTask> => {
  const tasks = readLocalTasks();
  return { data: tasks, total: tasks.length };
};

export const getTaskList = async (
  params: TaskListParams,
): Promise<PaginatedResponse<AnalysisTask>> => {
  try {
    return await request.get('/api/analysis/tasks', { params: { ...params } });
  } catch {
    return fallbackList();
  }
};

export const getTaskDetail = async (id: string): Promise<AnalysisTask | null> => {
  try {
    return await request.get(`/api/analysis/tasks/${id}`);
  } catch {
    return readLocalTasks().find((task) => task.id === id) ?? null;
  }
};

export const createAnalysisTask = async (params: CreateTaskParams): Promise<AnalysisTask> => {
  try {
    return await request.post('/api/analysis/tasks', params);
  } catch {
    const task = {
      ...fallbackTask,
      id: `task_${Date.now()}`,
      competitorName: params.competitorName,
      pageType: params.pageType,
      deviceType: params.deviceType as AnalysisTask['deviceType'],
      materialCount: params.materials?.length ?? 0,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      brief: params.brief,
      result: buildFallbackResult(params.competitorName, params.pageType),
    };
    writeLocalTask(task);
    return task;
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  try {
    await request.delete(`/api/analysis/tasks/${id}`);
  } catch {
    if (id !== fallbackTask.id) throw new Error('删除失败，请检查后端服务。');
  }
};

export const retryTask = async (id: string): Promise<void> => {
  try {
    await request.post(`/api/analysis/tasks/${id}/retry`);
  } catch {
    if (id !== fallbackTask.id) throw new Error('重试失败，请检查后端服务。');
  }
};
