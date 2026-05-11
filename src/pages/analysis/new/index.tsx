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

export const NewAnalysisPage = () => {
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const [form] = Form.useForm();

  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [createdTaskId, setCreatedTaskId] = useState<string | null>(null);

  const handleNextFromUpload = () => {
    if (fileList.length === 0) {
      message.warning('请至少上传一个素材文件');
      return;
    }
    setCurrentStep(1);
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
      return <BriefForm form={form} />;
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
            <Button type="primary" onClick={handleSubmitBrief}>
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
