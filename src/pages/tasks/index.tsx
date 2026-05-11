import { useState } from 'react';
import {
  Card, Table, Tag, Button, Space, Select, Input, DatePicker,
  Typography, App as AntApp, Popconfirm, Row, Col,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, ReloadOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { PageContainer } from '@/components/PageContainer';
import { STATUS_LABELS, STATUS_COLORS, PAGE_TYPES } from '@/types/common';
import {
  getTaskList,
  deleteTask,
  retryTask,
} from '@/pages/analysis/services/analysisService';
import type { AnalysisTask } from '@/pages/analysis/types';
import { useRequest } from './hooks/useRequest';

const { RangePicker } = DatePicker;

interface FilterState {
  type?: string;
  status?: string;
  competitor?: string;
  pageType?: string;
  startDate?: string;
  endDate?: string;
}

export const TaskListPage = () => {
  const navigate = useNavigate();
  const { message } = AntApp.useApp();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<FilterState>({});
  const [filterDraft, setFilterDraft] = useState<FilterState>({});

  const { data, loading, refresh } = useRequest(
    () => getTaskList({ page, pageSize, ...filters }),
    [page, pageSize, filters]
  );

  const handleSearch = () => {
    setFilters(filterDraft);
    setPage(1);
  };

  const handleReset = () => {
    setFilterDraft({});
    setFilters({});
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    message.success('删除成功');
    refresh();
  };

  const handleRetry = async (id: string) => {
    await retryTask(id);
    message.success('已重新提交分析');
    refresh();
  };

  const columns: ColumnsType<AnalysisTask> = [
    {
      title: '任务名称',
      key: 'name',
      render: (_, record) => (
        <div>
          <Typography.Text strong style={{ fontSize: 13, color: '#262626', display: 'block' }}>
            {record.competitorName} · {record.pageType}
          </Typography.Text>
          <Typography.Text style={{ fontSize: 12, color: '#8C8C8C' }}>
            {record.deviceType === 'mobile' ? '移动端' : record.deviceType === 'desktop' ? 'PC 端' : '平板'}
            · {record.materialCount} 个素材
          </Typography.Text>
        </div>
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
        <Typography.Text style={{ fontSize: 13, color: '#595959' }}>
          {dayjs(time).format('YYYY-MM-DD HH:mm')}
        </Typography.Text>
      ),
    },
    {
      title: '完成时间',
      dataIndex: 'completedAt',
      key: 'completedAt',
      width: 160,
      render: (time?: string) => (
        <Typography.Text style={{ fontSize: 13, color: '#595959' }}>
          {time ? dayjs(time).format('YYYY-MM-DD HH:mm') : '-'}
        </Typography.Text>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space size={4}>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            disabled={record.status !== 'completed'}
            onClick={() => navigate(`/analysis/result/${record.id}`)}
            style={{ padding: '0 4px' }}
          >
            查看结果
          </Button>
          {record.status === 'failed' && (
            <Button
              type="link"
              size="small"
              icon={<ReloadOutlined />}
              onClick={() => handleRetry(record.id)}
              style={{ padding: '0 4px' }}
            >
              重试
            </Button>
          )}
          <Popconfirm
            title="确认删除该任务？"
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
      title="历史任务"
      extra={
        <Button type="primary" onClick={() => navigate('/analysis/new')}>
          新建分析
        </Button>
      }
    >
      <Card style={{ borderRadius: 8, border: '1px solid #F0F0F0', marginBottom: 16 }} size="small">
        <Row gutter={[12, 12]} align="middle">
          <Col>
            <Select
              placeholder="任务类型"
              allowClear
              style={{ width: 120 }}
              value={filterDraft.type}
              onChange={(val) => setFilterDraft((prev) => ({ ...prev, type: val }))}
              options={[
                { value: 'manual', label: '手动分析' },
                { value: 'auto_monitor', label: '自动监控' },
              ]}
            />
          </Col>
          <Col>
            <Select
              placeholder="状态"
              allowClear
              style={{ width: 120 }}
              value={filterDraft.status}
              onChange={(val) => setFilterDraft((prev) => ({ ...prev, status: val }))}
              options={Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))}
            />
          </Col>
          <Col>
            <Input
              placeholder="竞品名称"
              allowClear
              style={{ width: 140 }}
              value={filterDraft.competitor}
              onChange={(e) => setFilterDraft((prev) => ({ ...prev, competitor: e.target.value }))}
            />
          </Col>
          <Col>
            <Select
              placeholder="页面类型"
              allowClear
              style={{ width: 140 }}
              value={filterDraft.pageType}
              onChange={(val) => setFilterDraft((prev) => ({ ...prev, pageType: val }))}
              options={PAGE_TYPES.map((t) => ({ value: t, label: t }))}
            />
          </Col>
          <Col>
            <RangePicker
              style={{ width: 240 }}
              onChange={(dates) => {
                setFilterDraft((prev) => ({
                  ...prev,
                  startDate: dates?.[0]?.toISOString(),
                  endDate: dates?.[1]?.toISOString(),
                }));
              }}
            />
          </Col>
          <Col>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                搜索
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card style={{ borderRadius: 8, border: '1px solid #F0F0F0' }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data?.data ?? []}
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total: data?.total ?? 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
          }}
          onRow={(record) => ({
            style: { cursor: record.status === 'completed' ? 'pointer' : 'default' },
            onClick: () => {
              if (record.status === 'completed') {
                navigate(`/analysis/result/${record.id}`);
              }
            },
          })}
        />
      </Card>
    </PageContainer>
  );
};
