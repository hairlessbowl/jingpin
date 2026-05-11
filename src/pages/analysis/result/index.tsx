import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Tabs, Button, Tag, Typography, Space, Skeleton,
  App as AntApp, Descriptions, Alert, Progress, Steps, Spin,
} from 'antd';
import {
  ArrowLeftOutlined, ReloadOutlined, LoadingOutlined,
  CheckCircleOutlined, ClockCircleOutlined,
} from '@ant-design/icons';
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

const POLLING_STEPS = [
  { title: '素材预处理', description: '图像增强、去噪、分辨率优化' },
  { title: 'UI 元素识别', description: 'AI 识别页面组件、布局结构' },
  { title: '设计模式分析', description: '提取配色、字体、间距规律' },
  { title: '差异对比分析', description: '与我方页面进行多维度对比' },
  { title: '融合建议生成', description: '生成可落地的设计优化建议' },
];

const PendingView = ({ onRefresh }: { onRefresh: () => void }) => {
  const [pollingStep, setPollingStep] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setPollingStep((prev) => {
        if (prev >= POLLING_STEPS.length - 1) return prev;
        return prev + 1;
      });
    }, 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const progressPercent = Math.round(((pollingStep + 1) / POLLING_STEPS.length) * 100);

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <Alert
        type="info"
        showIcon
        icon={<LoadingOutlined />}
        message="AI 正在深度分析中"
        description="分析通常需要 1-3 分钟，页面将自动刷新。您也可以离开此页面，稍后在历史任务中查看结果。"
        action={
          <Button size="small" onClick={onRefresh}>
            立即刷新
          </Button>
        }
        style={{ borderRadius: 8 }}
      />

      <Card
        style={{ borderRadius: 8, border: '1px solid #F0F0F0' }}
        bodyStyle={{ padding: '28px 32px' }}
      >
        <Space direction="vertical" size={20} style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 32, color: '#1677FF' }} />} />
            <div>
              <Typography.Title level={4} style={{ margin: 0, color: '#262626', lineHeight: '28px' }}>
                AI 正在分析中
              </Typography.Title>
              <Typography.Text style={{ color: '#8C8C8C', fontSize: 13 }}>
                当前：{POLLING_STEPS[pollingStep]?.description}
              </Typography.Text>
            </div>
          </div>

          <Progress
            percent={progressPercent}
            strokeColor={{ from: '#1677FF', to: '#69B1FF' }}
            trailColor="#D6E4FF"
            showInfo={false}
            strokeWidth={6}
          />

          <Steps
            direction="vertical"
            current={pollingStep}
            size="small"
            items={POLLING_STEPS.map((step, index) => {
              const isDone = index < pollingStep;
              const isActive = index === pollingStep;
              return {
                title: (
                  <Space size={8}>
                    <span style={{ fontWeight: isActive ? 600 : 400, fontSize: 13 }}>
                      {step.title}
                    </span>
                    {isActive && (
                      <Tag color="processing" style={{ fontSize: 11, lineHeight: '18px' }}>
                        进行中
                      </Tag>
                    )}
                    {isDone && (
                      <Tag color="success" style={{ fontSize: 11, lineHeight: '18px' }}>
                        完成
                      </Tag>
                    )}
                  </Space>
                ),
                description: (
                  <Typography.Text style={{ fontSize: 12, color: '#8C8C8C' }}>
                    {step.description}
                  </Typography.Text>
                ),
                icon: isActive ? (
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 16 }} />} />
                ) : isDone ? (
                  <CheckCircleOutlined style={{ color: '#52C41A' }} />
                ) : (
                  <ClockCircleOutlined style={{ color: '#D9D9D9' }} />
                ),
              };
            })}
          />
        </Space>
      </Card>
    </Space>
  );
};

export const AnalysisResultPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { message } = AntApp.useApp();

  const [task, setTask] = useState<AnalysisTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('breakdown');
  const pollingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchTask = async () => {
    if (!id) return;
    const data = await getTaskDetail(id);
    if (!data) {
      message.error('任务不存在');
      navigate('/tasks');
      return;
    }
    setTask(data);
    setLoading(false);

    if (data.status === 'completed' || data.status === 'failed') {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    }
  };

  useEffect(() => {
    fetchTask();
    pollingTimerRef.current = setInterval(fetchTask, 8000);
    return () => {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
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

  const isPending = !task?.result || task?.status === 'pending' || task?.status === 'processing';

  const tabItems = task?.result
    ? [
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
      ]
    : [];

  return (
    <PageContainer
      title={task ? `${task.competitorName} · ${task.pageType} 分析结果` : '分析结果'}
      extra={
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/tasks')}>
            返回列表
          </Button>
          {!isPending && (
            <Button icon={<ReloadOutlined />} type="primary" ghost>
              重新分析
            </Button>
          )}
        </Space>
      }
    >
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        {task && (
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
              {task.completedAt && (
                <Descriptions.Item label="分析时间">
                  {dayjs(task.completedAt).format('YYYY-MM-DD HH:mm')}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="素材数量">{task.materialCount} 个</Descriptions.Item>
              {task.brief && (
                <Descriptions.Item label="优化目标" span={2}>
                  {task.brief.optimizationGoal}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        )}

        {isPending ? (
          <PendingView onRefresh={fetchTask} />
        ) : (
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
        )}
      </Space>
    </PageContainer>
  );
};
