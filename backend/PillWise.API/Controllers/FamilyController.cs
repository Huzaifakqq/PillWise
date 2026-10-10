using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PillWise.API.Data;
using PillWise.API.DTOs;
using PillWise.API.Models;

namespace PillWise.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FamilyController : ControllerBase
{
    private readonly PillWiseDbContext _db;
    
    public FamilyController(PillWiseDbContext db) => _db = db;
    
    [HttpGet]
    public async Task<IActionResult> GetFamilyMembers([FromQuery] int userId)
    {
        var members = await _db.FamilyMembers
            .Where(f => f.UserId == userId)
            .Select(f => new FamilyMemberDto
            {
                Id = f.Id,
                UserId = f.UserId,
                Name = f.Name,
                Relation = f.Relation,
                Age = f.Age,
                MedicineCount = f.UserMedicines.Count(um => um.IsActive)
            })
            .ToListAsync();
        
        return Ok(members);
    }
    
    [HttpPost]
    public async Task<IActionResult> AddFamilyMember([FromBody] AddFamilyMemberDto dto)
    {
        var member = new FamilyMember
        {
            UserId = dto.UserId,
            Name = dto.Name,
            Relation = dto.Relation,
            Age = dto.Age
        };
        
        _db.FamilyMembers.Add(member);
        await _db.SaveChangesAsync();
        
        return Ok(new { message = "Family member added", id = member.Id });
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFamilyMember(int id)
    {
        var member = await _db.FamilyMembers.FindAsync(id);
        if (member == null) return NotFound();
        
        _db.FamilyMembers.Remove(member);
        await _db.SaveChangesAsync();
        
        return Ok(new { message = "Family member removed" });
    }
}
