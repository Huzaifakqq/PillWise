using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PillWise.API.Data;
using PillWise.API.DTOs;

namespace PillWise.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InteractionsController : ControllerBase
{
    private readonly PillWiseDbContext _db;
    
    public InteractionsController(PillWiseDbContext db) => _db = db;
    
    [HttpPost("check")]
    public async Task<IActionResult> CheckInteractions([FromBody] InteractionCheckDto dto)
    {
        if (dto.MedicineIds == null || dto.MedicineIds.Count < 2)
            return BadRequest("Select at least 2 medicines");
        
        var medicineIds = dto.MedicineIds.Distinct().ToList();
        var results = new List<InteractionResultDto>();
        
        // Check all pairs
        for (int i = 0; i < medicineIds.Count; i++)
        {
            for (int j = i + 1; j < medicineIds.Count; j++)
            {
                var id1 = medicineIds[i];
                var id2 = medicineIds[j];
                
                var interaction = await _db.Interactions
                    .Include(x => x.Medicine1)
                    .Include(x => x.Medicine2)
                    .FirstOrDefaultAsync(x =>
                        (x.Medicine1Id == id1 && x.Medicine2Id == id2) ||
                        (x.Medicine1Id == id2 && x.Medicine2Id == id1));
                
                if (interaction != null)
                {
                    results.Add(new InteractionResultDto
                    {
                        Medicine1Id = interaction.Medicine1Id,
                        Medicine1Name = interaction.Medicine1!.Name,
                        Medicine2Id = interaction.Medicine2Id,
                        Medicine2Name = interaction.Medicine2!.Name,
                        Severity = interaction.Severity,
                        Description = interaction.Description,
                        Advice = interaction.Advice
                    });
                }
                else
                {
                    // No known interaction - mark as safe
                    var med1 = await _db.Medicines.FindAsync(id1);
                    var med2 = await _db.Medicines.FindAsync(id2);
                    
                    if (med1 != null && med2 != null)
                    {
                        results.Add(new InteractionResultDto
                        {
                            Medicine1Id = id1,
                            Medicine1Name = med1.Name,
                            Medicine2Id = id2,
                            Medicine2Name = med2.Name,
                            Severity = "Safe",
                            Description = "No known interaction found",
                            Advice = "Generally safe to combine. Always consult your doctor."
                        });
                    }
                }
            }
        }
        
        return Ok(results);
    }
}
