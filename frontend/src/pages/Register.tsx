import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { setParticipant, setToken } from "../lib/auth";

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
      setAnnounce("Account created. Redirecting to session.");
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
    <main
      id="main-content"
      className="screen screen-auth"
      aria-labelledby="register-title"
    >
      <section className="auth-layout">
        <section
          className="auth-card panel-glass"
          aria-label="Create account form"
        >
          <header className="section-head">
            <p className="section-kicker">New Participant</p>
            <h1 id="register-title" className="section-title">
              Create account
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
              />
            </div>

            <div>
              <label htmlFor="name" className="field-label">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="field-input"
                placeholder="Your full name"
                autoComplete="name"
                required
              />
            </div>

            <div>
              <label htmlFor="gender" className="field-label">
                Gender
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) =>
                  setGender(e.target.value as "MALE" | "FEMALE" | "OTHER" | "")
                }
                className="field-select"
                required
              >
                <option value="">Choose one</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
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
                placeholder="At least 6 characters"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="field-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="field-input"
                placeholder="Repeat your password"
                autoComplete="new-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-block"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="auth-footer">
            Already registered?{" "}
            <Link to="/login" className="auth-link">
              Sign in
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
