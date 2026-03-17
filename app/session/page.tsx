"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type CurrentImage = {
  id: number;
  celebrity_name: string;
  image_url: string;
};

type SessionState = {
  session_id: number;
  current_index: number;
  total: number;
  image: CurrentImage;
  completed?: boolean;
};

export default function SessionPage() {
  const router = useRouter();
  const [state, setState] = useState<SessionState | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [participant, setParticipant] = useState<{ name: string; student_id: string } | null>(null);

  const loadCurrent = useCallback(async (sid: number) => {
    const data = await api.getCurrentImage(sid);
    if (data.completed) { router.push("/session/complete"); return; }
    setState(data);
    setRating(0);
    setHovered(0);
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    try {
      const p = localStorage.getItem("participant");
      if (p) setParticipant(JSON.parse(p));
    } catch { /* ignore */ }
    (async () => {
      try {
        const sessions = await api.getSessions();
        const active = sessions.find((s: { is_completed: boolean; id: number }) => !s.is_completed);
        let sid: number;
        if (active) { sid = active.id; }
        else { const created = await api.createSession(); sid = created.session_id; }
        setSessionId(sid);
        await loadCurrent(sid);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to start session");
      } finally {
        setLoading(false);
      }
    })();
  }, [router, loadCurrent]);

  const [showBreak, setShowBreak] = useState(false);
  const [breakSeconds, setBreakSeconds] = useState(0);

  const handleSubmit = async () => {
    if (!rating || !state || !sessionId) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await api.rateImage(sessionId, { image_id: state.image.id, rating });
      if (res.is_completed) {
        router.push("/session/complete");
      } else {
        await loadCurrent(sessionId);
        // Show break reminder every 10 ratings
        const nextIndex = state.current_index + 1;
        if (nextIndex > 0 && nextIndex % 10 === 0) {
          setShowBreak(true);
          setBreakSeconds(300); // 5 minutes
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  // Countdown timer for break
  useEffect(() => {
    if (!showBreak || breakSeconds <= 0) return;
    const t = setTimeout(() => setBreakSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [showBreak, breakSeconds]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading session…</p>
        </div>
      </div>
    );
  }

  if (error && !state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button onClick={() => router.push("/login")} className="text-blue-600 text-sm font-medium hover:underline">
            Back to login
          </button>
        </div>
      </div>
    );
  }

  if (!state) return null;

  const progress = (state.current_index / state.total) * 100;
  const active = hovered || rating;

  const breakMins = Math.floor(breakSeconds / 60);
  const breakSecs = breakSeconds % 60;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8 px-4">
      {/* Top bar */}
      <div className="w-full max-w-md mb-5">
        {/* User info row */}
        {participant && (
          <div className="flex items-center gap-2.5 mb-3 bg-white border border-slate-100 rounded-2xl px-4 py-2.5 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{participant.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{participant.name}</p>
              <p className="text-xs text-slate-400">{participant.student_id}</p>
            </div>
            <button
              onClick={() => router.push("/leaderboard")}
              className="flex items-center gap-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-full transition-colors shadow-sm flex-shrink-0"
            >
              🏆 Leaderboard
            </button>
            <button
              onClick={() => { localStorage.clear(); router.push("/login"); }}
              className="text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-full transition-colors shadow-sm flex-shrink-0"
            >
              Sign out
            </button>
          </div>
        )}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Progress</span>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
            {state.current_index + 1} / {state.total}
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-blue-500 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl sh
adow-slate-200/60 border border-slate-100 overflow-hidden">
        {/* Image */}
        <div className="relative w-full aspect-[3/4] bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={state.image.image_url}
            alt={state.image.celebrity_name}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-4 left-5">
            <p className="text-white font-semibold text-lg leading-tight drop-shadow">{state.image.celebrity_name}</p>
            <p className="text-white/70 text-xs mt-0.5">Rate from 1 to 10</p>
          </div>
        </div>

        {/* Rating section */}
        <div className="p-5">
          {/* Rating buttons */}
          <div className="grid grid-cols-10 gap-1.5 mb-5">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(n)}
                className={`aspect-square rounded-xl text-sm font-bold transition-all duration-150 border
                  ${active >= n
                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200 scale-105"
                    : "bg-slate-50 border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-500"
                  }`}
              >
                {n}
              </button>
            ))}
          </div>

          {/* Selected rating label */}
          <div className="text-center mb-4 h-5">
            {rating > 0 && (
              <span className="text-sm font-semibold text-blue-600">
                {rating <= 3 ? "Poor" : rating <= 5 ? "Average" : rating <= 7 ? "Good" : rating <= 9 ? "Great" : "Perfect"} — {rating}/10
              </span>
            )}
          </div>

          {error && <p className="text-red-500 text-xs text-center mb-3">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={!rating || submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-2xl text-sm transition-all shadow-md shadow-blue-200"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting…
              </span>
            ) : rating ? "Submit Rating →" : "Select a rating above"}
          </button>
        </div>
      </div>

      {/* Break reminder modal */}
      {showBreak && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">☕</span>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight">Time for a break!</h2>
            <p className="text-sm text-slate-500 mb-5">
              You&apos;ve rated 10 images. Rest your eyes for 5 minutes before continuing — it helps keep your ratings accurate.
            </p>
            {breakSeconds > 0 ? (
              <div className="mb-6">
                <div className="text-4xl font-bold text-amber-500 tabular-nums">
                  {breakMins}:{String(breakSecs).padStart(2, "0")}
                </div>
                <p className="text-xs text-slate-400 mt-1">remaining</p>
              </div>
            ) : (
              <p className="text-sm font-semibold text-green-600 mb-6">Break time is up — you&apos;re good to go!</p>
            )}
            <button
              onClick={() => setShowBreak(false)}
              className={`w-full font-semibold py-3 rounded-2xl text-sm transition-all ${
                breakSeconds > 0
                  ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200"
              }`}
            >
              {breakSeconds > 0 ? "Skip break" : "Continue rating →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
