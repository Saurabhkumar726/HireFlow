import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";

import CandidateDashboard from "./pages/CandidateDashboard";
import JobDetails from "./pages/JobDetails";
import MyApplications from "./pages/MyApplications";
import SavedJobs from "./pages/SavedJobs";

import RecruiterDashboard from "./pages/RecruiterDashboard";
import ManageJobs from "./pages/ManageJobs";
import RecruiterApplications from "./pages/RecruiterApplications";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import BrowseJobs from "./pages/BrowseJobs";

import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import FAQ from "./pages/FAQ";

import "./App.css";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =========================
            Public
        ========================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/faq"
          element={<FAQ />}
        />

        {/* Terms & Privacy */}
        <Route
          path="/terms"
          element={<Terms />}
        />

        <Route
          path="/privacy"
          element={<Privacy />}
        />
        


        {/* =========================
            Candidate
        ========================= */}

        <Route
          path="/candidate"
          element={<CandidateDashboard />}
        />

        <Route
          path="/candidate/jobs"
          element={<BrowseJobs />}
        />

        <Route
          path="/candidate/jobs/:id"
          element={<JobDetails />}
        />

        <Route
          path="/candidate/applications"
          element={<MyApplications />}
        />

        <Route
          path="/candidate/saved-jobs"
          element={<SavedJobs />}
        />


        {/* =========================
            Recruiter
        ========================= */}

        <Route
          path="/recruiter"
          element={<RecruiterDashboard />}
        />

        <Route
          path="/recruiter/jobs"
          element={<ManageJobs />}
        />

        <Route
          path="/recruiter/jobs/create"
          element={<CreateJob />}
        />

        <Route
          path="/recruiter/jobs/:id/edit"
          element={<EditJob />}
        />

        <Route
          path="/recruiter/applications"
          element={<RecruiterApplications />}
        />


        {/* =========================
            Fallback
        ========================= */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;