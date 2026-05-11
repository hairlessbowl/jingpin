import { Card, Tag, Typography, Space, Row, Col, Badge } from 'antd';
import { BulbOutlined, RocketOutlined, ThunderboltOutlined } from '@ant-design/icons';
import type { AnalysisResult } from '@/pages/analysis/types';

interface FusionSuggestionsProps {
  result: AnalysisResult;
}

const PRIORITY_CONFIG = {
  high: { color: '#FF4D4F', bg: '#FFF1F0', label: '高优先级', icon: <RocketOutlined /> },
  medium: { color: '#FA8C16', bg: '#FFF7E6', label: '中优先级', icon: <ThunderboltOutlined /> },
  low: { color: '#52C41A', bg: '#F6FFED', label: '低优先级', icon: <BulbOutlined /> },
};

export const FusionSuggestions = ({ result }: FusionSuggestionsProps) => {
  const { fusionSuggestions } = result;

  const highPriority = fusionSuggestions.filter((s) => s.priority === 'high');
  const mediumPriority = fusionSuggestions.filter((s) => s.priority === 'medium');
  const lowPriority = fusionSuggestions.filter((s) => s.priority === 'low');

  const renderSuggestionCard = (suggestion: (typeof fusionSuggestions)[0], index: number) => {
    const config = PRIORITY_CONFIG[suggestion.priority];
    return (
      <Card
        key={suggestion.id}
        style={{
          borderRadius: 8,
          border: `1px solid ${config.color}30`,
          background: config.bg,
          marginBottom: 12,
        }}
        size="small"
        bodyStyle={{ padding: '16px 20px' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: config.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            {config.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Typography.Text strong style={{ fontSize: 14, color: '#262626' }}>
                {suggestion.title}
              </Typography.Text>
              <Tag
                style={{
                  background: 'transparent',
                  border: `1px solid ${config.color}`,
                  color: config.color,
                  fontSize: 11,
                }}
              >
                {config.label}
              </Tag>
            </div>
            <Typography.Paragraph style={{ margin: '0 0 8px', color: '#595959', fontSize: 13 }}>
              {suggestion.description}
            </Typography.Paragraph>
            <div style={{ display: 'flex', gap: 16 }}>
              {suggestion.referenceElement && (
                <Typography.Text style={{ fontSize: 12, color: '#8C8C8C' }}>
                  参考元素：
                  <Tag style={{ fontSize: 11, marginLeft: 4 }}>{suggestion.referenceElement}</Tag>
                </Typography.Text>
              )}
              {suggestion.expectedEffect && (
                <Typography.Text style={{ fontSize: 12, color: '#52C41A' }}>
                  预期效果：{suggestion.expectedEffect}
                </Typography.Text>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          gap: 16,
          padding: '12px 16px',
          background: '#FAFAFA',
          borderRadius: 8,
          border: '1px solid #F0F0F0',
        }}
      >
        <Space size={24}>
          <Space size={6}>
            <Badge color="#FF4D4F" />
            <Typography.Text style={{ fontSize: 13 }}>高优先级 {highPriority.length} 项</Typography.Text>
          </Space>
          <Space size={6}>
            <Badge color="#FA8C16" />
            <Typography.Text style={{ fontSize: 13 }}>中优先级 {mediumPriority.length} 项</Typography.Text>
          </Space>
          <Space size={6}>
            <Badge color="#52C41A" />
            <Typography.Text style={{ fontSize: 13 }}>低优先级 {lowPriority.length} 项</Typography.Text>
          </Space>
        </Space>
      </div>

      {highPriority.length > 0 && (
        <div>
          <Typography.Text strong style={{ fontSize: 13, color: '#FF4D4F', display: 'block', marginBottom: 10 }}>
            高优先级建议
          </Typography.Text>
          {highPriority.map((s, i) => renderSuggestionCard(s, i))}
        </div>
      )}

      {mediumPriority.length > 0 && (
        <div>
          <Typography.Text strong style={{ fontSize: 13, color: '#FA8C16', display: 'block', marginBottom: 10 }}>
            中优先级建议
          </Typography.Text>
          {mediumPriority.map((s, i) => renderSuggestionCard(s, i))}
        </div>
      )}

      {lowPriority.length > 0 && (
        <div>
          <Typography.Text strong style={{ fontSize: 13, color: '#52C41A', display: 'block', marginBottom: 10 }}>
            低优先级建议
          </Typography.Text>
          {lowPriority.map((s, i) => renderSuggestionCard(s, i))}
        </div>
      )}
    </Space>
  );
};
