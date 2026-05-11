import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, Button, Typography, Space, Tag, Upload, Spin, App as AntApp,
  Input, Select, Form, Divider, Row, Col, Badge, Modal, Alert,
} from 'antd';
import {
  InboxOutlined, FileImageOutlined, VideoCameraOutlined, DeleteOutlined,
  CheckCircleOutlined, LoadingOutlined, PlayCircleOutlined, PlusOutlined,
  MergeCellsOutlined, SwapOutlined,
} from '@ant-design/icons';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';

import { PageContainer } from '@/components/PageContainer';
import { createAnalysisTask } from '@/pages/analysis/services/analysisService';
import { PAGE_TYPES } from '@/types/common';

const { Dragger } = Upload;

interface RecognitionResult {
  competitor: string;
  flowOrPage: string;
  confidence: number;
}

interface OwnPageRecognitionResult {
  pageType: string;
  confidence: number;
  description: string;
}

interface MixedFileItem {
  file: UploadFile;
  category: 'competitor' | 'own' | null;
  recognizing: boolean;
  competitorRecognition?: RecognitionResult;
  ownRecognition?: OwnPageRecognitionResult;
}

interface MockRecognitionData {
  competitorName: string;
  pageType: string;
  deviceType: string;
  brief: {
    businessScenario: string;
    targetUser: string;
    optimizationGoal: string;
    currentProblem: string;
  };
  fileRecognition: RecognitionResult;
  keyframes: Array<{
    time: string;
    label: string;
    description: string;
    changeType: 'strong' | 'medium' | 'start' | 'end';
  }>;
}

const MOCK_RECOGNITION_POOL: MockRecognitionData[] = [
  {
    competitorName: '拼多多',
    pageType: '商品详情页',
    deviceType: 'mobile',
    brief: {
      businessScenario: '竞品页面流程体验优化',
      targetUser: 'C 端消费者',
      optimizationGoal: '基于上传素材识别页面结构、流程节点和关键状态，输出借鉴点与改版建议。',
      currentProblem:
        '系统已识别素材类型和画面变化，建议结合业务目标确认要重点分析的页面目标、关键动作和状态反馈。',
    },
    fileRecognition: { competitor: '拼多多', flowOrPage: '商品详情页', confidence: 91 },
    keyframes: [
      { time: '00:00', label: '起始页面', description: '录屏起始画面，作为流程入口基准', changeType: 'start' },
      { time: '00:03', label: '页面切换', description: '强变化，通常是页面切换或大面积弹窗出现', changeType: 'strong' },
      { time: '00:06', label: '局部变化', description: '中等变化，可能是局部文案、按钮组列表内容变化', changeType: 'medium' },
      { time: '00:12', label: '页面切换', description: '强变化，通常是页面切换或大面积弹窗出现', changeType: 'strong' },
      { time: '00:15', label: '状态切换', description: '中等变化，可能是模块快照，状态切换或页面滚动', changeType: 'medium' },
      { time: '00:21', label: '结束页面', description: '录屏结束画面，作为流程结果基准', changeType: 'end' },
    ],
  },
  {
    competitorName: '美团',
    pageType: '外卖下单流程',
    deviceType: 'mobile',
    brief: {
      businessScenario: '竞品页面流程体验优化',
      targetUser: '骑手',
      optimizationGoal: '基于上传素材识别页面结构、流程节点和关键状态，输出借鉴点与改版建议。',
      currentProblem:
        '系统已识别素材类型和画面变化，建议结合业务目标确认要重点分析的页面目标、关键动作和状态反馈。',
    },
    fileRecognition: { competitor: '美团外卖', flowOrPage: '外卖下单流程', confidence: 94 },
    keyframes: [
      { time: '00:00', label: '起始页面', description: '录屏起始画面，作为流程入口基准', changeType: 'start' },
      { time: '00:05', label: '页面切换', description: '强变化，通常是页面切换或大面积弹窗出现', changeType: 'strong' },
      { time: '00:10', label: '局部变化', description: '中等变化，可能是局部文案、按钮组列表内容变化', changeType: 'medium' },
      { time: '00:18', label: '页面切换', description: '强变化，通常是页面切换或大面积弹窗出现', changeType: 'strong' },
      { time: '00:21', label: '结束页面', description: '录屏结束画面，作为流程结果基准', changeType: 'end' },
    ],
  },
];

const MOCK_OWN_PAGE_RECOGNITION: OwnPageRecognitionResult[] = [
  { pageType: '商品详情页', confidence: 88, description: '识别为我方商品详情页，包含价格、规格、购买按钮等核心元素' },
  { pageType: '购物车页', confidence: 85, description: '识别为我方购物车页，包含商品列表、数量调整、结算入口' },
  { pageType: '首页', confidence: 92, description: '识别为我方首页，包含 Banner、推荐商品、导航栏等模块' },
];

