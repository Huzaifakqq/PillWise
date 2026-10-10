namespace PillWise.API.Models;

public class UserMedicine
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int? FamilyMemberId { get; set; }
    public int MedicineId { get; set; }
    public string? Dosage { get; set; }
    public string? Timing { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsActive { get; set; } = true;
    
    public User? User { get; set; }
    public FamilyMember? FamilyMember { get; set; }
    public Medicine? Medicine { get; set; }
}
