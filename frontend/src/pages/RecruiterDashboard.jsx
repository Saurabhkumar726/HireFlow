import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


function RecruiterDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    if (parsedUser.role !== "Recruiter") {
      navigate("/login");
      return;
    }

    setUser(parsedUser);
    loadDashboard();
  }, [navigate]);

  const loadDashboard = async () => {
    try {
      const response = await api.get("/Dashboard/recruiter");
      setDashboard(response.data);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError("Unable to load recruiter dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard">

      <header className="dashboard-header">
        <div>
          <h1>HireFlow</h1>
          <p>Recruiter Dashboard</p>
        </div>

        <div className="header-right">
          <span>{user.fullName}</span>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">

        <section className="welcome-section">
          <h2>Welcome, {user.fullName} 👋</h2>

          <p>
            Manage your jobs and track candidate applications.
          </p>
        </section>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {dashboard && (
          <section className="stats-section">

            <div className="section-header">
              <h2>Application Overview</h2>
            </div>

            <div className="stats-grid">

              <div className="stat-card">
                <span>Total Applications</span>
                <strong>
                  {dashboard.totalApplications || 0}
                </strong>
              </div>

              <div className="stat-card">
                <span>Applied</span>
                <strong>
                  {dashboard.applied || 0}
                </strong>
              </div>

              <div className="stat-card">
                <span>Reviewing</span>
                <strong>
                  {dashboard.reviewing || 0}
                </strong>
              </div>

              <div className="stat-card">
                <span>Shortlisted</span>
                <strong>
                  {dashboard.shortlisted || 0}
                </strong>
              </div>

              <div className="stat-card">
                <span>Interview</span>
                <strong>
                  {dashboard.interview || 0}
                </strong>
              </div>

              <div className="stat-card">
                <span>Rejected</span>
                <strong>
                  {dashboard.rejected || 0}
                </strong>
              </div>

              <div className="stat-card">
                <span>Hired</span>
                <strong>
                  {dashboard.hired || 0}
                </strong>
              </div>

            </div>

          </section>
        )}

        <section className="recruiter-actions">

          <button
            className="primary-action"
            onClick={() => navigate("/recruiter/jobs")}
          >
            Manage Jobs
          </button>

          <button
            className="secondary-action"
            onClick={() => navigate("/recruiter/applications")}
          >
            View Applications
          </button>

        </section>

      </main>

    </div>
  );
}

export default RecruiterDashboard;