const COMPETITOR_OPTIONS = [
  { value: '拼多多', label: '拼多多' },
  { value: '京东', label: '京东' },
  { value: '淘宝', label: '淘宝' },
  { value: '美团', label: '美团' },
  { value: '抖音', label: '抖音' },
  { value: '快手', label: '快手' },
  { value: '小红书', label: '小红书' },
  { value: '其他', label: '其他' },
];

const DEVICE_OPTIONS = [
  { value: 'mobile', label: '移动端' },
  { value: 'desktop', label: 'PC 端' },
  { value: 'tablet', label: '平板' },
];

const TARGET_USER_OPTIONS = [
  { value: 'C 端消费者', label: 'C 端消费者' },
  { value: '骑手', label: '骑手' },
  { value: 'B 端商家', label: 'B 端商家' },
  { value: '运营人员', label: '运营人员' },
];

const KEYFRAME_COLORS: Record<string, string> = {
  start: '#52C41A',
  end: '#8C8C8C',
  strong: '#FF4D4F',
  medium: '#FA8C16',
};

const KEYFRAME_CHANGE_LABELS: Record<string, string> = {
  start: '起始',
  end: '结束',
  strong: '强变化',
  medium: '中变化',
};

const pickRandom = (): MockRecognitionData =>
  MOCK_RECOGNITION_POOL[Math.floor(Math.random() * MOCK_RECOGNITION_POOL.length)];

const pickRandomOwnPage = (): OwnPageRecognitionResult =>
  MOCK_OWN_PAGE_RECOGNITION[Math.floor(Math.random() * MOCK_OWN_PAGE_RECOGNITION.length)];

const SectionLabel = ({ color, tag, title }: { color: string; tag: string; title: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
        display: 'inline-block',
        flexShrink: 0,
      }}
    />
    <Typography.Text style={{ fontSize: 11, color, fontWeight: 600, letterSpacing: 1 }}>
      {tag}
    </Typography.Text>
    <Typography.Title level={5} style={{ margin: 0, marginLeft: 4 }}>
      {title}
    </Typography.Title>
  </div>
);

