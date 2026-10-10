namespace PillWise.API.Models;

public class Interaction
{
    public int Id { get; set; }
    public int Medicine1Id { get; set; }
    public int Medicine2Id { get; set; }
    public string Severity { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Advice { get; set; }
    
    public Medicine? Medicine1 { get; set; }
    public Medicine? Medicine2 { get; set; }
}
