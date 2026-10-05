using HireFlow.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HireFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Dashboard/recruiter
    [HttpGet("recruiter")]
    [Authorize(Roles = "Recruiter,Admin")]
    public async Task<IActionResult> GetRecruiterDashboard()
    {
        var totalJobs = await _context.Jobs
            .CountAsync();

        var activeJobs = await _context.Jobs
            .CountAsync(j => j.IsActive);

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
            totalApplications,
            applied,
            reviewing,
            shortlisted,
            interview,
            rejected,
            hired
        });
    }
}