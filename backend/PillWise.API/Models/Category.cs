namespace PillWise.API.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Icon { get; set; }
    
    public List<Medicine> Medicines { get; set; } = new();
}
