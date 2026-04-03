import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, LeaderboardEntry } from "../lib/api";
import { logout } from "../lib/auth";

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [announce, setAnnounce] = useState("");
  const navigate = useNavigate();
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    api
      .getLeaderboard()
      .then((data) => {
        setEntries(data);
        setAnnounce(`Leaderboard loaded with ${data.length} entries`);
      })
      .catch((err) => {
        console.error(err);
        setAnnounce("Failed to load leaderboard");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRankClass = (rank: number) => {
    if (rank === 1) return "rank-1";
    if (rank === 2) return "rank-2";
    if (rank === 3) return "rank-3";
    return "";
  };

  if (loading) {
    return (
      <div className="loading" role="status" aria-live="polite">
        <div className="loading-spinner" aria-hidden="true" />
        <span className="sr-only">Loading leaderboard...</span>
      </div>
    );
  }

  return (
    <div id="main-content" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <header className="header" role="banner">
        <div className="header-title">
          <span className="badge" aria-hidden="true">Live Results</span>
          <h1>Leaderboard</h1>
        </div>
        <nav className="header-actions" aria-label="Main navigation">
          <Link to="/session" className="btn">
            Rate
          </Link>
          <button onClick={handleLogout} className="btn btn-danger">
            Sign Out
          </button>
        </nav>
      </header>

      {entries.length === 0 ? (
        <div className="section" style={{ textAlign: "center" }}>
          <h2 className="section-title">No Ratings Yet</h2>
          <p className="section-subtitle">Be the first to rate images this session</p>
          <Link to="/session" className="btn btn-primary">
            Start Rating
          </Link>
        </div>
      ) : (
        <main style={{ flex: 1 }} aria-label="Leaderboard rankings">
          {entries.length >= 3 && (
            <div className="section">
              <h2 className="section-title" id="top3-heading">Top 3</h2>
              <p className="section-subtitle">Highest average scores</p>

              <div className="top-grid" role="list" aria-label="Top 3 celebrities">
                {[0, 1, 2].map((idx) => {
                  const entry = entries[idx];
                  return (
                    <article 
                      key={entry.image_id} 
                      className="top-item"
                      role="listitem"
                      aria-label={`Rank ${idx + 1}: ${entry.celebrity_name}, average rating ${entry.average_rating.toFixed(1)} from ${entry.rating_count} ratings`}
                    >
                      <img
                        src={entry.image_url}
                        alt={`Photo of ${entry.celebrity_name}`}
                        className="top-item-image"
                      />
                      <div className="top-item-content">
                        <div 
                          className={`rank-badge ${getRankClass(idx + 1)}`} 
                          style={{ marginBottom: "8px", display: "inline-flex" }}
                          aria-hidden="true"
                        >
                          #{idx + 1}
                        </div>
                        <p className="top-item-name">{entry.celebrity_name}</p>
                        <p className="top-item-meta">
                          {entry.rating_count} rating{entry.rating_count !== 1 ? "s" : ""}
                        </p>
                        <div 
                          className="score-pill" 
                          style={{ marginTop: "8px" }}
                          aria-label={`Average rating: ${entry.average_rating.toFixed(1)} out of 10`}
                        >
                          {entry.average_rating.toFixed(1)}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          <div className="section">
            <h2 className="section-title" id="all-rankings-heading">All Rankings</h2>
            <p className="section-subtitle">{entries.length} entries</p>

            <table 
              ref={tableRef}
              aria-labelledby="all-rankings-heading"
              aria-describedby="table-desc"
            >
              <caption id="table-desc" className="sr-only">
                Complete leaderboard rankings showing all celebrities with their average ratings and number of ratings
              </caption>
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">Celebrity</th>
                  <th scope="col">Ratings</th>
                  <th scope="col">Avg Score</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => (
                  <tr key={entry.image_id}>
                    <td>
                      <span 
                        className={`rank-badge ${getRankClass(idx + 1)}`}
                        aria-label={`Rank ${idx + 1}`}
                      >
                        {idx + 1}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <img
                          src={entry.image_url}
                          alt=""
                          style={{ width: "48px", height: "48px", objectFit: "cover" }}
                          aria-hidden="true"
                        />
                        <span>{entry.celebrity_name}</span>
                      </div>
                    </td>
                    <td>{entry.rating_count}</td>
                    <td>
                      <span 
                        className="score-pill"
                        aria-label={`Average rating: ${entry.average_rating.toFixed(1)}`}
                      >
                        {entry.average_rating.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      )}
      
      <div className="sr-only" role="status" aria-live="polite">
        {announce}
      </div>
    </div>
  );
}