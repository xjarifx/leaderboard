import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, LeaderboardEntry } from "../lib/api";
import { logout } from "../lib/auth";

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [announce, setAnnounce] = useState("");
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <div className="loading-screen" role="status" aria-live="polite">
        <div className="panel-glass loading-card">
          <div className="spinner" aria-hidden="true" />
          <strong>Loading leaderboard</strong>
          <p className="section-copy">Syncing the latest results.</p>
        </div>
      </div>
    );
  }

  return (
    <main id="main-content" className="screen" aria-label="Leaderboard">
      <header className="hero-head panel-glass">
        <div className="hero-meta">
          <p className="section-kicker">Leaderboard</p>
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-ghost"
          >
            Sign Out
          </button>
        </div>
        <div>
          <h1 className="display-title">Live ranking</h1>
          <p className="section-copy">
            Compare average image scores and track the strongest performers.
          </p>
        </div>
      </header>

      <nav className="top-nav panel-glass" aria-label="Primary">
        <Link to="/session" className="tab-link">
          Rate
        </Link>
        <Link
          to="/leaderboard"
          className="tab-link is-active"
          aria-current="page"
        >
          Leaderboard
        </Link>
      </nav>

      {entries.length === 0 ? (
        <section className="panel-glass">
          <h2 className="section-title">No ratings yet</h2>
          <p className="section-copy">
            Start a session to populate the leaderboard.
          </p>
          <div className="btn-row" style={{ marginTop: "12px" }}>
            <Link to="/session" className="btn btn-primary">
              Start rating
            </Link>
          </div>
        </section>
      ) : (
        <>
          <section className="stats-grid" aria-label="Leaderboard stats">
            <article className="stat-card panel-glass">
              <span className="stat-label">Entries</span>
              <p className="stat-value">{entries.length}</p>
            </article>
            <article className="stat-card panel-glass">
              <span className="stat-label">Top score</span>
              <p className="stat-value">
                {entries[0]?.average_rating.toFixed(1)}
              </p>
            </article>
          </section>

          <section className="panel-glass">
            <div>
              <h2 className="section-title">All participants</h2>
              <p className="section-copy">
                Ranked by average rating, highest first.
              </p>
            </div>
            <div
              className="list-stack"
              role="list"
              style={{ marginTop: "14px" }}
            >
              {entries.map((entry, index) => (
                <article
                  key={entry.image_index}
                  className="list-card panel-soft"
                  role="listitem"
                >
                  <div className="list-rank" aria-hidden="true">
                    {index + 1}
                  </div>
                  <img src={entry.image_url} alt={entry.celebrity_name} />
                  <div>
                    <h3 className="list-name">{entry.celebrity_name}</h3>
                    <p className="list-meta">
                      {entry.rating_count} rating
                      {entry.rating_count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="score-pill">
                    <span className="score-value">
                      {entry.average_rating.toFixed(1)}
                    </span>
                    <span className="score-caption">Score</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}

      <div className="sr-only" role="status" aria-live="polite">
        {announce}
      </div>
    </main>
  );
}
