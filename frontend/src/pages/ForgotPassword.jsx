import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/Auth/forgot-password", {
        email: email.trim(),
      });

      // Always show a generic success message, whether or not
      // the email exists in the system — this avoids leaking
      // which emails are registered.
      setSuccess(
        "If an account exists for that email, we've sent a password reset link. Please check your inbox."
      );
    } catch (error) {
      console.error("Forgot password request failed:", error);

      setError(
        error.response?.data?.message ||
          "Unable to send reset link right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* Background decoration */}
      <div className="auth-decoration auth-decoration-one"></div>
      <div className="auth-decoration auth-decoration-two"></div>

      <div className="auth-container">

        {/* Logo */}
        <div className="auth-brand">

          <div className="brand-logo">
            <span>H</span>
          </div>

          <h1>
            Hire<span>Flow</span>
          </h1>

          <p>
            Find Jobs. Hire Talent. Grow Together.
          </p>

        </div>

        {/* Forgot Password Card */}
        <div className="auth-card">

          <div className="auth-heading">

            <h2>
              Forgot Password?
            </h2>

            <p>
              Enter your email and we'll send you a link to reset your password
            </p>

          </div>

          {/* Error */}
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="auth-success">
              {success}
            </div>
          )}

          {/* Form */}
          {!success && (
            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div className="auth-form-group">

                <label htmlFor="email">
                  Email
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    ✉
                  </span>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleChange}
                    autoComplete="email"
                    disabled={loading}
                  />

                </div>

              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

            </form>
          )}

          {/* Back to login */}
          <div className="signup-prompt">

            <span>
              Remembered your password?
            </span>

            <button
              type="button"
              onClick={() => navigate("/login")}
              disabled={loading}
            >
              Back to Login
            </button>

          </div>

        </div>

        {/* Footer */}
        <p className="auth-footer">
          © 2026 HireFlow. All rights reserved.
        </p>

      </div>
    </div>
  );
}

export default ForgotPassword;