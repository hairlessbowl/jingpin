import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/pages/layout';
import { DashboardPage } from '@/pages/dashboard';
import { NewAnalysisPage } from '@/pages/analysis/new';
import { AnalysisResultPage } from '@/pages/analysis/result';
import { TaskListPage } from '@/pages/tasks';
import { MonitorListPage } from '@/pages/monitors';
import { MonitorHistoryPage } from '@/pages/monitors/history';
import { SettingsPage } from '@/pages/settings';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="analysis/new" element={<NewAnalysisPage />} />
        <Route path="analysis/result/:id" element={<AnalysisResultPage />} />
        <Route path="tasks" element={<TaskListPage />} />
        <Route path="monitors" element={<MonitorListPage />} />
        <Route path="monitors/:id/history" element={<MonitorHistoryPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
