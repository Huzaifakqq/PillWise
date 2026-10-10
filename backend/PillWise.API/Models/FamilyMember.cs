namespace PillWise.API.Models;

public class FamilyMember
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Relation { get; set; }
    public int? Age { get; set; }
    
    public User? User { get; set; }
    public List<UserMedicine> UserMedicines { get; set; } = new();
}
