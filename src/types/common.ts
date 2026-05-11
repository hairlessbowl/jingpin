export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type TaskType = 'manual' | 'auto_monitor';
export type DeviceType = 'desktop' | 'mobile' | 'tablet';

export const PAGE_TYPES = [
  '商品详情页',
  '购物车',
  '下单确认页',
  '支付页',
  '首页',
  '搜索结果页',
  '活动页',
  '个人中心',
  '其他',
] as const;

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: '等待中',
  processing: '处理中',
  completed: '已完成',
  failed: '失败',
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
  pending: 'default',
  processing: 'processing',
  completed: 'success',
  failed: 'error',
};
