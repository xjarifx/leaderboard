import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, Rating } from "../lib/api";
import { getCurrentSession, logout } from "../lib/auth";

export default function SessionComplete() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [announce, setAnnounce] = useState("");
  const navigate = useNavigate();
  const statusRef = useRef<HTMLDivElement>(null);

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
      <div className="loading" role="status" aria-live="polite">
        <div className="loading-spinner" aria-hidden="true" />
        <span className="sr-only">Loading session results...</span>
      </div>
    );
  }

  const averageRating =
    ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : "0";

  return (
    <div id="main-content" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <header className="header" role="banner">
        <div className="header-title">
          <h1>Session Complete</h1>
        </div>
<button onClick={handleLogout} className="btn btn-danger">
            Sign Out
          </button>
      </header>

      <main style={{ flex: 1 }} aria-label="Session results">
        <div ref={statusRef} className="section" style={{ textAlign: "center" }}>
          <span className="badge badge-success">Nice Work!</span>
          <h2 style={{ fontSize: "24px", marginTop: "16px", marginBottom: "8px" }}>
            Session Complete
          </h2>
          <p className="section-subtitle">Your ratings have been recorded</p>

          <div 
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "24px" }}
            role="region" 
            aria-label="Session statistics"
          >
            <div 
              style={{ padding: "20px", border: "1px solid var(--border)", background: "var(--bg-hover)" }}
              aria-label={`${ratings.length} images rated`}
            >
              <p style={{ fontSize: "32px", fontWeight: "700", color: "var(--brand)" }}>
                {ratings.length}
              </p>
              <p style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-secondary)", marginTop: "4px" }}>
                Images Rated
              </p>
            </div>
            <div 
              style={{ padding: "20px", border: "1px solid var(--border)", background: "var(--bg-hover)" }}
              aria-label={`Average rating ${averageRating}`}
            >
              <p style={{ fontSize: "32px", fontWeight: "700", color: "var(--success)" }}>
                {averageRating}
              </p>
              <p style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-secondary)", marginTop: "4px" }}>
                Avg Score
              </p>
            </div>
          </div>
        </div>

        <div className="section">
          <h3 className="section-title" id="ratings-heading">Your Ratings</h3>
          <p className="section-subtitle">Recap of your scored images</p>

          <div 
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}
            role="list" 
            aria-label="Rated images"
          >
            {ratings.map((rating) => (
              <figure 
                key={rating.id} 
                role="listitem"
                aria-label={`${rating.image.celebrity_name}: rated ${rating.rating} out of 10`}
                style={{ margin: 0 }}
              >
                <img
                  src={rating.image.image_url}
                  alt={`Photo of ${rating.image.celebrity_name}`}
                  style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }}
                />
                <figcaption 
                  style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.7)", padding: "4px", textAlign: "center" }}
                  aria-hidden="true"
                >
                  <span style={{ color: "white", fontSize: "12px", fontWeight: "600" }}>
                    {rating.rating}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <nav style={{ display: "flex", gap: "12px", justifyContent: "center" }} aria-label="Actions">
          <Link to="/leaderboard" className="btn btn-primary">
            View Leaderboard
          </Link>
          <button onClick={handleLogout} className="btn">
            Sign Out
          </button>
        </nav>
      </main>
      
      <div className="sr-only" role="status" aria-live="polite">
        {announce}
      </div>
    </div>
  );
}