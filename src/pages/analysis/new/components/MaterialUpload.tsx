import { Upload, Typography, Space, Tag, Spin } from 'antd';
import {
  InboxOutlined, FileImageOutlined, VideoCameraOutlined,
  DeleteOutlined, CheckCircleOutlined, LoadingOutlined,
} from '@ant-design/icons';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';

const { Dragger } = Upload;

interface RecognitionResult {
  competitor: string;
  flowOrPage: string;
  confidence: number;
}

interface MaterialUploadProps {
  fileList: UploadFile[];
  onChange: (files: UploadFile[]) => void;
  recognitionResults?: Map<string, RecognitionResult>;
  recognizingUids?: Set<string>;
}

const MOCK_RECOGNITION_MAP: Record<string, RecognitionResult> = {
  video: { competitor: '美团外卖', flowOrPage: '外卖下单流程', confidence: 94 },
  image: { competitor: '拼多多', flowOrPage: '商品详情页', confidence: 89 },
};

export const MaterialUpload = ({
  fileList,
  onChange,
  recognitionResults = new Map(),
  recognizingUids = new Set(),
}: MaterialUploadProps) => {
  const handleRemove = (uid: string) => {
    onChange(fileList.filter((f) => f.uid !== uid));
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Dragger
        multiple
        accept="image/*,video/*"
        fileList={fileList}
        beforeUpload={(file) => {
          const newFile: UploadFile = {
            uid: `${Date.now()}-${file.name}`,
            name: file.name,
            status: 'done',
            originFileObj: file as RcFile,
            size: file.size,
            type: file.type,
          };
          onChange([...fileList, newFile]);
          return false;
        }}
        showUploadList={false}
        style={{ borderRadius: 8 }}
      >
        <div style={{ padding: '24px 0' }}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ fontSize: 40, color: '#1677FF' }} />
          </p>
          <Typography.Text strong style={{ fontSize: 15, display: 'block', marginBottom: 4 }}>
            拖拽文件到此处，或点击上传
          </Typography.Text>
          <Typography.Text style={{ color: '#8C8C8C', fontSize: 13 }}>
            支持 PNG、JPG、GIF、MP4、MOV 格式，单文件不超过 50MB
          </Typography.Text>
        </div>
      </Dragger>

      {fileList.length > 0 && (
        <div>
          <Typography.Text style={{ color: '#8C8C8C', fontSize: 13, marginBottom: 8, display: 'block' }}>
            已上传 {fileList.length} 个文件
          </Typography.Text>
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            {fileList.map((file) => {
              const isVideo = file.type?.startsWith('video/');
              const isRecognizing = recognizingUids.has(file.uid);
              const recognition = recognitionResults.get(file.uid);

              return (
                <div
                  key={file.uid}
                  style={{
                    padding: '12px 14px',
                    background: recognition ? '#F6FFED' : '#FAFAFA',
                    borderRadius: 8,
                    border: `1px solid ${recognition ? '#B7EB8F' : '#F0F0F0'}`,
                    transition: 'all 0.3s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Space size={10}>
                      {isVideo ? (
                        <VideoCameraOutlined style={{ color: '#722ED1', fontSize: 18 }} />
                      ) : (
                        <FileImageOutlined style={{ color: '#1677FF', fontSize: 18 }} />
                      )}
                      <div>
                        <Typography.Text style={{ fontSize: 13, color: '#262626', display: 'block' }}>
                          {file.name}
                        </Typography.Text>
                        <Typography.Text style={{ fontSize: 12, color: '#8C8C8C' }}>
                          {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ''}
                        </Typography.Text>
                      </div>
                      <Tag color={isVideo ? 'purple' : 'blue'} style={{ fontSize: 11 }}>
                        {isVideo ? '录屏' : '截图'}
                      </Tag>
                    </Space>
                    <div
                      style={{ cursor: 'pointer', color: '#FF4D4F', padding: '4px 8px' }}
                      onClick={() => handleRemove(file.uid)}
                    >
                      <DeleteOutlined />
                    </div>
                  </div>

                  {isRecognizing && (
                    <div
                      style={{
                        marginTop: 10,
                        padding: '8px 12px',
                        background: '#E6F4FF',
                        borderRadius: 6,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <Spin indicator={<LoadingOutlined style={{ fontSize: 13, color: '#1677FF' }} />} />
                      <Typography.Text style={{ fontSize: 12, color: '#1677FF' }}>
                        AI 正在识别素材内容...
                      </Typography.Text>
                    </div>
                  )}

                  {recognition && !isRecognizing && (
                    <div
                      style={{
                        marginTop: 10,
                        padding: '8px 12px',
                        background: '#F6FFED',
                        borderRadius: 6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Space size={6}>
                        <CheckCircleOutlined style={{ color: '#52C41A', fontSize: 13 }} />
                        <Typography.Text style={{ fontSize: 12, color: '#389E0D' }}>
                          识别为：<strong>{recognition.competitor}</strong> · {recognition.flowOrPage}
                        </Typography.Text>
                      </Space>
                      <Typography.Text style={{ fontSize: 11, color: '#8C8C8C' }}>
                        置信度 {recognition.confidence}%
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
  );
};

export type { RecognitionResult };
export { MOCK_RECOGNITION_MAP };
