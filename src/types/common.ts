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
  { value: 'product_detail', label: '商品详情页' },
  { value: 'shopping_cart', label: '购物车' },
  { value: 'order_confirm', label: '下单确认页' },
  { value: 'payment', label: '支付页' },
  { value: 'homepage', label: '首页' },
  { value: 'search_result', label: '搜索结果页' },
  { value: 'activity', label: '活动页' },
  { value: 'user_center', label: '个人中心' },
  { value: 'other', label: '其他' },
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
