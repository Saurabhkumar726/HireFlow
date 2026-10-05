import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showApplyForm, setShowApplyForm] = useState(false);

  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/Jobs/${id}`);

      setJob(response.data.job || response.data);
    } catch (error) {
      console.error("Failed to load job:", error);

      if (error.response?.status === 404) {
        setError("Job not found or no longer available.");
      } else {
        setError("Unable to load job details.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenApply = () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      if (user.role !== "Candidate") {
        setApplyError(
          "Only candidates can apply for jobs."
        );
        return;
      }

      setApplyError("");
      setSuccess("");
      setShowApplyForm(true);
    } catch (error) {
      console.error(error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();

    setApplyError("");
    setSuccess("");

    const cleanResumeUrl = resumeUrl.trim();
    const cleanCoverLetter = coverLetter.trim();

    if (!cleanResumeUrl) {
      setApplyError("Please enter your resume URL.");
      return;
    }

    if (!cleanCoverLetter) {
      setApplyError("Please enter your cover letter.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post(
        "/JobApplications",
        {
          jobId: Number(id),
          resumeUrl: cleanResumeUrl,
          coverLetter: cleanCoverLetter,
        }
      );

      setSuccess(
        response.data?.message ||
          "Job application submitted successfully."
      );

      setResumeUrl("");
      setCoverLetter("");
      setShowApplyForm(false);
    } catch (error) {
      console.error("Application error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setApplyError(
        error.response?.data?.message ||
          "Unable to submit application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (submitting) {
      return;
    }

    setShowApplyForm(false);
    setApplyError("");
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">
          Loading job details...
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="page-container">

        <div className="error-message">
          {error || "Job not found."}
        </div>

        <button
          className="back-button"
          onClick={() => navigate("/candidate")}
        >
          ← Back to Jobs
        </button>

      </div>
    );
  }

  return (
    <div className="page-container">

      {/* Back */}
      <button
        className="back-button"
        onClick={() => navigate("/candidate")}
      >
        ← Back to Jobs
      </button>

      {/* Job Details */}
      <div className="job-details-card">

        <h1>{job.title}</h1>

        <h2 className="company">
          {job.companyName}
        </h2>

        <div className="job-info">

          <span>
            📍 {job.location}
          </span>

          <span>
            💼 {job.jobType}
          </span>

          <span>
            🎓 {job.experienceLevel}
          </span>

        </div>

        <hr />

        {/* Description */}
        <h2>Job Description</h2>

        <p className="job-description">
          {job.description}
        </p>

        {/* Success */}
        {success && (
          <div className="success-message">

            <p>{success}</p>

            <button
              className="secondary-button"
              onClick={() =>
                navigate("/candidate/applications")
              }
            >
              View My Applications
            </button>

          </div>
        )}

        {/* Error */}
        {applyError && (
          <div className="error-message">
            {applyError}
          </div>
        )}

        {/* Apply button */}
        {!showApplyForm && !success && (
          <button
            className="apply-button"
            onClick={handleOpenApply}
          >
            Apply Now
          </button>
        )}

        {/* Application Form */}
        {showApplyForm && !success && (
          <div className="application-form">

            <h2>Apply for this Job</h2>

            <p>
              Submit your resume and cover letter
              to apply for this position.
            </p>

            <form onSubmit={handleApply}>

              {/* Resume */}
              <div className="form-group">

                <label htmlFor="resumeUrl">
                  Resume URL
                </label>

                <input
                  id="resumeUrl"
                  type="url"
                  value={resumeUrl}
                  onChange={(e) =>
                    setResumeUrl(e.target.value)
                  }
                  placeholder="https://example.com/resume.pdf"
                  disabled={submitting}
                  required
                />

              </div>

              {/* Cover Letter */}
              <div className="form-group">

                <label htmlFor="coverLetter">
                  Cover Letter
                </label>

                <textarea
                  id="coverLetter"
                  value={coverLetter}
                  onChange={(e) =>
                    setCoverLetter(e.target.value)
                  }
                  placeholder="Write your cover letter..."
                  rows="7"
                  disabled={submitting}
                  required
                />

              </div>

              {/* Actions */}
              <div className="form-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleCancel}
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="apply-button"
                  disabled={submitting}
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Application"}
                </button>

              </div>

            </form>

          </div>
        )}

      </div>
    </div>
  );
}

export default JobDetails;