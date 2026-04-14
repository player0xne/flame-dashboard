import Link from "next/link";
import { AnalysisType, AnalysisMeta, getAnalysisLabel } from "@/lib/dates";

const TYPE_COLORS: Record<AnalysisType, string> = {
  moomoo: "text-accent",
  local: "text-accent-2",
  compare: "text-accent-3",
};

const TYPE_BG: Record<AnalysisType, string> = {
  moomoo: "bg-amber-500/10",
  local: "bg-blue-500/10",
  compare: "bg-emerald-500/10",
};

const TYPE_ICON: Record<AnalysisType, { icon: string; tagBg: string; tagText: string; stripe: string }> = {
  moomoo: { icon: "M", tagBg: "bg-amber-500/20", tagText: "text-amber-400", stripe: "bg-amber-500" },
  local: { icon: "L", tagBg: "bg-blue-500/20", tagText: "text-blue-400", stripe: "bg-blue-500" },
  compare: { icon: "VS", tagBg: "bg-emerald-500/20", tagText: "text-emerald-400", stripe: "bg-emerald-500" },
};

const SIGNAL_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  bullish: { bg: "bg-green-500/15", text: "text-green-400", label: "看涨" },
  bearish: { bg: "bg-red-500/15", text: "text-red-400", label: "看跌" },
  neutral: { bg: "bg-gray-500/15", text: "text-gray-400", label: "中性" },
};

export default function AnalysisCard({
  date,
  type,
  hasContent,
  meta,
}: {
  date: string;
  type: AnalysisType;
  hasContent: boolean;
  meta?: AnalysisMeta;
}) {
  const label = getAnalysisLabel(type);
  const colorClass = TYPE_COLORS[type];
  const bgClass = TYPE_BG[type];
  const icon = TYPE_ICON[type];

  if (!hasContent) {
    return (
      <div className="rounded-xl border border-card-border bg-card-bg/50 p-4 flex flex-col items-center justify-center min-h-[120px] opacity-40">
        <span className={`text-lg font-black ${icon.tagText} mb-1`}>{icon.icon}</span>
        <span className="text-sm text-muted">{label}</span>
        <span className="text-xs text-muted mt-1">暂无数据</span>
      </div>
    );
  }

  // Rich card with strategy summaries
  if (meta?.strategies && meta.strategies.length > 0) {
    return (
      <Link href={`/analysis/${date}/${type}`} className="block">
        <div
          className={`rounded-xl border border-card-border ${bgClass} p-3 hover:scale-[1.01] transition-transform cursor-pointer relative overflow-hidden`}
        >
          {/* Left color stripe */}
          <div className={`absolute top-0 left-0 bottom-0 w-1 ${icon.stripe}`} />

          {/* Header with source badge */}
          <div className="flex items-center justify-between mb-2 mt-1">
            <div className="flex items-center gap-1.5">
              <span className={`${icon.tagBg} ${icon.tagText} text-[10px] font-black px-1.5 py-0.5 rounded`}>
                {icon.icon}
              </span>
              <span className={`text-xs font-bold ${colorClass}`}>{label}</span>
            </div>
            {meta.totalFlow && (
              <span className="text-[10px] font-mono text-muted">
                {meta.totalFlow}
              </span>
            )}
          </div>

          {/* Macro one-liner */}
          {meta.macro && (
            <p className="text-[10px] text-muted leading-tight mb-2 line-clamp-2">
              {meta.macro}
            </p>
          )}

          {/* Top strategies - compact list */}
          <div className="space-y-1.5">
            {(meta.top3 || meta.strategies.slice(0, 3)).map((s, i) => {
              const strat = meta.strategies!.find((st) => st.sym === s.sym);
              const sig = strat ? SIGNAL_STYLE[strat.signal] : SIGNAL_STYLE.neutral;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-1.5 ${sig.bg} rounded-md px-2 py-1`}
                >
                  <span className={`text-[10px] font-bold ${sig.text} w-[42px] shrink-0`}>
                    {s.sym}
                  </span>
                  <span className="text-[10px] text-foreground/80 truncate flex-1">
                    {s.strategy}
                  </span>
                  <span className={`text-[10px] font-bold ${sig.text} shrink-0`}>
                    {s.conf}/10
                  </span>
                </div>
              );
            })}
          </div>

          {/* Ticker pills */}
          {meta.tickers && meta.tickers.length > 3 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {meta.tickers.slice(3).map((t) => {
                const strat = meta.strategies!.find((s) => s.sym === t);
                const sig = strat ? SIGNAL_STYLE[strat.signal] : SIGNAL_STYLE.neutral;
                return (
                  <span
                    key={t}
                    className={`text-[9px] px-1.5 py-0.5 rounded ${sig.bg} ${sig.text} font-medium`}
                  >
                    {t}
                  </span>
                );
              })}
            </div>
          )}

          <div className="text-[10px] text-muted mt-2 text-center">
            点击查看完整分析 →
          </div>
        </div>
      </Link>
    );
  }

  // Simple card (no metadata)
  return (
    <Link href={`/analysis/${date}/${type}`} className="block">
      <div
        className={`rounded-xl border border-card-border ${bgClass} p-4 flex flex-col items-center justify-center min-h-[120px] hover:scale-[1.02] transition-transform cursor-pointer relative overflow-hidden`}
      >
        <div className={`absolute top-0 left-0 bottom-0 w-1 ${icon.stripe}`} />
        <span className={`${icon.tagBg} ${icon.tagText} text-sm font-black px-2 py-0.5 rounded mb-2`}>
          {icon.icon}
        </span>
        <span className={`text-sm font-medium ${colorClass}`}>{label}</span>
        <span className="text-xs text-muted mt-2">点击查看详情</span>
      </div>
    </Link>
  );
}
