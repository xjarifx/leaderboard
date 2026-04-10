import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { setToken, setParticipant } from "../lib/auth";

export default function Register() {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER" | "">("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [announce, setAnnounce] = useState("");
  const navigate = useNavigate();
  const firstErrorRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      const message = "Passwords do not match";
      setError(message);
      setAnnounce(`Error: ${message}`);
      firstErrorRef.current?.focus();
      return;
    }

    if (!gender) {
      const message = "Please select your gender";
      setError(message);
      setAnnounce(`Error: ${message}`);
      firstErrorRef.current?.focus();
      return;
    }

    setLoading(true);
    setAnnounce("Creating account...");

    try {
      const { token, participant } = await api.register(
        studentId,
        name,
        password,
        gender,
      );
      setToken(token);
      setParticipant(participant);
      setAnnounce("Account created. Redirecting...");
      navigate("/session");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
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
        <span className="badge" aria-hidden="true">
          Join Now
        </span>
        <h1 id="auth-title" className="auth-title">
          Create Account
        </h1>
        <p className="auth-subtitle">Fill in your details to get started</p>

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
            />
          </div>

          <div className="form-group">
            <label htmlFor="name" className="label label-required">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="Enter your full name"
              required
              aria-required="true"
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender" className="label label-required">
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) =>
                setGender(e.target.value as "MALE" | "FEMALE" | "OTHER" | "")
              }
              className="input"
              required
              aria-required="true"
            >
              <option value="" disabled>
                Select your gender
              </option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
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
              placeholder="Create a password"
              required
              aria-required="true"
              autoComplete="new-password"
              minLength={6}
              aria-describedby="password-hint"
            />
            <span id="password-hint" className="sr-only">
              Must be at least 6 characters
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="label label-required">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              placeholder="Confirm your password"
              required
              aria-required="true"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "8px" }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>

      <div className="sr-only" role="status" aria-live="polite">
        {announce}
      </div>
    </div>
  );
}
