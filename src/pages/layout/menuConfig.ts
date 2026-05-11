import type { MenuProps } from 'antd';

export type MenuItem = Required<MenuProps>['items'][number];

export const menuItems: MenuItem[] = [
  {
    key: '/',
    label: '工作台',
    icon: null,
  },
  {
    key: '/analysis/new',
    label: '新建分析',
    icon: null,
  },
  {
    key: '/tasks',
    label: '历史任务',
    icon: null,
  },
  {
    key: '/monitors',
    label: '自动监控',
    icon: null,
  },
  {
    key: '/settings',
    label: '系统设置',
    icon: null,
  },
];

export const menuKeyToPath: Record<string, string> = {
  '/': '/',
  '/analysis/new': '/analysis/new',
  '/tasks': '/tasks',
  '/monitors': '/monitors',
  '/settings': '/settings',
};
