import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CandidateDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.role !== "Candidate") {
        navigate("/login");
        return;
      }

      setUser(parsedUser);
      loadJobs();
    } catch (error) {
      console.error(error);

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/Jobs");

      setJobs(response.data.jobs || response.data);
    } catch (error) {
      console.error("Error loading jobs:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load jobs."
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

  const handleViewDetails = (jobId) => {
    navigate(`/candidate/jobs/${jobId}`);
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="dashboard">

      {/* Header */}
      <header className="dashboard-header">

        <div>
          <h1>HireFlow</h1>
          <p>Candidate Dashboard</p>
        </div>

        <div className="header-right">

          <span>{user.fullName}</span>

          {/* Browse Jobs */}
          <button
            className="header-button"
            onClick={() => navigate("/candidate/jobs")}
          >
            Browse Jobs
          </button>

          {/* My Applications */}
          <button
            className="header-button"
            onClick={() =>
              navigate("/candidate/applications")
            }
          >
            My Applications
          </button>

          {/* Logout */}
          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>

      {/* Main Content */}
      <main className="dashboard-content">

        {/* Welcome */}
        <section className="welcome-section">

          <h2>
            Welcome, {user.fullName} 👋
          </h2>

          <p>
            Find your next opportunity and manage your applications.
          </p>

        </section>

        {/* Jobs */}
        <section className="jobs-section">

          <div className="section-header">

            <h2>Available Jobs</h2>

            <span>
              {jobs.length}{" "}
              {jobs.length === 1 ? "Job" : "Jobs"}
            </span>

          </div>

          {/* Loading */}
          {loading && (
            <p>Loading jobs...</p>
          )}

          {/* Error */}
          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {/* No Jobs */}
          {!loading &&
            !error &&
            jobs.length === 0 && (
              <p>
                No jobs available right now.
              </p>
            )}

          {/* Job Cards */}
          {!loading &&
            !error &&
            jobs.length > 0 && (

              <div className="jobs-grid">

                {jobs.map((job) => {

                  const jobId = job.id || job.jobId;

                  return (
                    <div
                      className="job-card"
                      key={jobId}
                    >

                      <h3>
                        {job.title}
                      </h3>

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

                      <p className="job-description">
                        {job.description}
                      </p>

                      <button
                        onClick={() =>
                          handleViewDetails(jobId)
                        }
                      >
                        View Details
                      </button>

                    </div>
                  );
                })}

              </div>
            )}

        </section>

      </main>

    </div>
  );
}

export default CandidateDashboard;