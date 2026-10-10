namespace PillWise.API.DTOs;

public class RegisterDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Password { get; set; } = string.Empty;
    public string? Allergies { get; set; }
}

public class LoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class AuthResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
}

public class MedicineDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? GenericName { get; set; }
    public int CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public string? Form { get; set; }
    public string? Manufacturer { get; set; }
    public string? Purpose { get; set; }
    public string? SideEffects { get; set; }
    public string? Dosage { get; set; }
    public string? PriceRange { get; set; }
}

public class InteractionCheckDto
{
    public List<int> MedicineIds { get; set; } = new();
}

public class InteractionResultDto
{
    public int Medicine1Id { get; set; }
    public string Medicine1Name { get; set; } = string.Empty;
    public int Medicine2Id { get; set; }
    public string Medicine2Name { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Advice { get; set; }
}

public class UserMedicineDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int? FamilyMemberId { get; set; }
    public string? FamilyMemberName { get; set; }
    public int MedicineId { get; set; }
    public string MedicineName { get; set; } = string.Empty;
    public string? MedicineForm { get; set; }
    public string? Dosage { get; set; }
    public string? Timing { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsActive { get; set; }
}

public class AddUserMedicineDto
{
    public int UserId { get; set; }
    public int? FamilyMemberId { get; set; }
    public int MedicineId { get; set; }
    public string? Dosage { get; set; }
    public string? Timing { get; set; }
}

public class FamilyMemberDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Relation { get; set; }
    public int? Age { get; set; }
    public int MedicineCount { get; set; }
}

public class AddFamilyMemberDto
{
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Relation { get; set; }
    public int? Age { get; set; }
}

public class DashboardStatsDto
{
    public int TotalMedicines { get; set; }
    public int ActiveWarnings { get; set; }
    public int FamilyMembers { get; set; }
    public int TotalInteractions { get; set; }
}

public class SideEffectDto
{
    public int UserId { get; set; }
    public int MedicineId { get; set; }
    public string? Description { get; set; }
    public string? Severity { get; set; }
}

public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public int MedicineCount { get; set; }
}
