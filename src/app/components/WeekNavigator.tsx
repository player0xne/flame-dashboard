"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function WeekNavigator({
  weekLabel,
  weekOffset,
  totalWeeks,
}: {
  weekLabel: string;
  weekOffset: number;
  totalWeeks: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function navigate(offset: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (offset === 0) {
      params.delete("week");
    } else {
      params.set("week", String(offset));
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={() => navigate(weekOffset + 1)}
        disabled={weekOffset >= totalWeeks - 1}
        className="px-4 py-2 rounded-lg bg-card-bg border border-card-border hover:border-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        &larr; 上一周
      </button>
      <div className="text-center">
        <h2 className="text-xl font-semibold">{weekLabel}</h2>
        {weekOffset === 0 && (
          <span className="text-sm text-accent">本周</span>
        )}
      </div>
      <button
        onClick={() => navigate(weekOffset - 1)}
        disabled={weekOffset <= 0}
        className="px-4 py-2 rounded-lg bg-card-bg border border-card-border hover:border-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        下一周 &rarr;
      </button>
    </div>
  );
}
