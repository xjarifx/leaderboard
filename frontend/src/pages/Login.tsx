import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { setParticipant, setToken } from "../lib/auth";

export default function Login() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [announce, setAnnounce] = useState("");
  const navigate = useNavigate();
  const firstErrorRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setAnnounce("Signing in...");

    try {
      const { token, participant } = await api.login(studentId, password);
      setToken(token);
      setParticipant(participant);
      setAnnounce("Login successful. Redirecting to session.");
      navigate("/session");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      setAnnounce(`Error: ${message}`);
      firstErrorRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      id="main-content"
      className="screen screen-auth"
      aria-labelledby="login-title"
    >
      <section className="auth-layout">
        <section className="auth-card panel-glass" aria-label="Sign in form">
          <header className="section-head">
            <p className="section-kicker">Welcome Back</p>
            <h1 id="login-title" className="section-title">
              Sign in
            </h1>
          </header>

          {error ? (
            <div
              ref={firstErrorRef}
              className="error-box"
              role="alert"
              aria-live="assertive"
              tabIndex={-1}
            >
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="form-stack" noValidate>
            <div>
              <label htmlFor="studentId" className="field-label">
                Student ID
              </label>
              <input
                id="studentId"
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="field-input"
                placeholder="22-0000-0"
                autoComplete="username"
                required
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field-input"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-block"
            >
              {loading ? "Signing in..." : "Enter Session"}
            </button>
          </form>

          <p className="auth-footer">
            New participant?{" "}
            <Link to="/register" className="auth-link">
              Create account
            </Link>
          </p>
        </section>
      </section>

      <div className="sr-only" role="status" aria-live="polite">
        {announce}
      </div>
    </main>
  );
}
