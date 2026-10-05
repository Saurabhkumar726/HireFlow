import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Candidate",
  });

  const [agreeTerms, setAgreeTerms] = useState(false);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
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

    if (!agreeTerms) {
      setError(
        "Please agree to the Terms & Privacy Policy."
      );
      return;
    }

    try {
      setLoading(true);

      await api.post("/Auth/register", {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error("Signup failed:", error);

      setError(
        error.response?.data?.message ||
          "Unable to create account. Please try again."
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

        {/* Brand */}
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


        {/* Signup Card */}
        <div className="auth-card signup-card">

          <div className="auth-heading">

            <h2>
              Create your HireFlow account
            </h2>

            <p>
              Join HireFlow and get started today
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


          <form onSubmit={handleSubmit}>

            {/* =================================================
                ROLE
            ================================================= */}

            <div className="auth-form-group">

              <label>
                I want to
              </label>

              <div className="role-options">

                {/* Candidate */}
                <label
                  className={`role-option ${
                    formData.role === "Candidate"
                      ? "selected"
                      : ""
                  }`}
                >

                  <input
                    type="radio"
                    name="role"
                    value="Candidate"
                    checked={
                      formData.role === "Candidate"
                    }
                    onChange={handleChange}
                  />

                  <span className="role-content">

                    <strong>
                      I'm a Candidate
                    </strong>

                    <small>
                      I'm looking for job opportunities
                    </small>

                  </span>

                </label>


                {/* Employer */}
                <label
                  className={`role-option ${
                    formData.role === "Recruiter"
                      ? "selected"
                      : ""
                  }`}
                >

                  <input
                    type="radio"
                    name="role"
                    value="Recruiter"
                    checked={
                      formData.role === "Recruiter"
                    }
                    onChange={handleChange}
                  />

                  <span className="role-content">

                    <strong>
                      I'm an Employer
                    </strong>

                    <small>
                      I'm looking for talented candidates
                    </small>

                  </span>

                </label>

              </div>

            </div>


            {/* =================================================
                FULL NAME
            ================================================= */}

            <div className="auth-form-group">

              <label htmlFor="fullName">
                Full Name
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  👤
                </span>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                />

              </div>

            </div>


            {/* =================================================
                EMAIL
            ================================================= */}

            <div className="auth-form-group">

              <label htmlFor="signup-email">
                Email
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  ✉
                </span>

                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />

              </div>

            </div>


            {/* =================================================
                PASSWORD
            ================================================= */}

            <div className="auth-form-group">

              <label htmlFor="signup-password">
                Password
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  id="signup-password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "◉" : "◌"}
                </button>

              </div>

            </div>


            {/* =================================================
                CONFIRM PASSWORD
            ================================================= */}

            <div className="auth-form-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
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
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? "◉" : "◌"}
                </button>

              </div>

            </div>


            {/* =================================================
                TERMS & PRIVACY
            ================================================= */}

            <div className="terms-checkbox">

              <label>

                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) =>
                    setAgreeTerms(e.target.checked)
                  }
                />

                <span className="terms-checkmark"></span>

                <span className="terms-text">
                  I agree to{" "}
                  <button
  type="button"
  className="terms-link"
  onClick={() => navigate("/terms")}
>
  Terms
</button>

{" & "}

<button
  type="button"
  className="terms-link"
  onClick={() => navigate("/privacy")}
>
  Privacy
</button>
                </span>

              </label>

            </div>


            {/* =================================================
                CREATE ACCOUNT
            ================================================= */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>


          {/* =================================================
              LOGIN
          ================================================= */}

          <div className="signup-prompt">

            <span>
              Already have an account?
            </span>

            <button
              type="button"
              onClick={() => navigate("/login")}
            >
              Sign in
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

export default Signup;