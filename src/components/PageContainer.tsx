import { ReactNode } from 'react';
import { Typography } from 'antd';

interface PageContainerProps {
  title: string;
  extra?: ReactNode;
  children: ReactNode;
}

export const PageContainer = ({ title, extra, children }: PageContainerProps) => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Typography.Title level={4} style={{ margin: 0, color: '#262626' }}>
          {title}
        </Typography.Title>
        {extra && <div>{extra}</div>}
      </div>
      {children}
    </div>
  );
};
