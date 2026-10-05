using HireFlow.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HireFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RecruiterController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public RecruiterController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Recruiter/jobs
    [HttpGet("jobs")]
    [Authorize(Roles = "Recruiter,Admin")]
    public async Task<IActionResult> GetRecruiterJobs()
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
}