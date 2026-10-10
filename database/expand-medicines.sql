-- PillWise DB expansion: +30 medicines (IDs 50-79), +15 interactions (IDs 31-45)
-- Safe to run once; skips if IDs already exist.

IF NOT EXISTS (SELECT 1 FROM Medicines WHERE Id = 50)
BEGIN
  INSERT INTO Medicines (Id, Name, GenericName, CategoryId, Form, Manufacturer, Purpose, SideEffects, Dosage, PriceRange) VALUES
  (50, 'Ponstan', 'Mefenamic Acid', 1, 'Tablet', 'Pfizer', 'Pain relief, menstrual cramps', 'Stomach pain, diarrhea, nausea', '500mg every 8 hours after food', 'PKR 150-200'),
  (51, 'Nurofen', 'Ibuprofen', 1, 'Tablet', 'Reckitt', 'Pain and inflammation relief', 'Stomach irritation, dizziness', '400mg every 8 hours after food', 'PKR 200-300'),
  (52, 'Arcoxia', 'Etoricoxib', 1, 'Tablet', 'MSD', 'Anti-inflammatory pain relief', 'High blood pressure, swelling, headache', '60-90mg once daily', 'PKR 400-600'),
  (53, 'Klaricid', 'Clarithromycin', 2, 'Tablet', 'Abbott', 'Antibiotic for chest and skin infections', 'Diarrhea, nausea, taste disturbance', '500mg twice daily', 'PKR 600-900'),
  (54, 'Ceftriaxone', 'Ceftriaxone', 2, 'Injection', 'Getz', 'Antibiotic for severe bacterial infections', 'Injection site pain, diarrhea', '1-2g once daily (IV/IM)', 'PKR 350-500'),
  (55, 'Doxy-1', 'Doxycycline', 2, 'Capsule', 'Searle', 'Antibiotic for acne, malaria, infections', 'Sun sensitivity, stomach upset', '100mg once or twice daily', 'PKR 200-300'),
  (56, 'Telfast', 'Fexofenadine', 3, 'Tablet', 'Sanofi', 'Non-drowsy allergy relief', 'Headache, mild drowsiness (rare)', '180mg once daily', 'PKR 250-400'),
  (57, 'Atarax', 'Hydroxyzine', 3, 'Tablet', 'UCB', 'Allergy relief, anxiety, itching', 'Drowsiness, dry mouth', '25mg at night', 'PKR 150-250'),
  (58, 'Benadryl', 'Diphenhydramine', 3, 'Capsule', 'KBN', 'Allergy relief, sleep aid', 'Heavy drowsiness, dry mouth', '25-50mg at night', 'PKR 100-200'),
  (59, 'Cozar', 'Losartan', 4, 'Tablet', 'Getz', 'Blood pressure control', 'Dizziness, tiredness, high potassium', '50-100mg once daily', 'PKR 300-500'),
  (60, 'Lasix', 'Furosemide', 4, 'Tablet', 'Sanofi', 'Water pill for swelling and blood pressure', 'Dehydration, low potassium, dizziness', '20-40mg in morning', 'PKR 100-150'),
  (61, 'Tenormin', 'Atenolol', 4, 'Tablet', 'AstraZeneca', 'Blood pressure and heart rate control', 'Tiredness, cold hands/feet', '50mg once daily', 'PKR 200-350'),
  (62, 'Amaryl', 'Glimepiride', 5, 'Tablet', 'Sanofi', 'Lowers blood sugar in type 2 diabetes', 'Low blood sugar, weight gain', '1-2mg before breakfast', 'PKR 300-450'),
  (63, 'Januvia', 'Sitagliptin', 5, 'Tablet', 'MSD', 'Lowers blood sugar in type 2 diabetes', 'Headache, sore throat', '100mg once daily', 'PKR 800-1200'),
  (64, 'Lantus', 'Insulin Glargine', 5, 'Injection', 'Sanofi', 'Long-acting insulin for diabetes', 'Low blood sugar, weight gain, injection site reactions', 'Once daily at bedtime (dose by doctor)', 'PKR 2500-3500'),
  (65, 'Diamicron', 'Gliclazide', 5, 'Tablet', 'Servier', 'Lowers blood sugar in type 2 diabetes', 'Low blood sugar, digestive upset', '40-80mg before breakfast', 'PKR 400-600'),
  (66, 'Pan 40', 'Pantoprazole', 6, 'Tablet', 'Getz', 'Reduces stomach acid, acid reflux', 'Headache, diarrhea, vitamin B12 loss (long term)', '40mg before breakfast', 'PKR 250-400'),
  (67, 'Gaviscon', 'Sodium Alginate', 6, 'Syrup', 'RB', 'Heartburn and acid reflux relief', 'Mild nausea, chalky taste', '10ml after meals and at bedtime', 'PKR 300-450'),
  (68, 'Zantac', 'Ranitidine', 6, 'Tablet', 'GSK', 'Reduces stomach acid (historical use)', 'Headache, constipation', '150mg twice daily', 'PKR 150-250'),
  (69, 'Neurobion', 'Vitamin B Complex', 7, 'Tablet', 'Merck', 'Nerve health, B-vitamin supplement', 'Mild nausea, yellow urine (harmless)', '1 tablet daily after food', 'PKR 200-350'),
  (70, 'Calcium Sandoz', 'Calcium + Vitamin D', 7, 'Effervescent', 'Sanofi', 'Bone strength, calcium supplement', 'Gas, constipation', '1 tablet daily in water', 'PKR 400-600'),
  (71, 'D-Rise', 'Cholecalciferol (Vit D3)', 7, 'Sachet', 'Merck', 'Vitamin D deficiency', 'Nausea if overdosed', '50,000 IU weekly (as directed)', 'PKR 150-250'),
  (72, 'Becosules', 'Vitamin B Complex + C', 7, 'Capsule', 'Pfizer', 'Vitamin deficiency, mouth ulcers', 'Mild stomach upset', '1 capsule daily', 'PKR 150-250'),
  (73, 'Actifed', 'Triprolidine + Pseudoephedrine', 8, 'Tablet', 'Janssen', 'Cold and flu relief', 'Drowsiness, dry mouth, increased heart rate', '1 tablet up to 3 times daily', 'PKR 200-300'),
  (74, 'Sinarest', 'Paracetamol + Phenylephrine', 8, 'Tablet', 'Centaur', 'Cold, flu, and headache relief', 'Nausea, raised blood pressure', '1 tablet up to 3 times daily', 'PKR 100-200'),
  (75, 'Coryfin', 'Phenylephrine + Menthol', 8, 'Syrup', 'GSK', 'Blocked nose and chest congestion', 'Dizziness, increased heart rate', '10ml up to 3 times daily', 'PKR 200-300'),
  (76, 'Sudafed', 'Pseudoephedrine', 8, 'Tablet', 'Janssen', 'Nasal and sinus congestion', 'Insomnia, nervousness, raised BP', '60mg every 6-8 hours', 'PKR 250-400'),
  (77, 'Strepsils', 'Amylmetacresol + Lidocaine', 8, 'Lozenge', 'RB', 'Sore throat relief', 'Mild mouth numbness', '1 lozenge every 2-3 hours (max 8/day)', 'PKR 150-250'),
  (78, 'Mucosolvan', 'Ambroxol', 8, 'Syrup', 'Boehringer', 'Chest congestion, productive cough', 'Nausea, allergic reaction (rare)', '10ml twice daily', 'PKR 250-400'),
  (79, 'Evion', 'Vitamin E', 7, 'Capsule', 'Merck', 'Antioxidant, vitamin E deficiency', 'Headache, nausea (high doses)', '400 IU daily', 'PKR 100-200');
