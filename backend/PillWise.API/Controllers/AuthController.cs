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
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly PillWiseDbContext _db;
    private readonly IConfiguration _config;
    
    public AuthController(PillWiseDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
            return BadRequest("Email already registered");
        
        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
            Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Allergies = dto.Allergies,
            CreatedAt = DateTime.UtcNow
        };
        
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        
        return Ok(new AuthResponseDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Token = GenerateToken(user)
        });
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
            return Unauthorized("Invalid email or password");
        
        return Ok(new AuthResponseDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Token = GenerateToken(user)
        });
    }
    
    [HttpGet("profile/{id}")]
    public async Task<IActionResult> GetProfile(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null) return NotFound();
        
        return Ok(new
        {
            user.Id,
            user.Name,
            user.Email,
            user.Phone,
            user.Allergies,
            user.CreatedAt
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
        
        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds);
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
