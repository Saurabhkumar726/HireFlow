import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    location: "",
    jobType: "",
    experienceLevel: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    // Basic validation
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
      setLoading(true);

      await api.post("/Jobs", {
        title: formData.title.trim(),
        companyName: formData.companyName.trim(),
        location: formData.location.trim(),
        jobType: formData.jobType,
        experienceLevel: formData.experienceLevel,
        description: formData.description.trim(),
      });

      navigate("/recruiter/jobs");
    } catch (error) {
      console.error("Failed to create job:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to create job. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="dashboard-content">

        <div className="form-page-header">
          <div>
            <h2>Create New Job</h2>
            <p>Add a new job posting to HireFlow.</p>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="job-form-card">

          <form onSubmit={handleSubmit}>

            {/* Job Title */}
            <div className="form-group">
              <label htmlFor="title">
                Job Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. Full Stack Developer"
                value={formData.title}
                onChange={handleChange}
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
                placeholder="e.g. HireFlow Technologies"
                value={formData.companyName}
                onChange={handleChange}
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
                placeholder="e.g. Indore"
                value={formData.location}
                onChange={handleChange}
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

                <option value="Internship">
                  Internship
                </option>

                <option value="Contract">
                  Contract
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
                rows="7"
                placeholder="Describe the role, responsibilities, requirements, etc."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Actions */}
            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate("/recruiter/jobs")}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Job"}
              </button>

            </div>

          </form>

        </div>

      </main>
    </div>
  );
}

export default CreateJob;