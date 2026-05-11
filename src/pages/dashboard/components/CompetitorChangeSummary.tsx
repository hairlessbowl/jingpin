import { Card, Typography, Tag, Space, Avatar, Badge } from 'antd';
import { ArrowRightOutlined, RiseOutlined, FireOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface CompetitorChangeItem {
  competitor: string;
  avatarColor: string;
  avatarLetter: string;
  changeCount: number;
  lastChangedAt: string;
  summary: string;
  tags: string[];
  impact: 'high' | 'medium' | 'low';
  monitorId: string;
}

const IMPACT_CONFIG = {
  high: { color: '#FF4D4F', bg: '#FFF1F0', label: '高影响' },
  medium: { color: '#FA8C16', bg: '#FFF7E6', label: '中影响' },
  low: { color: '#52C41A', bg: '#F6FFED', label: '低影响' },
};

const MOCK_COMPETITOR_CHANGES: CompetitorChangeItem[] = [
  {
    competitor: '京东',
    avatarColor: '#E1251B',
    avatarLetter: '京',
    changeCount: 3,
    lastChangedAt: '今天 10:05',
    summary: '百亿补贴活动页底部购买按钮样式更新，价格区新增倒计时组件，视觉冲击力显著增强',
    tags: ['按钮样式', '倒计时', '价格展示'],
    impact: 'high',
    monitorId: 'monitor_001',
  },
  {
    competitor: '拼多多',
    avatarColor: '#E02E24',
    avatarLetter: '拼',
    changeCount: 12,
    lastChangedAt: '今天 14:00',
    summary: '首页大促 Banner 图更新，入口文案调整为"限时秒杀"，强化紧迫感引导',
    tags: ['Banner', '文案', '首页入口'],
    impact: 'medium',
    monitorId: 'monitor_002',
  },
  {
    competitor: '美团',
    avatarColor: '#FFCC00',
    avatarLetter: '美',
    changeCount: 2,
    lastChangedAt: '今天 17:00',
    summary: '外卖下单流程：确认订单页送达时间展示升级为绿色强调，支付页微信支付优先引导',
    tags: ['下单流程', '支付引导', '配送时间'],
    impact: 'high',
    monitorId: 'monitor_004',
  },
];

export const CompetitorChangeSummary = () => {
  const navigate = useNavigate();

  return (
    <Card
      title={
        <Space size={8}>
          <FireOutlined style={{ color: '#FF4D4F' }} />
          <Typography.Text strong style={{ fontSize: 15 }}>
            竞品变化概述
          </Typography.Text>
          <Tag color="red" style={{ marginLeft: 4, fontSize: 11 }}>
            近 7 天
          </Tag>
        </Space>
      }
      extra={
        <Typography.Link
          onClick={() => navigate('/monitors')}
          style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}
        >
          查看监控 <ArrowRightOutlined style={{ fontSize: 11 }} />
        </Typography.Link>
      }
      style={{ borderRadius: 8, border: '1px solid #F0F0F0' }}
      bodyStyle={{ padding: '12px 24px 20px' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {MOCK_COMPETITOR_CHANGES.map((item, index) => {
          const impactCfg = IMPACT_CONFIG[item.impact];
          return (
            <div
              key={item.competitor}
              onClick={() => navigate(`/monitors/${item.monitorId}/history`)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                padding: '16px 0',
                borderBottom: index < MOCK_COMPETITOR_CHANGES.length - 1 ? '1px solid #F5F5F5' : 'none',
                cursor: 'pointer',
                transition: 'background 0.15s',
                borderRadius: 6,
                margin: '0 -8px',
                paddingLeft: 8,
                paddingRight: 8,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = '#FAFAFA';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = 'transparent';
              }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <Avatar
                  size={40}
                  style={{
                    background: item.avatarColor,
                    fontSize: 15,
                    fontWeight: 700,
                    color: item.competitor === '美团' ? '#333' : '#fff',
                  }}
                >
                  {item.avatarLetter}
                </Avatar>
                {item.changeCount > 0 && (
                  <Badge
                    count={item.changeCount}
                    size="small"
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      fontSize: 10,
                      minWidth: 16,
                      height: 16,
                      lineHeight: '16px',
                      padding: '0 4px',
                    }}
                  />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Typography.Text strong style={{ fontSize: 14, color: '#262626' }}>
                    {item.competitor}
                  </Typography.Text>
                  <span
                    style={{
                      fontSize: 11,
                      color: impactCfg.color,
                      background: impactCfg.bg,
                      padding: '1px 6px',
                      borderRadius: 4,
                      fontWeight: 500,
                    }}
                  >
                    {impactCfg.label}
                  </span>
                  <Typography.Text style={{ fontSize: 12, color: '#BFBFBF', marginLeft: 'auto' }}>
                    {item.lastChangedAt}
                  </Typography.Text>
                </div>

                <Typography.Text
                  style={{ fontSize: 13, color: '#595959', display: 'block', marginBottom: 8, lineHeight: '20px' }}
                  ellipsis={{ tooltip: item.summary }}
                >
                  {item.summary}
                </Typography.Text>

                <Space size={4} wrap>
                  {item.tags.map((tag) => (
                    <Tag
                      key={tag}
                      style={{
                        fontSize: 11,
                        padding: '0 6px',
                        lineHeight: '18px',
                        borderRadius: 4,
                        color: '#595959',
                        background: '#F5F5F5',
                        border: '1px solid #E8E8E8',
                        margin: 0,
                      }}
                    >
                      {tag}
                    </Tag>
                  ))}
                  <Space size={4} style={{ marginLeft: 4 }}>
                    <RiseOutlined style={{ fontSize: 11, color: '#8C8C8C' }} />
                    <Typography.Text style={{ fontSize: 11, color: '#8C8C8C' }}>
                      本周 {item.changeCount} 次变化
                    </Typography.Text>
                  </Space>
                </Space>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