const FileCard = ({
  file,
  recognition,
  isRecognizing,
  onRemove,
  accentColor = '#1677FF',
}: {
  file: UploadFile;
  recognition?: RecognitionResult | OwnPageRecognitionResult | null;
  isRecognizing: boolean;
  onRemove: (uid: string) => void;
  accentColor?: string;
}) => {
  const isVideo = file.type?.startsWith('video/');
  const isRecognized = !!recognition && !isRecognizing;

  return (
    <div
      style={{
        padding: '10px 14px',
        background: isRecognized ? '#F6FFED' : '#FAFAFA',
        borderRadius: 8,
        border: `1px solid ${isRecognized ? '#B7EB8F' : '#F0F0F0'}`,
        transition: 'all 0.3s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space size={8}>
          {isVideo ? (
            <VideoCameraOutlined style={{ color: '#722ED1', fontSize: 16 }} />
          ) : (
            <FileImageOutlined style={{ color: accentColor, fontSize: 16 }} />
          )}
          <div>
            <Typography.Text style={{ fontSize: 13, color: '#262626', display: 'block' }}>
              {file.name}
            </Typography.Text>
            <Typography.Text style={{ fontSize: 11, color: '#8C8C8C' }}>
              {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ''}
            </Typography.Text>
          </div>
          <Tag color={isVideo ? 'purple' : 'blue'} style={{ fontSize: 11 }}>
            {isVideo ? '录屏' : '截图'}
          </Tag>
        </Space>
        <DeleteOutlined
          style={{ color: '#FF4D4F', cursor: 'pointer', fontSize: 14 }}
          onClick={() => onRemove(file.uid)}
        />
      </div>

      {isRecognizing && (
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 12, color: '#1677FF' }} />} />
          <Typography.Text style={{ fontSize: 12, color: '#1677FF' }}>
            AI 正在识别素材内容...
          </Typography.Text>
        </div>
      )}

      {isRecognized && recognition && (
        <div
          style={{
            marginTop: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Space size={4}>
            <CheckCircleOutlined style={{ color: '#52C41A', fontSize: 12 }} />
            {'competitor' in recognition ? (
              <Typography.Text style={{ fontSize: 12, color: '#389E0D' }}>
                识别为：<strong>{recognition.competitor}</strong> · {recognition.flowOrPage}
              </Typography.Text>
            ) : (
              <Typography.Text style={{ fontSize: 12, color: '#389E0D' }}>
                识别为：<strong>{recognition.pageType}</strong> · {recognition.description.slice(0, 20)}...
              </Typography.Text>
            )}
          </Space>
          <Typography.Text style={{ fontSize: 11, color: '#8C8C8C' }}>
            置信度 {recognition.confidence}%
          </Typography.Text>
        </div>
      )}
    </div>
  );
};

export const NewAnalysisPage = () => {
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const [form] = Form.useForm();

  const [competitorFileList, setCompetitorFileList] = useState<UploadFile[]>([]);
  const [recognizingUids, setRecognizingUids] = useState<Set<string>>(new Set());
  const [recognitionResults, setRecognitionResults] = useState<Map<string, RecognitionResult>>(new Map());
  const [currentRecognition, setCurrentRecognition] = useState<MockRecognitionData | null>(null);

  const [ownFileList, setOwnFileList] = useState<UploadFile[]>([]);
  const [ownRecognizingUids, setOwnRecognizingUids] = useState<Set<string>>(new Set());
  const [ownRecognitionResults, setOwnRecognitionResults] = useState<Map<string, OwnPageRecognitionResult>>(new Map());

  const [mixedModalOpen, setMixedModalOpen] = useState(false);
  const [mixedFiles, setMixedFiles] = useState<MixedFileItem[]>([]);
  const [mixedRecognizing, setMixedRecognizing] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const pendingRef = useRef<MockRecognitionData | null>(null);

  const triggerCompetitorRecognition = (file: UploadFile) => {
    const uid = file.uid;
    setRecognizingUids((prev) => new Set(prev).add(uid));
    const recognized = pickRandom();
    pendingRef.current = recognized;

    setTimeout(() => {
      setRecognizingUids((prev) => {
        const next = new Set(prev);
        next.delete(uid);
        return next;
      });
      setRecognitionResults((prev) => {
        const next = new Map(prev);
        next.set(uid, recognized.fileRecognition);
        return next;
      });
      setCurrentRecognition(recognized);
      form.setFieldsValue({
        competitorName: recognized.competitorName,
        pageType: recognized.pageType,
        deviceType: recognized.deviceType,
        businessScenario: recognized.brief.businessScenario,
        targetUser: recognized.brief.targetUser,
        optimizationGoal: recognized.brief.optimizationGoal,
        currentProblem: recognized.brief.currentProblem,
      });
    }, 1400 + Math.random() * 600);
  };

  const handleCompetitorFilesChange = (newFiles: UploadFile[]) => {
    const addedFiles = newFiles.filter((f) => !competitorFileList.some((e) => e.uid === f.uid));
    setCompetitorFileList(newFiles);
    addedFiles.forEach(triggerCompetitorRecognition);
  };

  const handleRemoveCompetitorFile = (uid: string) => {
    setCompetitorFileList((prev) => prev.filter((f) => f.uid !== uid));
    setRecognitionResults((prev) => {
      const next = new Map(prev);
      next.delete(uid);
      return next;
    });
  };

  const triggerOwnRecognition = (file: UploadFile) => {
    const uid = file.uid;
    setOwnRecognizingUids((prev) => new Set(prev).add(uid));
    const recognized = pickRandomOwnPage();

    setTimeout(() => {
      setOwnRecognizingUids((prev) => {
        const next = new Set(prev);
        next.delete(uid);
        return next;
      });
      setOwnRecognitionResults((prev) => {
        const next = new Map(prev);
        next.set(uid, recognized);
        return next;
      });
    }, 1200 + Math.random() * 800);
  };

  const handleOwnFilesChange = (newFiles: UploadFile[]) => {
    const addedFiles = newFiles.filter((f) => !ownFileList.some((e) => e.uid === f.uid));
    setOwnFileList(newFiles);
    addedFiles.forEach(triggerOwnRecognition);
  };

  const handleRemoveOwnFile = (uid: string) => {
    setOwnFileList((prev) => prev.filter((f) => f.uid !== uid));
    setOwnRecognitionResults((prev) => {
      const next = new Map(prev);
      next.delete(uid);
      return next;
    });
  };

  const handleMixedUpload = (file: RcFile) => {
    const newItem: MixedFileItem = {
      file: {
        uid: `${Date.now()}-${file.name}`,
        name: file.name,
        status: 'done',
        originFileObj: file,
        size: file.size,
        type: file.type,
      },
      category: null,
      recognizing: true,
    };

    setMixedFiles((prev) => [...prev, newItem]);

    const isLikelyCompetitor = Math.random() > 0.4;
    const delay = 1200 + Math.random() * 800;

    setTimeout(() => {
      if (isLikelyCompetitor) {
        const recognized = pickRandom();
        setMixedFiles((prev) =>
          prev.map((item) =>
            item.file.uid === newItem.file.uid
              ? {
                  ...item,
                  recognizing: false,
                  category: 'competitor',
                  competitorRecognition: recognized.fileRecognition,
                }
              : item
          )
        );
      } else {
        const recognized = pickRandomOwnPage();
        setMixedFiles((prev) =>
          prev.map((item) =>
            item.file.uid === newItem.file.uid
              ? {
                  ...item,
                  recognizing: false,
                  category: 'own',
                  ownRecognition: recognized,
                }
              : item
          )
        );
      }
    }, delay);

    return false;
  };

  const handleMixedConfirm = () => {
    const competitorItems = mixedFiles.filter((item) => item.category === 'competitor');
    const ownItems = mixedFiles.filter((item) => item.category === 'own');

    const newCompetitorFiles = competitorItems.map((item) => item.file);
    const newOwnFiles = ownItems.map((item) => item.file);

    const addedCompetitor = newCompetitorFiles.filter(
      (f) => !competitorFileList.some((e) => e.uid === f.uid)
    );
    const addedOwn = newOwnFiles.filter(
      (f) => !ownFileList.some((e) => e.uid === f.uid)
    );

    setCompetitorFileList((prev) => [...prev, ...addedCompetitor]);
    addedCompetitor.forEach(triggerCompetitorRecognition);

    setOwnFileList((prev) => [...prev, ...addedOwn]);
    addedOwn.forEach(triggerOwnRecognition);

    setMixedModalOpen(false);
    setMixedFiles([]);
    message.success(`已导入 ${competitorItems.length} 个竞品素材、${ownItems.length} 个我方素材`);
  };

  const handleToggleMixedCategory = (uid: string) => {
    setMixedFiles((prev) =>
      prev.map((item) =>
        item.file.uid === uid
          ? { ...item, category: item.category === 'competitor' ? 'own' : 'competitor' }
          : item
      )
    );
  };

  const handleRemoveMixedFile = (uid: string) => {
    setMixedFiles((prev) => prev.filter((item) => item.file.uid !== uid));
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const task = await createAnalysisTask({
        competitorName: values.competitorName,
        pageType: values.pageType,
        deviceType: values.deviceType,
        brief: {
          businessScenario: values.businessScenario,
          targetUser: values.targetUser,
          optimizationGoal: values.optimizationGoal,
          currentProblem: values.currentProblem ?? '',
        },
      });

      message.success('分析任务已提交，正在处理...');
      navigate(`/analysis/result/${task.id}`);
    } catch {
      message.error('请检查必填项');
    } finally {
      setSubmitting(false);
    }
  };

  const hasAnyRecognizing = recognizingUids.size > 0 || ownRecognizingUids.size > 0;
  const mixedStillRecognizing = mixedFiles.some((item) => item.recognizing);

  return (
    <PageContainer
      title="新建分析"
      extra={
        <Button
          icon={<MergeCellsOutlined />}
          onClick={() => {
            setMixedFiles([]);
            setMixedModalOpen(true);
          }}
          style={{
            borderColor: '#722ED1',
            color: '#722ED1',
            fontWeight: 500,
          }}
        >
          混合上传
        </Button>
      }
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card
              style={{ borderRadius: 8, border: '1px solid #F0F0F0' }}
              bodyStyle={{ padding: 24 }}
            >
              <SectionLabel color="#FA8C16" tag="MATERIAL" title="竞品素材" />

              <Row gutter={12} style={{ marginBottom: 16 }}>
                <Col span={12}>
                  <Form.Item
                    name="competitorName"
                    label="竞品名称"
                    rules={[{ required: true, message: '请选择竞品' }]}
                    style={{ marginBottom: 0 }}
                  >
                    <Select
                      showSearch
                      placeholder="竞品 A"
                      options={COMPETITOR_OPTIONS}
                      allowClear
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="pageType"
                    label="页面类型"
                    rules={[{ required: true, message: '请选择页面类型' }]}
                    style={{ marginBottom: 0 }}
                  >
                    <Select
                      placeholder="任务页"
                      options={PAGE_TYPES.map((t) => ({ value: t, label: t }))}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Typography.Text
                style={{
                  fontSize: 13,
                  color: '#595959',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 10,
                }}
              >
                <PlayCircleOutlined style={{ color: '#FA8C16' }} />
                竞品截图 / 录屏
              </Typography.Text>

              <Dragger
                multiple
                accept="image/*,video/*"
                fileList={competitorFileList}
                beforeUpload={(file) => {
                  const newFile: UploadFile = {
                    uid: `${Date.now()}-${file.name}`,
                    name: file.name,
                    status: 'done',
                    originFileObj: file as RcFile,
                    size: file.size,
                    type: file.type,
                  };
                  handleCompetitorFilesChange([...competitorFileList, newFile]);
                  return false;
                }}
                showUploadList={false}
                style={{ borderRadius: 8, borderColor: '#FA8C16', background: '#FFFBF5' }}
              >
                <div style={{ padding: '20px 0' }}>
                  <InboxOutlined style={{ fontSize: 32, color: '#FA8C16' }} />
                  <Typography.Text
                    strong
                    style={{ fontSize: 14, display: 'block', marginTop: 8, color: '#FA8C16' }}
                  >
                    单个或批量上传竞品素材
                  </Typography.Text>
                  <Typography.Text style={{ color: '#8C8C8C', fontSize: 12 }}>
                    系统会自动识别图片和视频，并拆分为截图、录屏和关键帧
                  </Typography.Text>
                </div>
              </Dragger>

              {competitorFileList.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <Typography.Text
                    style={{ fontSize: 12, color: '#8C8C8C', display: 'block', marginBottom: 8 }}
                  >
                    已识别 {competitorFileList.length} 个竞品素材
                  </Typography.Text>
                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    {competitorFileList.map((file) => (
                      <FileCard
                        key={file.uid}
                        file={file}
                        recognition={recognitionResults.get(file.uid)}
                        isRecognizing={recognizingUids.has(file.uid)}
                        onRemove={handleRemoveCompetitorFile}
                        accentColor="#FA8C16"
                      />
                    ))}
                  </Space>
                </div>
              )}
            </Card>

            {currentRecognition && (
              <Card
                style={{ borderRadius: 8, border: '1px solid #F0F0F0' }}
                bodyStyle={{ padding: 24 }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                  }}
                >
                  <Space size={8}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#52C41A',
                        display: 'inline-block',
                      }}
                    />
                    <Typography.Text
                      style={{ fontSize: 11, color: '#52C41A', fontWeight: 600, letterSpacing: 1 }}
                    >
                      RECOGNITION
                    </Typography.Text>
                    <Typography.Title level={5} style={{ margin: 0, marginLeft: 4 }}>
                      素材识别结果
                    </Typography.Title>
                  </Space>
                  <Tag color="success" style={{ fontSize: 12 }}>
                    <CheckCircleOutlined style={{ marginRight: 4 }} />
                    已识别
                  </Tag>
                </div>

                <div
                  style={{
                    padding: '14px 16px',
                    background: '#F8FAFF',
                    borderRadius: 8,
                    border: '1px solid #D6E4FF',
                    marginBottom: 20,
                  }}
                >
                  <Space size={14} align="start">
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 8,
                        background: 'linear-gradient(135deg, #E6F4FF 0%, #BAE0FF 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <VideoCameraOutlined style={{ fontSize: 24, color: '#1677FF' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}
                      >
                        <Typography.Text strong style={{ fontSize: 13 }}>
                          视频识别
                        </Typography.Text>
                        <Tag color="blue" style={{ fontSize: 11 }}>
                          {currentRecognition.fileRecognition.competitor}
                        </Tag>
                        <Tag color="purple" style={{ fontSize: 11 }}>
                          {currentRecognition.fileRecognition.flowOrPage}
                        </Tag>
                      </div>
                      <Typography.Text
                        style={{ fontSize: 12, color: '#595959', display: 'block', marginBottom: 8 }}
                      >
                        已扫描录屏，识别到{' '}
                        <strong>{currentRecognition.keyframes.length}</strong> 个关键帧，置信度{' '}
                        <strong style={{ color: '#1677FF' }}>
                          {currentRecognition.fileRecognition.confidence}%
                        </strong>
                      </Typography.Text>
                      <Space size={4} wrap>
                        <Tag style={{ fontSize: 11 }}>强变化：页面切换 / 大面积弹窗</Tag>
                        <Tag style={{ fontSize: 11 }}>中变化：局部内容 / 状态切换</Tag>
                      </Space>
                    </div>
                  </Space>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <Space size={8}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#FA8C16',
                        display: 'inline-block',
                      }}
                    />
                    <Typography.Text
                      style={{ fontSize: 11, color: '#FA8C16', fontWeight: 600, letterSpacing: 1 }}
                    >
                      KEYFRAMES
                    </Typography.Text>
                    <Typography.Text strong style={{ fontSize: 13 }}>
                      录屏关键帧
                    </Typography.Text>
                    <Badge
                      count={currentRecognition.keyframes.length}
                      style={{ backgroundColor: '#FA8C16', fontSize: 10 }}
                    />
                  </Space>
                  <Button size="small" icon={<PlusOutlined />} style={{ fontSize: 12 }}>
                    补充帧
                  </Button>
                </div>

                <Typography.Text
                  style={{ fontSize: 12, color: '#8C8C8C', display: 'block', marginBottom: 12 }}
                >
                  点击「补充帧」后选择一帧画面，系统会把它加入关键帧列表，适合补充 AI 抽帧遗漏的时帧。
                </Typography.Text>

                <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
                  {currentRecognition.keyframes.map((frame, index) => {
                    const frameColor = KEYFRAME_COLORS[frame.changeType];
                    return (
                      <div
                        key={index}
                        style={{
                          flexShrink: 0,
                          width: 148,
                          borderRadius: 8,
                          border: `1px solid ${frameColor}33`,
                          overflow: 'hidden',
                          background: '#FAFAFA',
                          cursor: 'pointer',
                        }}
                      >
                        <div
                          style={{
                            height: 90,
                            background: `linear-gradient(135deg, ${frameColor}22 0%, ${frameColor}0D 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                          }}
                        >
                          <PlayCircleOutlined
                            style={{ fontSize: 26, color: frameColor, opacity: 0.7 }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              top: 6,
                              left: 6,
                              background: 'rgba(0,0,0,0.55)',
                              color: '#fff',
                              fontSize: 10,
                              padding: '1px 5px',
                              borderRadius: 3,
                              fontFamily: 'monospace',
                            }}
                          >
                            {frame.time}
                          </div>
                          <div
                            style={{
                              position: 'absolute',
                              bottom: 6,
                              right: 6,
                              background: frameColor,
                              color: '#fff',
                              fontSize: 10,
                              padding: '1px 5px',
                              borderRadius: 3,
                            }}
                          >
                            {KEYFRAME_CHANGE_LABELS[frame.changeType]}
                          </div>
                        </div>
                        <div style={{ padding: '8px 10px' }}>
                          <Typography.Text
                            strong
                            style={{ fontSize: 12, display: 'block', marginBottom: 2 }}
                          >
                            {frame.label}
                          </Typography.Text>
                          <Typography.Text
                            style={{ fontSize: 11, color: '#8C8C8C', lineHeight: '16px' }}
                            ellipsis={{ tooltip: frame.description }}
                          >
                            {frame.description}
                          </Typography.Text>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            <Card
              style={{ borderRadius: 8, border: '1px solid #F0F0F0' }}
              bodyStyle={{ padding: 24 }}
            >
              <SectionLabel color="#1677FF" tag="OWN PAGE" title="我方页面" />

              <Typography.Text
                style={{
                  fontSize: 13,
                  color: '#595959',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 10,
                }}
              >
                <FileImageOutlined style={{ color: '#1677FF' }} />
                我方页面素材
              </Typography.Text>

              <Dragger
                multiple
                accept="image/*,video/*"
                fileList={ownFileList}
                beforeUpload={(file) => {
                  const newFile: UploadFile = {
                    uid: `${Date.now()}-${file.name}`,
                    name: file.name,
                    status: 'done',
                    originFileObj: file as RcFile,
                    size: file.size,
                    type: file.type,
                  };
                  handleOwnFilesChange([...ownFileList, newFile]);
                  return false;
                }}
                showUploadList={false}
                style={{ borderRadius: 8, borderColor: '#1677FF', background: '#F0F7FF' }}
              >
                <div style={{ padding: '20px 0' }}>
                  <FileImageOutlined style={{ fontSize: 28, color: '#1677FF' }} />
                  <Typography.Text
                    strong
                    style={{ fontSize: 13, display: 'block', marginTop: 8, color: '#1677FF' }}
                  >
                    单个或批量上传我方页面素材
                  </Typography.Text>
                  <Typography.Text style={{ color: '#8C8C8C', fontSize: 12 }}>
                    交互与竞品素材一致，用于差异分析和方案转译
                  </Typography.Text>
                </div>
              </Dragger>

              {ownFileList.length > 0 ? (
                <div style={{ marginTop: 12 }}>
                  <Typography.Text
                    style={{ fontSize: 12, color: '#8C8C8C', display: 'block', marginBottom: 8 }}
                  >
                    已上传 {ownFileList.length} 个我方素材
                  </Typography.Text>
                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    {ownFileList.map((file) => (
                      <FileCard
                        key={file.uid}
                        file={file}
                        recognition={ownRecognitionResults.get(file.uid)}
                        isRecognizing={ownRecognizingUids.has(file.uid)}
                        onRemove={handleRemoveOwnFile}
                        accentColor="#1677FF"
                      />
                    ))}
                  </Space>
                </div>
              ) : (
                <div
                  style={{
                    marginTop: 12,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography.Text style={{ fontSize: 12, color: '#8C8C8C' }}>
                    未上传我方素材
                  </Typography.Text>
                  <Typography.Text style={{ fontSize: 12, color: '#FA8C16' }}>
                    建议至少上传 1 张当前页面截图
                  </Typography.Text>
                </div>
              )}
            </Card>
          </div>

          <div style={{ width: 288, flexShrink: 0, position: 'sticky', top: 24 }}>
            <Card
              style={{ borderRadius: 8, border: '1px solid #F0F0F0' }}
              bodyStyle={{ padding: 20 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#722ED1',
                    display: 'inline-block',
                  }}
                />
                <Typography.Text
                  style={{ fontSize: 11, color: '#722ED1', fontWeight: 600, letterSpacing: 1 }}
                >
                  BRIEF
                </Typography.Text>
              </div>
              <Typography.Title level={5} style={{ margin: '0 0 4px' }}>
                业务场景
              </Typography.Title>
              {currentRecognition ? (
                <Typography.Text
                  style={{ fontSize: 12, color: '#52C41A', display: 'block', marginBottom: 12 }}
                >
                  <CheckCircleOutlined style={{ marginRight: 4 }} />
                  已根据素材自动识别，可继续编辑修改。
                </Typography.Text>
              ) : (
                <Typography.Text
                  style={{ fontSize: 12, color: '#8C8C8C', display: 'block', marginBottom: 12 }}
                >
                  上传素材后系统将自动识别并填充。
                </Typography.Text>
              )}

              <Form.Item
                name="businessScenario"
                label={
                  <Typography.Text style={{ fontSize: 12, color: '#595959' }}>
                    业务场景
                  </Typography.Text>
                }
                style={{ marginBottom: 12 }}
              >
                <Input.TextArea rows={2} placeholder="竞品页面流程体验优化" style={{ fontSize: 13 }} />
              </Form.Item>

              <Form.Item
                name="targetUser"
                label={
                  <Typography.Text style={{ fontSize: 12, color: '#595959' }}>
                    目标用户
                  </Typography.Text>
                }
                style={{ marginBottom: 12 }}
              >
                <Select
                  placeholder="选择目标用户"
                  options={TARGET_USER_OPTIONS}
                  style={{ fontSize: 13 }}
                />
              </Form.Item>

              <Form.Item
                name="optimizationGoal"
                label={
                  <Typography.Text style={{ fontSize: 12, color: '#595959' }}>
                    优化目标
                  </Typography.Text>
                }
                style={{ marginBottom: 12 }}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="基于上传素材识别页面结构、流程节点和关键状态，输出借鉴点与改版建议。"
                  style={{ fontSize: 13 }}
                />
              </Form.Item>

              <Form.Item
                name="currentProblem"
                label={
                  <Typography.Text style={{ fontSize: 12, color: '#595959' }}>
                    当前问题
                  </Typography.Text>
                }
                style={{ marginBottom: 12 }}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="系统已识别素材类型和画面变化，建议结合业务目标..."
                  style={{ fontSize: 13 }}
                />
              </Form.Item>

              <Divider style={{ margin: '12px 0' }} />

              <Form.Item
                name="deviceType"
                label={
                  <Typography.Text style={{ fontSize: 12, color: '#595959' }}>
                    设备类型
                  </Typography.Text>
                }
                initialValue="mobile"
                style={{ marginBottom: 12 }}
              >
                <Select options={DEVICE_OPTIONS} style={{ fontSize: 13 }} />
              </Form.Item>

              <Form.Item
                label={
                  <Typography.Text style={{ fontSize: 12, color: '#595959' }}>
                    输出偏好
                  </Typography.Text>
                }
                style={{ marginBottom: 12 }}
              >
                <Select
                  defaultValue="增强改版"
                  options={[
                    { value: '增强改版', label: '增强改版' },
                    { value: '竞品拆解', label: '竞品拆解' },
                    { value: '差异分析', label: '差异分析' },
                  ]}
                  style={{ fontSize: 13 }}
                />
              </Form.Item>

              <Form.Item
                label={
                  <Typography.Text style={{ fontSize: 12, color: '#595959' }}>
                    业务约束
                  </Typography.Text>
                }
                style={{ marginBottom: 16 }}
              >
                <Input.TextArea
                  rows={2}
                  placeholder="不改变有关规则，优化信息表达和页面结构。"
                  style={{ fontSize: 13 }}
                />
              </Form.Item>

              <div style={{ display: 'flex', gap: 8 }}>
                <Button style={{ flex: 1 }} onClick={() => navigate('/')}>
                  保存草稿
                </Button>
                <Button
                  type="primary"
                  style={{ flex: 1, background: '#FA8C16', borderColor: '#FA8C16' }}
                  loading={submitting}
                  disabled={competitorFileList.length === 0 || hasAnyRecognizing}
                  onClick={handleSubmit}
                >
                  开始分析
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </Form>

      <Modal
        title={
          <Space size={8}>
            <MergeCellsOutlined style={{ color: '#722ED1' }} />
            <span>混合上传</span>
            <Typography.Text style={{ fontSize: 12, color: '#8C8C8C', fontWeight: 400 }}>
              批量上传后 AI 自动识别分类为竞品素材或我方素材
            </Typography.Text>
          </Space>
        }
        open={mixedModalOpen}
        onCancel={() => {
          setMixedModalOpen(false);
          setMixedFiles([]);
        }}
        width={680}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography.Text style={{ fontSize: 12, color: '#8C8C8C' }}>
              竞品素材 {mixedFiles.filter((f) => f.category === 'competitor').length} 个 ·
              我方素材 {mixedFiles.filter((f) => f.category === 'own').length} 个 ·
              识别中 {mixedFiles.filter((f) => f.recognizing).length} 个
            </Typography.Text>
            <Space>
              <Button
                onClick={() => {
                  setMixedModalOpen(false);
                  setMixedFiles([]);
                }}
              >
                取消
              </Button>
              <Button
                type="primary"
                disabled={mixedFiles.length === 0 || mixedStillRecognizing}
                onClick={handleMixedConfirm}
                style={{ background: '#722ED1', borderColor: '#722ED1' }}
              >
                {mixedStillRecognizing ? '识别中...' : `确认导入 (${mixedFiles.length} 个)`}
              </Button>
            </Space>
          </div>
        }
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Alert
            type="info"
            showIcon
            message="上传后 AI 将自动识别每个文件属于竞品素材还是我方素材，识别结果可手动调整。"
            style={{ borderRadius: 6 }}
          />

          <Dragger
            multiple
            accept="image/*,video/*"
            beforeUpload={handleMixedUpload}
            showUploadList={false}
            style={{ borderRadius: 8, borderColor: '#722ED1', background: '#FAF5FF' }}
          >
            <div style={{ padding: '16px 0' }}>
              <MergeCellsOutlined style={{ fontSize: 28, color: '#722ED1' }} />
              <Typography.Text
                strong
                style={{ fontSize: 13, display: 'block', marginTop: 8, color: '#722ED1' }}
              >
                拖拽或点击批量上传素材
              </Typography.Text>
              <Typography.Text style={{ color: '#8C8C8C', fontSize: 12 }}>
                支持图片和视频，AI 将自动识别分类
              </Typography.Text>
            </div>
          </Dragger>

          {mixedFiles.length > 0 && (
            <div>
              <Typography.Text
                style={{ fontSize: 12, color: '#8C8C8C', display: 'block', marginBottom: 8 }}
              >
                已上传 {mixedFiles.length} 个文件，点击「切换」可手动调整分类
              </Typography.Text>
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                {mixedFiles.map((item) => {
                  const isVideo = item.file.type?.startsWith('video/');
                  const categoryColor = item.category === 'competitor' ? '#FA8C16' : '#1677FF';
                  const categoryLabel = item.category === 'competitor' ? '竞品素材' : '我方素材';

                  return (
                    <div
                      key={item.file.uid}
                      style={{
                        padding: '10px 14px',
                        background: item.recognizing
                          ? '#FAFAFA'
                          : item.category === 'competitor'
                          ? '#FFFBF5'
                          : '#F0F7FF',
                        borderRadius: 8,
                        border: `1px solid ${
                          item.recognizing
                            ? '#F0F0F0'
                            : item.category === 'competitor'
                            ? '#FFD591'
                            : '#BAE0FF'
                        }`,
                        transition: 'all 0.3s',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Space size={8}>
                          {isVideo ? (
                            <VideoCameraOutlined style={{ color: '#722ED1', fontSize: 16 }} />
                          ) : (
                            <FileImageOutlined style={{ color: '#595959', fontSize: 16 }} />
                          )}
                          <div>
                            <Typography.Text
                              style={{ fontSize: 13, color: '#262626', display: 'block' }}
                            >
                              {item.file.name}
                            </Typography.Text>
                            <Typography.Text style={{ fontSize: 11, color: '#8C8C8C' }}>
                              {item.file.size
                                ? `${(item.file.size / 1024 / 1024).toFixed(2)} MB`
                                : ''}
                            </Typography.Text>
                          </div>
                        </Space>

                        <Space size={8}>
                          {item.recognizing ? (
                            <Space size={4}>
                              <Spin
                                indicator={
                                  <LoadingOutlined style={{ fontSize: 12, color: '#1677FF' }} />
                                }
                              />
                              <Typography.Text style={{ fontSize: 12, color: '#1677FF' }}>
                                识别中...
                              </Typography.Text>
                            </Space>
                          ) : (
                            <>
                              <Tag
                                color={item.category === 'competitor' ? 'orange' : 'blue'}
                                style={{ fontSize: 11, margin: 0 }}
                              >
                                {categoryLabel}
                              </Tag>
                              <Button
                                size="small"
                                icon={<SwapOutlined />}
                                style={{ fontSize: 11, color: categoryColor, borderColor: categoryColor }}
                                onClick={() => handleToggleMixedCategory(item.file.uid)}
                              >
                                切换
                              </Button>
                            </>
                          )}
                          <DeleteOutlined
                            style={{ color: '#FF4D4F', cursor: 'pointer', fontSize: 13 }}
                            onClick={() => handleRemoveMixedFile(item.file.uid)}
                          />
                        </Space>
                      </div>

                      {!item.recognizing && item.category === 'competitor' && item.competitorRecognition && (
                        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <CheckCircleOutlined style={{ color: '#52C41A', fontSize: 11 }} />
                          <Typography.Text style={{ fontSize: 11, color: '#389E0D' }}>
                            识别为：<strong>{item.competitorRecognition.competitor}</strong> ·{' '}
                            {item.competitorRecognition.flowOrPage} · 置信度{' '}
                            {item.competitorRecognition.confidence}%
                          </Typography.Text>
                        </div>
                      )}

                      {!item.recognizing && item.category === 'own' && item.ownRecognition && (
                        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <CheckCircleOutlined style={{ color: '#52C41A', fontSize: 11 }} />
                          <Typography.Text style={{ fontSize: 11, color: '#389E0D' }}>
                            识别为：<strong>我方 {item.ownRecognition.pageType}</strong> · 置信度{' '}
                            {item.ownRecognition.confidence}%
                          </Typography.Text>
                        </div>
                      )}
                    </div>
                  );
                })}
              </Space>
            </div>
          )}
        </Space>
      </Modal>
    </PageContainer>
  );
};
