import { Suspense } from "react";
import { getWeekData, getAvailableWeeks } from "@/lib/data";
import { getAnalysisLabel, AnalysisType } from "@/lib/dates";
import DayRow from "./components/DayRow";
import WeekNavigator from "./components/WeekNavigator";

const COLUMN_HEADERS: { type: AnalysisType; color: string }[] = [
  { type: "moomoo", color: "text-accent" },
  { type: "local", color: "text-accent-2" },
  { type: "compare", color: "text-accent-3" },
];

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const params = await searchParams;
  const weekOffset = parseInt(params.week || "0", 10);
  const weekData = getWeekData(weekOffset);
  const totalWeeks = getAvailableWeeks();

  return (
    <div>
      <Suspense fallback={null}>
        <WeekNavigator
          weekLabel={weekData.weekLabel}
          weekOffset={weekOffset}
          totalWeeks={totalWeeks}
        />
      </Suspense>

      {/* Column headers */}
      <div className="hidden sm:grid grid-cols-3 gap-3 mb-2 px-4">
        {COLUMN_HEADERS.map(({ type, color }) => (
          <div key={type} className={`text-center text-sm font-medium ${color}`}>
            {getAnalysisLabel(type)}
          </div>
        ))}
      </div>

      {/* Day rows */}
      <div>
        {weekData.days.map((day) => (
          <DayRow key={day.date} day={day} />
        ))}
      </div>

      {weekData.days.every((d) => !d.moomoo && !d.local && !d.compare) && (
        <div className="text-center text-muted py-12">
          <p className="text-lg">本周暂无分析数据</p>
          <p className="text-sm mt-2">
            将 HTML 文件放入 public/data/YYYY-MM-DD/ 目录即可
          </p>
        </div>
      )}
    </div>
  );
}
