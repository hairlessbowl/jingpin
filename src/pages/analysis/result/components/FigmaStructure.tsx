import { Card, Tag, Typography, Space, Tree } from 'antd';
import { ApartmentOutlined, LayoutOutlined, CopyOutlined } from '@ant-design/icons';
import type { AnalysisResult } from '@/pages/analysis/types';
import type { DataNode } from 'antd/es/tree';

interface FigmaStructureProps {
  result: AnalysisResult;
}

const SECTION_TYPE_COLORS: Record<string, string> = {
  header: 'blue',
  content: 'green',
  footer: 'orange',
  sidebar: 'purple',
};

export const FigmaStructure = ({ result }: FigmaStructureProps) => {
  const { figmaStructure } = result;

  const treeData: DataNode[] = [
    {
      key: 'root',
      title: (
        <Space size={8}>
          <LayoutOutlined style={{ color: '#1677FF' }} />
          <Typography.Text strong style={{ fontSize: 13 }}>
            {figmaStructure.rootFrame}
          </Typography.Text>
        </Space>
      ),
      children: figmaStructure.sections.map((section, index) => ({
        key: `section-${index}`,
        title: (
          <Space size={8}>
            <Tag
              color={SECTION_TYPE_COLORS[section.type] ?? 'default'}
              style={{ fontSize: 11, margin: 0 }}
            >
              {section.type}
            </Tag>
            <Typography.Text style={{ fontSize: 13 }}>{section.name}</Typography.Text>
            <Typography.Text style={{ fontSize: 11, color: '#8C8C8C' }}>
              {section.layoutMode}
            </Typography.Text>
          </Space>
        ),
        children: section.children.map((child, childIndex) => ({
          key: `section-${index}-child-${childIndex}`,
          title: (
            <Typography.Text style={{ fontSize: 12, color: '#595959' }}>{child}</Typography.Text>
          ),
          isLeaf: true,
        })),
      })),
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card
        title={
          <Space>
            <ApartmentOutlined />
            <Typography.Text strong>Figma 图层结构</Typography.Text>
          </Space>
        }
        style={{ borderRadius: 8, border: '1px solid #F0F0F0' }}
        size="small"
      >
        <Tree
          defaultExpandAll
          treeData={treeData}
          style={{ fontSize: 13 }}
        />
      </Card>

      <Card
        title={
          <Space>
            <CopyOutlined />
            <Typography.Text strong>文案占位符</Typography.Text>
          </Space>
        }
        style={{ borderRadius: 8, border: '1px solid #F0F0F0' }}
        size="small"
      >
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          {figmaStructure.copyPlaceholders.map((placeholder, index) => (
            <div
              key={index}
              style={{
                padding: '10px 14px',
                background: '#FAFAFA',
                borderRadius: 6,
                border: '1px solid #F0F0F0',
              }}
            >
              <Typography.Text style={{ fontSize: 11, color: '#8C8C8C', display: 'block', marginBottom: 4 }}>
                {placeholder.location}
              </Typography.Text>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography.Text
                  strong
                  style={{
                    fontSize: placeholder.fontSize,
                    fontWeight: placeholder.fontWeight === 'bold' ? 700 : placeholder.fontWeight === 'semibold' ? 600 : 400,
                    color: '#262626',
                  }}
                >
                  {placeholder.content}
                </Typography.Text>
                <Space size={8}>
                  <Tag style={{ fontSize: 11 }}>{placeholder.fontSize}px</Tag>
                  <Tag style={{ fontSize: 11 }}>{placeholder.fontWeight}</Tag>
                </Space>
              </div>
            </div>
          ))}
        </Space>
      </Card>
    </Space>
  );
};
