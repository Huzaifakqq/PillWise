using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PillWise.API.Data;
using PillWise.API.DTOs;

namespace PillWise.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly PillWiseDbContext _db;
    
    public DashboardController(PillWiseDbContext db) => _db = db;
    
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats([FromQuery] int userId)
    {
        var totalMedicines = await _db.UserMedicines
            .CountAsync(um => um.UserId == userId && um.IsActive && um.FamilyMemberId == null);
        
        var familyMembers = await _db.FamilyMembers
            .CountAsync(f => f.UserId == userId);
        
        // Get user's medicine IDs
        var userMedIds = await _db.UserMedicines
            .Where(um => um.UserId == userId && um.IsActive && um.FamilyMemberId == null)
            .Select(um => um.MedicineId)
            .ToListAsync();
        
        // Count warnings (interactions between user's medicines)
        int warningCount = 0;
        for (int i = 0; i < userMedIds.Count; i++)
        {
            for (int j = i + 1; j < userMedIds.Count; j++)
            {
                var hasInteraction = await _db.Interactions.AnyAsync(x =>
                    (x.Medicine1Id == userMedIds[i] && x.Medicine2Id == userMedIds[j]) ||
                    (x.Medicine1Id == userMedIds[j] && x.Medicine2Id == userMedIds[i]));
                
                if (hasInteraction) warningCount++;
            }
        }
        
        return Ok(new DashboardStatsDto
        {
            TotalMedicines = totalMedicines,
            ActiveWarnings = warningCount,
            FamilyMembers = familyMembers,
            TotalInteractions = warningCount
        });
    }
}
