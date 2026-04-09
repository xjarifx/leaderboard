import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, Image } from "../lib/api";
import {
  logout,
  getParticipant,
  setCurrentSession,
  getCurrentSession,
} from "../lib/auth";

export default function Session() {
  const [currentImage, setCurrentImage] = useState<Image | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [ratedCount, setRatedCount] = useState(0);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(300);
  const [announce, setAnnounce] = useState("");
  const participant = getParticipant();
  const navigate = useNavigate();
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);

  const fetchCurrentImage = useCallback(async () => {
    let sessionId = getCurrentSession();

    if (!sessionId) {
      try {
        const sessions = await api.getSessions();
        const incomplete = sessions.find(
          (s: { is_completed: boolean }) => !s.is_completed,
        );
        if (incomplete) {
          sessionId = incomplete.id;
          setCurrentSession(sessionId);
        }
      } catch {
        // No sessions yet
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
    if (!showBreakModal) return;

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

  useEffect(() => {
    if (submitButtonRef.current) {
      submitButtonRef.current.focus();
    }
  }, [selectedRating]);

  const handleRate = async (rating: number) => {
    if (!currentImage || submitting) return;

    setSubmitting(true);
    setAnnounce(`Rating ${rating} submitted`);
    const sessionId = getCurrentSession();
    if (!sessionId) return;

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
    if (rating <= 3) return "Poor";
    if (rating <= 5) return "Average";
    if (rating <= 7) return "Good";
    if (rating <= 9) return "Great";
    return "Perfect";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setSelectedRating(value);
    setAnnounce(`Rating ${value} selected`);
  };

  if (loading) {
    return (
      <div className="loading" role="status" aria-live="polite">
        <div className="loading-spinner" aria-hidden="true" />
        <span className="sr-only">Loading current image...</span>
      </div>
    );
  }

  return (
    <div
      id="main-content"
      style={{ flex: 1, display: "flex", flexDirection: "column" }}
    >
      <header className="header" role="banner">
        <div className="header-title">
          <span className="badge" aria-hidden="true">
            Active Session
          </span>
          <h1>{participant?.name}</h1>
          <p>ID: {participant?.student_id}</p>
        </div>
        <nav className="header-actions" aria-label="Main navigation">
          <Link to="/leaderboard" className="btn">
            Rankings
          </Link>
          <button onClick={handleLogout} className="btn btn-danger">
            Sign Out
          </button>
        </nav>
      </header>

      <main
        style={{ flex: 1, paddingBottom: "80px" }}
        aria-label="Rating session"
      >
        <div className="section" role="status" aria-live="polite">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              Progress
            </span>
            <span style={{ fontSize: "13px", fontWeight: "600" }}>
              {progress.current} of {progress.total}
            </span>
          </div>
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow={progress.current}
            aria-valuemin={0}
            aria-valuemax={progress.total}
            aria-label="Session progress"
          >
            <div
              className="progress-fill"
              style={{
                width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        <div className="rating-layout">
          {currentImage && (
            <div
              className="section image-section"
              style={{ padding: 0, overflow: "hidden" }}
            >
              <img
                src={currentImage.image_url}
                alt={`Image ${progress.current}`}
                style={{ width: "100%", display: "block" }}
              />
              <div style={{ padding: "16px", textAlign: "center" }}>
                <h2 style={{ fontSize: "18px" }}>
                  Image #{progress.current}
                </h2>
              </div>
            </div>
          )}

          <div className="section rating-section">
            <h3 className="section-title" id="rating-heading">
              Rate This Person
            </h3>
            <p className="section-subtitle">Drag to select a score</p>

            <div className="slider-container">
              <input
                ref={sliderRef}
                type="range"
                min="1"
                max="10"
                value={selectedRating}
                onChange={handleSliderChange}
                className="simple-slider"
                aria-label={`Rating: ${selectedRating} out of 10`}
                aria-valuemin={1}
                aria-valuemax={10}
                aria-valuenow={selectedRating}
              />

              <div className="slider-value-display" aria-live="polite">
                <span className="slider-number">{selectedRating}</span>
                <span className="slider-label">
                  {getRatingLabel(selectedRating)}
                </span>
              </div>
            </div>

            <div className="fixed-bottom">
              <div className="submit-container">
                <button
                  ref={submitButtonRef}
                  onClick={() => handleRate(selectedRating)}
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                  aria-describedby="submit-desc"
                >
                  {submitting
                    ? "Submitting..."
                    : `Submit ${selectedRating} - ${getRatingLabel(selectedRating)}`}
                </button>
                <span id="submit-desc" className="sr-only">
                  Submit your rating of {selectedRating} for image {progress.current}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showBreakModal && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="break-title"
        >
          <div className="modal">
            <span className="badge" aria-hidden="true">
              Take a Break
            </span>
            <h2 id="break-title" className="modal-title">
              You've rated {ratedCount} images
            </h2>
            <p className="modal-text">Take a moment to rest your eyes</p>
            <div className="modal-timer" aria-live="polite" aria-atomic="true">
              {formatTime(breakTimeLeft)}
            </div>
            <button
              onClick={() => {
                setShowBreakModal(false);
                setAnnounce("Break ended. Continue rating.");
              }}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <div className="sr-only" role="status" aria-live="polite">
        {announce}
      </div>
    </div>
  );
}
