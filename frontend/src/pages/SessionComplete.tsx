import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, Rating } from "../lib/api";
import { getCurrentSession, logout } from "../lib/auth";

export default function SessionComplete() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = getCurrentSession();
    if (!sessionId) {
      navigate("/session");
      return;
    }

    api.getSessionRatings(sessionId)
      .then(setRatings)
      .catch(() => navigate("/session"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const averageRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : "0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Session Complete</h1>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto w-full p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-8">
          <div className="text-6xl mb-4">&#127881; &#127882; &#127881;</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Congratulations!
          </h2>
          <p className="text-gray-600 mb-6">
            You've completed your rating session!
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-4xl font-bold text-blue-600">
                {ratings.length}
              </p>
              <p className="text-sm text-gray-600">Images Rated</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-4xl font-bold text-green-600">
                {averageRating}
              </p>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Your Ratings</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ratings.map((rating) => (
              <div key={rating.id} className="relative">
                <img
                  src={rating.image.image_url}
                  alt={rating.image.celebrity_name}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-center py-1 rounded-b-lg">
                  <span className="font-bold">{rating.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            to="/leaderboard"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition"
          >
            View Leaderboard
          </Link>
          <button
            onClick={handleLogout}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition"
          >
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
