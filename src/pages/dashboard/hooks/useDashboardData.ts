import { useState, useEffect } from 'react';
import type { AnalysisTask } from '@/pages/analysis/types';

interface DashboardStats {
  totalTasks: number;
  weeklyCompleted: number;
  activeMonitors: number;
  weeklyChanges: number;
}

interface MonitorSummary {
  activeCount: number;
  todayExecutions: number;
  weeklyChanges: number;
  lastChangeName: string;
  lastChangeTime: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentTasks: AnalysisTask[];
  monitorSummary: MonitorSummary;
}

const mockDashboardData: DashboardData = {
  stats: {
    totalTasks: 156,
    weeklyCompleted: 12,
    activeMonitors: 8,
    weeklyChanges: 3,
  },
  recentTasks: [
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
  ],
  monitorSummary: {
    activeCount: 8,
    todayExecutions: 12,
    weeklyChanges: 3,
    lastChangeName: '京东百亿补贴-手机品类',
    lastChangeTime: '2026-05-11T10:05:00Z',
  },
};

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setData(mockDashboardData);
      setLoading(false);
    };
    fetchData();
  }, []);

  return { data, loading };
};
