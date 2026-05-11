import { Card, Button, Row, Col, Typography, Space } from 'antd';
import { PlusOutlined, MonitorOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

import { PageContainer } from '@/components/PageContainer';
import { StatCards } from './components/StatCards';
import { RecentTaskList } from './components/RecentTaskList';
import { CompetitorChangeSummary } from './components/CompetitorChangeSummary';
import { useDashboardData } from './hooks/useDashboardData';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { data, loading } = useDashboardData();

  const headerExtra = (
    <Space size={8}>
      <Button
        icon={<PlusOutlined />}
        onClick={() => navigate('/analysis/new')}
      >
        新建分析
      </Button>
      <Button
        type="primary"
        icon={<MonitorOutlined />}
        onClick={() => navigate('/monitors')}
      >
        新建监控
      </Button>
    </Space>
  );

  return (
    <PageContainer title="工作台" extra={headerExtra}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <StatCards
            totalTasks={data?.stats.totalTasks ?? 0}
            weeklyCompleted={data?.stats.weeklyCompleted ?? 0}
            activeMonitors={data?.stats.activeMonitors ?? 0}
            weeklyChanges={data?.stats.weeklyChanges ?? 0}
            loading={loading}
          />
        </Col>

        <Col span={24}>
          <CompetitorChangeSummary />
        </Col>

        <Col span={24}>
          <Card
            title={
              <Typography.Text strong style={{ fontSize: 15 }}>
                最近任务
              </Typography.Text>
            }
            extra={
              <Button
                type="link"
                icon={<ArrowRightOutlined />}
                onClick={() => navigate('/tasks')}
                style={{ padding: 0 }}
              >
                查看全部
              </Button>
            }
            style={{ borderRadius: 8, border: '1px solid #F0F0F0' }}
          >
            <RecentTaskList tasks={data?.recentTasks ?? []} loading={loading} />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};
