using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PillWise.API.Data;
using PillWise.API.DTOs;
using PillWise.API.Models;

namespace PillWise.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SideEffectsController : ControllerBase
{
    private readonly PillWiseDbContext _db;
    
    public SideEffectsController(PillWiseDbContext db) => _db = db;
    
    [HttpPost]
    public async Task<IActionResult> ReportSideEffect([FromBody] SideEffectDto dto)
    {
        var sideEffect = new SideEffect
        {
            UserId = dto.UserId,
            MedicineId = dto.MedicineId,
            Description = dto.Description,
            Severity = dto.Severity,
            ReportedAt = DateTime.UtcNow
        };
        
        _db.SideEffects.Add(sideEffect);
        await _db.SaveChangesAsync();
        
        return Ok(new { message = "Side effect reported" });
    }
    
    [HttpGet("medicine/{medicineId}")]
    public async Task<IActionResult> GetSideEffects(int medicineId)
    {
        var sideEffects = await _db.SideEffects
            .Where(se => se.MedicineId == medicineId)
            .Select(se => new
            {
                se.Description,
                se.Severity,
                se.ReportedAt
            })
            .ToListAsync();
        
        return Ok(sideEffects);
    }
}
