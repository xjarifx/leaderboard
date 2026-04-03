import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, Image } from "../lib/api";
import { logout, getParticipant, setCurrentSession, getCurrentSession } from "../lib/auth";

export default function Session() {
  const [currentImage, setCurrentImage] = useState<Image | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [ratedCount, setRatedCount] = useState(0);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(300);
  const participant = getParticipant();
  const navigate = useNavigate();

  const fetchCurrentImage = useCallback(async () => {
    let sessionId = getCurrentSession();
    
    if (!sessionId) {
      try {
        const sessions = await api.getSessions();
        const incomplete = sessions.find((s: { is_completed: boolean }) => !s.is_completed);
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
        alert(err instanceof Error ? err.message : "Failed to create session. Add images first.");
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

  const handleRate = async (rating: number) => {
    if (!currentImage || submitting) return;
    
    setSubmitting(true);
    const sessionId = getCurrentSession();
    if (!sessionId) return;

    try {
      await api.rateImage(sessionId, currentImage.id, rating);
      setSelectedRating(null);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">Welcome, {participant?.name}</p>
            <p className="text-sm text-gray-500">ID: {participant?.student_id}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/leaderboard"
              className="text-blue-500 hover:underline text-sm font-medium"
            >
              Leaderboard
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

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 flex flex-col">
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{progress.current} / {progress.total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>

        {currentImage && (
          <div className="flex-1 flex flex-col items-center">
            <div className="relative w-full max-w-lg">
              <img
                src={currentImage.image_url}
                alt={currentImage.celebrity_name}
                className="w-full rounded-xl shadow-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-xl">
                <p className="text-white text-xl font-medium text-center">
                  {currentImage.celebrity_name}
                </p>
              </div>
            </div>

            <div className="mt-8 w-full max-w-md">
              <p className="text-center text-gray-600 mb-4">How would you rate this person?</p>
              <div className="grid grid-cols-10 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setSelectedRating(rating)}
                    disabled={submitting}
                    className={`py-3 rounded-lg font-medium transition ${
                      selectedRating === rating
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                <span>Poor</span>
                <span>Average</span>
                <span>Good</span>
                <span>Great</span>
                <span>Perfect</span>
              </div>

              {selectedRating && (
                <button
                  onClick={() => handleRate(selectedRating)}
                  disabled={submitting}
                  className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : `Submit Rating (${selectedRating} - ${getRatingLabel(selectedRating)})`}
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {showBreakModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
            <div className="text-6xl mb-4">&#127881;</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Time for a Break!</h2>
            <p className="text-gray-600 mb-4">
              You've rated {ratedCount} images. Take a moment to rest your eyes.
            </p>
            <div className="text-4xl font-bold text-blue-500 mb-6">
              {formatTime(breakTimeLeft)}
            </div>
            <button
              onClick={() => setShowBreakModal(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition"
            >
              Continue Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
