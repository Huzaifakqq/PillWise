using Microsoft.EntityFrameworkCore;
using PillWise.API.Models;

namespace PillWise.API.Data;

/// <summary>
/// Creates the schema and seeds core data on first run (used by Docker / fresh deploys).
/// Skips entirely if the Medicines table already has data.
///
/// The dataset matches the live database exactly: 8 categories, 79 medicines, 45
/// interactions. Medicines are listed in strict sequential ID order (two rows share
/// the name "Zantac", so interactions bind by position, not by name). Identity values
/// are assigned by SQL Server, avoiding IDENTITY_INSERT on identity columns.
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
            Med("Panadol", "Paracetamol", 1, "Tablet", "GSK", "Pain relief, fever", "Nausea, liver damage in overdose", "500mg every 6 hours", "PKR 2-5 per tablet"),
            Med("Brufen", "Ibuprofen", 1, "Tablet", "Abbott", "Pain, inflammation", "Stomach bleeding, kidney issues", "400mg every 8 hours", "PKR 5-10 per tablet"),
            Med("Augmentin", "Amoxicillin+Clavulanate", 2, "Tablet", "GSK", "Bacterial infections", "Diarrhea, allergic reactions", "625mg twice daily", "PKR 50-80 per tablet"),
            Med("Ciprocin", "Ciprofloxacin", 2, "Tablet", "Hilton", "Urinary infections", "Tendon damage, nausea", "500mg twice daily", "PKR 30-50 per tablet"),
            Med("Zyrtec", "Cetirizine", 3, "Tablet", "Novartis", "Allergies", "Drowsiness, dry mouth", "10mg once daily", "PKR 15-25 per tablet"),
            Med("Claritin", "Loratadine", 3, "Tablet", "Bayer", "Allergies", "Headache, fatigue", "10mg once daily", "PKR 20-30 per tablet"),
            Med("Norvasc", "Amlodipine", 4, "Tablet", "Pfizer", "Blood pressure", "Swelling, dizziness", "5mg once daily", "PKR 10-20 per tablet"),
            Med("Loprin", "Aspirin", 1, "Tablet", "Highnoon", "Heart protection, pain", "Stomach bleeding, ringing ears", "75mg once daily", "PKR 3-8 per tablet"),
            Med("Glucophage", "Metformin", 5, "Tablet", "Merck", "Diabetes", "Nausea, diarrhea", "500mg twice daily", "PKR 5-10 per tablet"),
            Med("Motilium", "Domperidone", 6, "Tablet", "Searle", "Nausea, vomiting", "Irregular heartbeat, headache", "10mg thrice daily", "PKR 8-15 per tablet"),
            Med("Risek", "Omeprazole", 6, "Capsule", "Getz", "Acid reflux", "Headache, vitamin B12 deficiency", "20mg once daily", "PKR 15-25 per capsule"),
            Med("Ventolin", "Salbutamol", 8, "Inhaler", "GSK", "Asthma", "Tremor, rapid heartbeat", "2 puffs as needed", "PKR 300-500 per inhaler"),
            Med("Disprin", "Aspirin", 1, "Tablet", "Reckitt", "Headache, pain", "Stomach irritation", "300-500mg as needed", "PKR 2-5 per tablet"),
            Med("Fexo", "Fexofenadine", 3, "Tablet", "Sami", "Allergies", "Headache, dizziness", "120mg once daily", "PKR 25-40 per tablet"),
            Med("Ceftrex", "Ceftriaxone", 2, "Injection", "Searle", "Severe infections", "Allergic reactions, diarrhea", "1g once daily", "PKR 200-400 per vial"),
            Med("Volaren", "Diclofenac", 1, "Tablet", "Novartis", "Pain, inflammation", "Stomach ulcers, dizziness", "50mg twice daily", "PKR 8-12 per tablet"),
            Med("Telmisartan", "Telmisartan", 4, "Tablet", "Highnoon", "Blood pressure", "Dizziness, back pain", "40mg once daily", "PKR 15-25 per tablet"),
            Med("Euthyrox", "Levothyroxine", 7, "Tablet", "Merck", "Thyroid", "Insomnia, weight loss", "50-100mcg once daily", "PKR 20-40 per tablet"),
            Med("Panadeine", "Paracetamol+Codeine", 1, "Tablet", "GSK", "Moderate pain", "Constipation, drowsiness", "As directed", "PKR 10-15 per tablet"),
            Med("Ampiclox", "Ampicillin+Cloxacillin", 2, "Capsule", "GSK", "Bacterial infections", "Rash, diarrhea", "500mg thrice daily", "PKR 15-25 per capsule"),
            Med("Allegra", "Fexofenadine", 3, "Tablet", "Sanofi", "Allergies", "Headache", "180mg once daily", "PKR 30-50 per tablet"),
            Med("Concor", "Bisoprolol", 4, "Tablet", "Merck", "Heart, blood pressure", "Fatigue, cold hands", "5mg once daily", "PKR 20-35 per tablet"),
            Med("Daonil", "Glibenclamide", 5, "Tablet", "Sanofi", "Diabetes", "Hypoglycemia, weight gain", "5mg once daily", "PKR 5-10 per tablet"),
            Med("Entamizole", "Diloxanide", 6, "Tablet", "Searle", "Amoebiasis", "Nausea, headache", "500mg thrice daily", "PKR 10-15 per tablet"),
            Med("Naturetin", "Bendroflumethiazide", 4, "Tablet", "Squibb", "Blood pressure, edema", "Potassium loss, dizziness", "2.5mg once daily", "PKR 8-15 per tablet"),
            Med("Arthrotec", "Diclofenac+Misoprostol", 1, "Tablet", "Pfizer", "Arthritis pain", "Diarrhea, stomach pain", "As directed", "PKR 20-30 per tablet"),
            Med("Flagyl", "Metronidazole", 2, "Tablet", "Sanofi", "Bacterial infections", "Metallic taste, nausea", "500mg thrice daily", "PKR 8-15 per tablet"),
            Med("Zantac", "Ranitidine", 6, "Tablet", "GSK", "Acid reflux", "Headache, constipation", "150mg twice daily", "PKR 10-20 per tablet"),
            Med("Ascoril", "Cough syrup", 8, "Syrup", "Glenmark", "Cough", "Drowsiness, nausea", "10ml thrice daily", "PKR 100-150 per bottle"),
            Med("Brufen Syrup", "Ibuprofen", 1, "Syrup", "Abbott", "Pain for children", "Stomach upset", "As per weight", "PKR 80-120 per bottle"),
            Med("Adalat", "Nifedipine", 4, "Tablet", "Bayer", "Blood pressure", "Headache, flushing", "10mg twice daily", "PKR 15-25 per tablet"),
            Med("Dilantin", "Phenytoin", 7, "Capsule", "Pfizer", "Epilepsy", "Gum swelling, drowsiness", "100mg thrice daily", "PKR 20-40 per capsule"),
            Med("Zestril", "Lisinopril", 4, "Tablet", "Merck", "Blood pressure", "Dry cough, dizziness", "10mg once daily", "PKR 15-30 per tablet"),
            Med("Folic Acid", "Folic Acid", 7, "Tablet", "GSK", "Pregnancy, anemia", "Rarely any", "5mg once daily", "PKR 5-10 per tablet"),
            Med("Iron Supplement", "Ferrous Sulfate", 7, "Tablet", "Hilton", "Anemia", "Constipation, dark stools", "200mg once daily", "PKR 5-10 per tablet"),
            Med("Rimantadine", "Rimantadine", 8, "Tablet", "Hilton", "Influenza", "Nausea, dizziness", "100mg twice daily", "PKR 25-40 per tablet"),
            Med("Tussionex", "Chlorpheniramine+Dextromethorphan", 8, "Syrup", "3M", "Cough", "Drowsiness, dry mouth", "5ml thrice daily", "PKR 150-200 per bottle"),
            Med("Maxiflo", "Fluticasone+Salmeterol", 8, "Inhaler", "GSK", "Asthma, COPD", "Thrush, headache", "1 puff twice daily", "PKR 800-1200 per inhaler"),
            Med("Ceftum", "Cefixime", 2, "Capsule", "Ranbaxy", "Bacterial infections", "Diarrhea, rash", "200mg once daily", "PKR 40-60 per capsule"),
            Med("Ugestan", "Dydrogesterone", 7, "Tablet", "Abbott", "Hormonal imbalance", "Nausea, headache", "10mg twice daily", "PKR 30-50 per tablet"),
            Med("Primolut", "Norethisterone", 7, "Tablet", "Bayer", "Menstrual disorders", "Bloating, mood changes", "5mg once daily", "PKR 25-40 per tablet"),
            Med("Cataflam", "Diclofenac Potassium", 1, "Tablet", "Novartis", "Pain, inflammation", "Stomach pain, dizziness", "50mg twice daily", "PKR 10-15 per tablet"),
            Med("Zithromax", "Azithromycin", 2, "Tablet", "Pfizer", "Bacterial infections", "Diarrhea, nausea", "500mg once daily", "PKR 60-100 per tablet"),
            Med("Fungicide", "Fluconazole", 2, "Capsule", "Pfizer", "Fungal infections", "Headache, nausea", "150mg once weekly", "PKR 40-80 per capsule"),
            Med("Betahistine", "Betahistine", 4, "Tablet", "Searle", "Vertigo, tinnitus", "Nausea, itching", "16mg thrice daily", "PKR 15-25 per tablet"),
            Med("Carbamazepine", "Carbamazepine", 7, "Tablet", "Novartis", "Epilepsy, nerve pain", "Dizziness, drowsiness", "200mg twice daily", "PKR 15-30 per tablet"),
            Med("Warfarin", "Warfarin", 4, "Tablet", "Effik", "Blood thinner", "Bleeding, bruising", "As directed by doctor", "PKR 30-50 per tablet"),
            Med("Clopivas", "Clopidogrel", 4, "Tablet", "Getz", "Blood thinner", "Bleeding, stomach pain", "75mg once daily", "PKR 25-40 per tablet"),
            Med("Alprazolam", "Alprazolam", 7, "Tablet", "Hilton", "Anxiety", "Drowsiness, dependence", "0.25mg as directed", "PKR 10-20 per tablet"),
            Med("Ponstan", "Mefenamic Acid", 1, "Tablet", "Pfizer", "Pain relief, menstrual cramps", "Stomach pain, diarrhea, nausea", "500mg every 8 hours after food", "PKR 150-200"),
            Med("Nurofen", "Ibuprofen", 1, "Tablet", "Reckitt", "Pain and inflammation relief", "Stomach irritation, dizziness", "400mg every 8 hours after food", "PKR 200-300"),
            Med("Arcoxia", "Etoricoxib", 1, "Tablet", "MSD", "Anti-inflammatory pain relief", "High blood pressure, swelling, headache", "60-90mg once daily", "PKR 400-600"),
            Med("Klaricid", "Clarithromycin", 2, "Tablet", "Abbott", "Antibiotic for chest and skin infections", "Diarrhea, nausea, taste disturbance", "500mg twice daily", "PKR 600-900"),
            Med("Ceftriaxone", "Ceftriaxone", 2, "Injection", "Getz", "Antibiotic for severe bacterial infections", "Injection site pain, diarrhea", "1-2g once daily (IV/IM)", "PKR 350-500"),
            Med("Doxy-1", "Doxycycline", 2, "Capsule", "Searle", "Antibiotic for acne, malaria, infections", "Sun sensitivity, stomach upset", "100mg once or twice daily", "PKR 200-300"),
            Med("Telfast", "Fexofenadine", 3, "Tablet", "Sanofi", "Non-drowsy allergy relief", "Headache, mild drowsiness (rare)", "180mg once daily", "PKR 250-400"),
            Med("Atarax", "Hydroxyzine", 3, "Tablet", "UCB", "Allergy relief, anxiety, itching", "Drowsiness, dry mouth", "25mg at night", "PKR 150-250"),
            Med("Benadryl", "Diphenhydramine", 3, "Capsule", "KBN", "Allergy relief, sleep aid", "Heavy drowsiness, dry mouth", "25-50mg at night", "PKR 100-200"),
            Med("Cozar", "Losartan", 4, "Tablet", "Getz", "Blood pressure control", "Dizziness, tiredness, high potassium", "50-100mg once daily", "PKR 300-500"),
            Med("Lasix", "Furosemide", 4, "Tablet", "Sanofi", "Water pill for swelling and blood pressure", "Dehydration, low potassium, dizziness", "20-40mg in morning", "PKR 100-150"),
            Med("Tenormin", "Atenolol", 4, "Tablet", "AstraZeneca", "Blood pressure and heart rate control", "Tiredness, cold hands/feet", "50mg once daily", "PKR 200-350"),
            Med("Amaryl", "Glimepiride", 5, "Tablet", "Sanofi", "Lowers blood sugar in type 2 diabetes", "Low blood sugar, weight gain", "1-2mg before breakfast", "PKR 300-450"),
            Med("Januvia", "Sitagliptin", 5, "Tablet", "MSD", "Lowers blood sugar in type 2 diabetes", "Headache, sore throat", "100mg once daily", "PKR 800-1200"),
            Med("Lantus", "Insulin Glargine", 5, "Injection", "Sanofi", "Long-acting insulin for diabetes", "Low blood sugar, weight gain, injection site reactions", "Once daily at bedtime (dose by doctor)", "PKR 2500-3500"),
            Med("Diamicron", "Gliclazide", 5, "Tablet", "Servier", "Lowers blood sugar in type 2 diabetes", "Low blood sugar, digestive upset", "40-80mg before breakfast", "PKR 400-600"),
            Med("Pan 40", "Pantoprazole", 6, "Tablet", "Getz", "Reduces stomach acid, acid reflux", "Headache, diarrhea, vitamin B12 loss (long term)", "40mg before breakfast", "PKR 250-400"),
            Med("Gaviscon", "Sodium Alginate", 6, "Syrup", "RB", "Heartburn and acid reflux relief", "Mild nausea, chalky taste", "10ml after meals and at bedtime", "PKR 300-450"),
            Med("Zantac", "Ranitidine", 6, "Tablet", "GSK", "Reduces stomach acid (historical use)", "Headache, constipation", "150mg twice daily", "PKR 150-250"),
            Med("Neurobion", "Vitamin B Complex", 7, "Tablet", "Merck", "Nerve health, B-vitamin supplement", "Mild nausea, yellow urine (harmless)", "1 tablet daily after food", "PKR 200-350"),
            Med("Calcium Sandoz", "Calcium + Vitamin D", 7, "Effervescent", "Sanofi", "Bone strength, calcium supplement", "Gas, constipation", "1 tablet daily in water", "PKR 400-600"),
            Med("D-Rise", "Cholecalciferol (Vit D3)", 7, "Sachet", "Merck", "Vitamin D deficiency", "Nausea if overdosed", "50,000 IU weekly (as directed)", "PKR 150-250"),
            Med("Becosules", "Vitamin B Complex + C", 7, "Capsule", "Pfizer", "Vitamin deficiency, mouth ulcers", "Mild stomach upset", "1 capsule daily", "PKR 150-250"),
            Med("Actifed", "Triprolidine + Pseudoephedrine", 8, "Tablet", "Janssen", "Cold and flu relief", "Drowsiness, dry mouth, increased heart rate", "1 tablet up to 3 times daily", "PKR 200-300"),
            Med("Sinarest", "Paracetamol + Phenylephrine", 8, "Tablet", "Centaur", "Cold, flu, and headache relief", "Nausea, raised blood pressure", "1 tablet up to 3 times daily", "PKR 100-200"),
            Med("Coryfin", "Phenylephrine + Menthol", 8, "Syrup", "GSK", "Blocked nose and chest congestion", "Dizziness, increased heart rate", "10ml up to 3 times daily", "PKR 200-300"),
            Med("Sudafed", "Pseudoephedrine", 8, "Tablet", "Janssen", "Nasal and sinus congestion", "Insomnia, nervousness, raised BP", "60mg every 6-8 hours", "PKR 250-400"),
            Med("Strepsils", "Amylmetacresol + Lidocaine", 8, "Lozenge", "RB", "Sore throat relief", "Mild mouth numbness", "1 lozenge every 2-3 hours (max 8/day)", "PKR 150-250"),
            Med("Mucosolvan", "Ambroxol", 8, "Syrup", "Boehringer", "Chest congestion, productive cough", "Nausea, allergic reaction (rare)", "10ml twice daily", "PKR 250-400"),
            Med("Evion", "Vitamin E", 7, "Capsule", "Merck", "Antioxidant, vitamin E deficiency", "Headache, nausea (high doses)", "400 IU daily", "PKR 100-200")
        };
        db.Medicines.AddRange(meds);
        await db.SaveChangesAsync();

        Medicine M(int oneBasedIndex) => meds[oneBasedIndex - 1];

        db.Interactions.AddRange(
            new Interaction { Medicine1 = M(1), Medicine2 = M(2), Severity = "Mild", Description = "Both painkillers together may increase stomach irritation", Advice = "Take with food. Avoid long-term combined use." },
            new Interaction { Medicine1 = M(1), Medicine2 = M(8), Severity = "Mild", Description = "Paracetamol with Aspirin may affect liver at high doses", Advice = "Do not exceed recommended doses of either." },
            new Interaction { Medicine1 = M(2), Medicine2 = M(8), Severity = "Dangerous", Description = "Ibuprofen and Aspirin together significantly increase risk of stomach bleeding and ulcers", Advice = "Do NOT take together. Consult doctor for alternative." },
            new Interaction { Medicine1 = M(3), Medicine2 = M(1), Severity = "Safe", Description = "No significant interaction between Augmentin and Panadol", Advice = "Safe to take together as prescribed." },
            new Interaction { Medicine1 = M(4), Medicine2 = M(8), Severity = "Dangerous", Description = "Ciprofloxacin with Aspirin may increase bleeding risk", Advice = "Avoid combining. Consult your doctor." },
            new Interaction { Medicine1 = M(5), Medicine2 = M(2), Severity = "Mild", Description = "Cetirizine may enhance drowsiness effect of Ibuprofen", Advice = "Be cautious when driving or operating machinery." },
            new Interaction { Medicine1 = M(7), Medicine2 = M(2), Severity = "Mild", Description = "Ibuprofen may reduce blood pressure lowering effect of Amlodipine", Advice = "Monitor blood pressure regularly." },
            new Interaction { Medicine1 = M(9), Medicine2 = M(2), Severity = "Mild", Description = "Ibuprofen may affect blood sugar control of Metformin", Advice = "Monitor blood sugar levels closely." },
            new Interaction { Medicine1 = M(10), Medicine2 = M(2), Severity = "Mild", Description = "Ibuprofen may worsen nausea side effect of Domperidone", Advice = "Take with food to minimize stomach upset." },
            new Interaction { Medicine1 = M(11), Medicine2 = M(8), Severity = "Mild", Description = "Omeprazole may reduce absorption of Aspirin", Advice = "Take 2 hours apart." },
            new Interaction { Medicine1 = M(13), Medicine2 = M(2), Severity = "Mild", Description = "Disprin and Brufen both are NSAIDs - increased stomach risk", Advice = "Do not combine regularly. Risk of GI bleeding." },
            new Interaction { Medicine1 = M(16), Medicine2 = M(8), Severity = "Dangerous", Description = "Diclofenac with Aspirin greatly increases risk of GI bleeding", Advice = "Avoid combination. Risk of stomach ulcers and bleeding." },
            new Interaction { Medicine1 = M(19), Medicine2 = M(2), Severity = "Dangerous", Description = "Panadeine with Brufen - double painkiller risk to stomach", Advice = "Avoid combining. Use only as prescribed." },
            new Interaction { Medicine1 = M(26), Medicine2 = M(8), Severity = "Mild", Description = "Arthrotec contains Diclofenac - similar risk with Aspirin", Advice = "Monitor for stomach pain. Take with food." },
            new Interaction { Medicine1 = M(30), Medicine2 = M(8), Severity = "Mild", Description = "Brufen Syrup with Aspirin - NSAID combination risk", Advice = "Avoid for children without doctor advice." },
            new Interaction { Medicine1 = M(31), Medicine2 = M(8), Severity = "Mild", Description = "Adalat with Aspirin - monitor for low blood pressure", Advice = "Rise slowly from sitting position." },
            new Interaction { Medicine1 = M(42), Medicine2 = M(8), Severity = "Mild", Description = "Cataflam (Diclofenac) with Aspirin - GI bleeding risk", Advice = "Take with food. Short duration only." },
            new Interaction { Medicine1 = M(47), Medicine2 = M(8), Severity = "Dangerous", Description = "Warfarin with Aspirin - SEVERE bleeding risk", Advice = "NEVER combine without direct doctor supervision. Life-threatening." },
            new Interaction { Medicine1 = M(48), Medicine2 = M(8), Severity = "Dangerous", Description = "Clopivas with Aspirin - increased bleeding risk", Advice = "Do NOT combine. High risk of serious bleeding." },
            new Interaction { Medicine1 = M(47), Medicine2 = M(2), Severity = "Dangerous", Description = "Warfarin with Ibuprofen - increased bleeding risk", Advice = "Avoid Ibuprofen. Use Paracetamol instead for pain." },
            new Interaction { Medicine1 = M(48), Medicine2 = M(2), Severity = "Dangerous", Description = "Clopivas with Ibuprofen - bleeding risk increases", Advice = "Avoid Ibuprofen. Consult doctor for safe pain relief." },
            new Interaction { Medicine1 = M(47), Medicine2 = M(1), Severity = "Mild", Description = "Warfarin with Paracetamol - monitor INR levels", Advice = "Safe in normal doses. Regular blood tests recommended." },
            new Interaction { Medicine1 = M(49), Medicine2 = M(2), Severity = "Dangerous", Description = "Alprazolam with Ibuprofen - enhanced drowsiness and confusion", Advice = "Avoid driving. Risk of impaired coordination." },
            new Interaction { Medicine1 = M(49), Medicine2 = M(1), Severity = "Mild", Description = "Alprazolam with Paracetamol - increased drowsiness", Advice = "Take at bedtime. Avoid activities requiring alertness." },
            new Interaction { Medicine1 = M(6), Medicine2 = M(49), Severity = "Mild", Description = "Claritin with Alprazolam - may increase sedation", Advice = "Be cautious. May feel more drowsy than usual." },
            new Interaction { Medicine1 = M(14), Medicine2 = M(2), Severity = "Mild", Description = "Fexo with Ibuprofen - may increase headache", Advice = "Stay hydrated. Take with food." },
            new Interaction { Medicine1 = M(4), Medicine2 = M(47), Severity = "Mild", Description = "Ciprocin with Warfarin - may enhance anticoagulant effect", Advice = "Monitor INR closely. Report any bleeding immediately." },
            new Interaction { Medicine1 = M(3), Medicine2 = M(47), Severity = "Mild", Description = "Augmentin with Warfarin - may increase INR", Advice = "Regular blood monitoring recommended." },
            new Interaction { Medicine1 = M(27), Medicine2 = M(47), Severity = "Dangerous", Description = "Flagyl with Warfarin - significantly increased bleeding risk", Advice = "Avoid if possible. Requires close INR monitoring." },
            new Interaction { Medicine1 = M(33), Medicine2 = M(49), Severity = "Mild", Description = "Dilantin with Alprazolam - increased drowsiness", Advice = "Avoid driving. Take at night if possible." },
            new Interaction { Medicine1 = M(47), Medicine2 = M(51), Severity = "Dangerous", Description = "Nurofen (ibuprofen) significantly increases bleeding risk when combined with Warfarin", Advice = "Avoid this combination. Use Paracetamol for pain instead and consult your doctor." },
            new Interaction { Medicine1 = M(8), Medicine2 = M(51), Severity = "Dangerous", Description = "Loprin (aspirin) plus Nurofen (ibuprofen) together greatly increase stomach bleeding and ulcer risk", Advice = "Avoid combining two NSAIDs. Take only one, with food, for the shortest time." },
            new Interaction { Medicine1 = M(8), Medicine2 = M(52), Severity = "Dangerous", Description = "Loprin (aspirin) with Arcoxia (etoricoxib) raises the risk of gastric bleeding and kidney strain", Advice = "Do not combine. Ask your doctor for a safer pain option such as Paracetamol." },
            new Interaction { Medicine1 = M(1), Medicine2 = M(50), Severity = "Mild", Description = "Ponstan and Panadol together may irritate the stomach; both are painkillers with different actions", Advice = "Occasional combined use is usually okay with food. Avoid long-term use together." },
            new Interaction { Medicine1 = M(19), Medicine2 = M(1), Severity = "Major", Description = "Panadeine already contains Paracetamol — adding Panadol can cause accidental Paracetamol overdose and liver damage", Advice = "Do not take both. Count all Paracetamol-containing medicines toward the 4g/day maximum." },
            new Interaction { Medicine1 = M(59), Medicine2 = M(60), Severity = "Mild", Description = "Cozar (losartan) with Lasix (furosemide) can lower blood pressure too much and deplete potassium", Advice = "Monitor blood pressure and potassium levels. Stay hydrated and report dizziness." },
            new Interaction { Medicine1 = M(62), Medicine2 = M(8), Severity = "Major", Description = "Loprin (aspirin) can raise blood sugar control issues and mask hypoglycemia symptoms in diabetics taking Amaryl", Advice = "Monitor blood sugar closely. Watch for unusual sweating, tremor, or confusion." },
            new Interaction { Medicine1 = M(66), Medicine2 = M(3), Severity = "Major", Description = "Pan 40 (pantoprazole) reduces stomach acidity needed for Augmentin absorption, lowering antibiotic effectiveness", Advice = "Take Augmentin 2 hours before or after Pan 40. Complete the full antibiotic course." },
            new Interaction { Medicine1 = M(56), Medicine2 = M(57), Severity = "Dangerous", Description = "Telfast plus Atarax combines antihistamine effects causing severe drowsiness and impaired coordination", Advice = "Avoid taking together. Prefer a single non-drowsy antihistamine like Telfast alone." },
            new Interaction { Medicine1 = M(58), Medicine2 = M(57), Severity = "Dangerous", Description = "Benadryl with Atarax causes additive sedation, dry mouth, and risk of confusion in elderly patients", Advice = "Avoid this combination, especially in older adults. Consult your doctor." },
            new Interaction { Medicine1 = M(53), Medicine2 = M(47), Severity = "Major", Description = "Klaricid (clarithromycin) strongly increases Warfarin levels, raising bleeding risk", Advice = "Requires INR monitoring and possible Warfarin dose reduction. Report any bruising or bleeding." },
            new Interaction { Medicine1 = M(55), Medicine2 = M(47), Severity = "Major", Description = "Doxy-1 (doxycycline) can enhance Warfarin effect and increase bleeding risk", Advice = "Monitor for unusual bleeding. Maintain consistent vitamin K intake from food." },
            new Interaction { Medicine1 = M(52), Medicine2 = M(48), Severity = "Major", Description = "Arcoxia (etoricoxib) with Clopivas (clopidogrel) increases gastrointestinal bleeding risk", Advice = "Use the lowest Arcoxia dose for the shortest time. Take with food and gastroprotection." },
            new Interaction { Medicine1 = M(66), Medicine2 = M(48), Severity = "Major", Description = "Pan 40 (pantoprazole) reduces activation of Clopivas (clopidogrel), weakening its anti-clotting effect", Advice = "Consider replacing Pan 40 with Pantoprazole alternatives like Ranitidine, or use Clopidogrel at a different time. Discuss with cardiologist." },
            new Interaction { Medicine1 = M(49), Medicine2 = M(57), Severity = "Dangerous", Description = "Alprazolam with Atarax causes dangerous combined sedation, breathing depression, and falls risk", Advice = "Avoid combining. Never increase doses of either without medical supervision." }
        );
        await db.SaveChangesAsync();
    }

    private static Medicine Med(string name, string generic, int cat, string form, string maker, string purpose, string side, string dosage, string price) =>
        new() { Name = name, GenericName = generic, CategoryId = cat, Form = form, Manufacturer = maker, Purpose = purpose, SideEffects = side, Dosage = dosage, PriceRange = price };
}
