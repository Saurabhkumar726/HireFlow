using HireFlow.API.Data;
using HireFlow.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HireFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JobsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public JobsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Jobs
    [HttpGet]
    public async Task<IActionResult> GetJobs(
        [FromQuery] string? search,
        [FromQuery] string? location,
        [FromQuery] string? jobType,
        [FromQuery] string? experienceLevel,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        if (page < 1)
            page = 1;

        if (pageSize < 1)
            pageSize = 10;

        if (pageSize > 100)
            pageSize = 100;

        var query = _context.Jobs
            .Where(j => j.IsActive)
            .AsQueryable();

        // Search by title, description or company
        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.Trim();

            query = query.Where(j =>
                EF.Functions.ILike(j.Title, $"%{search}%") ||
                EF.Functions.ILike(j.Description, $"%{search}%") ||
                EF.Functions.ILike(j.CompanyName, $"%{search}%"));
        }

        // Location filter
        if (!string.IsNullOrWhiteSpace(location))
        {
            location = location.Trim();

            query = query.Where(j =>
                EF.Functions.ILike(j.Location, $"%{location}%"));
        }

        // Job type filter
        if (!string.IsNullOrWhiteSpace(jobType))
        {
            jobType = jobType.Trim();

            query = query.Where(j =>
                EF.Functions.ILike(j.JobType, $"%{jobType}%"));
        }

        // Experience level filter
        if (!string.IsNullOrWhiteSpace(experienceLevel))
        {
            experienceLevel = experienceLevel.Trim();

            query = query.Where(j =>
                EF.Functions.ILike(
                    j.ExperienceLevel,
                    $"%{experienceLevel}%"));
        }

        var totalJobs = await query.CountAsync();

        var totalPages = totalJobs == 0
            ? 0
            : (int)Math.Ceiling(
                totalJobs / (double)pageSize);

        var jobs = await query
            .OrderByDescending(j => j.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new
        {
            page,
            pageSize,
            totalJobs,
            totalPages,
            jobs
        });
    }

    // GET: api/Jobs/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetJob(int id)
    {
        var job = await _context.Jobs.FindAsync(id);

        if (job == null || !job.IsActive)
        {
            return NotFound(new
            {
                message = "Job not found."
            });
        }

        return Ok(job);
    }

    // GET: api/Jobs/stats
    [Authorize(Roles = "Recruiter,Admin")]
    [HttpGet("stats")]
    public async Task<IActionResult> GetJobStatistics()
    {
        var jobs = await _context.Jobs
            .OrderByDescending(j => j.CreatedAt)
            .Select(j => new
            {
                jobId = j.Id,
                title = j.Title,
                companyName = j.CompanyName,
                location = j.Location,
                jobType = j.JobType,
                experienceLevel = j.ExperienceLevel,
                isActive = j.IsActive,
                createdAt = j.CreatedAt,

                totalApplications = _context.JobApplications
                    .Count(a => a.JobId == j.Id)
            })
            .ToListAsync();

        return Ok(new
        {
            totalJobs = jobs.Count,
            jobs
        });
    }

    // GET: api/Jobs/dashboard
    [Authorize(Roles = "Recruiter,Admin")]
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardSummary()
    {
        var totalJobs = await _context.Jobs
            .CountAsync();

        var activeJobs = await _context.Jobs
            .CountAsync(j => j.IsActive);

        var inactiveJobs = await _context.Jobs
            .CountAsync(j => !j.IsActive);

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
            totalJobs,
            activeJobs,
            inactiveJobs,
            totalApplications,
            applied,
            reviewing,
            shortlisted,
            interview,
            rejected,
            hired
        });
    }

    // POST: api/Jobs
    [Authorize(Roles = "Recruiter,Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateJob(Job job)
    {
        job.Id = 0;
        job.CreatedAt = DateTime.UtcNow;
        job.IsActive = true;

        _context.Jobs.Add(job);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Job created successfully.",
            job
        });
    }

    // PUT: api/Jobs/1
    [Authorize(Roles = "Recruiter,Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateJob(
        int id,
        Job updatedJob)
    {
        var job = await _context.Jobs.FindAsync(id);

        if (job == null)
        {
            return NotFound(new
            {
                message = "Job not found."
            });
        }

        job.Title = updatedJob.Title;
        job.Description = updatedJob.Description;
        job.CompanyName = updatedJob.CompanyName;
        job.Location = updatedJob.Location;
        job.JobType = updatedJob.JobType;
        job.ExperienceLevel = updatedJob.ExperienceLevel;
        job.IsActive = updatedJob.IsActive;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Job updated successfully.",
            job
        });
    }

    // DELETE: api/Jobs/1
    [Authorize(Roles = "Recruiter,Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteJob(int id)
    {
        var job = await _context.Jobs.FindAsync(id);

        if (job == null)
        {
            return NotFound(new
            {
                message = "Job not found."
            });
        }

        // Soft delete
        job.IsActive = false;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Job deactivated successfully."
        });
    }

    // PUT: api/Jobs/1/activate
    [Authorize(Roles = "Recruiter,Admin")]
    [HttpPut("{id}/activate")]
    public async Task<IActionResult> ActivateJob(int id)
    {
        var job = await _context.Jobs.FindAsync(id);

        if (job == null)
        {
            return NotFound(new
            {
                message = "Job not found."
            });
        }

        if (job.IsActive)
        {
            return BadRequest(new
            {
                message = "Job is already active."
            });
        }

        job.IsActive = true;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Job activated successfully.",
            job = new
            {
                id = job.Id,
                title = job.Title,
                companyName = job.CompanyName,
                location = job.Location,
                jobType = job.JobType,
                experienceLevel = job.ExperienceLevel,
                isActive = job.IsActive,
                createdAt = job.CreatedAt
            }
        });
    }
}