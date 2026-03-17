"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type Rating = {
  id: number;
  rating: number;
  image: { id: number; celebrity_name: string; image_url: string };
};

export default function CompletePage() {
  const router = useRouter();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    (async () => {
      try {
        const sessions = await api.getSessions();
        const done = sessions.find((s: { is_completed: boolean }) => s.is_completed);
        if (done) { const data = await api.getRatings(done.id); setRatings(data); }
      } catch { /* silently fail */ }
      finally { setLoading(false); }
    })();
  }, [router]);

  const avg = ratings.length
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-md">
        {/* Banner */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 text-center mb-4">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎉</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-1">All done!</h1>
          <p className="text-slate-400 text-sm mb-1">You rated {ratings.length} images.</p>
          {avg && (
            <p className="text-slate-500 text-sm mb-6">
              Your average rating was{" "}
              <span className="font-bold text-blue-600 text-base">{avg}</span>
              <span className="text-slate-400">/10</span>
            </p>
          )}
          <button
            onClick={() => router.push("/leaderboard")}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold py-3 rounded-2xl text-sm transition-all shadow-md shadow-blue-200 mb-3"
          >
            🏆 View Leaderboard
          </button>
          <button
            onClick={() => { localStorage.clear(); router.push("/login"); }}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Sign out
          </button>
        </div>

        {/* Ratings list */}
        {!loading && ratings.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Ratings</p>
            </div>
            <ul className="divide-y divide-slate-50">
              {ratings.map((r) => (
                <li key={r.id} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.image.image_url} alt={r.image.celebrity_name} className="w-full h-full object-cover" />
                  </div>
                  <span className="flex-1 text-sm text-slate-700 font-medium">{r.image.celebrity_name}</span>
                  <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${
                    r.rating >= 8 ? "bg-green-50 text-green-600" :
                    r.rating >= 5 ? "bg-blue-50 text-blue-600" :
                    "bg-slate-100 text-slate-500"
                  }`}>
                    {r.rating}/10
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
