import { Steps, Typography, Space, Spin, Tag } from 'antd';
import {
  LoadingOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

interface ProgressStep {
  title: string;
  description: string;
  status: 'wait' | 'process' | 'finish' | 'error';
}

interface ProgressViewProps {
  currentStep: number;
}

const ANALYSIS_STEPS: ProgressStep[] = [
  { title: '素材预处理', description: '图像增强、去噪、分辨率优化', status: 'wait' },
  { title: 'UI 元素识别', description: 'AI 识别页面组件、布局结构', status: 'wait' },
  { title: '设计模式分析', description: '提取配色、字体、间距规律', status: 'wait' },
  { title: '差异对比分析', description: '与我方页面进行多维度对比', status: 'wait' },
  { title: '融合建议生成', description: '生成可落地的设计优化建议', status: 'wait' },
];

const getStepStatus = (
  stepIndex: number,
  currentStep: number
): 'wait' | 'process' | 'finish' | 'error' => {
  if (stepIndex < currentStep) return 'finish';
  if (stepIndex === currentStep) return 'process';
  return 'wait';
};

export const ProgressView = ({ currentStep }: ProgressViewProps) => {
  const steps = ANALYSIS_STEPS.map((step, index) => ({
    ...step,
    status: getStepStatus(index, currentStep),
  }));

  const isCompleted = currentStep >= ANALYSIS_STEPS.length;

  return (
    <Space direction="vertical" size={32} style={{ width: '100%' }}>
      <div style={{ textAlign: 'center', padding: '24px 0 8px' }}>
        {isCompleted ? (
          <Space direction="vertical" size={8}>
            <CheckCircleOutlined style={{ fontSize: 48, color: '#52C41A' }} />
            <Typography.Title level={4} style={{ margin: 0, color: '#52C41A' }}>
              分析完成！
            </Typography.Title>
            <Typography.Text style={{ color: '#8C8C8C' }}>
              正在跳转到分析结果页面...
            </Typography.Text>
          </Space>
        ) : (
          <Space direction="vertical" size={8}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 40, color: '#1677FF' }} />} />
            <Typography.Title level={4} style={{ margin: 0, color: '#262626' }}>
              AI 正在分析中
            </Typography.Title>
            <Typography.Text style={{ color: '#8C8C8C' }}>
              预计需要 1-3 分钟，请耐心等待
            </Typography.Text>
          </Space>
        )}
      </div>

      <div
        style={{
          background: '#FAFAFA',
          borderRadius: 8,
          padding: '24px 32px',
          border: '1px solid #F0F0F0',
        }}
      >
        <Steps
          direction="vertical"
          current={currentStep}
          size="small"
          items={steps.map((step, index) => ({
            title: (
              <Space size={8}>
                <span style={{ fontWeight: step.status === 'process' ? 600 : 400 }}>
                  {step.title}
                </span>
                {step.status === 'process' && (
                  <Tag color="processing" style={{ fontSize: 11 }}>
                    进行中
                  </Tag>
                )}
                {step.status === 'finish' && (
                  <Tag color="success" style={{ fontSize: 11 }}>
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
              step.status === 'process' ? (
                <Spin indicator={<LoadingOutlined style={{ fontSize: 16 }} />} />
              ) : step.status === 'finish' ? (
                <CheckCircleOutlined style={{ color: '#52C41A' }} />
              ) : (
                <ClockCircleOutlined style={{ color: '#D9D9D9' }} />
              ),
          }))}
        />
      </div>
    </Space>
  );
};
