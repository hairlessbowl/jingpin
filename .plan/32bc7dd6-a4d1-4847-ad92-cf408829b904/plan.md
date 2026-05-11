# 竞品反向工程 Design Intelligence MVP — 实施计划

## 技术选型

- **UI 框架**：Ant Design 5.x + ProComponents（实体 > 3 个，有 Dashboard，有复杂表单）
- **布局**：Ant Design Layout（Sider + Header + Content）
- **路由**：Hash Router（react-router-dom v6）
- **样式**：Tailwind CSS
- **数据**：Mock 数据（先生成 Mock，后续按需对接）
- **构建**：Webpack 5 + Babel

## 目录结构

```
src/
├── pages/
│   ├── layout/
│   │   ├── index.tsx
│   │   ├── components/
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   └── menuConfig.ts
│   ├── dashboard/
│   │   ├── index.tsx
│   │   ├── components/
│   │   │   ├── StatCards.tsx
│   │   │   └── RecentTaskList.tsx
│   │   └── hooks/
│   │       └── useDashboardData.ts
│   ├── analysis/
│   │   ├── new/
│   │   │   ├── index.tsx
│   │   │   ├── components/
│   │   │   │   ├── MaterialUpload.tsx
│   │   │   │   ├── BriefForm.tsx
│   │   │   │   └── ProgressView.tsx
│   │   │   └── hooks/
│   │   │       └── useNewAnalysis.ts
│   │   ├── result/
│   │   │   ├── index.tsx
│   │   │   ├── components/
│   │   │   │   ├── BreakdownTab.tsx
│   │   │   │   ├── DiffTab.tsx
│   │   │   │   ├── FusionTab.tsx
│   │   │   │   ├── ChangeReportTab.tsx
│   │   │   │   └── FigmaTab.tsx
│   │   │   └── hooks/
│   │   │       └── useAnalysisResult.ts
│   │   ├── services/
│   │   │   └── analysisService.ts
│   │   └── types.ts
│   ├── tasks/
│   │   ├── index.tsx
│   │   ├── components/
│   │   │   ├── TaskTable.tsx
│   │   │   └── TaskFilter.tsx
│   │   ├── hooks/
│   │   │   └── useTaskList.ts
│   │   └── services/
│   │       └── taskService.ts
│   ├── monitors/
│   │   ├── index.tsx
│   │   ├── history/
│   │   │   └── index.tsx
│   │   ├── components/
│   │   │   ├── MonitorTable.tsx
│   │   │   └── MonitorFormModal.tsx
│   │   ├── hooks/
│   │   │   └── useMonitorList.ts
│   │   └── services/
│   │       └── monitorService.ts
│   └── settings/
│       ├── index.tsx
│       └── hooks/
│           └── useSettings.ts
├── components/
│   └── PageContainer.tsx
├── types/
│   └── common.ts
└── services/
    └── request.ts
```

## 路由规划

```
#/                          → 工作台（Dashboard）
#/analysis/new              → 新建分析
#/analysis/result/:id       → 分析结果
#/tasks                     → 历史任务
#/monitors                  → 自动监控
#/monitors/:id/history      → 监控历史
#/settings                  → 系统设置
```

## 生成步骤

### Step 1: 项目骨架
- package.json + webpack.config.js + tailwind.config.js + postcss.config.js
- anpm install
- src/index.tsx + src/App.tsx
- 布局组件（Layout + Sidebar + Header + menuConfig）

### Step 2: 公共模块
- src/services/request.ts
- src/types/common.ts
- src/components/PageContainer.tsx

### Step 3: 工作台（Dashboard）
- useDashboardData.ts（Mock 数据）
- StatCards.tsx（4 个统计卡片）
- RecentTaskList.tsx（最近任务列表）
- dashboard/index.tsx

### Step 4: 新建分析
- analysis/types.ts
- analysisService.ts（Mock）
- MaterialUpload.tsx（文件上传区域）
- BriefForm.tsx（Brief 表单）
- ProgressView.tsx（处理进度）
- analysis/new/index.tsx

### Step 5: 分析结果
- BreakdownTab.tsx（页面拆解）
- DiffTab.tsx（差异分析）
- FusionTab.tsx（融合建议）
- FigmaTab.tsx（Figma 结构）
- analysis/result/index.tsx

### Step 6: 历史任务
- taskService.ts（Mock）
- TaskFilter.tsx
- TaskTable.tsx
- tasks/index.tsx

### Step 7: 自动监控
- monitorService.ts（Mock）
- MonitorTable.tsx
- MonitorFormModal.tsx（新建/编辑弹窗）
- monitors/index.tsx
- monitors/history/index.tsx（监控历史）

### Step 8: 系统设置
- settings/index.tsx

### Step 9: 收尾
- 完善路由注册
- 完善菜单配置
- 全量验证
