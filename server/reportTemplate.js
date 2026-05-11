function guessScenario(task) {
  const goal = task.brief?.optimizationGoal || '提升页面转化和关键操作效率';
  const problem = task.brief?.currentProblem || '当前页面需要更清晰地承接用户决策';
  return { goal, problem };
}

function buildScreenshotUrl(material) {
  if (!material || !material.content_base64 || !material.mime_type?.startsWith('image/')) return undefined;
  return `data:${material.mime_type};base64,${material.content_base64}`;
}

function generateAnalysisReport(task, materials) {
  const competitorMaterials = materials.filter(item => item.category === 'competitor');
  const ownMaterials = materials.filter(item => item.category === 'own');
  const competitorShot = buildScreenshotUrl(competitorMaterials[0]);
  const ownShot = buildScreenshotUrl(ownMaterials[0]);
  const { goal, problem } = guessScenario(task);
  const page = task.page_type;
  const competitor = task.competitor_name;

  return {
    breakdown: {
      layoutSummary: `${competitor}「${page}」素材已完成结构化拆解。系统识别到核心展示区、信任/利益点表达区和底部行动区，适合用于对照我方页面做转译。`,
      components: [
        { id: 'c1', type: 'image', name: '首屏视觉区', description: '承载主视觉、关键商品/服务信息和第一注意力焦点。', region: 'Header' },
        { id: 'c2', type: 'label', name: '利益点标签', description: '通过优惠、时效、保障或活动标签降低用户决策成本。', region: 'Content' },
        { id: 'c3', type: 'button', name: '主行动按钮', description: '承担加购、购买、提交或继续下一步的关键转化动作。', region: 'Footer' },
        { id: 'c4', type: 'card', name: '辅助信息卡片', description: '补充规则、服务说明、评价或对比信息，提升信任感。', region: 'Content' },
      ],
      designPatterns: ['首屏信息聚焦', '利益点前置', '底部固定行动', '模块化分组表达'],
      colorPalette: {
        primary: '#1677FF',
        secondary: '#FA8C16',
        background: '#F5F7FA',
        text: '#262626',
        accent: ['#E6F4FF', '#FFF7E6', '#F6FFED'],
      },
    },
    diffAnalysis: {
      summary: `围绕「${goal}」，竞品更强调快速理解和即时行动；我方当前主要问题是「${problem}」。建议先优化首屏表达、行动路径和反馈状态。`,
      differences: [
        {
          dimension: '信息层级',
          description: '竞品把用户最关心的信息放在首屏更高权重位置，减少理解成本。',
          competitorApproach: '核心卖点、价格/权益、行动按钮组合呈现。',
          ourApproach: ownMaterials.length ? '我方素材已上传，可围绕首屏权重进行对照优化。' : '暂未上传我方素材，建议补充后完善对照结论。',
          impact: 'high',
          competitorScreenshotUrl: competitorShot,
          ourScreenshotUrl: ownShot,
        },
        {
          dimension: '行动转化',
          description: '竞品的主按钮更突出，辅助动作弱化，路径判断更直接。',
          competitorApproach: '主行动按钮视觉权重高，文案强调即时收益。',
          ourApproach: '可检查我方按钮文案、位置、禁用态和提交反馈是否足够明确。',
          impact: 'high',
          competitorScreenshotUrl: competitorShot,
          ourScreenshotUrl: ownShot,
        },
        {
          dimension: '信任与约束说明',
          description: '竞品把规则解释拆成短标签或卡片，降低阅读负担。',
          competitorApproach: '用标签、图标、短句解释优惠、保障和状态。',
          ourApproach: '建议避免大段说明，把复杂规则拆成可扫读模块。',
          impact: 'medium',
          competitorScreenshotUrl: competitorShot,
          ourScreenshotUrl: ownShot,
        },
      ],
      borrowablePoints: [
        '首屏只保留一个最明确的主目标，减少分散入口。',
        '把优惠、保障、时效等决策信息前置为短标签。',
        '固定关键行动区，确保滚动后仍能继续转化。',
      ],
      incompatiblePoints: [
        '竞品专属活动名、平台权益和品牌化表达不可直接复用。',
        '不建议照搬强促销视觉，应按我方品牌和业务规则转译。',
      ],
    },
    fusionSuggestions: [
      {
        id: 's1',
        title: '重排首屏信息优先级',
        description: `围绕「${goal}」把标题、利益点、关键状态和主按钮放在首屏可扫读区域。`,
        referenceElement: '首屏视觉区',
        priority: 'high',
        expectedEffect: '提升用户理解速度，减少首屏跳出。',
      },
      {
        id: 's2',
        title: '强化主行动按钮与反馈',
        description: '统一主按钮文案，补齐加载中、成功、失败、不可用状态，避免用户不确定下一步。',
        referenceElement: '主行动按钮',
        priority: 'high',
        expectedEffect: '提升关键动作完成率和演示流程可信度。',
      },
      {
        id: 's3',
        title: '把复杂规则拆成短标签',
        description: '将优惠、限制、保障、时效等说明拆成 3-5 个短标签或信息卡。',
        referenceElement: '利益点标签',
        priority: 'medium',
        expectedEffect: '降低阅读压力，帮助用户快速判断价值。',
      },
    ],
    changeReport: {
      summary: '本次为手动上传素材生成的模板化分析报告，适合 MVP 演示和需求评审。',
      added: ['真实素材上传记录', '任务持久化记录', '结构化分析报告'],
      removed: [],
      modified: [
        { module: '分析流程', before: '前端 Mock 立即返回固定报告', after: '后端基于任务、素材和 Brief 生成报告' },
        { module: '任务列表', before: '刷新后数据丢失', after: '任务写入 Postgres，可跨设备查看' },
      ],
      riskLevel: 'low',
      designOpportunities: ['后续可接入真实视觉模型', '后续可将文件迁移到对象存储', '后续可增加报告导出'],
    },
    figmaStructure: {
      rootFrame: `${competitor}-${page}-优化转译稿 (${task.device_type})`,
      sections: [
        { name: 'Header/Hero', type: 'header', layoutMode: 'VERTICAL', children: ['主视觉', '核心标题', '利益点标签'] },
        { name: 'Content/Decision', type: 'content', layoutMode: 'VERTICAL', children: ['价格/权益', '信任说明', '对比信息'] },
        { name: 'Footer/ActionBar', type: 'footer', layoutMode: 'HORIZONTAL', children: ['辅助动作', '主行动按钮'] },
      ],
      copyPlaceholders: [
        { location: 'Header/Hero/核心标题', content: `${page}核心价值一句话`, fontSize: 18, fontWeight: 'semibold' },
        { location: 'Content/Decision/利益点', content: '限时权益 / 服务保障 / 状态提示', fontSize: 13, fontWeight: 'medium' },
        { location: 'Footer/ActionBar/主行动按钮', content: '立即继续', fontSize: 15, fontWeight: 'semibold' },
      ],
    },
  };
}

module.exports = { generateAnalysisReport };
