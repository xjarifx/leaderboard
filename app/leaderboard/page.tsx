"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type Entry = {
  celebrity_name: string;
  avg_rating: number | null;
  total_ratings: number;
  sample_url: string;
};

const MEDAL = ["🥇", "🥈", "🥉"];

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 8 ? "bg-green-50 text-green-600 border-green-100" :
    score >= 6 ? "bg-blue-50 text-blue-600 border-blue-100" :
    score >= 4 ? "bg-amber-50 text-amber-600 border-amber-100" :
    "bg-slate-100 text-slate-500 border-slate-200";
  return (
    <div className={`flex items-baseline gap-0.5 px-3 py-1.5 rounded-xl border font-bold text-base ${color}`}>
      {score}
      <span className="text-xs font-normal opacity-60">/10</span>
    </div>
  );
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [data, setData] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getLeaderboard().then(setData).finally(() => setLoading(false));
  }, []);

  const top3 = data.filter((e) => e.avg_rating !== null).slice(0, 3);
  const rest = data.slice(3);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Leaderboard</h1>
            <p className="text-xs text-slate-400 mt-0.5">Ranked by average rating</p>
          </div>
          <button
            onClick={() => router.back()}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-full transition-colors shadow-sm"
          >
            ← Back
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-24">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Loading…</p>
          </div>
        ) : (
          <>
            {/* Top 3 podium cards */}
            {top3.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[top3[1], top3[0], top3[2]].map((entry, podiumIdx) => {
                  if (!entry) return <div key={podiumIdx} />;
                  const rank = data.indexOf(entry);
                  const heights = ["h-24", "h-32", "h-20"];
                  return (
                    <div key={entry.celebrity_name} className="flex flex-col items-center gap-2">
                      <div className={`w-full ${heights[podiumIdx]} rounded-2xl overflow-hidden bg-slate-100 relative shadow-md`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={entry.sample_url} alt={entry.celebrity_name} className="w-full h-full object-cover" loading="eager" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <span className="absolute top-2 left-2 text-lg">{MEDAL[rank]}</span>
                        {entry.avg_rating !== null && (
                          <span className="absolute bottom-2 right-2 text-white text-xs font-bold bg-black/40 px-1.5 py-0.5 rounded-lg">
                            {entry.avg_rating}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-700 text-center leading-tight line-clamp-2">
                        {entry.celebrity_name}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Full list */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
              <ul className="divide-y divide-slate-50">
                {data.map((entry, i) => (
                  <li key={entry.celebrity_name} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                    {/* Rank */}
                    <div className="w-7 flex-shrink-0 text-center">
                      {i < 3
                        ? <span className="text-base">{MEDAL[i]}</span>
                        : <span className="text-xs font-bold text-slate-400">{i + 1}</span>
                      }
                    </div>

                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={entry.sample_url} alt={entry.celebrity_name} className="w-full h-full object-cover" loading="lazy" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{entry.celebrity_name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {entry.total_ratings} {entry.total_ratings === 1 ? "rating" : "ratings"}
                      </p>
                    </div>

                    {/* Score */}
                    {entry.avg_rating !== null
                      ? <ScoreBadge score={entry.avg_rating} />
                      : <span className="text-xs text-slate-300 italic">No ratings</span>
                    }
                  </li>
                ))}
              </ul>
            </div>

            {rest.length === 0 && data.length === 0 && (
              <p className="text-center text-slate-400 text-sm py-12">No data yet.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
