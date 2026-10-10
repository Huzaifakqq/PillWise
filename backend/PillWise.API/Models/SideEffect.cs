namespace PillWise.API.Models;

public class SideEffect
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int MedicineId { get; set; }
    public string? Description { get; set; }
    public string? Severity { get; set; }
    public DateTime ReportedAt { get; set; } = DateTime.UtcNow;
    
    public User? User { get; set; }
    public Medicine? Medicine { get; set; }
}
