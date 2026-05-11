import { useState } from 'react';
import { Card, Steps, Button, Space, App as AntApp, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { UploadFile } from 'antd/es/upload/interface';

import { PageContainer } from '@/components/PageContainer';
import { MaterialUpload } from './components/MaterialUpload';
import { BriefForm } from './components/BriefForm';
import { ProgressView } from './components/ProgressView';
import { createAnalysisTask } from '@/pages/analysis/services/analysisService';

const STEPS = [
  { title: '上传素材', description: '截图或录屏' },
  { title: '填写 Brief', description: '分析背景信息' },
  { title: 'AI 分析中', description: '自动拆解分析' },
];

const MOCK_RECOGNITION_RESULTS = [
  {
    competitorName: '拼多多',
    pageType: '商品详情页',
    deviceType: 'mobile',
    brief: {
      businessScenario: '电商商品详情页，展示商品信息、价格和购买入口，用于引导用户完成加购或直接购买',
      targetUser: 'C 端消费者',
      optimizationGoal: '提升加购和购买转化率',
      currentProblem: '',
    },
  },
  {
    competitorName: '京东',
    pageType: '活动页',
    deviceType: 'mobile',
    brief: {
      businessScenario: '大促活动页，集中展示限时优惠商品，引导用户参与活动并完成购买',
      targetUser: 'C 端消费者',
      optimizationGoal: '提升活动页 GMV 和用户参与率',
      currentProblem: '',
    },
  },
  {
    competitorName: '美团',
    pageType: '下单确认页',
    deviceType: 'mobile',
    brief: {
      businessScenario: '外卖下单确认页，展示订单详情、配送信息和支付方式，引导用户完成支付',
      targetUser: 'C 端消费者',
      optimizationGoal: '提升支付成功率，降低下单流程跳出率',
      currentProblem: '',
    },
  },
];

const simulateRecognition = async (): Promise<typeof MOCK_RECOGNITION_RESULTS[0]> => {
  await new Promise((resolve) => setTimeout(resolve, 1800));
  return MOCK_RECOGNITION_RESULTS[Math.floor(Math.random() * MOCK_RECOGNITION_RESULTS.length)];
};

export const NewAnalysisPage = () => {
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const [form] = Form.useForm();

  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [createdTaskId, setCreatedTaskId] = useState<string | null>(null);
  const [recognizing, setRecognizing] = useState(false);

  const handleNextFromUpload = async () => {
    if (fileList.length === 0) {
      message.warning('请至少上传一个素材文件');
      return;
    }
    setCurrentStep(1);
    setRecognizing(true);

    try {
      const recognized = await simulateRecognition();
      form.setFieldsValue({
        competitorName: recognized.competitorName,
        pageType: recognized.pageType,
        deviceType: recognized.deviceType,
        brief: recognized.brief,
      });
      message.success('AI 已自动识别素材内容并填充，请确认后提交');
    } finally {
      setRecognizing(false);
    }
  };

  const handleSubmitBrief = async () => {
    try {
      const values = await form.validateFields();
      setCurrentStep(2);
      setAnalysisStep(0);

      const task = await createAnalysisTask({
        competitorName: values.competitorName,
        pageType: values.pageType,
        deviceType: values.deviceType,
        brief: values.brief,
      });
      setCreatedTaskId(task.id);

      const totalSteps = 5;
      for (let step = 0; step < totalSteps; step++) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setAnalysisStep(step + 1);
      }

      await new Promise((resolve) => setTimeout(resolve, 600));
      message.success('分析完成！');
      navigate(`/analysis/result/${task.id}`);
    } catch {
      message.error('提交失败，请检查表单');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    if (currentStep === 0) {
      return <MaterialUpload fileList={fileList} onChange={setFileList} />;
    }
    if (currentStep === 1) {
      return <BriefForm form={form} recognizing={recognizing} />;
    }
    return <ProgressView currentStep={analysisStep} />;
  };

  const renderFooter = () => {
    if (currentStep === 2) return null;
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <Button onClick={handlePrev} disabled={currentStep === 0}>
          上一步
        </Button>
        <Space>
          <Button onClick={() => navigate('/')}>取消</Button>
          {currentStep === 0 && (
            <Button type="primary" onClick={handleNextFromUpload}>
              下一步
            </Button>
          )}
          {currentStep === 1 && (
            <Button type="primary" onClick={handleSubmitBrief} disabled={recognizing}>
              开始分析
            </Button>
          )}
        </Space>
      </div>
    );
  };

  return (
    <PageContainer title="新建分析">
      <Card style={{ borderRadius: 8, border: '1px solid #F0F0F0' }}>
        <Steps
          current={currentStep}
          items={STEPS}
          style={{ marginBottom: 32 }}
        />
        <div style={{ minHeight: 320 }}>{renderStepContent()}</div>
        {renderFooter()}
      </Card>
    </PageContainer>
  );
};
