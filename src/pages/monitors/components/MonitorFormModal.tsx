import { Modal, Form, Input, Select, Switch, Space, Typography } from 'antd';
import type { FormInstance } from 'antd';
import { PAGE_TYPES } from '@/types/common';

interface MonitorFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  form: FormInstance;
  loading: boolean;
}

const COMPETITOR_OPTIONS = [
  { value: '拼多多', label: '拼多多' },
  { value: '京东', label: '京东' },
  { value: '淘宝', label: '淘宝' },
  { value: '美团', label: '美团' },
  { value: '抖音', label: '抖音' },
  { value: '快手', label: '快手' },
  { value: '小红书', label: '小红书' },
];

const FREQUENCY_OPTIONS = [
  { value: 'hourly', label: '每小时' },
  { value: 'daily', label: '每天' },
  { value: 'weekly', label: '每周' },
];

const DEVICE_OPTIONS = [
  { value: 'mobile', label: '移动端' },
  { value: 'desktop', label: 'PC 端' },
  { value: 'tablet', label: '平板' },
];

export const MonitorFormModal = ({
  open,
  onCancel,
  onSubmit,
  form,
  loading,
}: MonitorFormModalProps) => {
  const notifyDingTalk = Form.useWatch('notifyDingTalk', form);

  const handleOk = async () => {
    const values = await form.validateFields();
    await onSubmit(values);
  };

  return (
    <Modal
      title="新建监控任务"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okText="创建"
      cancelText="取消"
      width={560}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{ deviceType: 'mobile', frequency: 'daily', notifyDingTalk: false }}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="name"
          label="监控名称"
          rules={[{ required: true, message: '请输入监控名称' }]}
        >
          <Input placeholder="如：京东百亿补贴-手机品类" />
        </Form.Item>

        <Space style={{ width: '100%' }} size={12}>
          <Form.Item
            name="competitorName"
            label="竞品名称"
            rules={[{ required: true, message: '请选择竞品' }]}
            style={{ flex: 1, marginBottom: 0 }}
          >
            <Select placeholder="选择竞品" options={COMPETITOR_OPTIONS} showSearch />
          </Form.Item>
          <Form.Item
            name="pageType"
            label="页面类型"
            rules={[{ required: true, message: '请选择页面类型' }]}
            style={{ flex: 1, marginBottom: 0 }}
          >
            <Select
              placeholder="选择页面类型"
              options={PAGE_TYPES.map((t) => ({ value: t, label: t }))}
            />
          </Form.Item>
        </Space>

        <Form.Item
          name="targetUrl"
          label="目标 URL"
          rules={[{ required: true, message: '请输入目标 URL' }, { type: 'url', message: '请输入有效的 URL' }]}
          style={{ marginTop: 16 }}
        >
          <Input placeholder="https://www.example.com/page" />
        </Form.Item>

        <Space style={{ width: '100%' }} size={12}>
          <Form.Item
            name="deviceType"
            label="设备类型"
            style={{ flex: 1, marginBottom: 0 }}
          >
            <Select options={DEVICE_OPTIONS} />
          </Form.Item>
          <Form.Item
            name="frequency"
            label="监控频率"
            style={{ flex: 1, marginBottom: 0 }}
          >
            <Select options={FREQUENCY_OPTIONS} />
          </Form.Item>
        </Space>

        <Form.Item
          name="notifyDingTalk"
          label="钉钉通知"
          valuePropName="checked"
          style={{ marginTop: 16, marginBottom: notifyDingTalk ? 12 : 0 }}
        >
          <Switch checkedChildren="开启" unCheckedChildren="关闭" />
        </Form.Item>

        {notifyDingTalk && (
          <Form.Item
            name="dingTalkWebhook"
            label="钉钉 Webhook"
            rules={[{ required: true, message: '请输入钉钉 Webhook 地址' }]}
          >
            <Input placeholder="https://oapi.dingtalk.com/robot/send?access_token=..." />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};