END

IF NOT EXISTS (SELECT 1 FROM Interactions WHERE Id = 31)
BEGIN
  INSERT INTO Interactions (Id, Medicine1Id, Medicine2Id, Severity, Description, Advice) VALUES
  (31, 47, 51, 'Dangerous', 'Nurofen (ibuprofen) significantly increases bleeding risk when combined with Warfarin', 'Avoid this combination. Use Paracetamol for pain instead and consult your doctor.'),
  (32, 8, 51, 'Dangerous', 'Loprin (aspirin) plus Nurofen (ibuprofen) together greatly increase stomach bleeding and ulcer risk', 'Avoid combining two NSAIDs. Take only one, with food, for the shortest time.'),
  (33, 8, 52, 'Dangerous', 'Loprin (aspirin) with Arcoxia (etoricoxib) raises the risk of gastric bleeding and kidney strain', 'Do not combine. Ask your doctor for a safer pain option such as Paracetamol.'),
  (34, 1, 50, 'Mild', 'Ponstan and Panadol together may irritate the stomach; both are painkillers with different actions', 'Occasional combined use is usually okay with food. Avoid long-term use together.'),
  (35, 19, 1, 'Major', 'Panadeine already contains Paracetamol — adding Panadol can cause accidental Paracetamol overdose and liver damage', 'Do not take both. Count all Paracetamol-containing medicines toward the 4g/day maximum.'),
  (36, 59, 60, 'Mild', 'Cozar (losartan) with Lasix (furosemide) can lower blood pressure too much and deplete potassium', 'Monitor blood pressure and potassium levels. Stay hydrated and report dizziness.'),
  (37, 62, 8, 'Major', 'Loprin (aspirin) can raise blood sugar control issues and mask hypoglycemia symptoms in diabetics taking Amaryl', 'Monitor blood sugar closely. Watch for unusual sweating, tremor, or confusion.'),
  (38, 66, 3, 'Major', 'Pan 40 (pantoprazole) reduces stomach acidity needed for Augmentin absorption, lowering antibiotic effectiveness', 'Take Augmentin 2 hours before or after Pan 40. Complete the full antibiotic course.'),
  (39, 56, 57, 'Dangerous', 'Telfast plus Atarax combines antihistamine effects causing severe drowsiness and impaired coordination', 'Avoid taking together. Prefer a single non-drowsy antihistamine like Telfast alone.'),
  (40, 58, 57, 'Dangerous', 'Benadryl with Atarax causes additive sedation, dry mouth, and risk of confusion in elderly patients', 'Avoid this combination, especially in older adults. Consult your doctor.'),
  (41, 53, 47, 'Major', 'Klaricid (clarithromycin) strongly increases Warfarin levels, raising bleeding risk', 'Requires INR monitoring and possible Warfarin dose reduction. Report any bruising or bleeding.'),
  (42, 55, 47, 'Major', 'Doxy-1 (doxycycline) can enhance Warfarin effect and increase bleeding risk', 'Monitor for unusual bleeding. Maintain consistent vitamin K intake from food.'),
  (43, 52, 48, 'Major', 'Arcoxia (etoricoxib) with Clopivas (clopidogrel) increases gastrointestinal bleeding risk', 'Use the lowest Arcoxia dose for the shortest time. Take with food and gastroprotection.'),
  (44, 66, 48, 'Major', 'Pan 40 (pantoprazole) reduces activation of Clopivas (clopidogrel), weakening its anti-clotting effect', 'Consider replacing Pan 40 with Pantoprazole alternatives like Ranitidine, or use Clopidogrel at a different time. Discuss with cardiologist.'),
  (45, 49, 57, 'Dangerous', 'Alprazolam with Atarax causes dangerous combined sedation, breathing depression, and falls risk', 'Avoid combining. Never increase doses of either without medical supervision.');
END
