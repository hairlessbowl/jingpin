import { useState, useEffect } from 'react';
import {
  Card, Table, Tag, Button, Space, Typography, App as AntApp,
  Popconfirm, Badge, Tooltip, Form,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined, PauseCircleOutlined, PlayCircleOutlined,
  DeleteOutlined, HistoryOutlined, BellOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

import { PageContainer } from '@/components/PageContainer';
import type { MonitorTask } from './types';
import {
  getMonitorList,
  createMonitor,
  updateMonitorStatus,
  deleteMonitor,
} from './services/monitorService';
import { MonitorFormModal } from './components/MonitorFormModal';

const STATUS_CONFIG = {
  active: { color: 'success', label: '运行中' },
  paused: { color: 'warning', label: '已暂停' },
  stopped: { color: 'default', label: '已停止' },
};

const FREQUENCY_LABELS = {
  hourly: '每小时',
  daily: '每天',
  weekly: '每周',
};

export const MonitorListPage = () => {
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const [form] = Form.useForm();

  const [monitors, setMonitors] = useState<MonitorTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchMonitors = async () => {
    setLoading(true);
    const data = await getMonitorList();
    setMonitors(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMonitors();
  }, []);

  const handleToggleStatus = async (monitor: MonitorTask) => {
    const newStatus = monitor.status === 'active' ? 'paused' : 'active';
    await updateMonitorStatus(monitor.id, newStatus);
    message.success(newStatus === 'active' ? '已恢复监控' : '已暂停监控');
    fetchMonitors();
  };

  const handleDelete = async (id: string) => {
    await deleteMonitor(id);
    message.success('删除成功');
    fetchMonitors();
  };

  const handleCreate = async (values: Record<string, unknown>) => {
    setSubmitting(true);
    try {
      await createMonitor({
        name: values.name as string,
        competitorName: values.competitorName as string,
        targetUrl: values.targetUrl as string,
        pageType: values.pageType as string,
        deviceType: values.deviceType as 'mobile' | 'desktop' | 'tablet',
        frequency: values.frequency as 'hourly' | 'daily' | 'weekly',
        status: 'active',
        notifyDingTalk: values.notifyDingTalk as boolean,
        dingTalkWebhook: values.dingTalkWebhook as string | undefined,
      });
      message.success('监控任务创建成功');
      setModalOpen(false);
      form.resetFields();
      fetchMonitors();
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnsType<MonitorTask> = [
    {
      title: '监控名称',
      key: 'name',
      render: (_, record) => (
        <div>
          <Space size={6}>
            <Typography.Text strong style={{ fontSize: 13, color: '#262626' }}>
              {record.name}
            </Typography.Text>
            {record.notifyDingTalk && (
              <Tooltip title="已开启钉钉通知">
                <BellOutlined style={{ color: '#1677FF', fontSize: 12 }} />
              </Tooltip>
            )}
          </Space>
          <Typography.Text style={{ fontSize: 12, color: '#8C8C8C', display: 'block' }}>
            {record.competitorName} · {record.pageType}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: keyof typeof STATUS_CONFIG) => (
        <Badge
          status={STATUS_CONFIG[status].color as 'success' | 'warning' | 'default'}
          text={STATUS_CONFIG[status].label}
        />
      ),
    },
    {
      title: '频率',
      dataIndex: 'frequency',
      key: 'frequency',
      width: 90,
      render: (freq: keyof typeof FREQUENCY_LABELS) => (
        <Tag>{FREQUENCY_LABELS[freq]}</Tag>
      ),
    },
    {
      title: '执行统计',
      key: 'stats',
      width: 140,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Typography.Text style={{ fontSize: 12, color: '#595959' }}>
            共执行 <strong>{record.totalExecutions}</strong> 次
          </Typography.Text>
          <Typography.Text style={{ fontSize: 12, color: record.changesDetected > 0 ? '#FF4D4F' : '#8C8C8C' }}>
            检测到 <strong>{record.changesDetected}</strong> 次变化
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: '最近执行',
      dataIndex: 'lastExecutedAt',
      key: 'lastExecutedAt',
      width: 150,
      render: (time?: string) => (
        <Typography.Text style={{ fontSize: 13, color: '#595959' }}>
          {time ? dayjs(time).format('MM-DD HH:mm') : '未执行'}
        </Typography.Text>
      ),
    },
    {
      title: '下次执行',
      dataIndex: 'nextExecuteAt',
      key: 'nextExecuteAt',
      width: 150,
      render: (time?: string) => (
        <Typography.Text style={{ fontSize: 13, color: '#595959' }}>
          {time ? dayjs(time).format('MM-DD HH:mm') : '-'}
        </Typography.Text>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size={4}>
          <Button
            type="link"
            size="small"
            icon={<HistoryOutlined />}
            onClick={() => navigate(`/monitors/${record.id}/history`)}
            style={{ padding: '0 4px' }}
          >
            执行历史
          </Button>
          <Button
            type="link"
            size="small"
            icon={record.status === 'active' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={() => handleToggleStatus(record)}
            style={{ padding: '0 4px' }}
          >
            {record.status === 'active' ? '暂停' : '恢复'}
          </Button>
          <Popconfirm
            title="确认删除该监控任务？"
            onConfirm={() => handleDelete(record.id)}
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              style={{ padding: '0 4px' }}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      title="自动监控"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          新建监控
        </Button>
      }
    >
      <Card style={{ borderRadius: 8, border: '1px solid #F0F0F0' }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={monitors}
          loading={loading}
          pagination={{ showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
        />
      </Card>

      <MonitorFormModal
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        onSubmit={handleCreate}
        form={form}
        loading={submitting}
      />
    </PageContainer>
  );
};
