using HireFlow.API.Data;
using HireFlow.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HireFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UsersController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Users
    // Get all users
    [HttpGet]
    [Authorize(Roles = "Recruiter,Admin")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => new
            {
                id = u.Id,
                fullName = u.FullName,
                email = u.Email,
                role = u.Role,
                createdAt = u.CreatedAt
            })
            .ToListAsync();

        return Ok(new
        {
            totalUsers = users.Count,
            users
        });
    }

    // GET: api/Users/me
    // Get currently logged-in user
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new
            {
                message = "Invalid user token."
            });
        }

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return NotFound(new
            {
                message = "User not found."
            });
        }

        return Ok(new
        {
            id = user.Id,
            fullName = user.FullName,
            email = user.Email,
            role = user.Role,
            createdAt = user.CreatedAt
        });
    }

    // GET: api/Users/1
    // Get user by ID
    [HttpGet("{id:int}")]
    [Authorize(Roles = "Recruiter,Admin")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
        {
            return NotFound(new
            {
                message = "User not found."
            });
        }

        return Ok(new
        {
            id = user.Id,
            fullName = user.FullName,
            email = user.Email,
            role = user.Role,
            createdAt = user.CreatedAt
        });
    }

    // PUT: api/Users/1/role
    // Update user role
    [HttpPut("{id:int}/role")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateUserRole(
        int id,
        [FromBody] UpdateUserRoleRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
        {
            return NotFound(new
            {
                message = "User not found."
            });
        }

        if (request == null || string.IsNullOrWhiteSpace(request.Role))
        {
            return BadRequest(new
            {
                message = "User role is required.",
                allowedRoles = new[]
                {
                    "Candidate",
                    "Recruiter",
                    "Admin"
                }
            });
        }

        var allowedRoles = new[]
        {
            "Candidate",
            "Recruiter",
            "Admin"
        };

        var requestedRole = request.Role.Trim();

        if (!allowedRoles.Contains(
                requestedRole,
                StringComparer.OrdinalIgnoreCase))
        {
            return BadRequest(new
            {
                message = "Invalid user role.",
                allowedRoles
            });
        }

        var standardRole = allowedRoles.First(role =>
            role.Equals(
                requestedRole,
                StringComparison.OrdinalIgnoreCase));

        // Prevent Admin from accidentally changing their own role
        var currentUserIdClaim =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (int.TryParse(currentUserIdClaim, out var currentUserId) &&
            currentUserId == id &&
            user.Role.Equals("Admin", StringComparison.OrdinalIgnoreCase) &&
            !standardRole.Equals("Admin", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new
            {
                message = "You cannot remove your own Admin role."
            });
        }

        user.Role = standardRole;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "User role updated successfully.",
            user = new
            {
                id = user.Id,
                fullName = user.FullName,
                email = user.Email,
                role = user.Role,
                createdAt = user.CreatedAt
            }
        });
    }
}

// Request model for updating user role
public class UpdateUserRoleRequest
{
    public string Role { get; set; } = string.Empty;
}