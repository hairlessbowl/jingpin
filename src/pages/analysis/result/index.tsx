import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Tabs, Button, Tag, Typography, Space, Skeleton, App as AntApp, Descriptions } from 'antd';
import { ArrowLeftOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { PageContainer } from '@/components/PageContainer';
import { getTaskDetail } from '@/pages/analysis/services/analysisService';
import { STATUS_LABELS, STATUS_COLORS } from '@/types/common';
import type { AnalysisTask } from '@/pages/analysis/types';
import { PageBreakdown } from './components/PageBreakdown';
import { DiffAnalysis } from './components/DiffAnalysis';
import { FusionSuggestions } from './components/FusionSuggestions';
import { ChangeReport } from './components/ChangeReport';
import { FigmaStructure } from './components/FigmaStructure';

export const AnalysisResultPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { message } = AntApp.useApp();

  const [task, setTask] = useState<AnalysisTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('breakdown');

  useEffect(() => {
    if (!id) return;
    const fetchTask = async () => {
      setLoading(true);
      const data = await getTaskDetail(id);
      if (!data) {
        message.error('任务不存在');
        navigate('/tasks');
        return;
      }
      setTask(data);
      setLoading(false);
    };
    fetchTask();
  }, [id]);

  if (loading) {
    return (
      <PageContainer title="分析结果">
        <Card style={{ borderRadius: 8 }}>
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      </PageContainer>
    );
  }

  if (!task || !task.result) {
    return (
      <PageContainer title="分析结果">
        <Card style={{ borderRadius: 8, textAlign: 'center', padding: 48 }}>
          <Typography.Text style={{ color: '#8C8C8C' }}>暂无分析结果</Typography.Text>
        </Card>
      </PageContainer>
    );
  }

  const tabItems = [
    {
      key: 'breakdown',
      label: '页面拆解',
      children: <PageBreakdown result={task.result} />,
    },
    {
      key: 'diff',
      label: '差异分析',
      children: <DiffAnalysis result={task.result} />,
    },
    {
      key: 'fusion',
      label: '融合建议',
      children: <FusionSuggestions result={task.result} />,
    },
    {
      key: 'changes',
      label: '变化报告',
      children: <ChangeReport taskId={task.id} />,
    },
    {
      key: 'figma',
      label: 'Figma 结构',
      children: <FigmaStructure result={task.result} />,
    },
  ];

  return (
    <PageContainer
      title={`${task.competitorName} · ${task.pageType} 分析结果`}
      extra={
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/tasks')}>
            返回列表
          </Button>
          <Button icon={<ReloadOutlined />} type="primary" ghost>
            重新分析
          </Button>
        </Space>
      }
    >
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Card style={{ borderRadius: 8, border: '1px solid #F0F0F0' }} size="small">
          <Descriptions size="small" column={4}>
            <Descriptions.Item label="竞品">
              <Typography.Text strong>{task.competitorName}</Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="页面类型">{task.pageType}</Descriptions.Item>
            <Descriptions.Item label="设备">
              {task.deviceType === 'mobile' ? '移动端' : task.deviceType === 'desktop' ? 'PC 端' : '平板'}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={STATUS_COLORS[task.status]}>{STATUS_LABELS[task.status]}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="分析时间">
              {task.completedAt ? dayjs(task.completedAt).format('YYYY-MM-DD HH:mm') : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="素材数量">{task.materialCount} 个</Descriptions.Item>
            {task.brief && (
              <Descriptions.Item label="优化目标" span={2}>
                {task.brief.optimizationGoal}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        <Card
          style={{ borderRadius: 8, border: '1px solid #F0F0F0' }}
          bodyStyle={{ padding: '0 24px 24px' }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            tabBarStyle={{ marginBottom: 20 }}
          />
        </Card>
      </Space>
    </PageContainer>
  );
};
