using BCrypt.Net;
using Google.Apis.Auth;
using HireFlow.API.Data;
using HireFlow.API.DTOs;
using HireFlow.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using System.Net.Mail;
using System.Security.Cryptography;

namespace HireFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly JwtService _jwtService;
    private readonly IConfiguration _configuration;

    public AuthController(
        ApplicationDbContext context,
        JwtService jwtService,
        IConfiguration configuration)
    {
        _context = context;
        _jwtService = jwtService;
        _configuration = configuration;
    }

    // =========================================================
    // POST: api/Auth/register
    // =========================================================
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FullName))
        {
            return BadRequest(new
            {
                message = "Full name is required."
            });
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(new
            {
                message = "Email is required."
            });
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new
            {
                message = "Password is required."
            });
        }

        var email = request.Email.Trim().ToLower();

        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email);

        if (existingUser != null)
        {
            return BadRequest(new
            {
                message = "Email is already registered."
            });
        }

        // Public registration creates Candidate accounts only.
        var user = new Models.User
        {
            FullName = request.FullName.Trim(),
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = "Candidate",
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "User registered successfully.",
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


    // =========================================================
    // POST: api/Auth/login
    // =========================================================
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(new
            {
                message = "Email is required."
            });
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new
            {
                message = "Password is required."
            });
        }

        var email = request.Email.Trim().ToLower();

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email);

        if (user == null)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        var passwordValid = BCrypt.Net.BCrypt.Verify(
            request.Password,
            user.PasswordHash
        );

        if (!passwordValid)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        var token = _jwtService.GenerateToken(user);

        return Ok(new
        {
            message = "Login successful.",
            token,
            user = new
            {
                id = user.Id,
                fullName = user.FullName,
                email = user.Email,
                role = user.Role
            }
        });
    }


    // =========================================================
    // POST: api/Auth/google
    // =========================================================
    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin(GoogleLoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Credential))
        {
            return BadRequest(new
            {
                message = "Google credential is required."
            });
        }

        try
        {
            // Get Google Client ID from configuration
            var googleClientId =
                _configuration["Google:ClientId"];

            if (string.IsNullOrWhiteSpace(googleClientId))
            {
                return StatusCode(500, new
                {
                    message = "Google Client ID is not configured."
                });
            }

            // Verify Google credential
            var payload = await GoogleJsonWebSignature.ValidateAsync(
                request.Credential,
                new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[]
                    {
                        googleClientId
                    }
                }
            );

            if (payload == null)
            {
                return Unauthorized(new
                {
                    message = "Invalid Google credential."
                });
            }

            var email = payload.Email?.Trim().ToLower();

            if (string.IsNullOrWhiteSpace(email))
            {
                return Unauthorized(new
                {
                    message = "Google account email could not be verified."
                });
            }

            // Find existing user
            var user = await _context.Users
                .FirstOrDefaultAsync(
                    u => u.Email.ToLower() == email
                );

            // If user does not exist, create Candidate account
            if (user == null)
            {
                user = new Models.User
                {
                    FullName = string.IsNullOrWhiteSpace(payload.Name)
                        ? email.Split('@')[0]
                        : payload.Name.Trim(),

                    Email = email,

                    // Google users do not use normal password login.
                    // Store a random hash so PasswordHash remains valid.
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(
                        Guid.NewGuid().ToString()
                    ),

                    Role = "Candidate",

                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);

                await _context.SaveChangesAsync();
            }

            // Generate HireFlow JWT
            var token = _jwtService.GenerateToken(user);

            return Ok(new
            {
                message = "Google login successful.",
                token,
                user = new
                {
                    id = user.Id,
                    fullName = user.FullName,
                    email = user.Email,
                    role = user.Role
                }
            });
        }
        catch (InvalidJwtException)
        {
            return Unauthorized(new
            {
                message = "Invalid Google credential."
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine(
                $"Google login error: {ex}"
            );

            return StatusCode(500, new
            {
                message = "Unable to login with Google."
            });
        }
    }


    // =========================================================
    // POST: api/Auth/forgot-password
    // =========================================================
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(new
            {
                message = "Email is required."
            });
        }

        var email = request.Email.Trim().ToLower();

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email);

        // Always return the same generic response, whether or not
        // the email is registered — this avoids leaking which
        // emails exist in the system.
        var genericResponse = new
        {
            message = "If an account exists for that email, a password reset link has been sent."
        };

        if (user == null)
        {
            return Ok(genericResponse);
        }

        // Generate a URL-safe reset token and store it with a
        // 30 minute expiry.
        var tokenBytes = RandomNumberGenerator.GetBytes(32);
        var token = WebEncoders.Base64UrlEncode(tokenBytes);

        user.PasswordResetToken = token;
        user.PasswordResetTokenExpiry = DateTime.UtcNow.AddMinutes(30);

        await _context.SaveChangesAsync();

        var frontendBaseUrl =
            _configuration["Frontend:BaseUrl"] ?? "http://localhost:5173";

        var resetLink =
            $"{frontendBaseUrl}/reset-password?token={token}&email={Uri.EscapeDataString(user.Email)}";

        await SendPasswordResetEmailAsync(user.Email, resetLink);

        return Ok(genericResponse);
    }


    // =========================================================
    // POST: api/Auth/reset-password
    // =========================================================
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Token) ||
            string.IsNullOrWhiteSpace(request.NewPassword))
        {
            return BadRequest(new
            {
                message = "Email, token, and new password are all required."
            });
        }

        if (request.NewPassword.Length < 6)
        {
            return BadRequest(new
            {
                message = "Password must be at least 6 characters."
            });
        }

        var email = request.Email.Trim().ToLower();

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email);

        var tokenIsValid =
            user != null &&
            !string.IsNullOrWhiteSpace(user.PasswordResetToken) &&
            user.PasswordResetToken == request.Token &&
            user.PasswordResetTokenExpiry.HasValue &&
            user.PasswordResetTokenExpiry.Value > DateTime.UtcNow;

        if (!tokenIsValid)
        {
            return BadRequest(new
            {
                message = "This reset link has expired or is invalid. Please request a new one."
            });
        }

        user!.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        user.PasswordResetToken = null;
        user.PasswordResetTokenExpiry = null;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Your password has been reset successfully."
        });
    }


    // =========================================================
    // Helper: send the password reset email.
    //
    // If SMTP settings are not configured (e.g. in local dev),
    // the reset link is logged to the console instead of failing,
    // so the flow can still be tested end-to-end.
    // =========================================================
    private async Task SendPasswordResetEmailAsync(string toEmail, string resetLink)
    {
        var smtpHost = _configuration["Smtp:Host"];
        var smtpPortSetting = _configuration["Smtp:Port"];
        var smtpUser = _configuration["Smtp:Username"];
        var smtpPassword = _configuration["Smtp:Password"];
        var fromEmail = _configuration["Smtp:FromEmail"] ?? smtpUser;

        var smtpConfigured =
            !string.IsNullOrWhiteSpace(smtpHost) &&
            !string.IsNullOrWhiteSpace(smtpUser) &&
            !string.IsNullOrWhiteSpace(smtpPassword);

        if (!smtpConfigured)
        {
            Console.WriteLine(
                $"[Password Reset] SMTP is not configured. Reset link for {toEmail}: {resetLink}"
            );
            return;
        }

        try
        {
            var smtpPort = int.TryParse(smtpPortSetting, out var parsedPort)
                ? parsedPort
                : 587;

            var plainTextBody =
                $"We received a request to reset your HireFlow password.\n\n" +
                $"Open the link below to choose a new password. This link expires in 30 minutes.\n\n" +
                $"{resetLink}\n\n" +
                $"If you didn't request this, you can safely ignore this email.";

            var htmlBody = BuildPasswordResetEmailHtml(resetLink);

            using var message = new MailMessage
            {
                From = new MailAddress(fromEmail!, "HireFlow"),
                Subject = "Reset your HireFlow password",
                Body = plainTextBody,
                IsBodyHtml = false
            };

            // HTML version as an alternate view, with the plain text
            // above kept as a fallback for clients that don't render HTML.
            var htmlView = AlternateView.CreateAlternateViewFromString(
                htmlBody,
                null,
                "text/html"
            );

            message.AlternateViews.Add(htmlView);

            message.To.Add(toEmail);

            using var smtpClient = new SmtpClient(smtpHost, smtpPort)
            {
                Credentials = new System.Net.NetworkCredential(smtpUser, smtpPassword),
                EnableSsl = true
            };

            await smtpClient.SendMailAsync(message);
        }
        catch (Exception ex)
        {
            // Do not let an email delivery failure surface to the
            // client — the reset token has already been saved, and
            // we don't want to reveal SMTP errors to the caller.
            Console.WriteLine(
                $"[Password Reset] Failed to send email to {toEmail}: {ex}"
            );
        }
    }


    // =========================================================
    // Helper: build the HTML body for the password reset email.
    //
    // Inline styles are used throughout — most email clients
    // strip <style> blocks, so styling has to live on each tag.
    // =========================================================
    private static string BuildPasswordResetEmailHtml(string resetLink)
    {
        return $@"
<!DOCTYPE html>
<html lang=""en"">
<head>
  <meta charset=""UTF-8"" />
  <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"" />
</head>
<body style=""margin:0; padding:0; background-color:#f5f7fb; font-family: Arial, Helvetica, sans-serif;"">

  <table role=""presentation"" width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""background-color:#f5f7fb; padding:40px 0;"">
    <tr>
      <td align=""center"">

        <table role=""presentation"" width=""480"" cellpadding=""0"" cellspacing=""0"" style=""background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 8px 25px rgba(16,42,67,0.08);"">

          <!-- Header / logo -->
          <tr>
            <td align=""center"" style=""padding:40px 40px 0 40px;"">
              <table role=""presentation"" cellpadding=""0"" cellspacing=""0"">
                <tr>
                  <td style=""width:44px; height:44px; background-color:#2864e8; border-radius:12px; text-align:center; vertical-align:middle;"">
                    <span style=""color:#ffffff; font-size:24px; font-weight:800; line-height:44px;"">H</span>
                  </td>
                  <td style=""padding-left:10px;"">
                    <span style=""font-size:24px; font-weight:800; color:#102a43;"">Hire<span style=""color:#2864e8;"">Flow</span></span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td align=""center"" style=""padding:32px 40px 0 40px;"">
              <h1 style=""margin:0; font-size:22px; color:#102a43; font-weight:700;"">Reset your password</h1>
            </td>
          </tr>

          <!-- Body copy -->
          <tr>
            <td style=""padding:16px 40px 0 40px;"">
              <p style=""margin:0 0 16px 0; font-size:15px; line-height:1.6; color:#627d98; text-align:center;"">
                We received a request to reset the password for your HireFlow account.
                Click the button below to choose a new one. This link expires in
                <strong style=""color:#102a43;"">30 minutes</strong>.
              </p>
            </td>
          </tr>

          <!-- Button -->
          <tr>
            <td align=""center"" style=""padding:24px 40px;"">
              <table role=""presentation"" cellpadding=""0"" cellspacing=""0"">
                <tr>
                  <td style=""background-color:#2864e8; border-radius:9px;"">
                    <a href=""{resetLink}""
                       style=""display:inline-block; padding:14px 32px; font-size:16px; font-weight:600; color:#ffffff; text-decoration:none;"">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Fallback link -->
          <tr>
            <td style=""padding:0 40px 32px 40px;"">
              <p style=""margin:0; font-size:13px; line-height:1.6; color:#829ab1; text-align:center;"">
                Button not working? Copy and paste this link into your browser:<br />
                <a href=""{resetLink}"" style=""color:#2864e8; word-break:break-all;"">{resetLink}</a>
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style=""padding:0 40px;"">
              <div style=""border-top:1px solid #edf2f7;""></div>
            </td>
          </tr>

          <!-- Footer note -->
          <tr>
            <td style=""padding:24px 40px 40px 40px;"">
              <p style=""margin:0; font-size:13px; line-height:1.6; color:#829ab1; text-align:center;"">
                If you didn't request a password reset, you can safely ignore this email —
                your password will not be changed.
              </p>
            </td>
          </tr>

        </table>

        <p style=""margin:24px 0 0 0; font-size:12px; color:#829ab1; font-family: Arial, Helvetica, sans-serif;"">
          © 2026 HireFlow. All rights reserved.
        </p>

      </td>
    </tr>
  </table>

</body>
</html>";
    }
}