// Trading day utilities

export type AnalysisType = "moomoo" | "local" | "compare";

export interface StrategyMeta {
  sym: string;
  signal: "bullish" | "bearish" | "neutral";
  conf: number;
  strategy: string;
  target: string;
  risk: string;
}

export interface AnalysisMeta {
  title: string;
  date: string;
  source: string;
  totalFlow?: string;
  tickers?: string[];
  macro?: string;
  strategies?: StrategyMeta[];
  top3?: { rank: number; sym: string; strategy: string; conf: number }[];
}

export interface DayAnalysis {
  date: string; // YYYY-MM-DD
  moomoo?: string; // HTML content
  local?: string;
  compare?: string;
  moomooMeta?: AnalysisMeta;
  localMeta?: AnalysisMeta;
  compareMeta?: AnalysisMeta;
}

export interface WeekData {
  weekLabel: string;
  days: DayAnalysis[];
}

const ANALYSIS_LABELS: Record<AnalysisType, string> = {
  moomoo: "Moomoo 异动期权",
  local: "本地异动追踪",
  compare: "两系统对比",
};

export function getAnalysisLabel(type: AnalysisType): string {
  return ANALYSIS_LABELS[type];
}

/**
 * Get the Monday of the week containing the given date.
 */
export function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Get 5 trading days (Mon-Fri) for the week containing the given date.
 */
export function getTradingDays(weekStart: Date): string[] {
  const days: string[] = [];
  const monday = getMonday(weekStart);
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(formatDate(d));
  }
  return days;
}

export function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

export function formatDateDisplay(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${month}月${day}日 ${weekdays[d.getDay()]}`;
}

export function getWeekLabel(mondayStr: string): string {
  const monday = new Date(mondayStr + "T00:00:00");
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  const mMonth = monday.getMonth() + 1;
  const mDay = monday.getDate();
  const fMonth = friday.getMonth() + 1;
  const fDay = friday.getDate();
  return `${mMonth}/${mDay} - ${fMonth}/${fDay}`;
}
