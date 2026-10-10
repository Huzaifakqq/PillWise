using Microsoft.EntityFrameworkCore;
using PillWise.API.Models;

namespace PillWise.API.Data;

public class PillWiseDbContext : DbContext
{
    public PillWiseDbContext(DbContextOptions<PillWiseDbContext> options) : base(options) { }
    
    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Medicine> Medicines => Set<Medicine>();
    public DbSet<Interaction> Interactions => Set<Interaction>();
    public DbSet<FamilyMember> FamilyMembers => Set<FamilyMember>();
    public DbSet<UserMedicine> UserMedicines => Set<UserMedicine>();
    public DbSet<SideEffect> SideEffects => Set<SideEffect>();
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(u => u.Id);
            e.Property(u => u.Name).HasMaxLength(100);
            e.Property(u => u.Email).HasMaxLength(100).IsRequired();
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.Phone).HasMaxLength(20);
            e.Property(u => u.Password).HasMaxLength(255);
            e.Property(u => u.Allergies).HasMaxLength(500);
        });
        
        modelBuilder.Entity<Category>(e =>
        {
            e.HasKey(c => c.Id);
            e.Property(c => c.Name).HasMaxLength(100).IsRequired();
            e.Property(c => c.Icon).HasMaxLength(50);
        });
        
        modelBuilder.Entity<Medicine>(e =>
        {
            e.HasKey(m => m.Id);
            e.Property(m => m.Name).HasMaxLength(200).IsRequired();
            e.Property(m => m.GenericName).HasMaxLength(200);
            e.Property(m => m.Form).HasMaxLength(50);
            e.Property(m => m.Manufacturer).HasMaxLength(200);
            e.Property(m => m.Purpose).HasMaxLength(500);
            e.Property(m => m.SideEffects).HasMaxLength(1000);
            e.Property(m => m.Dosage).HasMaxLength(500);
            e.Property(m => m.PriceRange).HasMaxLength(50);
            e.HasOne(m => m.Category).WithMany(c => c.Medicines).HasForeignKey(m => m.CategoryId);
        });
        
        modelBuilder.Entity<Interaction>(e =>
        {
            e.HasKey(i => i.Id);
            e.Property(i => i.Severity).HasMaxLength(20).IsRequired();
            e.Property(i => i.Description).HasMaxLength(1000);
            e.Property(i => i.Advice).HasMaxLength(1000);
            e.HasOne(i => i.Medicine1).WithMany().HasForeignKey(i => i.Medicine1Id).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(i => i.Medicine2).WithMany().HasForeignKey(i => i.Medicine2Id).OnDelete(DeleteBehavior.Restrict);
        });
        
        modelBuilder.Entity<FamilyMember>(e =>
        {
            e.HasKey(f => f.Id);
            e.Property(f => f.Name).HasMaxLength(100).IsRequired();
            e.Property(f => f.Relation).HasMaxLength(50);
            e.HasOne(f => f.User).WithMany(u => u.FamilyMembers).HasForeignKey(f => f.UserId);
        });
        
        modelBuilder.Entity<UserMedicine>(e =>
        {
            e.HasKey(um => um.Id);
            e.Property(um => um.Dosage).HasMaxLength(100);
            e.Property(um => um.Timing).HasMaxLength(200);
            e.HasOne(um => um.User).WithMany(u => u.UserMedicines).HasForeignKey(um => um.UserId);
            e.HasOne(um => um.FamilyMember).WithMany(f => f.UserMedicines).HasForeignKey(um => um.FamilyMemberId);
            e.HasOne(um => um.Medicine).WithMany().HasForeignKey(um => um.MedicineId);
        });
        
        modelBuilder.Entity<SideEffect>(e =>
        {
            e.HasKey(se => se.Id);
            e.Property(se => se.Description).HasMaxLength(1000);
            e.Property(se => se.Severity).HasMaxLength(20);
            e.HasOne(se => se.User).WithMany().HasForeignKey(se => se.UserId);
            e.HasOne(se => se.Medicine).WithMany().HasForeignKey(se => se.MedicineId);
        });
    }
}
