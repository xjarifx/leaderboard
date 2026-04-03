import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Session from "./pages/Session";
import SessionComplete from "./pages/SessionComplete";
import Leaderboard from "./pages/Leaderboard";
import { getToken } from "./lib/auth";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  const isAuthenticated = Boolean(getToken());

  return (
    <div className="page-container">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/session"
          element={
            <ProtectedRoute>
              <Session />
            </ProtectedRoute>
          }
        />
        <Route
          path="/session/complete"
          element={
            <ProtectedRoute>
              <SessionComplete />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/session" : "/login"} replace />
          }
        />
      </Routes>
    </div>
  );
}

export default App;