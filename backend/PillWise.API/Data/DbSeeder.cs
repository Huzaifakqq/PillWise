using Microsoft.EntityFrameworkCore;
using PillWise.API.Models;

namespace PillWise.API.Data;

/// <summary>
/// Creates the schema and seeds core data on first run (used by Docker / fresh deploys).
/// Skips entirely if the Medicines table already has data.
/// </summary>
public static class DbSeeder
{
    public static async Task InitializeAsync(PillWiseDbContext db)
    {
        await db.Database.EnsureCreatedAsync();

        if (await db.Medicines.AnyAsync()) return;

        db.Categories.AddRange(
            new Category { Name = "Painkillers", Icon = "💊" },
            new Category { Name = "Antibiotics", Icon = "🦠" },
            new Category { Name = "Allergy", Icon = "🤧" },
            new Category { Name = "Blood Pressure", Icon = "❤️" },
            new Category { Name = "Diabetes", Icon = "🩸" },
            new Category { Name = "Stomach", Icon = "🤰" },
            new Category { Name = "Vitamins", Icon = "🍊" },
            new Category { Name = "Cold & Flu", Icon = "😷" }
        );
        await db.SaveChangesAsync();

        var meds = new[]
        {
            Med("Panadol", "Paracetamol", 1, "Tablet", "GSK", "Pain relief and fever reduction", "Nausea, liver damage (overdose)", "500mg every 6-8 hours", "PKR 100-200"),
            Med("Brufen", "Ibuprofen", 1, "Tablet", "Abbott", "Anti-inflammatory pain relief", "Stomach pain, gastric bleeding", "400mg every 8 hours after food", "PKR 200-300"),
            Med("Augmentin", "Amoxicillin + Clavulanate", 2, "Tablet", "GSK", "Broad-spectrum antibiotic", "Diarrhea, nausea, rash", "625mg every 8 hours", "PKR 500-800"),
            Med("Ciprocin", "Ciprofloxacin", 2, "Tablet", "Searle", "Antibiotic for urinary and other infections", "Tendon pain, dizziness", "500mg twice daily", "PKR 400-600"),
            Med("Zyrtec", "Cetirizine", 3, "Tablet", "UCB", "24-hour allergy relief", "Drowsiness, dry mouth", "10mg once daily", "PKR 150-250"),
            Med("Ponstan", "Mefenamic Acid", 1, "Tablet", "Pfizer", "Pain and menstrual cramp relief", "Stomach upset, diarrhea", "500mg every 8 hours", "PKR 150-200"),
            Med("Norvasc", "Amlodipine", 4, "Tablet", "Pfizer", "Blood pressure control", "Swelling in ankles, flushing", "5-10mg once daily", "PKR 300-500"),
            Med("Loprin", "Aspirin (low dose)", 4, "Tablet", "Getz", "Heart attack and stroke prevention", "Stomach bleeding, ringing in ears", "75mg once daily", "PKR 100-150"),
            Med("Glucophage", "Metformin", 5, "Tablet", "Merck", "Lowers blood sugar in type 2 diabetes", "Nausea, diarrhea, B12 deficiency", "500mg twice daily with meals", "PKR 200-400"),
            Med("Motilium", "Domperidone", 6, "Tablet", "Searle", "Nausea, vomiting, stomach emptying", "Drowsiness, dry mouth", "10mg before meals", "PKR 150-250"),
            Med("Risek", "Omeprazole", 6, "Capsule", "Getz", "Acid reflux and stomach ulcer relief", "Headache, vitamin B12 loss (long term)", "20mg before breakfast", "PKR 250-400"),
            Med("Velosef", "Cephradine", 2, "Capsule", "Bristol", "Antibiotic for chest and skin infections", "Diarrhea, skin rash", "500mg twice daily", "PKR 400-600"),
            Med("Celebrex", "Celecoxib", 1, "Capsule", "Pfizer", "Anti-inflammatory for arthritis pain", "Cardiovascular risk, stomach ulcer", "200mg once daily", "PKR 600-900"),
            Med("Plavix", "Clopidogrel", 4, "Tablet", "Sanofi", "Prevents blood clots after heart attack", "Bleeding, bruising", "75mg once daily", "PKR 500-800"),
            Med("Lasix", "Furosemide", 4, "Tablet", "Sanofi", "Water pill for swelling and blood pressure", "Dehydration, low potassium", "20-40mg in morning", "PKR 100-150"),
            Med("Calpol", "Paracetamol (syrup)", 1, "Syrup", "GSK", "Fever and pain relief for children", "Nausea (rare)", "Per weight every 6 hours", "PKR 150-250"),
            Med("Panadeine", "Paracetamol + Codeine", 1, "Tablet", "GSK", "Stronger pain relief", "Constipation, drowsiness, addiction risk", "1-2 tablets every 6 hours", "PKR 200-350"),
            Med("Ventolin", "Salbutamol", 8, "Inhaler", "GSK", "Relieves asthma and breathing difficulty", "Tremor, rapid heartbeat", "1-2 puffs when needed", "PKR 400-600"),
            Med("Warfarin", "Warfarin Sodium", 4, "Tablet", "Zydus", "Prevents blood clots", "Major bleeding risk, bruising", "Dose by INR (typically 5mg)", "PKR 300-500")
        };
        db.Medicines.AddRange(meds);
        await db.SaveChangesAsync();

        Medicine M(string name) => meds.First(x => x.Name == name);

        db.Interactions.AddRange(
            new Interaction { Medicine1 = M("Panadol"), Medicine2 = M("Brufen"), Severity = "Mild", Description = "Panadol and Brufen together may irritate the stomach; both relieve pain differently", Advice = "Usually okay short-term with food. Avoid long-term combined use." },
            new Interaction { Medicine1 = M("Panadeine"), Medicine2 = M("Panadol"), Severity = "Major", Description = "Panadeine already contains Paracetamol — adding Panadol risks liver-damaging overdose", Advice = "Do not combine. Count all Paracetamol toward the 4g/day maximum." },
            new Interaction { Medicine1 = M("Brufen"), Medicine2 = M("Loprin"), Severity = "Dangerous", Description = "Brufen (ibuprofen) with Loprin (aspirin) greatly increases stomach bleeding and ulcer risk", Advice = "Avoid combining two NSAIDs. Take only one, with food, for the shortest time." },
            new Interaction { Medicine1 = M("Brufen"), Medicine2 = M("Warfarin"), Severity = "Dangerous", Description = "Brufen significantly increases bleeding risk when combined with Warfarin", Advice = "Avoid. Use Paracetamol for pain instead and consult your doctor." },
            new Interaction { Medicine1 = M("Loprin"), Medicine2 = M("Warfarin"), Severity = "Dangerous", Description = "Loprin (aspirin) with Warfarin causes dangerous additive bleeding risk", Advice = "Only under specialist supervision with regular INR monitoring." },
            new Interaction { Medicine1 = M("Augmentin"), Medicine2 = M("Risek"), Severity = "Major", Description = "Risek (omeprazole) reduces absorption of Augmentin, lowering antibiotic effectiveness", Advice = "Take Augmentin 2 hours before or after Risek." },
            new Interaction { Medicine1 = M("Glucophage"), Medicine2 = M("Brufen"), Severity = "Major", Description = "Brufen can impair kidney function and reduce Metformin clearance, raising lactate risk", Advice = "Avoid regular NSAID use with Metformin. Monitor kidney function." },
            new Interaction { Medicine1 = M("Plavix"), Medicine2 = M("Brufen"), Severity = "Major", Description = "Plavix (clopidogrel) with Brufen increases gastrointestinal bleeding risk", Advice = "Use Paracetamol for pain instead of Brufen where possible." },
            new Interaction { Medicine1 = M("Celebrex"), Medicine2 = M("Plavix"), Severity = "Major", Description = "Celebrex with Plavix raises clotting and bleeding complications", Advice = "Use lowest Celebrex dose for shortest time. Monitor for bruising." },
            new Interaction { Medicine1 = M("Lasix"), Medicine2 = M("Norvasc"), Severity = "Mild", Description = "Lasix with Norvasc can lower blood pressure too much causing dizziness", Advice = "Rise slowly from sitting. Monitor blood pressure regularly." },
            new Interaction { Medicine1 = M("Panadeine"), Medicine2 = M("Motilium"), Severity = "Major", Description = "Panadeine (codeine) with Motilium reduces codeine effectiveness for pain", Advice = "Discuss alternative pain relief with your doctor." },
            new Interaction { Medicine1 = M("Warfarin"), Medicine2 = M("Augmentin"), Severity = "Major", Description = "Augmentin may enhance Warfarin effect, increasing bleeding risk", Advice = "Requires INR monitoring during the antibiotic course." },
            new Interaction { Medicine1 = M("Ponstan"), Medicine2 = M("Panadol"), Severity = "Mild", Description = "Ponstan and Panadol together may irritate the stomach", Advice = "Occasional combined use is usually okay with food." },
            new Interaction { Medicine1 = M("Ponstan"), Medicine2 = M("Brufen"), Severity = "Dangerous", Description = "Ponstan and Brufen are both NSAIDs — combined use dramatically increases ulcer and bleeding risk", Advice = "Take only ONE NSAID. Never combine Ponstan with Brufen." }
        );
        await db.SaveChangesAsync();
    }

    private static Medicine Med(string name, string generic, int cat, string form, string maker, string purpose, string side, string dosage, string price) =>
        new() { Name = name, GenericName = generic, CategoryId = cat, Form = form, Manufacturer = maker, Purpose = purpose, SideEffects = side, Dosage = dosage, PriceRange = price };
}
