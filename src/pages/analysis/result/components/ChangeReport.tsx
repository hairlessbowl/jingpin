import { Card, Timeline, Tag, Typography, Space, Empty } from 'antd';
import { ClockCircleOutlined, AlertOutlined } from '@ant-design/icons';

interface ChangeReportProps {
  taskId: string;
}

const mockChanges = [
  {
    time: '2026-05-11 10:05',
    title: '底部操作栏按钮布局调整',
    description: '加购按钮从左侧移至中间，购买按钮宽度增加 20%',
    impact: 'high' as const,
    dimension: '布局',
  },
  {
    time: '2026-05-10 14:30',
    title: '价格展示区域新增倒计时',
    description: '在价格标签右侧增加限时特惠倒计时组件，字体颜色为红色',
    impact: 'medium' as const,
    dimension: '交互',
  },
  {
    time: '2026-05-09 09:15',
    title: '商品主图轮播指示器样式更新',
    description: '指示器从圆点改为短横线，激活态颜色从白色改为品牌红',
    impact: 'low' as const,
    dimension: '视觉',
  },
];

const IMPACT_CONFIG = {
  high: { color: 'red', label: '高影响' },
  medium: { color: 'orange', label: '中影响' },
  low: { color: 'green', label: '低影响' },
};

export const ChangeReport = ({ taskId }: ChangeReportProps) => {
  if (!taskId) {
    return <Empty description="暂无变化记录" />;
  }

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card
        style={{ borderRadius: 8, border: '1px solid #FFF7E6', background: '#FFFBF0' }}
        size="small"
      >
        <Space>
          <AlertOutlined style={{ color: '#FA8C16' }} />
          <Typography.Text style={{ color: '#FA8C16', fontSize: 13 }}>
            本次分析共检测到 <strong>{mockChanges.length}</strong> 处变化，其中高影响变化{' '}
            <strong>{mockChanges.filter((c) => c.impact === 'high').length}</strong> 处
          </Typography.Text>
        </Space>
      </Card>

      <Card
        title={
          <Space>
            <ClockCircleOutlined />
            <Typography.Text strong>变化时间线</Typography.Text>
          </Space>
        }
        style={{ borderRadius: 8, border: '1px solid #F0F0F0' }}
        size="small"
      >
        <Timeline
          items={mockChanges.map((change) => ({
            color: IMPACT_CONFIG[change.impact].color,
            children: (
              <div style={{ paddingBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Typography.Text strong style={{ fontSize: 13 }}>
                    {change.title}
                  </Typography.Text>
                  <Tag color={IMPACT_CONFIG[change.impact].color} style={{ fontSize: 11 }}>
                    {IMPACT_CONFIG[change.impact].label}
                  </Tag>
                  <Tag style={{ fontSize: 11 }}>{change.dimension}</Tag>
                </div>
                <Typography.Text style={{ fontSize: 12, color: '#595959', display: 'block', marginBottom: 4 }}>
                  {change.description}
                </Typography.Text>
                <Typography.Text style={{ fontSize: 11, color: '#BFBFBF' }}>
                  {change.time}
                </Typography.Text>
              </div>
            ),
          }))}
        />
      </Card>
    </Space>
  );
};
