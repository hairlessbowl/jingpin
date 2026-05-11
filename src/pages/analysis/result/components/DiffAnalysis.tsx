import { Row, Col, Card, Tag, Typography, Space, List, Image } from 'antd';
import { ArrowRightOutlined, CheckCircleOutlined, CloseCircleOutlined, CameraOutlined } from '@ant-design/icons';
import type { AnalysisResult } from '@/pages/analysis/types';

interface DiffAnalysisProps {
  result: AnalysisResult;
}

const IMPACT_CONFIG = {
  high: { color: '#FF4D4F', bg: '#FFF1F0', label: '高影响' },
  medium: { color: '#FA8C16', bg: '#FFF7E6', label: '中影响' },
  low: { color: '#52C41A', bg: '#F6FFED', label: '低影响' },
};

export const DiffAnalysis = ({ result }: DiffAnalysisProps) => {
  const { diffAnalysis } = result;

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card
        style={{ borderRadius: 8, border: '1px solid #E6F4FF', background: '#F0F7FF' }}
        size="small"
      >
        <Typography.Paragraph style={{ margin: 0, color: '#1677FF', fontSize: 14 }}>
          <strong>总结：</strong>{diffAnalysis.summary}
        </Typography.Paragraph>
      </Card>

      <Card
        title={<Typography.Text strong>差异对比详情</Typography.Text>}
        style={{ borderRadius: 8, border: '1px solid #F0F0F0' }}
        size="small"
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          {diffAnalysis.differences.map((diff, index) => {
            const impactConfig = IMPACT_CONFIG[diff.impact];
            const hasScreenshots = diff.competitorScreenshotUrl || diff.ourScreenshotUrl;
            return (
              <div
                key={index}
                style={{
                  padding: '14px 16px',
                  background: '#FAFAFA',
                  borderRadius: 8,
                  border: '1px solid #F0F0F0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Tag
                    style={{
                      background: impactConfig.bg,
                      color: impactConfig.color,
                      border: 'none',
                      fontWeight: 600,
                    }}
                  >
                    {impactConfig.label}
                  </Tag>
                  <Typography.Text strong style={{ fontSize: 14 }}>
                    {diff.dimension}
                  </Typography.Text>
                  <Typography.Text style={{ color: '#8C8C8C', fontSize: 13 }}>
                    — {diff.description}
                  </Typography.Text>
                </div>

                <Row gutter={12}>
                  <Col span={11}>
                    <div
                      style={{
                        padding: '10px 12px',
                        background: '#FFF7E6',
                        borderRadius: 6,
                        borderLeft: '3px solid #FA8C16',
                      }}
                    >
                      <Typography.Text style={{ fontSize: 11, color: '#FA8C16', display: 'block', marginBottom: 4 }}>
                        竞品方案
                      </Typography.Text>
                      <Typography.Text style={{ fontSize: 13, color: '#595959' }}>
                        {diff.competitorApproach}
                      </Typography.Text>
                    </div>
                  </Col>
                  <Col span={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowRightOutlined style={{ color: '#D9D9D9' }} />
                  </Col>
                  <Col span={11}>
                    <div
                      style={{
                        padding: '10px 12px',
                        background: '#F5F5F5',
                        borderRadius: 6,
                        borderLeft: '3px solid #D9D9D9',
                      }}
                    >
                      <Typography.Text style={{ fontSize: 11, color: '#8C8C8C', display: 'block', marginBottom: 4 }}>
                        我方现状
                      </Typography.Text>
                      <Typography.Text style={{ fontSize: 13, color: '#595959' }}>
                        {diff.ourApproach}
                      </Typography.Text>
                    </div>
                  </Col>
                </Row>

                {hasScreenshots && (
                  <div style={{ marginTop: 14 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        marginBottom: 10,
                        paddingBottom: 8,
                        borderBottom: '1px dashed #F0F0F0',
                      }}
                    >
                      <CameraOutlined style={{ color: '#8C8C8C', fontSize: 12 }} />
                      <Typography.Text style={{ fontSize: 12, color: '#8C8C8C' }}>截图对比</Typography.Text>
                    </div>
                    <Image.PreviewGroup>
                      <Row gutter={12} align="middle">
                        <Col span={11}>
                          <div style={{ textAlign: 'center' }}>
                            <div
                              style={{
                                display: 'inline-block',
                                fontSize: 11,
                                color: '#FA8C16',
                                background: '#FFF7E6',
                                padding: '2px 8px',
                                borderRadius: 4,
                                marginBottom: 8,
                              }}
                            >
                              竞品截图
                            </div>
                            {diff.competitorScreenshotUrl ? (
                              <Image
                                src={diff.competitorScreenshotUrl}
                                alt="竞品截图"
                                style={{
                                  width: '100%',
                                  height: 180,
                                  objectFit: 'cover',
                                  borderRadius: 8,
                                  border: '2px solid #FA8C1640',
                                  display: 'block',
                                }}
                                preview={{ mask: '查看大图' }}
                              />
                            ) : (
                              <div
                                style={{
                                  height: 180,
                                  background: '#F5F5F5',
                                  borderRadius: 8,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#BFBFBF',
                                  fontSize: 12,
                                }}
                              >
                                暂无截图
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col span={2} style={{ textAlign: 'center' }}>
                          <ArrowRightOutlined style={{ color: '#D9D9D9', fontSize: 16 }} />
                        </Col>
                        <Col span={11}>
                          <div style={{ textAlign: 'center' }}>
                            <div
                              style={{
                                display: 'inline-block',
                                fontSize: 11,
                                color: '#8C8C8C',
                                background: '#F5F5F5',
                                padding: '2px 8px',
                                borderRadius: 4,
                                marginBottom: 8,
                              }}
                            >
                              我方截图
                            </div>
                            {diff.ourScreenshotUrl ? (
                              <Image
                                src={diff.ourScreenshotUrl}
                                alt="我方截图"
                                style={{
                                  width: '100%',
                                  height: 180,
                                  objectFit: 'cover',
                                  borderRadius: 8,
                                  border: '2px solid #D9D9D9',
                                  display: 'block',
                                }}
                                preview={{ mask: '查看大图' }}
                              />
                            ) : (
                              <div
                                style={{
                                  height: 180,
                                  background: '#F5F5F5',
                                  borderRadius: 8,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#BFBFBF',
                                  fontSize: 12,
                                }}
                              >
                                暂无截图
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </Image.PreviewGroup>
                  </div>
                )}
              </div>
            );
          })}
        </Space>
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card
            title={
              <Space>
                <CheckCircleOutlined style={{ color: '#52C41A' }} />
                <Typography.Text strong>可借鉴点</Typography.Text>
              </Space>
            }
            style={{ borderRadius: 8, border: '1px solid #F0F0F0' }}
            size="small"
          >
            <List
              size="small"
              dataSource={diffAnalysis.borrowablePoints}
              renderItem={(item) => (
                <List.Item style={{ padding: '6px 0', border: 'none' }}>
                  <Space align="start" size={8}>
                    <CheckCircleOutlined style={{ color: '#52C41A', marginTop: 2, flexShrink: 0 }} />
                    <Typography.Text style={{ fontSize: 13, color: '#595959' }}>{item}</Typography.Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={
              <Space>
                <CloseCircleOutlined style={{ color: '#FF4D4F' }} />
                <Typography.Text strong>不适用点</Typography.Text>
              </Space>
            }
            style={{ borderRadius: 8, border: '1px solid #F0F0F0' }}
            size="small"
          >
            <List
              size="small"
              dataSource={diffAnalysis.incompatiblePoints}
              renderItem={(item) => (
                <List.Item style={{ padding: '6px 0', border: 'none' }}>
                  <Space align="start" size={8}>
                    <CloseCircleOutlined style={{ color: '#FF4D4F', marginTop: 2, flexShrink: 0 }} />
                    <Typography.Text style={{ fontSize: 13, color: '#595959' }}>{item}</Typography.Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};
