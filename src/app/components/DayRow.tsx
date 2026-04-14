import { DayAnalysis, AnalysisType, formatDateDisplay } from "@/lib/dates";
import AnalysisCard from "./AnalysisCard";

const TYPES: AnalysisType[] = ["moomoo", "local", "compare"];
const META_KEYS = {
  moomoo: "moomooMeta",
  local: "localMeta",
  compare: "compareMeta",
} as const;

export default function DayRow({ day }: { day: DayAnalysis }) {
  const hasAny = day.moomoo || day.local || day.compare;
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
  const isToday = day.date === today;

  return (
    <div
      className={`rounded-2xl border ${
        isToday ? "border-accent/50 bg-accent/5" : "border-card-border bg-card-bg/30"
      } p-4 mb-4`}
    >
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-base font-semibold">
          {formatDateDisplay(day.date)}
        </h3>
        {isToday && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent font-medium">
            今天
          </span>
        )}
        {!hasAny && (
          <span className="text-xs text-muted">无分析数据</span>
        )}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {TYPES.map((type) => (
          <AnalysisCard
            key={type}
            date={day.date}
            type={type}
            hasContent={!!day[type]}
            meta={day[META_KEYS[type]]}
          />
        ))}
      </div>
    </div>
  );
}
