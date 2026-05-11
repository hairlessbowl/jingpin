import { Steps, Typography, Space, Spin, Tag, Progress } from 'antd';
import {
  LoadingOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';

interface ProgressViewProps {
  currentStep: number;
}

interface StepConfig {
  title: string;
  description: string;
  detail: string;
}

const ANALYSIS_STEPS: StepConfig[] = [
  {
    title: '素材预处理',
    description: '图像增强、去噪、分辨率优化',
    detail: '正在对上传的截图/录屏进行预处理，提升识别精度',
  },
  {
    title: 'UI 元素识别',
    description: 'AI 识别页面组件、布局结构',
    detail: '识别按钮、导航栏、卡片、表单等 UI 组件及其层级关系',
  },
  {
    title: '设计模式分析',
    description: '提取配色、字体、间距规律',
    detail: '分析竞品的视觉设计语言，提取可复用的设计模式',
  },
  {
    title: '差异对比分析',
    description: '与我方页面进行多维度对比',
    detail: '从布局、交互、视觉三个维度对比竞品与我方的差异',
  },
  {
    title: '融合建议生成',
    description: '生成可落地的设计优化建议',
    detail: '结合业务目标，输出优先级排序的设计改进方案',
  },
];

const getStepStatus = (
  stepIndex: number,
  currentStep: number
): 'wait' | 'process' | 'finish' => {
  if (stepIndex < currentStep) return 'finish';
  if (stepIndex === currentStep) return 'process';
  return 'wait';
};

export const ProgressView = ({ currentStep }: ProgressViewProps) => {
  const isCompleted = currentStep >= ANALYSIS_STEPS.length;
  const progressPercent = Math.round((currentStep / ANALYSIS_STEPS.length) * 100);

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <div
        style={{
          textAlign: 'center',
          padding: '28px 0 12px',
          background: isCompleted
            ? 'linear-gradient(135deg, #F6FFED 0%, #FCFFE6 100%)'
            : 'linear-gradient(135deg, #E6F4FF 0%, #F0F7FF 100%)',
          borderRadius: 12,
          border: `1px solid ${isCompleted ? '#B7EB8F' : '#BAE0FF'}`,
          transition: 'all 0.4s',
        }}
      >
        {isCompleted ? (
          <Space direction="vertical" size={6}>
            <CheckCircleOutlined style={{ fontSize: 44, color: '#52C41A' }} />
            <Typography.Title level={4} style={{ margin: 0, color: '#389E0D' }}>
              分析完成！
            </Typography.Title>
            <Space size={4}>
              <ThunderboltOutlined style={{ color: '#52C41A', fontSize: 13 }} />
              <Typography.Text style={{ color: '#52C41A', fontSize: 13 }}>
                结果已就绪，正在跳转...
              </Typography.Text>
            </Space>
          </Space>
        ) : (
          <Space direction="vertical" size={10} style={{ width: '100%', padding: '0 32px' }}>
            <Space size={10}>
              <Spin indicator={<LoadingOutlined style={{ fontSize: 32, color: '#1677FF' }} />} />
              <div style={{ textAlign: 'left' }}>
                <Typography.Title level={4} style={{ margin: 0, color: '#262626', lineHeight: '28px' }}>
                  AI 正在分析中
                </Typography.Title>
                <Typography.Text style={{ color: '#8C8C8C', fontSize: 13 }}>
                  {currentStep < ANALYSIS_STEPS.length
                    ? `当前：${ANALYSIS_STEPS[currentStep]?.detail}`
                    : '即将完成...'}
                </Typography.Text>
              </div>
            </Space>
            <Progress
              percent={progressPercent}
              strokeColor={{ from: '#1677FF', to: '#69B1FF' }}
              trailColor="#D6E4FF"
              showInfo={false}
              strokeWidth={6}
              style={{ marginTop: 4 }}
            />
            <Typography.Text style={{ color: '#8C8C8C', fontSize: 12 }}>
              {currentStep}/{ANALYSIS_STEPS.length} 步完成 · 预计还需 {Math.max(1, ANALYSIS_STEPS.length - currentStep) * 1} 秒
            </Typography.Text>
          </Space>
        )}
      </div>

      <div
        style={{
          background: '#FAFAFA',
          borderRadius: 8,
          padding: '20px 28px',
          border: '1px solid #F0F0F0',
        }}
      >
        <Steps
          direction="vertical"
          current={currentStep}
          size="small"
          items={ANALYSIS_STEPS.map((step, index) => {
            const status = getStepStatus(index, currentStep);
            return {
              title: (
                <Space size={8}>
                  <span style={{ fontWeight: status === 'process' ? 600 : 400, fontSize: 13 }}>
                    {step.title}
                  </span>
                  {status === 'process' && (
                    <Tag color="processing" style={{ fontSize: 11, lineHeight: '18px' }}>
                      进行中
                    </Tag>
                  )}
                  {status === 'finish' && (
                    <Tag color="success" style={{ fontSize: 11, lineHeight: '18px' }}>
                      完成
                    </Tag>
                  )}
                </Space>
              ),
              description: (
                <Typography.Text style={{ fontSize: 12, color: '#8C8C8C' }}>
                  {step.description}
                </Typography.Text>
              ),
              icon:
                status === 'process' ? (
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 16 }} />} />
                ) : status === 'finish' ? (
                  <CheckCircleOutlined style={{ color: '#52C41A' }} />
                ) : (
                  <ClockCircleOutlined style={{ color: '#D9D9D9' }} />
                ),
            };
          })}
        />
      </div>
    </Space>
  );
};
