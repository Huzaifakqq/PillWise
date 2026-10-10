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

        if (categoryId.HasValue)
            query = query.Where(m => m.CategoryId == categoryId.Value);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            var candidates = await query.ToListAsync();

            var scored = candidates
                .Select(m => new { Med = m, Score = FuzzyScore(m.Name, term) + FuzzyScore(m.GenericName ?? "", term) })
                .Where(x => x.Score > 0)
                .OrderByDescending(x => x.Score)
                .Select(x => x.Med)
                .ToList();

            return Ok(scored.Select(m => ToDto(m)).ToList());
        }

        var medicines = await query.ToListAsync();
        return Ok(medicines.Select(ToDto).ToList());
    }

    private static MedicineDto ToDto(PillWise.API.Models.Medicine m) => new MedicineDto
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
    };

    /// <summary>Fuzzy match score: exact 100, prefix 80, contains 60, typo (Levenshtein ≤2) 40-distance.</summary>
    private static int FuzzyScore(string value, string term)
    {
        if (string.IsNullOrWhiteSpace(value) || string.IsNullOrWhiteSpace(term)) return 0;
        var v = value.ToLower();

        if (v == term) return 100;
        if (v.StartsWith(term)) return 80;
        if (v.Contains(term)) return 60;

        var distance = Levenshtein(v, term);
        if (distance <= 2 && term.Length >= 3) return 40 - distance * 5;

        return 0;
    }

    private static int Levenshtein(string a, string b)
    {
        var dp = new int[a.Length + 1, b.Length + 1];
        for (var i = 0; i <= a.Length; i++) dp[i, 0] = i;
        for (var j = 0; j <= b.Length; j++) dp[0, j] = j;

        for (var i = 1; i <= a.Length; i++)
        for (var j = 1; j <= b.Length; j++)
        {
            var cost = a[i - 1] == b[j - 1] ? 0 : 1;
            dp[i, j] = Math.Min(Math.Min(dp[i - 1, j] + 1, dp[i, j - 1] + 1), dp[i - 1, j - 1] + cost);
        }
        return dp[a.Length, b.Length];
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
