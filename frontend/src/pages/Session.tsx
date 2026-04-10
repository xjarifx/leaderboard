import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, Image } from "../lib/api";
import {
  getCurrentSession,
  getParticipant,
  logout,
  setCurrentSession,
} from "../lib/auth";

const QUICK_RATINGS = [1, 3, 5, 7, 10];

export default function Session() {
  const [currentImage, setCurrentImage] = useState<Image | null>(null);
  const [selectedRating, setSelectedRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [ratedCount, setRatedCount] = useState(0);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(300);
  const [announce, setAnnounce] = useState("");
  const participant = getParticipant();
  const navigate = useNavigate();

  const fetchCurrentImage = useCallback(async () => {
    let sessionId = getCurrentSession();

    if (!sessionId) {
      try {
        const sessions = await api.getSessions();
        const incomplete = sessions.find((s) => !s.is_completed);
        if (incomplete) {
          sessionId = incomplete.id;
          setCurrentSession(sessionId);
        }
      } catch {
        // Fall back to creating a session below.
      }
    }

    if (!sessionId) {
      try {
        const session = await api.createSession();
        sessionId = session.id;
        setCurrentSession(sessionId);
      } catch (err) {
        alert(
          err instanceof Error
            ? err.message
            : "Failed to create session. Add images first.",
        );
        setLoading(false);
        return;
      }
    }

    try {
      const data = await api.getCurrentImage(sessionId);
      if (data.completed) {
        navigate("/session/complete");
        return;
      }
      if (data.currentImage) {
        setCurrentImage(data.currentImage);
        setProgress(data.progress || { current: 0, total: 0 });
        setRatedCount(data.ratedCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch current image:", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCurrentImage();
  }, [fetchCurrentImage]);

  useEffect(() => {
    if (ratedCount > 0 && ratedCount % 10 === 0) {
      setShowBreakModal(true);
      setBreakTimeLeft(300);
    }
  }, [ratedCount]);

  useEffect(() => {
    if (!showBreakModal) {
      return;
    }

    const timer = setInterval(() => {
      setBreakTimeLeft((prev) => {
        if (prev <= 1) {
          setShowBreakModal(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showBreakModal]);

  const handleRate = async (rating: number) => {
    if (!currentImage || submitting) {
      return;
    }

    setSubmitting(true);
    setAnnounce(`Rating ${rating} submitted`);
    const sessionId = getCurrentSession();
    if (!sessionId) {
      setSubmitting(false);
      return;
    }

    try {
      await api.rateImage(sessionId, currentImage.id, rating);
      setRatedCount((prev) => prev + 1);
      await fetchCurrentImage();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRatingLabel = (rating: number) => {
    if (rating <= 2) return "Very low";
    if (rating <= 4) return "Low";
    if (rating <= 6) return "Average";
    if (rating <= 8) return "High";
    return "Very high";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="loading-screen" role="status" aria-live="polite">
        <div className="panel-glass loading-card">
          <div className="spinner" aria-hidden="true" />
          <strong>Loading session</strong>
          <p className="section-copy">Getting the next image.</p>
        </div>
      </div>
    );
  }

  const progressPercent =
    progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  return (
    <main
      id="main-content"
      className="screen session-screen"
      aria-label="Rating session"
    >
      <header className="hero-head panel-glass session-hero">
        <div className="hero-meta">
          <p className="section-kicker">Active Session</p>
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-ghost"
          >
            Sign Out
          </button>
        </div>
        <div>
          <h1 className="display-title">
            {participant?.name ?? "Participant"}
          </h1>
          <p className="section-copy">
            ID {participant?.student_id ?? "N/A"} • Rate one image at a time.
          </p>
        </div>
      </header>

      <nav className="top-nav panel-glass session-nav" aria-label="Primary">
        <Link to="/session" className="tab-link is-active" aria-current="page">
          Rate
        </Link>
        <Link to="/leaderboard" className="tab-link">
          Leaderboard
        </Link>
      </nav>

      <section className="panel-glass metrics-panel session-metrics">
        <div className="metric-row">
          <div>
            <h2 className="section-title">Progress</h2>
            <p className="section-copy">
              {progress.current} of {progress.total} images
            </p>
          </div>
          <span className="metric-value">{ratedCount} rated</span>
        </div>
        <div
          className="metric-bar"
          role="progressbar"
          aria-valuenow={progress.current}
          aria-valuemin={0}
          aria-valuemax={progress.total}
          aria-label="Session progress"
        >
          <div
            className="metric-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </section>

      <section className="two-column session-workspace">
        {currentImage ? (
          <article className="image-stage panel-glass">
            <img
              src={currentImage.image_url}
              alt={`${currentImage.celebrity_name} for rating`}
            />
            <div className="image-body">
              <h2 className="image-name">{currentImage.celebrity_name}</h2>
              <p className="image-meta">Current image in your queue</p>
            </div>
          </article>
        ) : null}

        <article className="panel-glass rating-card">
          <div>
            <h2 className="section-title">Your score</h2>
            <p className="section-copy">Choose from 1 to 10.</p>
          </div>

          <input
            type="range"
            min="1"
            max="10"
            value={selectedRating}
            onChange={(e) => setSelectedRating(Number(e.target.value))}
            className="range-input"
            aria-label={`Rating ${selectedRating} out of 10`}
          />

          <div className="rating-summary" aria-live="polite">
            <div>
              <p className="rating-score">{selectedRating}</p>
              <p className="rating-label">{getRatingLabel(selectedRating)}</p>
            </div>
            <div className="score-pill">
              <span className="score-value">
                {Math.round(progressPercent)}%
              </span>
              <span className="score-caption">Complete</span>
            </div>
          </div>

          <div className="rating-quick" aria-label="Quick ratings">
            {QUICK_RATINGS.map((rating) => (
              <button
                key={rating}
                type="button"
                className={`chip ${selectedRating === rating ? "is-selected" : ""}`}
                onClick={() => setSelectedRating(rating)}
              >
                {rating}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleRate(selectedRating)}
            disabled={submitting || !currentImage}
            className="btn btn-primary btn-block"
          >
            {submitting ? "Submitting..." : `Submit rating ${selectedRating}`}
          </button>
        </article>
      </section>

      {showBreakModal ? (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="break-title"
        >
          <div className="modal-card panel-glass">
            <p className="section-kicker">Break</p>
            <h2 id="break-title">Pause for a moment</h2>
            <p>
              You have rated {ratedCount} images. Take a short rest, then
              continue.
            </p>
            <div className="timer-box" aria-live="polite" aria-atomic="true">
              <span className="timer-value">{formatTime(breakTimeLeft)}</span>
              <span className="section-copy">Recommended break time</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowBreakModal(false);
                setAnnounce("Break ended. Continue rating.");
              }}
              className="btn btn-primary btn-block"
            >
              Continue
            </button>
          </div>
        </div>
      ) : null}

      <div className="sr-only" role="status" aria-live="polite">
        {announce}
      </div>
    </main>
  );
}
