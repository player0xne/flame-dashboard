import fs from "fs";
import path from "path";
import {
  DayAnalysis,
  WeekData,
  AnalysisType,
  AnalysisMeta,
  getTradingDays,
  getMonday,
  formatDate,
  getWeekLabel,
} from "./dates";

const DATA_DIR = path.join(process.cwd(), "public", "data");

/**
 * Get all available dates that have analysis data.
 */
export function getAvailableDates(): string[] {
  if (!fs.existsSync(DATA_DIR)) return [];
  const dirs = fs.readdirSync(DATA_DIR).filter((name) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(name);
  });
  return dirs.sort().reverse();
}

/**
 * Read analysis HTML content for a specific date and type.
 */
export function getAnalysisContent(
  date: string,
  type: AnalysisType
): string | undefined {
  const dir = path.join(DATA_DIR, date);
  if (!fs.existsSync(dir)) return undefined;

  // Look for .html file
  const htmlFile = path.join(dir, `${type}.html`);
  if (fs.existsSync(htmlFile)) {
    return fs.readFileSync(htmlFile, "utf-8");
  }

  return undefined;
}

/**
 * Read metadata JSON for a specific date and type.
 */
export function getAnalysisMeta(
  date: string,
  type: AnalysisType
): AnalysisMeta | undefined {
  const metaFile = path.join(DATA_DIR, date, `${type}.meta.json`);
  if (fs.existsSync(metaFile)) {
    try {
      return JSON.parse(fs.readFileSync(metaFile, "utf-8"));
    } catch {
      return undefined;
    }
  }
  return undefined;
}

/**
 * Load a single day's analysis data.
 */
export function getDayAnalysis(date: string): DayAnalysis {
  return {
    date,
    moomoo: getAnalysisContent(date, "moomoo"),
    local: getAnalysisContent(date, "local"),
    compare: getAnalysisContent(date, "compare"),
    moomooMeta: getAnalysisMeta(date, "moomoo"),
    localMeta: getAnalysisMeta(date, "local"),
    compareMeta: getAnalysisMeta(date, "compare"),
  };
}

/**
 * Get week data for a given offset (0 = current week, 1 = last week, etc.)
 */
export function getWeekData(weekOffset: number = 0): WeekData {
  const now = new Date();
  const monday = getMonday(now);
  monday.setDate(monday.getDate() - weekOffset * 7);

  const tradingDays = getTradingDays(monday);
  const mondayStr = formatDate(monday);

  // Load data for each trading day, newest first
  const days = tradingDays
    .map((date) => getDayAnalysis(date))
    .reverse();

  return {
    weekLabel: getWeekLabel(mondayStr),
    days,
  };
}

/**
 * Get total number of weeks that have data.
 */
export function getAvailableWeeks(): number {
  const dates = getAvailableDates();
  if (dates.length === 0) return 1;

  const oldest = new Date(dates[dates.length - 1] + "T00:00:00");
  const now = new Date();
  const diffWeeks = Math.ceil(
    (now.getTime() - getMonday(oldest).getTime()) / (7 * 24 * 60 * 60 * 1000)
  );
  return Math.max(diffWeeks + 1, 1);
}

/**
 * Check if analysis exists for a given date and type.
 */
export function hasAnalysis(date: string, type: AnalysisType): boolean {
  return getAnalysisContent(date, type) !== undefined;
}
