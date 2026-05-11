import { Table, Tag, Button, Typography, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import type { AnalysisTask } from '@/pages/analysis/types';
import { STATUS_LABELS, STATUS_COLORS } from '@/types/common';

interface RecentTaskListProps {
  tasks: AnalysisTask[];
  loading: boolean;
}

export const RecentTaskList = ({ tasks, loading }: RecentTaskListProps) => {
  const navigate = useNavigate();

  const columns: ColumnsType<AnalysisTask> = [
    {
      title: '任务名称',
      key: 'name',
      render: (_, record) => (
        <Typography.Text strong style={{ color: '#262626' }}>
          {record.competitorName} - {record.pageType}
        </Typography.Text>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'manual' ? 'blue' : 'purple'}>
          {type === 'manual' ? '手动分析' : '自动监控'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: keyof typeof STATUS_LABELS) => (
        <Tag color={STATUS_COLORS[status]}>{STATUS_LABELS[status]}</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (time: string) => (
        <Typography.Text style={{ color: '#8C8C8C', fontSize: 13 }}>
          {dayjs(time).format('MM-DD HH:mm')}
        </Typography.Text>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => {
            if (record.status === 'completed') {
              navigate(`/analysis/result/${record.id}`);
            }
          }}
          disabled={record.status !== 'completed'}
          style={{ padding: 0 }}
        >
          {record.status === 'completed' ? '查看结果' : '查看详情'}
        </Button>
      ),
    },
  ];

  if (loading) {
    return <Skeleton active paragraph={{ rows: 5 }} />;
  }

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={tasks}
      pagination={false}
      size="small"
      onRow={(record) => ({
        onClick: () => {
          if (record.status === 'completed') {
            navigate(`/analysis/result/${record.id}`);
          }
        },
        style: { cursor: record.status === 'completed' ? 'pointer' : 'default' },
      })}
    />
  );
};
