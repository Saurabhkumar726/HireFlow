using HireFlow.API.Data;
using HireFlow.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HireFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class JobApplicationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public JobApplicationsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // =========================================================
    // POST: api/JobApplications
    // Candidate applies for a job
    // =========================================================
    [HttpPost]
    [Authorize(Roles = "Candidate")]
    public async Task<IActionResult> ApplyForJob(
        [FromBody] CreateJobApplicationRequest request)
    {
        var userIdClaim = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new
            {
                message = "Invalid user token."
            });
        }

        if (request == null)
        {
            return BadRequest(new
            {
                message = "Application data is required."
            });
        }

        if (request.JobId <= 0)
        {
            return BadRequest(new
            {
                message = "Valid JobId is required."
            });
        }

        if (string.IsNullOrWhiteSpace(request.ResumeUrl))
        {
            return BadRequest(new
            {
                message = "Resume URL is required."
            });
        }

        if (string.IsNullOrWhiteSpace(request.CoverLetter))
        {
            return BadRequest(new
            {
                message = "Cover letter is required."
            });
        }

        var job = await _context.Jobs
            .FirstOrDefaultAsync(j => j.Id == request.JobId);

        if (job == null || !job.IsActive)
        {
            return NotFound(new
            {
                message = "Job not found or inactive."
            });
        }

        var alreadyApplied = await _context.JobApplications
            .AnyAsync(a =>
                a.JobId == request.JobId &&
                a.UserId == userId);

        if (alreadyApplied)
        {
            return BadRequest(new
            {
                message = "You have already applied for this job."
            });
        }

        var application = new Models.JobApplication
        {
            JobId = request.JobId,
            UserId = userId,
            ResumeUrl = request.ResumeUrl.Trim(),
            CoverLetter = request.CoverLetter.Trim(),
            Status = "Applied",
            AppliedAt = DateTime.UtcNow
        };

        _context.JobApplications.Add(application);

        await _context.SaveChangesAsync();

        var candidate = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (candidate == null)
        {
            return NotFound(new
            {
                message = "Candidate user not found."
            });
        }

        return Ok(new
        {
            message = "Job application submitted successfully.",

            application = new
            {
                applicationId = application.Id,
                jobId = application.JobId,

                candidate = new
                {
                    id = candidate.Id,
                    fullName = candidate.FullName,
                    email = candidate.Email
                },

                resumeUrl = application.ResumeUrl,
                coverLetter = application.CoverLetter,
                status = application.Status,
                appliedAt = application.AppliedAt
            }
        });
    }


    // =========================================================
    // GET: api/JobApplications/my
    // Get applications of currently logged-in candidate
    // =========================================================
    [HttpGet("my")]
    [Authorize(Roles = "Candidate")]
    public async Task<IActionResult> GetMyApplications()
    {
        var userIdClaim = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new
            {
                message = "Invalid user token."
            });
        }

        var applications = await _context.JobApplications
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.AppliedAt)
            .Select(a => new
            {
                applicationId = a.Id,
                jobId = a.JobId,

                job = new
                {
                    id = a.Job!.Id,
                    title = a.Job.Title,
                    companyName = a.Job.CompanyName,
                    location = a.Job.Location,
                    jobType = a.Job.JobType,
                    experienceLevel = a.Job.ExperienceLevel
                },

                resumeUrl = a.ResumeUrl,
                coverLetter = a.CoverLetter,
                status = a.Status,
                appliedAt = a.AppliedAt
            })
            .ToListAsync();

        return Ok(applications);
    }


    // =========================================================
    // GET: api/JobApplications/job/{jobId}
    // Recruiter/Admin gets applications for a specific job
    // =========================================================
    [HttpGet("job/{jobId:int}")]
    [Authorize(Roles = "Recruiter,Admin")]
    public async Task<IActionResult> GetJobApplications(int jobId)
    {
        var job = await _context.Jobs
            .FirstOrDefaultAsync(j => j.Id == jobId);

        if (job == null)
        {
            return NotFound(new
            {
                message = "Job not found."
            });
        }

        var applications = await _context.JobApplications
            .Where(a => a.JobId == jobId)
            .OrderByDescending(a => a.AppliedAt)
            .Select(a => new
            {
                applicationId = a.Id,
                jobId = a.JobId,

                candidate = new
                {
                    id = a.User!.Id,
                    fullName = a.User.FullName,
                    email = a.User.Email
                },

                resumeUrl = a.ResumeUrl,
                coverLetter = a.CoverLetter,
                status = a.Status,
                appliedAt = a.AppliedAt
            })
            .ToListAsync();

        return Ok(new
        {
            job = new
            {
                id = job.Id,
                title = job.Title,
                companyName = job.CompanyName
            },

            totalApplications = applications.Count,

            applications
        });
    }


    // =========================================================
    // GET: api/JobApplications/recruiter
    // Recruiter/Admin gets ALL applications
    // =========================================================
    [HttpGet("recruiter")]
    [Authorize(Roles = "Recruiter,Admin")]
    public async Task<IActionResult> GetRecruiterApplications()
    {
        var applications = await _context.JobApplications
            .OrderByDescending(a => a.AppliedAt)
            .Select(a => new
            {
                applicationId = a.Id,
                jobId = a.JobId,

                candidate = new
                {
                    id = a.User!.Id,
                    fullName = a.User.FullName,
                    email = a.User.Email
                },

                job = new
                {
                    id = a.Job!.Id,
                    title = a.Job.Title,
                    companyName = a.Job.CompanyName,
                    location = a.Job.Location,
                    jobType = a.Job.JobType,
                    experienceLevel = a.Job.ExperienceLevel
                },

                resumeUrl = a.ResumeUrl,
                coverLetter = a.CoverLetter,
                status = a.Status,
                appliedAt = a.AppliedAt
            })
            .ToListAsync();

        return Ok(new
        {
            totalApplications = applications.Count,
            applications
        });
    }


    // =========================================================
    // GET: api/JobApplications/stats
    // Recruiter/Admin application statistics
    // =========================================================
    [HttpGet("stats")]
    [Authorize(Roles = "Recruiter,Admin")]
    public async Task<IActionResult> GetApplicationStats()
    {
        var totalApplications = await _context.JobApplications
            .CountAsync();

        var applied = await _context.JobApplications
            .CountAsync(a => a.Status == "Applied");

        var reviewing = await _context.JobApplications
            .CountAsync(a => a.Status == "Reviewing");

        var shortlisted = await _context.JobApplications
            .CountAsync(a => a.Status == "Shortlisted");

        var interview = await _context.JobApplications
            .CountAsync(a => a.Status == "Interview");

        var rejected = await _context.JobApplications
            .CountAsync(a => a.Status == "Rejected");

        var hired = await _context.JobApplications
            .CountAsync(a => a.Status == "Hired");

        return Ok(new
        {
            totalApplications,
            applied,
            reviewing,
            shortlisted,
            interview,
            rejected,
            hired
        });
    }


    // =========================================================
    // PUT: api/JobApplications/{id}/status
    // Recruiter/Admin updates application status
    // =========================================================
    [HttpPut("{id:int}/status")]
    [Authorize(Roles = "Recruiter,Admin")]
    public async Task<IActionResult> UpdateApplicationStatus(
        int id,
        [FromBody] string status)
    {
        var application = await _context.JobApplications
            .Include(a => a.User)
            .Include(a => a.Job)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (application == null)
        {
            return NotFound(new
            {
                message = "Job application not found."
            });
        }

        var allowedStatuses = new[]
        {
            "Applied",
            "Reviewing",
            "Shortlisted",
            "Interview",
            "Rejected",
            "Hired"
        };

        if (string.IsNullOrWhiteSpace(status))
        {
            return BadRequest(new
            {
                message = "Application status is required.",
                allowedStatuses
            });
        }

        status = status.Trim();

        var matchedStatus = allowedStatuses
            .FirstOrDefault(s =>
                s.Equals(
                    status,
                    StringComparison.OrdinalIgnoreCase));

        if (matchedStatus == null)
        {
            return BadRequest(new
            {
                message = "Invalid application status.",
                allowedStatuses
            });
        }

        if (application.User == null)
        {
            return NotFound(new
            {
                message = "Candidate user not found."
            });
        }

        application.Status = matchedStatus;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Application status updated successfully.",

            application = new
            {
                applicationId = application.Id,
                jobId = application.JobId,

                candidate = new
                {
                    id = application.User.Id,
                    fullName = application.User.FullName,
                    email = application.User.Email
                },

                resumeUrl = application.ResumeUrl,
                coverLetter = application.CoverLetter,
                status = application.Status,
                appliedAt = application.AppliedAt
            }
        });
    }
}