import { Row, Col, Card, Tag, Typography, Space, Divider } from 'antd';
import type { AnalysisResult } from '@/pages/analysis/types';

interface PageBreakdownProps {
  result: AnalysisResult;
}

const COMPONENT_TYPE_COLORS: Record<string, string> = {
  image: 'blue',
  heading: 'purple',
  button: 'red',
  label: 'orange',
  tag: 'cyan',
  input: 'green',
  nav: 'geekblue',
  card: 'magenta',
};

export const PageBreakdown = ({ result }: PageBreakdownProps) => {
  const { breakdown } = result;

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card
          title={<Typography.Text strong>布局概述</Typography.Text>}
          style={{ borderRadius: 8, border: '1px solid #F0F0F0' }}
          size="small"
        >
          <Typography.Paragraph style={{ color: '#595959', margin: 0 }}>
            {breakdown.layoutSummary}
          </Typography.Paragraph>
        </Card>
      </Col>

      <Col span={16}>
        <Card
          title={<Typography.Text strong>组件清单</Typography.Text>}
          style={{ borderRadius: 8, border: '1px solid #F0F0F0' }}
          size="small"
        >
          <Space direction="vertical" size={0} style={{ width: '100%' }}>
            {breakdown.components.map((comp, index) => (
              <div key={comp.id}>
                {index > 0 && <Divider style={{ margin: '8px 0' }} />}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      background: '#F5F5F5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: 12,
                      color: '#8C8C8C',
                      fontWeight: 600,
                    }}
                  >
                    {index + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Space size={8} style={{ marginBottom: 4 }}>
                      <Typography.Text strong style={{ fontSize: 13 }}>
                        {comp.name}
                      </Typography.Text>
                      <Tag
                        color={COMPONENT_TYPE_COLORS[comp.type] ?? 'default'}
                        style={{ fontSize: 11 }}
                      >
                        {comp.type}
                      </Tag>
                      <Tag style={{ fontSize: 11, color: '#8C8C8C' }}>{comp.region}</Tag>
                    </Space>
                    <Typography.Text style={{ fontSize: 12, color: '#8C8C8C', display: 'block' }}>
                      {comp.description}
                    </Typography.Text>
                  </div>
                </div>
              </div>
            ))}
          </Space>
        </Card>
      </Col>

      <Col span={8}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Card
            title={<Typography.Text strong>配色方案</Typography.Text>}
            style={{ borderRadius: 8, border: '1px solid #F0F0F0' }}
            size="small"
          >
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              {[
                { label: '主色', value: breakdown.colorPalette.primary },
                { label: '辅色', value: breakdown.colorPalette.secondary },
                { label: '背景色', value: breakdown.colorPalette.background },
                { label: '文字色', value: breakdown.colorPalette.text },
              ].map((color) => (
                <div key={color.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 4,
                      background: color.value,
                      border: '1px solid #F0F0F0',
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <Typography.Text style={{ fontSize: 12, color: '#8C8C8C', display: 'block' }}>
                      {color.label}
                    </Typography.Text>
                    <Typography.Text style={{ fontSize: 12, fontFamily: 'monospace' }}>
                      {color.value}
                    </Typography.Text>
                  </div>
                </div>
              ))}
              {breakdown.colorPalette.accent.map((accentColor, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 4,
                      background: accentColor,
                      border: '1px solid #F0F0F0',
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <Typography.Text style={{ fontSize: 12, color: '#8C8C8C', display: 'block' }}>
                      强调色 {index + 1}
                    </Typography.Text>
                    <Typography.Text style={{ fontSize: 12, fontFamily: 'monospace' }}>
                      {accentColor}
                    </Typography.Text>
                  </div>
                </div>
              ))}
            </Space>
          </Card>

          <Card
            title={<Typography.Text strong>设计模式</Typography.Text>}
            style={{ borderRadius: 8, border: '1px solid #F0F0F0' }}
            size="small"
          >
            <Space size={[8, 8]} wrap>
              {breakdown.designPatterns.map((pattern) => (
                <Tag key={pattern} color="blue" style={{ borderRadius: 4 }}>
                  {pattern}
                </Tag>
              ))}
            </Space>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};
