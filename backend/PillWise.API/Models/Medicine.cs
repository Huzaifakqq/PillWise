namespace PillWise.API.Models;

public class Medicine
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? GenericName { get; set; }
    public int CategoryId { get; set; }
    public string? Form { get; set; }
    public string? Manufacturer { get; set; }
    public string? Purpose { get; set; }
    public string? SideEffects { get; set; }
    public string? Dosage { get; set; }
    public string? PriceRange { get; set; }
    
    public Category? Category { get; set; }
}
