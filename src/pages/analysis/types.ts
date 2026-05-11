import type { TaskStatus, TaskType, DeviceType } from '@/types/common';

export interface AnalysisTask {
  id: string;
  type: TaskType;
  status: TaskStatus;
  competitorName: string;
  pageType: string;
  deviceType: DeviceType;
  materialCount: number;
  createdAt: string;
  completedAt?: string;
  brief?: AnalysisBrief;
  result?: AnalysisResult;
}

export interface AnalysisBrief {
  businessScenario: string;
  targetUser: string;
  currentProblem?: string;
  optimizationGoal?: string;
}

export interface AnalysisResult {
  breakdown: PageBreakdown;
  diffAnalysis: DiffAnalysis;
  fusionSuggestions: FusionSuggestion[];
  changeReport?: ChangeReport;
  figmaStructure: FigmaStructure;
}

export interface PageBreakdown {
  layoutSummary: string;
  components: ComponentItem[];
  designPatterns: string[];
  colorPalette: ColorPalette;
}

export interface ComponentItem {
  id: string;
  type: string;
  name: string;
  description: string;
  region: string;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string[];
}

export interface DiffAnalysis {
  summary: string;
  differences: DiffItem[];
  borrowablePoints: string[];
  incompatiblePoints: string[];
}

export interface DiffItem {
  dimension: string;
  description: string;
  competitorApproach: string;
  ourApproach: string;
  impact: 'high' | 'medium' | 'low';
}

export interface FusionSuggestion {
  id: string;
  title: string;
  description: string;
  referenceElement: string;
  priority: 'high' | 'medium' | 'low';
  expectedEffect: string;
}

export interface ChangeReport {
  summary: string;
  added: string[];
  removed: string[];
  modified: ChangeItem[];
  riskLevel: 'low' | 'medium' | 'high';
  designOpportunities: string[];
}

export interface ChangeItem {
  module: string;
  before: string;
  after: string;
}

export interface FigmaStructure {
  rootFrame: string;
  sections: FigmaSection[];
  copyPlaceholders: CopyPlaceholder[];
}

export interface FigmaSection {
  name: string;
  type: string;
  layoutMode: string;
  children: string[];
}

export interface CopyPlaceholder {
  location: string;
  content: string;
  fontSize: number;
  fontWeight: string;
}
