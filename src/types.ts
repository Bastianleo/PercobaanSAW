export interface Criteria {
  id: string;
  name: string;
  weight: number;
  type: "benefit" | "cost";
}

export interface Alternative {
  id: string;
  name: string;
  values: Record<string, number>;
}

export interface NormalizedAlternative extends Alternative {
  norm: Record<string, number>;
}

export interface SAWResult {
  id: string;
  name: string;
  score: number;
  norm: Record<string, number>;
  rank: number;
}

export interface AHPResult {
  weights: number[];
  CI: number;
  CR: number;
  ranked: AHPRanked[];
  consistent: boolean;
}

export interface AHPRanked {
  id: string;
  name: string;
  weight: number;
  rank: number;
}

export interface CombinedResult extends SAWResult {
  sawScore: number;
  ahpWeight: number;
  combined: number;
}

export interface RadarDataPoint {
  subject: string;
  [key: string]: string | number;
}

export interface StatItem {
  label: string;
  value: number;
  icon: string;
  color: "blue" | "indigo" | "emerald" | "amber";
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
}

export interface ExportItem {
  title: string;
  desc: string;
  onClick: () => void;
}

export interface CriteriaForm {
  name: string;
  weight: string;
  type: "benefit" | "cost";
}

export interface AlternativeForm {
  name: string;
  values: Record<string, string>;
}