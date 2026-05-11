import { Upload, Button, Typography, Space, Tag } from 'antd';
import { InboxOutlined, FileImageOutlined, VideoCameraOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';

const { Dragger } = Upload;

interface MaterialUploadProps {
  fileList: UploadFile[];
  onChange: (files: UploadFile[]) => void;
}

export const MaterialUpload = ({ fileList, onChange }: MaterialUploadProps) => {
  const handleRemove = (file: UploadFile) => {
    onChange(fileList.filter((f) => f.uid !== file.uid));
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
              return (
                <div
                  key={file.uid}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: '#FAFAFA',
                    borderRadius: 6,
                    border: '1px solid #F0F0F0',
                  }}
                >
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
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    size="small"
                    danger
                    onClick={() => handleRemove(file)}
                  />
                </div>
              );
            })}
          </Space>
        </div>
      )}
    </Space>
  );
};
