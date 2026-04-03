import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, LeaderboardEntry } from "../lib/api";
import { logout } from "../lib/auth";

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getLeaderboard()
      .then(setEntries)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getScoreColor = (avg: number) => {
    if (avg >= 8) return "bg-green-500";
    if (avg >= 6) return "bg-blue-500";
    if (avg >= 4) return "bg-amber-500";
    return "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Celebrity Leaderboard</h1>
          <div className="flex items-center gap-4">
            <Link
              to="/session"
              className="text-blue-500 hover:underline text-sm font-medium"
            >
              Start Rating
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto w-full p-4">
        {entries.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <p className="text-gray-600">No ratings yet. Be the first to rate!</p>
            <Link
              to="/session"
              className="inline-block mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Start Rating
            </Link>
          </div>
        ) : (
          <>
            {entries.length >= 3 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">
                  Top 3 Celebrities
                </h2>
                <div className="flex items-end justify-center gap-4">
                  {[1, 0, 2].map((idx) => {
                    const entry = entries[idx];
                    const medals = ["&#129352;", "&#129351;", "&#129353;"];
                    const heights = ["h-32", "h-40", "h-28"];
                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <div
                          className={`w-24 ${heights[idx]} rounded-t-xl flex items-center justify-center`}
                          style={{ backgroundColor: ["#FFD700", "#C0C0C0", "#CD7F32"][idx] }}
                        >
                          <span dangerouslySetInnerHTML={{ __html: medals[idx] }} />
                        </div>
                        <div className="bg-gray-100 p-2 w-24 rounded-b-xl text-center">
                          <p className="font-bold text-sm truncate">{entry.celebrity_name}</p>
                          <p className="text-xs text-gray-600">{entry.average_rating.toFixed(1)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">All Rankings</h2>
              <div className="space-y-3">
                {entries.map((entry, idx) => (
                  <div
                    key={entry.image_id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-600">
                      #{idx + 1}
                    </div>
                    <img
                      src={entry.image_url}
                      alt={entry.celebrity_name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{entry.celebrity_name}</p>
                      <p className="text-xs text-gray-500">
                        {entry.rating_count} rating{entry.rating_count !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className={`${getScoreColor(entry.average_rating)} text-white px-3 py-1 rounded-full font-bold`}>
                      {entry.average_rating.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
