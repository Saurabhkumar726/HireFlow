import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./JobCard.css";

function JobCard({
  job,
  initialSaved = false,
  onSavedChange,
}) {
  const navigate = useNavigate();

  const [saved, setSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);

  /*
  =========================================================
  SYNC SAVED STATE
  =========================================================

  This is important when the parent component loads saved
  job IDs after the JobCard has already rendered.
  */

  useEffect(() => {
    setSaved(initialSaved);
  }, [initialSaved]);


  /*
  =========================================================
  SAVE / UNSAVE JOB
  =========================================================
  */

  const handleSaveJob = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (saving || !job?.id) {
      return;
    }

    try {
      setSaving(true);

      if (saved) {
        /*
        Remove saved job
        */

        await api.delete(`/SavedJobs/${job.id}`);

        setSaved(false);

        if (onSavedChange) {
          onSavedChange(job.id, false);
        }

      } else {
        /*
        Save job
        */

        await api.post(`/SavedJobs/${job.id}`);

        setSaved(true);

        if (onSavedChange) {
          onSavedChange(job.id, true);
        }
      }

    } catch (error) {
      console.error(
        "Failed to update saved job:",
        error
      );

      /*
      =====================================================
      AUTH ERROR
      =====================================================
      */

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      /*
      If saving failed, keep the existing state.
      */
    } finally {
      setSaving(false);
    }
  };


  /*
  =========================================================
  VIEW JOB
  =========================================================
  */

  const handleViewJob = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!job?.id) {
      return;
    }

    navigate(`/candidate/jobs/${job.id}`);
  };


  /*
  =========================================================
  COMPANY INITIAL
  =========================================================
  */

  const getCompanyInitial = () => {
    if (!job?.companyName) {
      return "H";
    }

    return job.companyName
      .trim()
      .charAt(0)
      .toUpperCase();
  };


  /*
  =========================================================
  SAFETY
  =========================================================
  */

  if (!job) {
    return null;
  }


  /*
  =========================================================
  UI
  =========================================================
  */

  return (
    <article className="job-card">

      {/* =================================================
          TOP
      ================================================= */}

      <div className="job-card-top">

        {/* Company Logo / Initial */}

        <div
          className="job-company-logo"
          aria-label={`${job.companyName || "HireFlow"} logo`}
        >
          {getCompanyInitial()}
        </div>


        {/* Save Job */}

        <button
          type="button"
          className={`save-job-btn ${
            saved ? "saved" : ""
          }`}
          onClick={handleSaveJob}
          disabled={saving}
          aria-label={
            saved
              ? "Remove job from saved jobs"
              : "Save job"
          }
          title={
            saved
              ? "Remove from saved jobs"
              : "Save job"
          }
        >
          {saving ? (
            <span className="save-job-loading">
              ...
            </span>
          ) : (
            saved ? "♥" : "♡"
          )}
        </button>

      </div>


      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="job-card-content">

        {/* Job Title */}

        <h3 className="job-title">
          {job.title}
        </h3>


        {/* Company */}

        <p className="job-company">
          {job.companyName}
        </p>


        {/* =================================================
            JOB META
        ================================================= */}

        <div className="job-meta">

          {job.location && (
            <span>
              📍 {job.location}
            </span>
          )}

          {job.jobType && (
            <span>
              💼 {job.jobType}
            </span>
          )}

          {job.experienceLevel && (
            <span>
              🎓 {job.experienceLevel}
            </span>
          )}

        </div>


        {/* =================================================
            DESCRIPTION
        ================================================= */}

        {job.description && (
          <p className="job-description">
            {job.description}
          </p>
        )}

      </div>


      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="job-card-footer">

        <span className="job-posted">

          Posted{" "}

          {job.createdAt
            ? new Date(
                job.createdAt
              ).toLocaleDateString()
            : "-"}

        </span>


        {/* View Details */}

        <button
          type="button"
          className="view-job-btn"
          onClick={handleViewJob}
        >
          View Details →
        </button>

      </div>

    </article>
  );
}

export default JobCard;