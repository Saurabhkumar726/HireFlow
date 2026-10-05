import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import JobCard from "../components/JobCard";

function SavedJobs() {
  const navigate = useNavigate();

  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // CHECK LOGIN + LOAD SAVED JOBS
  // =========================================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    // No login information
    if (!storedUser || !token) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      // Only candidates can access Saved Jobs
      if (user.role !== "Candidate") {
        navigate("/login");
        return;
      }

      loadSavedJobs();
    } catch (error) {
      console.error("Invalid user data:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    }
  }, [navigate]);

  // =========================================================
  // LOAD SAVED JOBS
  // =========================================================

  const loadSavedJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/SavedJobs");

      setSavedJobs(response.data || []);
    } catch (error) {
      console.error("Failed to load saved jobs:", error);

      // Only logout if token is actually rejected
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load saved jobs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // REMOVE SAVED JOB
  // =========================================================

  const handleSavedChange = (jobId, isSaved) => {
    if (!isSaved) {
      setSavedJobs((current) =>
        current.filter(
          (item) => item.job.id !== jobId
        )
      );
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="dashboard">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="dashboard-header">

        <div>
          <h1>HireFlow</h1>

          <p>
            Candidate Portal
          </p>
        </div>

        <div className="header-right">

          {/* Dashboard */}

          <button
            type="button"
            className="header-button"
            onClick={() =>
              navigate("/candidate")
            }
          >
            Dashboard
          </button>


          {/* Browse Jobs */}

          <button
            type="button"
            className="header-button"
            onClick={() =>
              navigate("/candidate/jobs")
            }
          >
            Browse Jobs
          </button>


          {/* My Applications */}

          <button
            type="button"
            className="header-button"
            onClick={() =>
              navigate("/candidate/applications")
            }
          >
            My Applications
          </button>


          {/* Logout */}

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="dashboard-content">

        <div className="page-header">

          <div>

            <h2>
              Saved Jobs
            </h2>

            <p>
              Jobs you've saved for later.
            </p>

          </div>

        </div>


        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* ===================================================
            LOADING
        =================================================== */}

        {loading && (
          <div className="loading-state">
            Loading saved jobs...
          </div>
        )}


        {/* ===================================================
            EMPTY
        =================================================== */}

        {!loading &&
          !error &&
          savedJobs.length === 0 && (

            <div className="empty-state">

              <h3>
                No Saved Jobs
              </h3>

              <p>
                Save jobs you're interested in
                and find them here later.
              </p>

              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  navigate("/candidate/jobs")
                }
              >
                Browse Jobs
              </button>

            </div>
          )}


        {/* ===================================================
            SAVED JOBS
        =================================================== */}

        {!loading &&
          !error &&
          savedJobs.length > 0 && (

            <div className="candidate-jobs-list">

              {savedJobs.map((item) => {

                if (!item.job) {
                  return null;
                }

                return (
                  <JobCard
                    key={item.job.id}
                    job={item.job}
                    initialSaved={true}
                    onSavedChange={handleSavedChange}
                  />
                );
              })}

            </div>
          )}

      </main>

    </div>
  );
}

export default SavedJobs;