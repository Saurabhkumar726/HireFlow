import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EditJob() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    location: "",
    jobType: "",
    experienceLevel: "",
    description: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/Jobs/${id}`);

      const job = response.data;

      setFormData({
        title: job.title || "",
        companyName: job.companyName || "",
        location: job.location || "",
        jobType: job.jobType || "",
        experienceLevel: job.experienceLevel || "",
        description: job.description || "",
        isActive: job.isActive ?? true,
      });
    } catch (error) {
        console.error("FAILED TO UPDATE JOB");
        console.error("Status:", error.response?.status);
        console.error("Response:", error.response?.data);
        console.error("Full error:", error);

        setError(
            error.response?.data?.message ||
            error.response?.data?.title ||
            `Update failed. Status: ${error.response?.status || "Unknown"}`
        );

    } finally {
      setLoading(false);
    }
  };

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

    if (
      !formData.title.trim() ||
      !formData.companyName.trim() ||
      !formData.location.trim() ||
      !formData.jobType ||
      !formData.experienceLevel ||
      !formData.description.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setSaving(true);

      await api.put(`/Jobs/${id}`, {
        title: formData.title.trim(),
        companyName: formData.companyName.trim(),
        location: formData.location.trim(),
        jobType: formData.jobType,
        experienceLevel: formData.experienceLevel,
        description: formData.description.trim(),
        isActive: formData.isActive,
      });

      navigate("/recruiter/jobs");
    } catch (error) {
      console.error("Failed to update job:", error);

      setError(
        error.response?.data?.message ||
          "Unable to update job. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <div>
            <h1>HireFlow</h1>
            <p>Recruiter Dashboard</p>
          </div>

          <div className="header-right">
            <button
              className="header-button"
              onClick={() => navigate("/recruiter")}
            >
              Dashboard
            </button>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <main className="dashboard-content">
          <div className="loading-state">
            Loading job...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">

      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h1>HireFlow</h1>
          <p>Recruiter Dashboard</p>
        </div>

        <div className="header-right">
          <button
            className="header-button"
            onClick={() => navigate("/recruiter")}
          >
            Dashboard
          </button>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="dashboard-content">

        <div className="page-header">
          <div>
            <h2>Edit Job</h2>
            <p>
              Update the details of your job posting.
            </p>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form
          className="job-form-card"
          onSubmit={handleSubmit}
        >

          {/* Job Title */}
          <div className="form-group">
            <label htmlFor="title">
              Job Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Full Stack Developer"
            />
          </div>

          {/* Company Name */}
          <div className="form-group">
            <label htmlFor="companyName">
              Company Name
            </label>

            <input
              id="companyName"
              name="companyName"
              type="text"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g. HireFlow Technologies"
            />
          </div>

          {/* Location */}
          <div className="form-group">
            <label htmlFor="location">
              Location
            </label>

            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Indore"
            />
          </div>

          {/* Job Type */}
          <div className="form-group">
            <label htmlFor="jobType">
              Job Type
            </label>

            <select
              id="jobType"
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
            >
              <option value="">
                Select job type
              </option>

              <option value="Full-time">
                Full-time
              </option>

              <option value="Part-time">
                Part-time
              </option>

              <option value="Contract">
                Contract
              </option>

              <option value="Internship">
                Internship
              </option>
            </select>
          </div>

          {/* Experience Level */}
          <div className="form-group">
            <label htmlFor="experienceLevel">
              Experience Level
            </label>

            <select
              id="experienceLevel"
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
            >
              <option value="">
                Select experience level
              </option>

              <option value="Fresher">
                Fresher
              </option>

              <option value="Junior">
                Junior
              </option>

              <option value="Mid-level">
                Mid-level
              </option>

              <option value="Senior">
                Senior
              </option>
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">
              Job Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the role, responsibilities, requirements, etc."
              rows="8"
            />
          </div>

          {/* Active Status */}
          <div className="form-checkbox">
            <label>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((current) => ({
                    ...current,
                    isActive: e.target.checked,
                  }))
                }
              />

              <span>
                Job is active
              </span>
            </label>
          </div>

          {/* Buttons */}
          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/recruiter/jobs")}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving ? "Updating..." : "Update Job"}
            </button>

          </div>

        </form>

      </main>
    </div>
  );
}

export default EditJob;