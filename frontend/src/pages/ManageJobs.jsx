import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ConfirmModal from "../components/ConfirmModal";

function ManageJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Confirm modal state — replaces window.confirm()
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    jobId: null,
    jobTitle: "",
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== "Recruiter") {
      navigate("/login");
      return;
    }

    loadJobs();
  }, [navigate]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/Jobs/stats");

      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error("Failed to load jobs:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load jobs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // Opens the confirm modal for deactivating a job.
  const handleDeactivateClick = (jobId, jobTitle) => {
    setActionError("");
    setConfirmModal({
      open: true,
      jobId,
      jobTitle,
    });
  };

  // Runs once the user confirms inside the modal.
  const handleConfirmDeactivate = async () => {
    try {
      setActionLoading(true);
      setActionError("");

      await api.delete(`/Jobs/${confirmModal.jobId}`);

      setConfirmModal({ open: false, jobId: null, jobTitle: "" });

      await loadJobs();
    } catch (error) {
      console.error("Failed to deactivate job:", error);

      setActionError(
        error.response?.data?.message ||
          "Unable to deactivate this job. Please try again."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelDeactivate = () => {
    if (actionLoading) {
      return;
    }

    setConfirmModal({ open: false, jobId: null, jobTitle: "" });
  };

  const handleActivate = async (jobId) => {
    try {
      setActionError("");

      await api.put(`/Jobs/${jobId}/activate`);

      await loadJobs();
    } catch (error) {
      console.error("Failed to activate job:", error);

      setActionError(
        error.response?.data?.message ||
          "Unable to activate this job. Please try again."
      );
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
            <h2>Manage Jobs</h2>

            <p>
              View and manage your job postings.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() =>
              navigate("/recruiter/jobs/create")
            }
          >
            + Create New Job
          </button>

        </div>

        {/* Loading */}
        {loading && (
          <div className="loading-state">
            Loading jobs...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Action error (activate/deactivate failures) */}
        {!loading && !error && actionError && (
          <div className="error-message">
            {actionError}
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          jobs.length === 0 && (
            <div className="empty-state">

              <h3>No Jobs Found</h3>

              <p>
                You have not created any job postings yet.
              </p>

              <button
                className="primary-button"
                onClick={() =>
                  navigate("/recruiter/jobs/create")
                }
              >
                Create Your First Job
              </button>

            </div>
          )}

        {/* Jobs */}
        {!loading &&
          !error &&
          jobs.length > 0 && (

            <div className="manage-jobs-list">

              {jobs.map((job) => {

                const jobId = job.jobId;

                return (
                  <div
                    className="manage-job-card"
                    key={jobId}
                  >

                    {/* Job Content */}
                    <div className="manage-job-content">

                      <div className="manage-job-title">

                        <h3>
                          {job.title}
                        </h3>

                        <span
                          className={`job-status ${
                            job.isActive
                              ? "active"
                              : "inactive"
                          }`}
                        >
                          {job.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </div>

                      <p className="company">
                        {job.companyName}
                      </p>

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

                      <div className="job-meta">

                        <span>
                          Applications:{" "}
                          <strong>
                            {job.totalApplications || 0}
                          </strong>
                        </span>

                        <span>
                          Created:{" "}
                          {job.createdAt
                            ? new Date(
                                job.createdAt
                              ).toLocaleDateString()
                            : "-"}
                        </span>

                      </div>

                    </div>

                    {/* Actions */}
                    <div className="manage-job-actions">

                      <button
                        className="secondary-button"
                        onClick={() =>
                          navigate(
                            `/recruiter/applications`
                          )
                        }
                      >
                        View Applications
                      </button>

                      <button
                        className="edit-button"
                        onClick={() =>
                          navigate(
                            `/recruiter/jobs/${jobId}/edit`
                          )
                        }
                      >
                        Edit
                      </button>

                      {job.isActive ? (

                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDeactivateClick(
                              jobId,
                              job.title
                            )
                          }
                        >
                          Deactivate
                        </button>

                      ) : (

                        <button
                          className="activate-button"
                          onClick={() =>
                            handleActivate(jobId)
                          }
                        >
                          Activate
                        </button>

                      )}

                    </div>

                  </div>
                );
              })}

            </div>
          )}

      </main>

      {/* Deactivate confirmation modal */}
      <ConfirmModal
        open={confirmModal.open}
        variant="danger"
        title="Deactivate this job?"
        message={
          confirmModal.jobTitle
            ? `"${confirmModal.jobTitle}" will no longer be visible to candidates. You can reactivate it anytime.`
            : "This job will no longer be visible to candidates. You can reactivate it anytime."
        }
        confirmLabel="Deactivate"
        cancelLabel="Cancel"
        loading={actionLoading}
        onConfirm={handleConfirmDeactivate}
        onCancel={handleCancelDeactivate}
      />

    </div>
  );
}

export default ManageJobs;