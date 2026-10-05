using HireFlow.API.Data;
using HireFlow.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HireFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Candidate")]
public class SavedJobsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SavedJobsController(ApplicationDbContext context)
    {
        _context = context;
    }


    // =========================================================
    // GET: api/SavedJobs
    // Get all saved jobs of current candidate
    // =========================================================

    [HttpGet]
    public async Task<IActionResult> GetSavedJobs()
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

        var savedJobs = await _context.SavedJobs
            .Where(s =>
                s.UserId == userId &&
                s.Job != null &&
                s.Job.IsActive)
            .OrderByDescending(s => s.SavedAt)
            .Select(s => new
            {
                id = s.Id,
                savedAt = s.SavedAt,

                job = new
                {
                    id = s.Job!.Id,
                    title = s.Job.Title,
                    description = s.Job.Description,
                    companyName = s.Job.CompanyName,
                    location = s.Job.Location,
                    jobType = s.Job.JobType,
                    experienceLevel = s.Job.ExperienceLevel,
                    createdAt = s.Job.CreatedAt
                }
            })
            .ToListAsync();

        return Ok(savedJobs);
    }


    // =========================================================
    // GET: api/SavedJobs/ids
    // Get only saved Job IDs
    // =========================================================

    [HttpGet("ids")]
    public async Task<IActionResult> GetSavedJobIds()
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

        var jobIds = await _context.SavedJobs
            .Where(s => s.UserId == userId)
            .Select(s => s.JobId)
            .ToListAsync();

        return Ok(jobIds);
    }


    // =========================================================
    // POST: api/SavedJobs/1
    // Save a job
    // =========================================================

    [HttpPost("{jobId:int}")]
    public async Task<IActionResult> SaveJob(int jobId)
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

        if (jobId <= 0)
        {
            return BadRequest(new
            {
                message = "Valid JobId is required."
            });
        }

        var job = await _context.Jobs
            .FirstOrDefaultAsync(j =>
                j.Id == jobId &&
                j.IsActive);

        if (job == null)
        {
            return NotFound(new
            {
                message = "Job not found or inactive."
            });
        }

        var alreadySaved = await _context.SavedJobs
            .AnyAsync(s =>
                s.UserId == userId &&
                s.JobId == jobId);

        if (alreadySaved)
        {
            return Ok(new
            {
                message = "Job is already saved.",
                saved = true
            });
        }

        var savedJob = new SavedJob
        {
            UserId = userId,
            JobId = jobId,
            SavedAt = DateTime.UtcNow
        };

        _context.SavedJobs.Add(savedJob);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Job saved successfully.",
            saved = true
        });
    }


    // =========================================================
    // DELETE: api/SavedJobs/1
    // Remove saved job
    // =========================================================

    [HttpDelete("{jobId:int}")]
    public async Task<IActionResult> RemoveSavedJob(int jobId)
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

        var savedJob = await _context.SavedJobs
            .FirstOrDefaultAsync(s =>
                s.UserId == userId &&
                s.JobId == jobId);

        if (savedJob == null)
        {
            return NotFound(new
            {
                message = "Saved job not found."
            });
        }

        _context.SavedJobs.Remove(savedJob);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Job removed from saved jobs.",
            saved = false
        });
    }
}