import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

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

  // Normal email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/Auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      const token = response.data.token;
      const user = response.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "Recruiter") {
        navigate("/recruiter");
      } else {
        navigate("/candidate");
      }
    } catch (error) {
      console.error("Login failed:", error);

      if (error.response?.status === 401) {
        setError(
          error.response?.data?.message ||
            "Invalid email or password. Please try again."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to login. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");

    if (!credentialResponse?.credential) {
      setError("Google login failed. Please try again.");
      return;
    }

    try {
      setGoogleLoading(true);

      const response = await api.post("/Auth/google", {
        credential: credentialResponse.credential,
      });

      const token = response.data.token;
      const user = response.data.user;

      if (!token || !user) {
        setError("Invalid response from server.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "Recruiter") {
        navigate("/recruiter");
      } else {
        navigate("/candidate");
      }
    } catch (error) {
      console.error("Google login failed:", error);

      if (error.response?.status === 401) {
        setError(
          error.response?.data?.message ||
            "Google authentication failed."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to login with Google. Please try again."
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setGoogleLoading(false);
    setError("Google login failed. Please try again.");
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

        {/* Login Card */}
        <div className="auth-card">

          <div className="auth-heading">

            <h2>
              Welcome to HireFlow
            </h2>

            <p>
              Login to your account to continue
            </p>

          </div>

          {/* Error */}
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {/* Email/Password Form */}
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
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={loading || googleLoading}
                />

              </div>

            </div>

            {/* Password */}
            <div className="auth-form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={loading || googleLoading}
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
                  disabled={loading || googleLoading}
                >
                  {showPassword ? "◉" : "◌"}
                </button>

              </div>

              <div className="forgot-password">

                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  disabled={loading || googleLoading}
                >
                  Forgot Password?
                </button>

              </div>

            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="login-button"
              disabled={loading || googleLoading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* Divider */}
          <div className="auth-divider">

            <span></span>

            <p>OR</p>

            <span></span>

          </div>

          {/* Google Login */}
          <div className="google-login-wrapper">

            {googleLoading ? (
              <button
                type="button"
                className="google-button"
                disabled
              >
                Connecting to Google...
              </button>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false}
                text="continue_with"
                shape="rectangular"
                size="large"
              />
            )}

          </div>

          {/* Signup */}
          <div className="signup-prompt">

            <span>
              New to HireFlow?
            </span>

            <button
              type="button"
              onClick={() => navigate("/signup")}
              disabled={loading || googleLoading}
            >
              Sign Up
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

export default Login;