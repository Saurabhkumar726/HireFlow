import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function RecruiterApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const statuses = [
    "Applied",
    "Reviewing",
    "Shortlisted",
    "Interview",
    "Rejected",
    "Hired",
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      if (user.role !== "Recruiter") {
        navigate("/login");
        return;
      }

      loadApplications();
    } catch (error) {
      console.error("Invalid user data:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    }
  }, [navigate]);

  // Load recruiter applications
  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * We first get recruiter jobs.
       * Then we get applications for each job.
       *
       * This keeps the frontend compatible with:
       * GET /api/Jobs
       * GET /api/JobApplications/job/{jobId}
       */

      const jobsResponse = await api.get("/Jobs");

      const jobs =
        jobsResponse.data?.jobs ||
        jobsResponse.data ||
        [];

      if (!Array.isArray(jobs) || jobs.length === 0) {
        setApplications([]);
        return;
      }

      const applicationRequests = jobs.map(async (job) => {
        const jobId = job.id || job.jobId;

        if (!jobId) {
          return [];
        }

        try {
          const response = await api.get(
            `/JobApplications/job/${jobId}`
          );

          const data = response.data;

          const jobApplications =
            data?.applications || [];

          return jobApplications.map((application) => ({
            ...application,

            // Make sure job information is always available
            job:
              application.job ||
              data?.job ||
              job,
          }));
        } catch (error) {
          /*
           * If one job fails, don't stop all applications
           * from loading.
           */
          console.error(
            `Unable to load applications for job ${jobId}:`,
            error
          );

          // Authentication error should still be handled
          if (error.response?.status === 401) {
            throw error;
          }

          return [];
        }
      });

      const results = await Promise.all(
        applicationRequests
      );

      const allApplications = results.flat();

      // Newest applications first
      allApplications.sort((a, b) => {
        const dateA = a.appliedAt
          ? new Date(a.appliedAt).getTime()
          : 0;

        const dateB = b.appliedAt
          ? new Date(b.appliedAt).getTime()
          : 0;

        return dateB - dateA;
      });

      setApplications(allApplications);
    } catch (error) {
      console.error(
        "Failed to load recruiter applications:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load applications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Update application status
  const updateStatus = async (
    applicationId,
    newStatus
  ) => {
    if (!applicationId || !newStatus) {
      return;
    }

    try {
      await api.put(
        `/JobApplications/${applicationId}/status`,
        newStatus,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update UI immediately
      setApplications((previousApplications) =>
        previousApplications.map((application) =>
          application.applicationId === applicationId
            ? {
                ...application,
                status: newStatus,
              }
            : application
        )
      );
    } catch (error) {
      console.error(
        "Failed to update application status:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      alert(
        error.response?.data?.message ||
          "Unable to update application status."
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const getStatusClass = (status) => {
    if (!status) {
      return "status-badge";
    }

    return `status-badge status-${status
      .toLowerCase()
      .replace(/\s+/g, "-")}`;
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
            className="secondary-action"
            onClick={() => navigate("/recruiter")}
          >
            Dashboard
          </button>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

      </header>

      {/* Main */}
      <main className="dashboard-content">

        {/* Page Introduction */}
        <section className="welcome-section">

          <h2>Applications</h2>

          <p>
            Review candidates and manage their
            application status.
          </p>

        </section>

        {/* Error */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading">
            Loading applications...
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          applications.length === 0 && (
            <div className="empty-state">

              <h3>No applications yet</h3>

              <p>
                Applications from candidates will
                appear here.
              </p>

            </div>
          )}

        {/* Applications */}
        {!loading &&
          !error &&
          applications.length > 0 && (
            <section className="applications-section">

              <div className="section-header">

                <h2>Your Applications</h2>

                <span>
                  {applications.length}{" "}
                  Application
                  {applications.length !== 1
                    ? "s"
                    : ""}
                </span>

              </div>

              <div className="applications-list">

                {applications.map((application) => (

                  <div
                    className="application-card"
                    key={application.applicationId}
                  >

                    {/* Candidate + Job */}
                    <div className="application-main">

                      {/* Candidate */}
                      <div className="candidate-info">

                        <h3>
                          {application.candidate
                            ?.fullName ||
                            application.user
                              ?.fullName ||
                            "Unknown Candidate"}
                        </h3>

                        <p>
                          {application.candidate
                            ?.email ||
                            application.user
                              ?.email ||
                            "No email available"}
                        </p>

                      </div>

                      {/* Job */}
                      <div className="application-job">

                        <h4>
                          {application.job?.title ||
                            "Unknown Job"}
                        </h4>

                        <p>
                          {application.job
                            ?.companyName || ""}
                        </p>

                      </div>

                    </div>

                    {/* Application Details */}
                    <div className="application-details">

                      <div>

                        <span className="detail-label">
                          Applied
                        </span>

                        <span>
                          {application.appliedAt
                            ? new Date(
                                application.appliedAt
                              ).toLocaleDateString()
                            : "-"}
                        </span>

                      </div>

                      <div>

                        <span className="detail-label">
                          Status
                        </span>

                        <span
                          className={getStatusClass(
                            application.status
                          )}
                        >
                          {application.status ||
                            "Applied"}
                        </span>

                      </div>

                    </div>

                    {/* Actions */}
                    <div className="application-actions">

                      {/* Resume */}
                      {application.resumeUrl ? (
                        <a
                          href={
                            application.resumeUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="resume-button"
                        >
                          View Resume
                        </a>
                      ) : (
                        <span>
                          No resume
                        </span>
                      )}

                      {/* Status */}
                      <select
                        value={
                          application.status ||
                          "Applied"
                        }
                        onChange={(event) =>
                          updateStatus(
                            application.applicationId,
                            event.target.value
                          )
                        }
                      >
                        {statuses.map((status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ))}
                      </select>

                    </div>

                    {/* Cover Letter */}
                    {application.coverLetter && (
                      <div className="cover-letter">

                        <h4>
                          Cover Letter
                        </h4>

                        <p>
                          {application.coverLetter}
                        </p>

                      </div>
                    )}

                  </div>

                ))}

              </div>

            </section>
          )}

      </main>

    </div>
  );
}

export default RecruiterApplications;