import { useState } from 'react';
import {
  Card, Form, Input, Select, Switch, Button, Space, Typography,
  Divider, App as AntApp, InputNumber, Row, Col,
} from 'antd';
import {
  RobotOutlined, BellOutlined, SaveOutlined, ApiOutlined,
} from '@ant-design/icons';

import { PageContainer } from '@/components/PageContainer';

const AI_MODEL_OPTIONS = [
  { value: 'gpt-4o', label: 'GPT-4o（推荐）' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  { value: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet' },
  { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
];

const VISION_MODEL_OPTIONS = [
  { value: 'gpt-4o', label: 'GPT-4o Vision（推荐）' },
  { value: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet Vision' },
  { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro Vision' },
];

export const SettingsPage = () => {
  const { message } = AntApp.useApp();
  const [aiForm] = Form.useForm();
  const [notifyForm] = Form.useForm();
  const [savingAi, setSavingAi] = useState(false);
  const [savingNotify, setSavingNotify] = useState(false);

  const dingTalkEnabled = Form.useWatch('dingTalkEnabled', notifyForm);

  const handleSaveAi = async () => {
    await aiForm.validateFields();
    setSavingAi(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSavingAi(false);
    message.success('AI 配置已保存');
  };

  const handleSaveNotify = async () => {
    await notifyForm.validateFields();
    setSavingNotify(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSavingNotify(false);
    message.success('通知配置已保存');
  };

  return (
    <PageContainer title="系统设置">
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Card
          title={
            <Space>
              <RobotOutlined style={{ color: '#1677FF' }} />
              <Typography.Text strong>AI 模型配置</Typography.Text>
            </Space>
          }
          style={{ borderRadius: 8, border: '1px solid #F0F0F0' }}
          extra={
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={savingAi}
              onClick={handleSaveAi}
            >
              保存配置
            </Button>
          }
        >
          <Form
            form={aiForm}
            layout="vertical"
            requiredMark={false}
            initialValues={{
              analysisModel: 'gpt-4o',
              visionModel: 'gpt-4o',
              maxTokens: 4096,
              temperature: 0.3,
            }}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="apiKey"
                  label="API Key"
                  rules={[{ required: true, message: '请输入 API Key' }]}
                >
                  <Input.Password placeholder="sk-..." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="apiBaseUrl" label="API Base URL（可选）">
                  <Input placeholder="https://api.openai.com/v1" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="analysisModel" label="分析模型">
                  <Select options={AI_MODEL_OPTIONS} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="visionModel" label="视觉识别模型">
                  <Select options={VISION_MODEL_OPTIONS} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="maxTokens" label="最大 Token 数">
                  <InputNumber min={1024} max={32768} step={512} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="temperature" label="Temperature（创造性）">
                  <InputNumber min={0} max={1} step={0.1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Divider style={{ margin: '4px 0 16px' }} />

            <Form.Item label="连接测试" style={{ marginBottom: 0 }}>
              <Button icon={<ApiOutlined />} onClick={() => message.info('连接测试功能开发中')}>
                测试 API 连接
              </Button>
              <Typography.Text style={{ marginLeft: 12, fontSize: 12, color: '#8C8C8C' }}>
                点击测试当前配置是否可用
              </Typography.Text>
            </Form.Item>
          </Form>
        </Card>

        <Card
          title={
            <Space>
              <BellOutlined style={{ color: '#FA8C16' }} />
              <Typography.Text strong>通知渠道配置</Typography.Text>
            </Space>
          }
          style={{ borderRadius: 8, border: '1px solid #F0F0F0' }}
          extra={
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={savingNotify}
              onClick={handleSaveNotify}
            >
              保存配置
            </Button>
          }
        >
          <Form
            form={notifyForm}
            layout="vertical"
            requiredMark={false}
            initialValues={{ dingTalkEnabled: false, notifyOnChange: true, notifyOnError: true }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: '#FAFAFA',
                borderRadius: 8,
                border: '1px solid #F0F0F0',
                marginBottom: 16,
              }}
            >
              <Space size={12}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: '#1677FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BellOutlined style={{ color: '#fff', fontSize: 16 }} />
                </div>
                <div>
                  <Typography.Text strong style={{ display: 'block' }}>钉钉机器人通知</Typography.Text>
                  <Typography.Text style={{ fontSize: 12, color: '#8C8C8C' }}>
                    监控到变化时自动发送钉钉消息
                  </Typography.Text>
                </div>
              </Space>
              <Form.Item name="dingTalkEnabled" valuePropName="checked" style={{ margin: 0 }}>
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>
            </div>

            {dingTalkEnabled && (
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Form.Item
                  name="defaultWebhook"
                  label="默认 Webhook 地址"
                  rules={[{ required: true, message: '请输入 Webhook 地址' }]}
                >
                  <Input placeholder="https://oapi.dingtalk.com/robot/send?access_token=..." />
                </Form.Item>

                <Form.Item name="webhookSecret" label="加签密钥（可选）">
                  <Input.Password placeholder="SEC..." />
                </Form.Item>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name="notifyOnChange"
                      label="检测到变化时通知"
                      valuePropName="checked"
                    >
                      <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="notifyOnError"
                      label="执行失败时通知"
                      valuePropName="checked"
                    >
                      <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Button onClick={() => message.info('测试消息已发送')}>
                    发送测试消息
                  </Button>
                </Form.Item>
              </Space>
            )}
          </Form>
        </Card>
      </Space>
    </PageContainer>
  );
};
