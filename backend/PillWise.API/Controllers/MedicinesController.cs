using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PillWise.API.Data;
using PillWise.API.DTOs;

namespace PillWise.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MedicinesController : ControllerBase
{
    private readonly PillWiseDbContext _db;
    
    public MedicinesController(PillWiseDbContext db) => _db = db;
    
    [HttpGet]
    public async Task<IActionResult> GetMedicines([FromQuery] string? search, [FromQuery] int? categoryId)
    {
        var query = _db.Medicines.Include(m => m.Category).AsQueryable();
        
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(m => m.Name.Contains(search) || 
                                     (m.GenericName != null && m.GenericName.Contains(search)));
        
        if (categoryId.HasValue)
            query = query.Where(m => m.CategoryId == categoryId.Value);
        
        var medicines = await query.Select(m => new MedicineDto
        {
            Id = m.Id,
            Name = m.Name,
            GenericName = m.GenericName,
            CategoryId = m.CategoryId,
            CategoryName = m.Category!.Name,
            Form = m.Form,
            Manufacturer = m.Manufacturer,
            Purpose = m.Purpose,
            SideEffects = m.SideEffects,
            Dosage = m.Dosage,
            PriceRange = m.PriceRange
        }).ToListAsync();
        
        return Ok(medicines);
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetMedicine(int id)
    {
        var medicine = await _db.Medicines
            .Include(m => m.Category)
            .Where(m => m.Id == id)
            .Select(m => new MedicineDto
            {
                Id = m.Id,
                Name = m.Name,
                GenericName = m.GenericName,
                CategoryId = m.CategoryId,
                CategoryName = m.Category!.Name,
                Form = m.Form,
                Manufacturer = m.Manufacturer,
                Purpose = m.Purpose,
                SideEffects = m.SideEffects,
                Dosage = m.Dosage,
                PriceRange = m.PriceRange
            })
            .FirstOrDefaultAsync();
        
        if (medicine == null) return NotFound();
        
        // Get interactions for this medicine
        var interactions = await _db.Interactions
            .Include(i => i.Medicine1)
            .Include(i => i.Medicine2)
            .Where(i => i.Medicine1Id == id || i.Medicine2Id == id)
            .Select(i => new
            {
                i.Severity,
                i.Description,
                i.Advice,
                OtherMedicine = i.Medicine1Id == id ? i.Medicine2!.Name : i.Medicine1!.Name
            })
            .ToListAsync();
        
        return Ok(new { medicine, interactions });
    }
    
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _db.Categories
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Icon = c.Icon,
                MedicineCount = c.Medicines.Count()
            })
            .ToListAsync();
        
        return Ok(categories);
    }
}
