import { Modal, Form, Input, Select, Switch, Space, Typography, Radio, Card, Steps, Tag } from 'antd';
import type { FormInstance } from 'antd';
import { PAGE_TYPES } from '@/types/common';
import {
  ShopOutlined, OrderedListOutlined, EnvironmentOutlined,
  SearchOutlined, ShoppingCartOutlined, CreditCardOutlined, CheckCircleOutlined,
} from '@ant-design/icons';

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

const MEITUAN_FLOW_STEPS = [
  { icon: <ShopOutlined />, title: '打开首页', description: '进入美团外卖 H5 首页' },
  { icon: <SearchOutlined />, title: '搜索商品', description: '搜索目标餐厅或商品' },
  { icon: <ShopOutlined />, title: '进入商品详情', description: '点击商品查看详情页' },
  { icon: <ShoppingCartOutlined />, title: '加入购物车', description: '选规格并加入购物车' },
  { icon: <OrderedListOutlined />, title: '确认订单', description: '填写地址、备注等信息' },
  { icon: <CreditCardOutlined />, title: '提交支付', description: '选择支付方式并提交（不真实支付）' },
];

export const MonitorFormModal = ({
  open,
  onCancel,
  onSubmit,
  form,
  loading,
}: MonitorFormModalProps) => {
  const notifyDingTalk = Form.useWatch('notifyDingTalk', form);
  const targetType = Form.useWatch('targetType', form);

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
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{ deviceType: 'mobile', frequency: 'daily', notifyDingTalk: false, targetType: 'page' }}
        style={{ marginTop: 16 }}
      >
        <Form.Item name="targetType" label="监控类型">
          <Radio.Group style={{ width: '100%' }}>
            <Space style={{ width: '100%' }} size={12}>
              <Radio.Button
                value="page"
                style={{
                  flex: 1,
                  height: 'auto',
                  padding: '10px 16px',
                  borderRadius: 8,
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <EnvironmentOutlined />
                <span>页面监控</span>
                <Typography.Text style={{ fontSize: 11, color: '#8C8C8C', display: 'block' }}>
                  监控单个页面的 UI 变化
                </Typography.Text>
              </Radio.Button>
              <Radio.Button
                value="flow"
                style={{
                  flex: 1,
                  height: 'auto',
                  padding: '10px 16px',
                  borderRadius: 8,
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <OrderedListOutlined />
                <span>流程监控</span>
                <Typography.Text style={{ fontSize: 11, color: '#8C8C8C', display: 'block' }}>
                  监控完整用户操作流程
                </Typography.Text>
              </Radio.Button>
            </Space>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="name"
          label="监控名称"
          rules={[{ required: true, message: '请输入监控名称' }]}
        >
          <Input placeholder={targetType === 'flow' ? '如：美团外卖-完整下单流程' : '如：京东百亿补贴-手机品类'} />
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
          {targetType === 'page' ? (
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
          ) : (
            <Form.Item
              name="pageType"
              label="流程类型"
              rules={[{ required: true, message: '请选择流程类型' }]}
              style={{ flex: 1, marginBottom: 0 }}
            >
              <Select
                placeholder="选择流程类型"
                options={[
                  { value: '外卖下单流程', label: '外卖下单流程' },
                  { value: '电商购物流程', label: '电商购物流程（即将支持）', disabled: true },
                  { value: '酒店预订流程', label: '酒店预订流程（即将支持）', disabled: true },
                ]}
              />
            </Form.Item>
          )}
        </Space>

        {targetType === 'flow' && (
          <Card
            size="small"
            style={{ marginTop: 16, borderRadius: 8, background: '#F8FAFF', border: '1px solid #D6E4FF' }}
            title={
              <Space size={6}>
                <OrderedListOutlined style={{ color: '#1677FF' }} />
                <Typography.Text style={{ fontSize: 13, color: '#1677FF' }}>外卖下单流程 · 6 个步骤</Typography.Text>
                <Tag color="blue" style={{ fontSize: 11 }}>MVP</Tag>
              </Space>
            }
          >
            <Steps
              direction="vertical"
              size="small"
              current={5}
              style={{ marginTop: 8 }}
              items={MEITUAN_FLOW_STEPS.map((step, index) => ({
                title: (
                  <Typography.Text style={{ fontSize: 13, fontWeight: 500 }}>
                    {step.title}
                  </Typography.Text>
                ),
                description: (
                  <Typography.Text style={{ fontSize: 12, color: '#8C8C8C' }}>
                    {step.description}
                    {index === 5 && (
                      <Tag color="orange" style={{ marginLeft: 6, fontSize: 10 }}>不真实支付</Tag>
                    )}
                  </Typography.Text>
                ),
                icon: <span style={{ fontSize: 14 }}>{step.icon}</span>,
              }))}
            />
          </Card>
        )}

        <Form.Item
          name="targetUrl"
          label={targetType === 'flow' ? '流程入口 URL' : '目标 URL'}
          rules={[{ required: true, message: '请输入目标 URL' }, { type: 'url', message: '请输入有效的 URL' }]}
          style={{ marginTop: 16 }}
        >
          <Input placeholder={targetType === 'flow' ? 'https://h5.meituan.com' : 'https://www.example.com/page'} />
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
