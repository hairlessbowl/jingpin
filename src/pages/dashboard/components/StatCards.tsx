import { Row, Col, Card, Statistic, Skeleton } from 'antd';
import {
  FileTextOutlined,
  CheckCircleOutlined,
  MonitorOutlined,
  AlertOutlined,
} from '@ant-design/icons';

interface StatItem {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  suffix?: string;
}

interface StatCardsProps {
  totalTasks: number;
  weeklyCompleted: number;
  activeMonitors: number;
  weeklyChanges: number;
  loading: boolean;
}

export const StatCards = ({
  totalTasks,
  weeklyCompleted,
  activeMonitors,
  weeklyChanges,
  loading,
}: StatCardsProps) => {
  const statItems: StatItem[] = [
    {
      title: '任务总数',
      value: totalTasks,
      icon: <FileTextOutlined />,
      color: '#1677FF',
      bgColor: '#E6F4FF',
    },
    {
      title: '本周完成',
      value: weeklyCompleted,
      icon: <CheckCircleOutlined />,
      color: '#52C41A',
      bgColor: '#F6FFED',
    },
    {
      title: '监控中',
      value: activeMonitors,
      icon: <MonitorOutlined />,
      color: '#FA8C16',
      bgColor: '#FFF7E6',
    },
    {
      title: '本周变化',
      value: weeklyChanges,
      icon: <AlertOutlined />,
      color: '#FF4D4F',
      bgColor: '#FFF1F0',
    },
  ];

  return (
    <Row gutter={16}>
      {statItems.map((item) => (
        <Col span={6} key={item.title}>
          <Card
            style={{
              borderRadius: 8,
              border: '1px solid #F0F0F0',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}
            bodyStyle={{ padding: '20px 24px' }}
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 1 }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Statistic
                  title={
                    <span style={{ fontSize: 13, color: '#8C8C8C', fontWeight: 400 }}>
                      {item.title}
                    </span>
                  }
                  value={item.value}
                  valueStyle={{ fontSize: 28, fontWeight: 700, color: '#262626' }}
                />
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: item.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    color: item.color,
                  }}
                >
                  {item.icon}
                </div>
              </div>
            )}
          </Card>
        </Col>
      ))}
    </Row>
  );
};
