import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Table, Tag, Button, Space, Typography, Badge, Skeleton,
  Modal, Image, Row, Col, Divider, Alert, Steps, Timeline,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined,
  PictureOutlined, FileTextOutlined, BulbOutlined, WarningOutlined,
  CameraOutlined, ArrowRightOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

import { PageContainer } from '@/components/PageContainer';
import type { MonitorExecution, MonitorTask, ExecutionReport, ExecutionChangeDetail } from '../types';
import { getMonitorDetail, getMonitorExecutions } from '../services/monitorService';

const IMPACT_CONFIG = {
  high: { color: '#FF4D4F', bg: '#FFF1F0', label: '高影响', tagColor: 'error' as const },
  medium: { color: '#FA8C16', bg: '#FFF7E6', label: '中影响', tagColor: 'warning' as const },
  low: { color: '#52C41A', bg: '#F6FFED', label: '低影响', tagColor: 'success' as const },
};

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  execution: MonitorExecution | null;
  monitorName: string;
}

const ChangeDetailCard = ({ detail }: { detail: ExecutionChangeDetail }) => {
  const impactConfig = IMPACT_CONFIG[detail.impact];
  return (
    <div
      style={{
        border: `1px solid ${impactConfig.color}30`,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 16,
      }}
    >
      <div
        style={{
          padding: '10px 16px',
          background: impactConfig.bg,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Tag color={impactConfig.tagColor} style={{ margin: 0 }}>{impactConfig.label}</Tag>
        <Typography.Text strong style={{ fontSize: 14 }}>{detail.dimension}</Typography.Text>
        <Typography.Text style={{ fontSize: 13, color: '#595959' }}>— {detail.description}</Typography.Text>
      </div>

      <div style={{ padding: '16px' }}>
        <Row gutter={16} align="middle">
          <Col span={11}>
            <div style={{ textAlign: 'center' }}>
              <Typography.Text
                style={{
                  display: 'block',
                  fontSize: 11,
                  color: '#8C8C8C',
                  marginBottom: 8,
                  background: '#F5F5F5',
                  padding: '3px 8px',
                  borderRadius: 4,
                }}
              >
                变化前
              </Typography.Text>
              <Image
                src={detail.beforeScreenshotUrl}
                alt="变化前截图"
                style={{ borderRadius: 8, border: '1px solid #F0F0F0', width: '100%', maxHeight: 200, objectFit: 'cover' }}
                preview={{ mask: '查看大图' }}
              />
              <div
                style={{
                  marginTop: 8,
                  padding: '8px 10px',
                  background: '#FFF7E6',
                  borderRadius: 6,
                  borderLeft: '3px solid #FA8C16',
                  textAlign: 'left',
                }}
              >
                <Typography.Text style={{ fontSize: 12, color: '#595959' }}>{detail.beforeDescription}</Typography.Text>
              </div>
            </div>
          </Col>
          <Col span={2} style={{ textAlign: 'center' }}>
            <ArrowRightOutlined style={{ color: '#D9D9D9', fontSize: 18 }} />
          </Col>
          <Col span={11}>
            <div style={{ textAlign: 'center' }}>
              <Typography.Text
                style={{
                  display: 'block',
                  fontSize: 11,
                  color: '#FF4D4F',
                  marginBottom: 8,
                  background: '#FFF1F0',
                  padding: '3px 8px',
                  borderRadius: 4,
                }}
              >
                变化后
              </Typography.Text>
              <Image
                src={detail.afterScreenshotUrl}
                alt="变化后截图"
                style={{ borderRadius: 8, border: '1px solid #FFD6D6', width: '100%', maxHeight: 200, objectFit: 'cover' }}
                preview={{ mask: '查看大图' }}
              />
              <div
                style={{
                  marginTop: 8,
                  padding: '8px 10px',
                  background: '#FFF1F0',
                  borderRadius: 6,
                  borderLeft: '3px solid #FF4D4F',
                  textAlign: 'left',
                }}
              >
                <Typography.Text style={{ fontSize: 12, color: '#595959' }}>{detail.afterDescription}</Typography.Text>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

const ReportModal = ({ open, onClose, execution, monitorName }: ReportModalProps) => {
  if (!execution?.report) return null;
  const { report } = execution;

  return (
    <Modal
      title={
        <Space>
          <FileTextOutlined style={{ color: '#1677FF' }} />
          <span>变化分析报告</span>
          <Typography.Text style={{ fontSize: 13, color: '#8C8C8C', fontWeight: 400 }}>
            {monitorName} · {dayjs(execution.executedAt).format('YYYY-MM-DD HH:mm')}
          </Typography.Text>
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={<Button onClick={onClose}>关闭</Button>}
      width={800}
      style={{ top: 20 }}
      styles={{ body: { maxHeight: '80vh', overflowY: 'auto', padding: '16px 24px' } }}
    >
      <Alert
        icon={<FileTextOutlined />}
        message={<Typography.Text strong>AI 分析摘要</Typography.Text>}
        description={report.summary}
        type="info"
        showIcon
        style={{ marginBottom: 20, borderRadius: 8 }}
      />

      <Typography.Title level={5} style={{ marginBottom: 12 }}>
        <WarningOutlined style={{ color: '#FA8C16', marginRight: 6 }} />
        变化详情（{report.changeDetails.length} 处）
      </Typography.Title>

      {report.changeDetails.map((detail, index) => (
        <ChangeDetailCard key={index} detail={detail} />
      ))}

      <Divider />

      <Typography.Title level={5} style={{ marginBottom: 12 }}>
        <CameraOutlined style={{ color: '#1677FF', marginRight: 6 }} />
        本次执行截图留存（{report.screenshots.length} 张）
      </Typography.Title>

      <Image.PreviewGroup>
        <Row gutter={[12, 12]}>
          {report.screenshots.map((screenshot, index) => (
            <Col span={8} key={index}>
              <div
                style={{
                  border: '1px solid #F0F0F0',
                  borderRadius: 8,
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                <Image
                  src={screenshot.screenshotUrl}
                  alt={screenshot.stepName}
                  style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }}
                  preview={{ mask: '查看大图' }}
                />
                <div style={{ padding: '6px 10px', background: '#FAFAFA' }}>
                  <Typography.Text style={{ fontSize: 12, color: '#595959', display: 'block' }}>
                    {screenshot.stepName}
                  </Typography.Text>
                  <Typography.Text style={{ fontSize: 11, color: '#BFBFBF' }}>
                    {dayjs(screenshot.capturedAt).format('HH:mm:ss')}
                  </Typography.Text>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Image.PreviewGroup>

      <Divider />

      <Typography.Title level={5} style={{ marginBottom: 12 }}>
        <BulbOutlined style={{ color: '#52C41A', marginRight: 6 }} />
        设计建议
      </Typography.Title>

      <Timeline
        items={report.recommendations.map((rec, index) => ({
          color: index === 0 ? '#FF4D4F' : index === 1 ? '#FA8C16' : '#52C41A',
          children: (
            <Typography.Text style={{ fontSize: 13, color: '#595959' }}>{rec}</Typography.Text>
          ),
        }))}
      />
    </Modal>
  );
};

export const MonitorHistoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [monitor, setMonitor] = useState<MonitorTask | null>(null);
  const [executions, setExecutions] = useState<MonitorExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportExecution, setReportExecution] = useState<MonitorExecution | null>(null);

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
      width: 100,
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
      title: '变化检测',
      dataIndex: 'hasChanges',
      key: 'hasChanges',
      width: 140,
      render: (hasChanges: boolean, record) =>
        hasChanges ? (
          <Badge color="#FF4D4F" text={`有变化（${record.changeCount} 处）`} />
        ) : (
          <Badge color="#D9D9D9" text="无变化" />
        ),
    },
    {
      title: '截图留存',
      key: 'screenshots',
      width: 160,
      render: (_, record) => {
        if (!record.screenshots || record.screenshots.length === 0) {
          return <Typography.Text style={{ color: '#D9D9D9', fontSize: 12 }}>-</Typography.Text>;
        }
        return (
          <Space size={4}>
            <PictureOutlined style={{ color: '#1677FF', fontSize: 13 }} />
            <Typography.Text style={{ fontSize: 12, color: '#1677FF' }}>
              {record.screenshots.length} 张截图
            </Typography.Text>
            <Image.PreviewGroup
              items={record.screenshots.map((s) => ({ src: s.screenshotUrl, alt: s.stepName }))}
            >
              <Image
                src={record.screenshots[0].screenshotUrl}
                width={32}
                height={32}
                style={{ borderRadius: 4, objectFit: 'cover', cursor: 'pointer' }}
                preview={{ mask: '' }}
              />
            </Image.PreviewGroup>
          </Space>
        );
      },
    },
    {
      title: '耗时',
      dataIndex: 'duration',
      key: 'duration',
      width: 80,
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
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) =>
        record.hasChanges && record.report ? (
          <Button
            type="link"
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => setReportExecution(record)}
            style={{ padding: '0 4px', color: '#FF4D4F' }}
          >
            查看报告
          </Button>
        ) : (
          <Typography.Text style={{ color: '#D9D9D9', fontSize: 12 }}>-</Typography.Text>
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
              <Space size={32} wrap>
                <div>
                  <Typography.Text style={{ fontSize: 12, color: '#8C8C8C', display: 'block' }}>竞品</Typography.Text>
                  <Typography.Text strong>{monitor.competitorName}</Typography.Text>
                </div>
                <div>
                  <Typography.Text style={{ fontSize: 12, color: '#8C8C8C', display: 'block' }}>
                    {monitor.targetType === 'flow' ? '流程类型' : '页面类型'}
                  </Typography.Text>
                  <Space size={4}>
                    <Typography.Text>{monitor.pageType}</Typography.Text>
                    {monitor.targetType === 'flow' && <Tag color="purple">流程监控</Tag>}
                  </Space>
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
              rowClassName={(record) => record.hasChanges ? 'ant-table-row-highlight' : ''}
            />
          </Card>
        </Space>
      )}

      <ReportModal
        open={!!reportExecution}
        onClose={() => setReportExecution(null)}
        execution={reportExecution}
        monitorName={monitor?.name ?? ''}
      />
    </PageContainer>
  );
};
