namespace PillWise.API.Models;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Password { get; set; } = string.Empty;
    public string? Allergies { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public List<UserMedicine> UserMedicines { get; set; } = new();
    public List<FamilyMember> FamilyMembers { get; set; } = new();
}
