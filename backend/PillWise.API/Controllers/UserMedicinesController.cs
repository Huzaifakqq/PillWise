using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PillWise.API.Data;
using PillWise.API.DTOs;
using PillWise.API.Models;

namespace PillWise.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserMedicinesController : ControllerBase
{
    private readonly PillWiseDbContext _db;
    
    public UserMedicinesController(PillWiseDbContext db) => _db = db;
    
    [HttpGet]
    public async Task<IActionResult> GetUserMedicines([FromQuery] int userId, [FromQuery] int? familyMemberId)
    {
        var query = _db.UserMedicines
            .Include(um => um.Medicine)
            .Include(um => um.FamilyMember)
            .Where(um => um.UserId == userId && um.IsActive);
        
        if (familyMemberId.HasValue)
            query = query.Where(um => um.FamilyMemberId == familyMemberId.Value);
        else
            query = query.Where(um => um.FamilyMemberId == null);
        
        var medicines = await query.Select(um => new UserMedicineDto
        {
            Id = um.Id,
            UserId = um.UserId,
            FamilyMemberId = um.FamilyMemberId,
            FamilyMemberName = um.FamilyMember != null ? um.FamilyMember.Name : null,
            MedicineId = um.MedicineId,
            MedicineName = um.Medicine!.Name,
            MedicineForm = um.Medicine.Form,
            Dosage = um.Dosage,
            Timing = um.Timing,
            StartDate = um.StartDate,
            EndDate = um.EndDate,
            IsActive = um.IsActive
        }).ToListAsync();
        
        return Ok(medicines);
    }
    
    [HttpPost]
    public async Task<IActionResult> AddUserMedicine([FromBody] AddUserMedicineDto dto)
    {
        var userMedicine = new UserMedicine
        {
            UserId = dto.UserId,
            FamilyMemberId = dto.FamilyMemberId,
            MedicineId = dto.MedicineId,
            Dosage = dto.Dosage,
            Timing = dto.Timing,
            StartDate = DateTime.Today,
            IsActive = true
        };
        
        _db.UserMedicines.Add(userMedicine);
        await _db.SaveChangesAsync();
        
        return Ok(new { message = "Medicine added", id = userMedicine.Id });
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoveUserMedicine(int id)
    {
        var userMedicine = await _db.UserMedicines.FindAsync(id);
        if (userMedicine == null) return NotFound();
        
        userMedicine.IsActive = false;
        await _db.SaveChangesAsync();
        
        return Ok(new { message = "Medicine removed" });
    }
}
