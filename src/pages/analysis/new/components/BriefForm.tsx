import { Form, Input, Select, Row, Col, Skeleton, Alert } from 'antd';
import type { FormInstance } from 'antd';
import { ScanOutlined } from '@ant-design/icons';
import { PAGE_TYPES } from '@/types/common';

interface BriefFormProps {
  form: FormInstance;
  recognizing?: boolean;
}

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

export const BriefForm = ({ form, recognizing = false }: BriefFormProps) => {
  if (recognizing) {
    return (
      <div>
        <Alert
          icon={<ScanOutlined />}
          message="AI 正在识别素材内容..."
          description="正在自动分析上传的截图/录屏，识别竞品信息和页面类型，请稍候"
          type="info"
          showIcon
          style={{ marginBottom: 24, borderRadius: 8 }}
        />
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={12}><Skeleton.Input active block /></Col>
          <Col span={12}><Skeleton.Input active block /></Col>
        </Row>
        <Skeleton.Input active block style={{ marginBottom: 16 }} />
        <Skeleton active paragraph={{ rows: 2 }} style={{ marginBottom: 16 }} />
        <Row gutter={16}>
          <Col span={12}><Skeleton.Input active block /></Col>
          <Col span={12}><Skeleton.Input active block /></Col>
        </Row>
      </div>
    );
  }

  return (
    <Form form={form} layout="vertical" requiredMark={false}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="competitorName"
            label="竞品名称"
            rules={[{ required: true, message: '请选择或输入竞品名称' }]}
          >
            <Select
              showSearch
              placeholder="选择竞品"
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
          >
            <Select
              placeholder="选择页面类型"
              options={PAGE_TYPES.map((t) => ({ value: t, label: t }))}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="deviceType"
        label="设备类型"
        initialValue="mobile"
        rules={[{ required: true }]}
      >
        <Select options={DEVICE_OPTIONS} />
      </Form.Item>

      <Form.Item
        name={['brief', 'businessScenario']}
        label="业务场景描述"
        rules={[{ required: true, message: '请描述业务场景' }]}
      >
        <Input.TextArea
          rows={3}
          placeholder="描述该竞品页面的业务场景，如：电商商品详情页，展示商品信息和购买入口"
          showCount
          maxLength={300}
        />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name={['brief', 'targetUser']}
            label="目标用户"
            rules={[{ required: true, message: '请描述目标用户' }]}
          >
            <Input placeholder="如：C 端消费者、B 端商家" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name={['brief', 'optimizationGoal']}
            label="优化目标"
            rules={[{ required: true, message: '请填写优化目标' }]}
          >
            <Input placeholder="如：提升加购和购买转化率" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name={['brief', 'currentProblem']}
        label="当前问题"
      >
        <Input.TextArea
          rows={2}
          placeholder="描述我方当前存在的问题，如：我方商详页转化率低于竞品（可选）"
          showCount
          maxLength={200}
        />
      </Form.Item>
    </Form>
  );
};
