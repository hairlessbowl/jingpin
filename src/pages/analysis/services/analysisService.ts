import { request } from '@/services/request';
import type { AnalysisBrief, AnalysisTask } from '../types';
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
};

const fallbackList = (): PaginatedResponse<AnalysisTask> => ({ data: [fallbackTask], total: 1 });

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
    return id === fallbackTask.id ? fallbackTask : null;
  }
};

export const createAnalysisTask = async (params: CreateTaskParams): Promise<AnalysisTask> => {
  try {
    return await request.post('/api/analysis/tasks', params);
  } catch {
    return {
      ...fallbackTask,
      id: `task_${Date.now()}`,
      competitorName: params.competitorName,
      pageType: params.pageType,
      deviceType: params.deviceType as AnalysisTask['deviceType'],
      materialCount: params.materials?.length ?? 0,
      brief: params.brief,
    };
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
