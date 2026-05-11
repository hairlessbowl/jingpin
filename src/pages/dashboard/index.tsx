import { Card, Button, Row, Col, Typography, Space, Divider } from 'antd';
import { PlusOutlined, MonitorOutlined, ArrowRightOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

import { PageContainer } from '@/components/PageContainer';
import { StatCards } from './components/StatCards';
import { RecentTaskList } from './components/RecentTaskList';
import { useDashboardData } from './hooks/useDashboardData';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { data, loading } = useDashboardData();

  return (
    <PageContainer title="工作台">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Row gutter={16}>
            <Col span={8}>
              <Card
                hoverable
                onClick={() => navigate('/analysis/new')}
                style={{
                  borderRadius: 8,
                  border: '1px solid #E6F4FF',
                  background: 'linear-gradient(135deg, #E6F4FF 0%, #F0F7FF 100%)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                bodyStyle={{ padding: 24 }}
              >
                <Space direction="vertical" size={8}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: '#1677FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PlusOutlined style={{ color: '#fff', fontSize: 18 }} />
                  </div>
                  <Typography.Title level={5} style={{ margin: 0, color: '#1677FF' }}>
                    新建分析
                  </Typography.Title>
                  <Typography.Text style={{ color: '#595959', fontSize: 13 }}>
                    上传竞品截图/录屏，AI 自动拆解分析
                  </Typography.Text>
                </Space>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                hoverable
                onClick={() => navigate('/monitors')}
                style={{
                  borderRadius: 8,
                  border: '1px solid #FFF7E6',
                  background: 'linear-gradient(135deg, #FFF7E6 0%, #FFFBF0 100%)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                bodyStyle={{ padding: 24 }}
              >
                <Space direction="vertical" size={8}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: '#FA8C16',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MonitorOutlined style={{ color: '#fff', fontSize: 18 }} />
                  </div>
                  <Typography.Title level={5} style={{ margin: 0, color: '#FA8C16' }}>
                    新建监控
                  </Typography.Title>
                  <Typography.Text style={{ color: '#595959', fontSize: 13 }}>
                    配置自动采集任务，实时监控竞品变化
                  </Typography.Text>
                </Space>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                style={{
                  borderRadius: 8,
                  border: '1px solid #F0F0F0',
                  background: '#FAFAFA',
                }}
                bodyStyle={{ padding: 24 }}
              >
                <Typography.Text style={{ color: '#8C8C8C', fontSize: 12, display: 'block', marginBottom: 8 }}>
                  监控动态
                </Typography.Text>
                {loading ? null : (
                  <Space direction="vertical" size={4} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography.Text style={{ color: '#595959', fontSize: 13 }}>运行中监控</Typography.Text>
                      <Typography.Text strong style={{ color: '#262626' }}>{data?.monitorSummary.activeCount} 个</Typography.Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography.Text style={{ color: '#595959', fontSize: 13 }}>今日执行</Typography.Text>
                      <Typography.Text strong style={{ color: '#262626' }}>{data?.monitorSummary.todayExecutions} 次</Typography.Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography.Text style={{ color: '#595959', fontSize: 13 }}>本周变化</Typography.Text>
                      <Typography.Text strong style={{ color: '#FF4D4F' }}>{data?.monitorSummary.weeklyChanges} 次</Typography.Text>
                    </div>
                    <Divider style={{ margin: '8px 0' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <ClockCircleOutlined style={{ color: '#8C8C8C', fontSize: 12 }} />
                      <Typography.Text style={{ color: '#8C8C8C', fontSize: 12 }}>
                        最近变化：{data?.monitorSummary.lastChangeName}
                      </Typography.Text>
                    </div>
                  </Space>
                )}
              </Card>
            </Col>
          </Row>
        </Col>

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
