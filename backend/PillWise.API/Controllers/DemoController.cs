using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PillWise.API.Data;
using PillWise.API.DTOs;
using PillWise.API.Models;

namespace PillWise.API.Controllers;

[ApiController]
[Route("api/demo")]
public class DemoController : ControllerBase
{
    private readonly PillWiseDbContext _db;
    private readonly IConfiguration _config;

    // Simple in-memory rate limiter: max N seeds per IP per minute.
    private static readonly System.Collections.Concurrent.ConcurrentDictionary<string, (DateTime WindowStart, int Count)> _hits = new();
    private const int MaxSeedsPerMinute = 10;

    public DemoController(PillWiseDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    /// <summary>
    /// One-click demo: creates (or resets) a fully populated demo account
    /// with a family member, medicines, and a known dangerous interaction.
    /// Public (no auth) so judges can try it, but rate-limited to prevent abuse.
    /// </summary>
    [HttpPost("seed")]
    public async Task<IActionResult> SeedDemo()
    {
        var clientIp = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        if (!CheckRateLimit(clientIp))
            return StatusCode(StatusCodes.Status429TooManyRequests, "Too many demo requests. Try again in a minute.");

        const string demoEmail = "demo@pillwise.pk";
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == demoEmail);

        if (user == null)
        {
            user = new User
            {
                Name = "Ayesha Khan",
                Email = demoEmail,
                Phone = "0300-1234567",
                Password = BCrypt.Net.BCrypt.HashPassword("demo123"),
                Allergies = "Penicillin, Sulfa drugs",
                CreatedAt = DateTime.UtcNow
            };
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
        }

        var existingMeds = await _db.UserMedicines.Where(um => um.UserId == user.Id).ToListAsync();
        if (existingMeds.Count == 0)
        {
            _db.UserMedicines.AddRange(
                new UserMedicine { UserId = user.Id, MedicineId = 1, Dosage = "500mg", Timing = "Morning + Night", IsActive = true },
                new UserMedicine { UserId = user.Id, MedicineId = 2, Dosage = "400mg", Timing = "After lunch", IsActive = true },
                new UserMedicine { UserId = user.Id, MedicineId = 47, Dosage = "5mg", Timing = "Once daily (morning)", IsActive = true },
                new UserMedicine { UserId = user.Id, MedicineId = 3, Dosage = "625mg", Timing = "Every 8 hours", IsActive = true },
                new UserMedicine { UserId = user.Id, MedicineId = 8, Dosage = "75mg", Timing = "After dinner", IsActive = true }
            );

            var amma = new FamilyMember { UserId = user.Id, Name = "Amma", Relation = "Mother", Age = 62 };
            _db.FamilyMembers.Add(amma);
            await _db.SaveChangesAsync();

            _db.UserMedicines.AddRange(
                new UserMedicine { UserId = user.Id, FamilyMemberId = amma.Id, MedicineId = 1, Dosage = "500mg", Timing = "Morning + Night", IsActive = true },
                new UserMedicine { UserId = user.Id, FamilyMemberId = amma.Id, MedicineId = 8, Dosage = "75mg", Timing = "After dinner", IsActive = true }
            );
            await _db.SaveChangesAsync();
        }

        return Ok(new AuthResponseDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Token = GenerateToken(user)
        });
    }

    private string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _config["Jwt:Secret"] ?? "PillWiseSuperSecretKey2026HackathonIslamabad!"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name)
        };
        var token = new JwtSecurityToken(claims: claims, expires: DateTime.UtcNow.AddDays(7), signingCredentials: creds);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static bool CheckRateLimit(string ip)
    {
        var now = DateTime.UtcNow;
        var entry = _hits.AddOrUpdate(ip,
            _ => (now, 1),
            (_, existing) =>
                now - existing.WindowStart > TimeSpan.FromMinutes(1)
                    ? (now, 1)
                    : (existing.WindowStart, existing.Count + 1));
        return entry.Count <= MaxSeedsPerMinute;
    }
}
