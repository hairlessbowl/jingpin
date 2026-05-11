import { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  PlusCircleOutlined,
  HistoryOutlined,
  MonitorOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: '工作台',
  },
  {
    key: '/analysis/new',
    icon: <PlusCircleOutlined />,
    label: '新建分析',
  },
  {
    key: '/tasks',
    icon: <HistoryOutlined />,
    label: '历史任务',
  },
  {
    key: '/monitors',
    icon: <MonitorOutlined />,
    label: '自动监控',
  },
  {
    type: 'divider',
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: '系统设置',
  },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = (() => {
    const pathname = location.pathname;
    if (pathname.startsWith('/analysis/result')) return '/tasks';
    if (pathname.startsWith('/monitors/') && pathname.includes('/history')) return '/monitors';
    return pathname;
  })();

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={220}
      style={{
        background: '#FFFFFF',
        borderRight: '1px solid #F0F0F0',
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          padding: collapsed ? '0 24px' : '0 20px',
          borderBottom: '1px solid #F0F0F0',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: 'linear-gradient(135deg, #1677FF 0%, #0958D9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>D</span>
        </div>
        {!collapsed && (
          <span
            style={{
              marginLeft: 10,
              fontSize: 14,
              fontWeight: 600,
              color: '#262626',
              letterSpacing: '-0.2px',
            }}
          >
            Design Intelligence
          </span>
        )}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{
          border: 'none',
          marginTop: 8,
        }}
      />
    </Sider>
  );
};
