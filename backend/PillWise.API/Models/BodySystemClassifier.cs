namespace PillWise.API.Models;

/// <summary>
/// Maps medicines to the body system most affected by their side effects,
/// powering the "interaction heatmap by body system" visual.
/// </summary>
public static class BodySystemClassifier
{
    public static string Classify(string medicineName, string? sideEffects)
    {
        var text = $"{medicineName} {sideEffects}".ToLowerInvariant();

        if (ContainsAny(text, "bleed", "ulcer", "gastric", "stomach", "nausea", "vomit", "diarrhea", "constipation", "reflux", "heartburn", "acid", "liver"))
            return "Gastrointestinal";

        if (ContainsAny(text, "kidney", "renal", "potassium", "dehydrat", "urinary"))
            return "Kidney & Urinary";

        if (ContainsAny(text, "tendon", "rash", "skin", "allerg", "itch"))
            return "Skin & Allergic";

        if (ContainsAny(text, "drowsi", "dizz", "tremor", "headache", "seizure", "nervous", "addiction", "sedat", "sleep"))
            return "Nervous System";

        if (ContainsAny(text, "blood", "inr", "clot", "bruise", "heart", "pressure", "cardio", "cardiac"))
            return "Cardiovascular & Blood";

        if (ContainsAny(text, "sugar", "glucose", "diabet", "insulin"))
            return "Metabolic";

        if (ContainsAny(text, "breath", "asthma", "lung", "cough", "inhal"))
            return "Respiratory";

        if (ContainsAny(text, "infect", "antibiotic", "bacteria", "fever"))
            return "Immune & Infection";

        return "General";
    }

    private static bool ContainsAny(string text, params string[] keywords) =>
        keywords.Any(k => text.Contains(k, StringComparison.Ordinal));
}
