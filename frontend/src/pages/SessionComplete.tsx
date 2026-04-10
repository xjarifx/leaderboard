import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, Rating } from "../lib/api";
import { getCurrentSession, logout } from "../lib/auth";

export default function SessionComplete() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [announce, setAnnounce] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = getCurrentSession();
    if (!sessionId) {
      navigate("/session");
      return;
    }

    api
      .getSessionRatings(sessionId)
      .then((data) => {
        setRatings(data);
        setAnnounce(`Session complete. You rated ${data.length} images.`);
      })
      .catch(() => {
        setAnnounce("Failed to load session results");
        navigate("/session");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="loading-screen" role="status" aria-live="polite">
        <div className="panel-glass loading-card">
          <div className="spinner" aria-hidden="true" />
          <strong>Loading summary</strong>
          <p className="section-copy">Preparing your completed session.</p>
        </div>
      </div>
    );
  }

  const averageRating =
    ratings.length > 0
      ? (
          ratings.reduce((sum, rating) => sum + rating.rating, 0) /
          ratings.length
        ).toFixed(1)
      : "0";

  return (
    <main id="main-content" className="screen" aria-label="Session complete">
      <header className="hero-head panel-glass">
        <div className="hero-meta">
          <p className="section-kicker">Completed</p>
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-ghost"
          >
            Sign Out
          </button>
        </div>
        <div>
          <h1 className="display-title">Session complete</h1>
          <p className="section-copy">
            Your ratings are saved and ready to compare on the leaderboard.
          </p>
        </div>
      </header>

      <section className="stats-grid" aria-label="Session stats">
        <article className="stat-card panel-glass">
          <span className="stat-label">Images Rated</span>
          <p className="stat-value">{ratings.length}</p>
        </article>
        <article className="stat-card panel-glass">
          <span className="stat-label">Average Score</span>
          <p className="stat-value">{averageRating}</p>
        </article>
      </section>

      <section className="panel-glass">
        <div className="btn-row">
          <Link to="/leaderboard" className="btn btn-primary">
            View leaderboard
          </Link>
          <Link to="/session" className="btn btn-secondary">
            Back to session
          </Link>
        </div>
      </section>

      <section className="panel-glass">
        <div>
          <h2 className="section-title">Your ratings</h2>
          <p className="section-copy">A compact recap of this session.</p>
        </div>
        <div className="grid-results" role="list" style={{ marginTop: "14px" }}>
          {ratings.map((rating, index) => (
            <article
              key={rating.id}
              className="result-card panel-soft"
              role="listitem"
            >
              <img
                src={rating.image.image_url}
                alt={`${rating.image.celebrity_name} rated ${rating.rating}`}
              />
              <div className="result-body">
                <h3 className="list-name">{rating.image.celebrity_name}</h3>
                <p className="list-meta">Image {index + 1}</p>
                <div className="score-pill" style={{ marginTop: "10px" }}>
                  <span className="score-value">{rating.rating}</span>
                  <span className="score-caption">Your score</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="sr-only" role="status" aria-live="polite">
        {announce}
      </div>
    </main>
  );
}
