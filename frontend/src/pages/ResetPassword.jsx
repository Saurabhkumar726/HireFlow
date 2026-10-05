import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Reset link is expected in the form:
  // /reset-password?token=xxxxx&email=someone@example.com
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError(
        "This reset link is invalid or missing. Please request a new one."
      );
      return;
    }

    if (!formData.password || !formData.confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/Auth/reset-password", {
        token,
        email,
        newPassword: formData.password,
      });

      setSuccess(
        "Your password has been reset successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Reset password failed:", error);

      if (error.response?.status === 400) {
        setError(
          error.response?.data?.message ||
            "This reset link has expired or is invalid. Please request a new one."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to reset password right now. Please try again."
        );
      }
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

        {/* Reset Password Card */}
        <div className="auth-card">

          <div className="auth-heading">

            <h2>
              Reset Password
            </h2>

            <p>
              Choose a new password for your account
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

              {/* New Password */}
              <div className="auth-form-group">

                <label htmlFor="password">
                  New Password
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    🔒
                  </span>

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    disabled={loading}
                  >
                    {showPassword ? "◉" : "◌"}
                  </button>

                </div>

              </div>

              {/* Confirm Password */}
              <div className="auth-form-group">

                <label htmlFor="confirmPassword">
                  Confirm New Password
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    🔒
                  </span>

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword ? "text" : "password"
                    }
                    placeholder="Re-enter new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) => !current
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    disabled={loading}
                  >
                    {showConfirmPassword ? "◉" : "◌"}
                  </button>

                </div>

              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;