import { useState, useEffect } from 'react';
import { request } from '@/services/request';
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

const fallbackDashboardData: DashboardData = {
  stats: { totalTasks: 1, weeklyCompleted: 1, activeMonitors: 0, weeklyChanges: 0 },
  recentTasks: [],
  monitorSummary: {
    activeCount: 0,
    todayExecutions: 0,
    weeklyChanges: 0,
    lastChangeName: '',
    lastChangeTime: '',
  },
};

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        setData(await request.get('/api/dashboard/summary'));
      } catch {
        setData(fallbackDashboardData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading };
};
