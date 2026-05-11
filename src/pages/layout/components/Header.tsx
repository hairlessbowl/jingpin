import { Layout, Avatar, Typography, Badge } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;

export const Header = () => {
  return (
    <AntHeader
      style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #F0F0F0',
        padding: '0 24px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'sticky',
        top: 0,
        zIndex: 99,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Badge count={3} size="small">
          <BellOutlined
            style={{
              fontSize: 18,
              color: '#595959',
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
          />
        </Badge>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <Avatar
            size={32}
            icon={<UserOutlined />}
            style={{ background: '#1677FF' }}
          />
          <Typography.Text style={{ color: '#262626', fontSize: 14 }}>
            沈确
          </Typography.Text>
        </div>
      </div>
    </AntHeader>
  );
};
