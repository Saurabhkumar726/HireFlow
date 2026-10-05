import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function MyApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/JobApplications/my");

      setApplications(response.data || []);
    } catch (error) {
      console.error("Failed to load applications:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load your applications."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Applied":
        return "status-applied";

      case "Reviewing":
        return "status-reviewing";

      case "Shortlisted":
        return "status-shortlisted";

      case "Interview":
        return "status-interview";

      case "Hired":
        return "status-hired";

      case "Rejected":
        return "status-rejected";

      default:
        return "";
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-GB");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="dashboard">

      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h1>HireFlow</h1>
          <p>Candidate Dashboard</p>
        </div>

        <div className="header-right">

          <button
            className="secondary-action"
            onClick={() => navigate("/candidate")}
          >
            Jobs
          </button>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>
      </header>

      {/* Main */}
      <main className="dashboard-content">

        {/* Page Heading */}
        <section className="welcome-section">
          <h2>My Applications</h2>

          <p>
            Track the status of your job applications.
          </p>
        </section>

        {/* Loading */}
        {loading && (
          <div className="loading">
            Loading applications...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading &&
          !error &&
          applications.length === 0 && (
            <div className="empty-state">

              <h3>No applications yet</h3>

              <p>
                You haven't applied for any jobs yet.
              </p>

              <button
                onClick={() => navigate("/candidate")}
              >
                Browse Jobs
              </button>

            </div>
          )}

        {/* Applications */}
        {!loading &&
          !error &&
          applications.length > 0 && (
            <section className="applications-section">

              {/* Section Header */}
              <div className="section-header">

                <h2>Your Applications</h2>

                <span>
                  {applications.length} Application
                  {applications.length !== 1 ? "s" : ""}
                </span>

              </div>

              {/* Application Cards */}
              <div className="applications-grid">

                {applications.map((application) => {

                  const job = application.job;

                  return (
                    <article
                      className="application-card"
                      key={application.applicationId}
                    >

                      {/* Job Title */}
                      <div className="application-header">

                        <div className="application-title">

                          <h3>
                            {job?.title || "Job Application"}
                          </h3>

                          <p className="company">
                            {job?.companyName || "Company"}
                          </p>

                        </div>

                      </div>

                      {/* Status */}
                      <div className="application-status">

                        <span
                          className={`status-badge ${getStatusClass(
                            application.status
                          )}`}
                        >
                          {application.status || "Applied"}
                        </span>

                      </div>

                      {/* Job Information */}
                      <div className="application-info">

                        <p>
                          <span className="info-icon">📍</span>
                          {job?.location || "N/A"}
                        </p>

                        <p>
                          <span className="info-icon">💼</span>
                          {job?.jobType || "N/A"}
                        </p>

                        <p>
                          <span className="info-icon">🎓</span>
                          {job?.experienceLevel || "N/A"}
                        </p>

                      </div>

                      {/* Footer */}
                      <div className="application-footer">

                        <span>
                          Applied on{" "}
                          {formatDate(application.appliedAt)}
                        </span>

                        <button
                          type="button"
                          className="view-job-button"
                          onClick={() =>
                            navigate(
                              `/candidate/jobs/${application.jobId}`
                            )
                          }
                        >
                          View Job
                        </button>

                      </div>

                    </article>
                  );
                })}

              </div>

            </section>
          )}

      </main>

    </div>
  );
}

export default MyApplications;