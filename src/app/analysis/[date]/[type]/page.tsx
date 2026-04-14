import Link from "next/link";
import { getAnalysisContent } from "@/lib/data";
import { AnalysisType, getAnalysisLabel, formatDateDisplay } from "@/lib/dates";
import { notFound } from "next/navigation";

const VALID_TYPES = new Set<string>(["moomoo", "local", "compare"]);

const TYPE_COLORS: Record<AnalysisType, string> = {
  moomoo: "text-accent",
  local: "text-accent-2",
  compare: "text-accent-3",
};

export const dynamic = "force-dynamic";

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ date: string; type: string }>;
}) {
  const { date, type } = await params;

  if (!VALID_TYPES.has(type)) {
    notFound();
  }

  const analysisType = type as AnalysisType;
  const content = getAnalysisContent(date, analysisType);

  if (!content) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/"
          className="px-3 py-1.5 rounded-lg bg-card-bg border border-card-border hover:border-accent transition-colors text-sm"
        >
          &larr; 返回
        </Link>
        <div>
          <h1 className={`text-xl font-semibold ${TYPE_COLORS[analysisType]}`}>
            {getAnalysisLabel(analysisType)}
          </h1>
          <p className="text-sm text-muted">{formatDateDisplay(date)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-card-border bg-card-bg p-1">
        <iframe
          srcDoc={content}
          className="w-full rounded-xl bg-white"
          style={{ minHeight: "80vh", border: "none" }}
          sandbox="allow-scripts allow-same-origin"
          title={`${getAnalysisLabel(analysisType)} - ${date}`}
        />
      </div>
    </div>
  );
}
