import { createRoot } from 'react-dom/client';
import { App, ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { HashRouter } from 'react-router-dom';

import { App as AppRouter } from './App';
import './styles/index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);

root.render(
  <ConfigProvider
    locale={zhCN}
    theme={{
      algorithm: theme.defaultAlgorithm,
      token: {
        colorPrimary: '#1677FF',
        colorPrimaryHover: '#4096FF',
        colorPrimaryActive: '#0958D9',
        colorSuccess: '#52C41A',
        colorWarning: '#FAAD14',
        colorError: '#FF4D4F',
        colorInfo: '#1677FF',
        colorText: '#262626',
        colorTextSecondary: '#595959',
        colorTextTertiary: '#8C8C8C',
        colorBgLayout: '#F0F2F5',
        colorBgContainer: '#FFFFFF',
        colorBorder: '#D9D9D9',
        colorBorderSecondary: '#F0F0F0',
        borderRadius: 8,
      },
      components: {
        Menu: {
          itemColor: '#595959',
          itemHoverColor: '#1677FF',
          itemSelectedColor: '#1677FF',
          itemHoverBg: '#F5F7FA',
          itemSelectedBg: '#E6F4FF',
        },
        Table: {
          headerBg: '#FAFAFA',
          rowHoverBg: '#F5F7FA',
          borderColor: '#F0F0F0',
        },
        Card: {
          borderRadiusLG: 8,
        },
      },
    }}
  >
    <App>
      <HashRouter>
        <AppRouter />
      </HashRouter>
    </App>
  </ConfigProvider>
);
