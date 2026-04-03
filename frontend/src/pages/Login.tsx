import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { setToken, setParticipant } from "../lib/auth";

export default function Login() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [announce, setAnnounce] = useState("");
  const navigate = useNavigate();
  const firstErrorRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setAnnounce("Signing in...");

    try {
      const { token, participant } = await api.login(studentId, password);
      setToken(token);
      setParticipant(participant);
      setAnnounce("Login successful. Redirecting...");
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
    <div className="auth-container" role="main" aria-labelledby="auth-title">
      <div className="auth-card">
        <span className="badge" aria-hidden="true">Welcome Back</span>
        <h1 id="auth-title" className="auth-title">Sign In</h1>
        <p className="auth-subtitle">Enter your credentials to continue</p>

        {error && (
          <div 
            ref={firstErrorRef}
            className="error-box" 
            role="alert" 
            aria-live="assertive"
            tabIndex={-1}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="studentId" className="label label-required">
              Student ID
            </label>
            <input
              ref={firstInputRef}
              id="studentId"
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="input"
              placeholder="Enter your student ID"
              required
              aria-required="true"
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="label label-required">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="Enter your password"
              required
              aria-required="true"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "8px" }}
            aria-describedby={loading ? "submit-status" : undefined}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
          
          {loading && (
            <span id="submit-status" className="sr-only">
              Signing in, please wait
            </span>
          )}
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Create one
          </Link>
        </p>
      </div>
      
      <div className="sr-only" role="status" aria-live="polite">
        {announce}
      </div>
    </div>
  );
}