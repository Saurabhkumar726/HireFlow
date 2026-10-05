import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import JobCard from "../components/JobCard";

function BrowseJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    jobType: "",
    experienceLevel: "",
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);


  // =========================================================
  // CHECK USER + LOAD DATA
  // =========================================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      if (user.role !== "Candidate") {
        navigate("/login");
        return;
      }

      loadJobs();
      loadSavedJobIds();
    } catch (error) {
      console.error("Invalid user data:", error);

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      navigate("/login");
    }
  }, [navigate, page]);


  // =========================================================
  // LOAD JOBS
  // =========================================================

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (filters.search.trim()) {
        params.append(
          "search",
          filters.search.trim()
        );
      }

      if (filters.location.trim()) {
        params.append(
          "location",
          filters.location.trim()
        );
      }

      if (filters.jobType) {
        params.append(
          "jobType",
          filters.jobType
        );
      }

      if (filters.experienceLevel) {
        params.append(
          "experienceLevel",
          filters.experienceLevel
        );
      }

      params.append("page", page);
      params.append("pageSize", 10);

      const response = await api.get(
        `/Jobs?${params.toString()}`
      );

      setJobs(response.data.jobs || []);

      setTotalPages(
        response.data.totalPages || 0
      );

    } catch (error) {
      console.error(
        "Failed to load jobs:",
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
          "Unable to load jobs. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // LOAD SAVED JOB IDS
  // =========================================================

  const loadSavedJobIds = async () => {
    try {
      const response = await api.get(
        "/SavedJobs/ids"
      );

      setSavedJobIds(
        response.data || []
      );

    } catch (error) {
      console.error(
        "Failed to load saved jobs:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
      }
    }
  };


  // =========================================================
  // SAVE STATE CHANGE
  // =========================================================

  const handleSavedChange = (
    jobId,
    isSaved
  ) => {
    setSavedJobIds((current) => {

      if (isSaved) {

        if (current.includes(jobId)) {
          return current;
        }

        return [
          ...current,
          jobId,
        ];
      }

      return current.filter(
        (id) => id !== jobId
      );
    });
  };


  // =========================================================
  // FILTER CHANGE
  // =========================================================

  const handleFilterChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  };


  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearch = (e) => {
    e.preventDefault();

    setPage(1);

    loadJobs();
  };


  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const handleClearFilters = () => {

    setFilters({
      search: "",
      location: "",
      jobType: "",
      experienceLevel: "",
    });

    setPage(1);

  };


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };


  return (
    <div className="dashboard">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="dashboard-header">

        <div>
          <h1>HireFlow</h1>
          <p>Candidate Portal</p>
        </div>


        <div className="header-right">

          <button
            className="header-button"
            onClick={() =>
              navigate("/candidate")
            }
          >
            Dashboard
          </button>


          <button
            className="header-button"
            onClick={() =>
              navigate("/candidate/saved-jobs")
            }
          >
            ♥ Saved Jobs
          </button>


          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="dashboard-content">

        <div className="page-header">

          <div>

            <h2>Browse Jobs</h2>

            <p>
              Find your next opportunity on HireFlow.
            </p>

          </div>

        </div>


        {/* ===================================================
            FILTERS
        =================================================== */}

        <form
          className="job-filters"
          onSubmit={handleSearch}
        >

          <div className="filter-group">

            <label htmlFor="search">
              Search
            </label>

            <input
              id="search"
              name="search"
              type="text"
              placeholder="Job title, company..."
              value={filters.search}
              onChange={handleFilterChange}
            />

          </div>


          <div className="filter-group">

            <label htmlFor="location">
              Location
            </label>

            <input
              id="location"
              name="location"
              type="text"
              placeholder="e.g. Indore"
              value={filters.location}
              onChange={handleFilterChange}
            />

          </div>


          <div className="filter-group">

            <label htmlFor="jobType">
              Job Type
            </label>

            <select
              id="jobType"
              name="jobType"
              value={filters.jobType}
              onChange={handleFilterChange}
            >

              <option value="">
                All Types
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


          <div className="filter-group">

            <label htmlFor="experienceLevel">
              Experience
            </label>

            <select
              id="experienceLevel"
              name="experienceLevel"
              value={filters.experienceLevel}
              onChange={handleFilterChange}
            >

              <option value="">
                All Levels
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


          <div className="filter-actions">

            <button
              type="submit"
              className="primary-button"
            >
              Search Jobs
            </button>


            <button
              type="button"
              className="cancel-button"
              onClick={handleClearFilters}
            >
              Clear
            </button>

          </div>

        </form>


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
            Loading jobs...
          </div>
        )}


        {/* ===================================================
            EMPTY
        =================================================== */}

        {!loading &&
          !error &&
          jobs.length === 0 && (

            <div className="empty-state">

              <h3>
                No Jobs Found
              </h3>

              <p>
                Try changing your search or filters.
              </p>

            </div>

          )}


        {/* ===================================================
            JOBS
        =================================================== */}

        {!loading &&
          !error &&
          jobs.length > 0 && (

            <div className="candidate-jobs-list">

              {jobs.map((job) => (

                <JobCard
                  key={job.id}
                  job={job}
                  initialSaved={savedJobIds.includes(
                    job.id
                  )}
                  onSavedChange={
                    handleSavedChange
                  }
                />

              ))}

            </div>

          )}


        {/* ===================================================
            PAGINATION
        =================================================== */}

        {!loading &&
          !error &&
          totalPages > 1 && (

            <div className="pagination">

              <button
                className="secondary-button"
                disabled={page === 1}
                onClick={() =>
                  setPage(
                    (current) =>
                      current - 1
                  )
                }
              >
                Previous
              </button>


              <span>
                Page {page} of {totalPages}
              </span>


              <button
                className="secondary-button"
                disabled={
                  page === totalPages
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      current + 1
                  )
                }
              >
                Next
              </button>

            </div>

          )}

      </main>

    </div>
  );
}

export default BrowseJobs;