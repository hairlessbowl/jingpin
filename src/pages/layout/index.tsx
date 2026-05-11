import { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

const { Content } = Layout;

export const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarWidth = sidebarCollapsed ? 80 : 220;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout style={{ marginLeft: sidebarWidth, transition: 'margin-left 0.2s' }}>
        <Header />
        <Content
          style={{
            background: '#F0F2F5',
            minHeight: 'calc(100vh - 56px)',
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
