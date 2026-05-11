import { Card, Button, Row, Col, Typography, Space, Form } from 'antd';
import { PlusOutlined, MonitorOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

import { PageContainer } from '@/components/PageContainer';
import { StatCards } from './components/StatCards';
import { RecentTaskList } from './components/RecentTaskList';
import { CompetitorChangeSummary } from './components/CompetitorChangeSummary';
import { useDashboardData } from './hooks/useDashboardData';
import { MonitorFormModal } from '@/pages/monitors/components/MonitorFormModal';
import { createMonitor } from '@/pages/monitors/services/monitorService';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { data, loading } = useDashboardData();
  const [monitorModalOpen, setMonitorModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const handleCreateMonitor = async (values: Record<string, unknown>) => {
    setSubmitting(true);
    try {
      await createMonitor({
        name: values.name as string,
        competitorName: values.competitorName as string,
        targetType: (values.targetType as 'page' | 'flow') ?? 'page',
        targetUrl: values.targetUrl as string,
        pageType: values.pageType as string,
        deviceType: values.deviceType as 'mobile' | 'desktop' | 'tablet',
        frequency: values.frequency as 'hourly' | 'daily' | 'weekly',
        status: 'active',
        notifyDingTalk: values.notifyDingTalk as boolean,
        dingTalkWebhook: values.dingTalkWebhook as string | undefined,
      });
      setMonitorModalOpen(false);
      form.resetFields();
    } finally {
      setSubmitting(false);
    }
  };

  const headerExtra = (
    <Space size={8}>
      <Button
        icon={<PlusOutlined />}
        onClick={() => navigate('/analysis/new')}
      >
        新建分析
      </Button>
      <Button
        icon={<MonitorOutlined />}
        onClick={() => setMonitorModalOpen(true)}
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

      <MonitorFormModal
        open={monitorModalOpen}
        onCancel={() => { setMonitorModalOpen(false); form.resetFields(); }}
        onSubmit={handleCreateMonitor}
        form={form}
        loading={submitting}
      />
    </PageContainer>
  );
};
