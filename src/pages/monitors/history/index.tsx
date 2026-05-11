import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Table, Tag, Button, Space, Typography, Badge, Skeleton,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { PageContainer } from '@/components/PageContainer';
import type { MonitorExecution, MonitorTask } from '../types';
import { getMonitorDetail, getMonitorExecutions } from '../services/monitorService';

export const MonitorHistoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [monitor, setMonitor] = useState<MonitorTask | null>(null);
  const [executions, setExecutions] = useState<MonitorExecution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      const [monitorData, executionData] = await Promise.all([
        getMonitorDetail(id),
        getMonitorExecutions(id),
      ]);
      setMonitor(monitorData);
      setExecutions(executionData);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const columns: ColumnsType<MonitorExecution> = [
    {
      title: '执行时间',
      dataIndex: 'executedAt',
      key: 'executedAt',
      render: (time: string) => (
        <Typography.Text style={{ fontSize: 13 }}>
          {dayjs(time).format('YYYY-MM-DD HH:mm:ss')}
        </Typography.Text>
      ),
    },
    {
      title: '执行状态',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: string) =>
        status === 'success' ? (
          <Space size={4}>
            <CheckCircleOutlined style={{ color: '#52C41A' }} />
            <Typography.Text style={{ color: '#52C41A', fontSize: 13 }}>成功</Typography.Text>
          </Space>
        ) : (
          <Space size={4}>
            <CloseCircleOutlined style={{ color: '#FF4D4F' }} />
            <Typography.Text style={{ color: '#FF4D4F', fontSize: 13 }}>失败</Typography.Text>
          </Space>
        ),
    },
    {
      title: '是否有变化',
      dataIndex: 'hasChanges',
      key: 'hasChanges',
      width: 110,
      render: (hasChanges: boolean, record) =>
        hasChanges ? (
          <Badge color="#FF4D4F" text={`有变化（${record.changeCount} 处）`} />
        ) : (
          <Badge color="#D9D9D9" text="无变化" />
        ),
    },
    {
      title: '耗时',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      render: (duration: number) => (
        <Typography.Text style={{ fontSize: 13, color: '#595959' }}>
          {duration > 0 ? `${duration}s` : '-'}
        </Typography.Text>
      ),
    },
    {
      title: '错误信息',
      dataIndex: 'errorMessage',
      key: 'errorMessage',
      render: (msg?: string) =>
        msg ? (
          <Typography.Text style={{ fontSize: 12, color: '#FF4D4F' }}>{msg}</Typography.Text>
        ) : (
          <Typography.Text style={{ color: '#D9D9D9' }}>-</Typography.Text>
        ),
    },
  ];

  return (
    <PageContainer
      title={monitor ? `${monitor.name} · 执行历史` : '执行历史'}
      extra={
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/monitors')}>
          返回监控列表
        </Button>
      }
    >
      {loading ? (
        <Card style={{ borderRadius: 8 }}>
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
      ) : (
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          {monitor && (
            <Card style={{ borderRadius: 8, border: '1px solid #F0F0F0' }} size="small">
              <Space size={32}>
                <div>
                  <Typography.Text style={{ fontSize: 12, color: '#8C8C8C', display: 'block' }}>竞品</Typography.Text>
                  <Typography.Text strong>{monitor.competitorName}</Typography.Text>
                </div>
                <div>
                  <Typography.Text style={{ fontSize: 12, color: '#8C8C8C', display: 'block' }}>页面类型</Typography.Text>
                  <Typography.Text>{monitor.pageType}</Typography.Text>
                </div>
                <div>
                  <Typography.Text style={{ fontSize: 12, color: '#8C8C8C', display: 'block' }}>监控频率</Typography.Text>
                  <Tag>{{ hourly: '每小时', daily: '每天', weekly: '每周' }[monitor.frequency]}</Tag>
                </div>
                <div>
                  <Typography.Text style={{ fontSize: 12, color: '#8C8C8C', display: 'block' }}>累计执行</Typography.Text>
                  <Typography.Text strong>{monitor.totalExecutions} 次</Typography.Text>
                </div>
                <div>
                  <Typography.Text style={{ fontSize: 12, color: '#8C8C8C', display: 'block' }}>检测到变化</Typography.Text>
                  <Typography.Text strong style={{ color: monitor.changesDetected > 0 ? '#FF4D4F' : '#262626' }}>
                    {monitor.changesDetected} 次
                  </Typography.Text>
                </div>
              </Space>
            </Card>
          )}

          <Card style={{ borderRadius: 8, border: '1px solid #F0F0F0' }}>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={executions}
              pagination={{ showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
            />
          </Card>
        </Space>
      )}
    </PageContainer>
  );
};
