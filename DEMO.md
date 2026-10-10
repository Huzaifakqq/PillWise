# 🎤 PillWise — 4-Minute Demo Script

> Islamabad Hack 2026 — Community & Society Track
> **Rule:** demo must finish within 4 minutes. Timings below are hard limits.

---

## [0:00–0:30] HOOK — The Problem (30s)
> "Every year, thousands die from medicine interactions that nobody checked for.
> In Pakistan, 1 in 5 medicines is substandard. Our elderly relatives take 5+ medicines a day —
> prescribed by different doctors who never talk to each other.
> One dangerous pair — like Aspirin + Warfarin — can cause internal bleeding overnight.
> **Nobody checks. Until now.**"

**Screen:** Landing page hero (particles + interaction examples animating).

---

## [0:30–1:30] LIVE DEMO — One Dangerous Pair (60s)
**Screen:** Click **"Live Demo"** button (loads Ayesha Khan's account instantly).

> "This is Ayesha. She takes 5 medicines. Her mother — Amma, 62 — takes 2 more.
> Watch what happens when we check her list."

1. Go to **⚡ Checker** → click **Select All** → **Check Now**
2. Radar scanner animates → results bounce in
3. **Point at the red card:** "Warfarin + Brufen — DANGEROUS. Bleeding risk.
   PillWise tells her to switch pain relief to Paracetamol instead."
4. **Show confetti/shield:** "Every safe pair gets a green all-clear."
5. Click **🖼️ Share Card** → PNG downloads:
   "She sends this to her family WhatsApp group. One image, saved a life."

---

## [1:30–2:30] MORE THAN A CHECKER (60s)
**Screen:** Navigate quickly through features (don't explain each fully):

1. **📊 Dashboard** — "Animated safety score gauge. Live donut chart.
   Weekly activity. Her whole risk picture in one screen."
2. **📷 Scanner** — "Points camera at a medicine box barcode → instant identification.
   Tap a demo code to simulate." *(tap Panadol code)*
3. **⏰ Dose Reminders** — "Notification when it's time for each dose."
4. **👨‍👩‍👧 Family** — "Amma's medicines tracked separately — with her own warnings."
5. **🌐 اردو toggle** — *(click language button)* "Full Urdu with Nastaliq font — for the people who need it most."
6. **🤖 AI Assistant** — *(optional, if time)* "Ask 'Can I take Panadol with Brufen?' — instant answer."

---

## [2:30–3:15] THE NUMBERS & TECH (45s)
**Screen:** Landing stats section + architecture slide/GitHub.

> "79 medicines. 45 known interactions. Fuzzy search — type 'panadl' and still find Panadol.
>
> Tech: Next.js 16 frontend on Vercel. ASP.NET Core 10 + EF Core + SQL Server backend.
> Swagger docs, Serilog logging, rate limiting, 7 passing unit tests, CI on every push.
> PWA — installable on phones. Docker-compose runs everything with one command.
>
> **Built spec-first with Kiro** — specs → tasks → tested code."

---

## [3:15–4:00] IMPACT & ASK (45s)
> "This isn't a prototype for a rich-country hospital.
> It works on a $100 Android phone, in Urdu, for a family in Rawalpindi
> whose father was prescribed three medicines by three different doctors.
>
> Impact: preventable deaths → prevented. Pharmacists get a checking tool.
> CHICs and Lady Health Workers can screen a whole street.
>
> PillWise — **Be Wise Before You Take.**
> Try it yourself: the Live Demo button. Thank you!"

---

## ⚠️ Demo-Day Checklist
- [ ] Laptop charged, backend running (`dotnet run`), frontend `npm run start`
- [ ] Internet on (for fonts/Vercel fallback)
- [ ] Camera permission granted on Chrome beforehand (for scanner)
- [ ] Notification permission pre-granted (for reminders)
- [ ] Git repo + README open in second tab
- [ ] KIRO.md open (judges may ask)
- [ ] Backup: run `docker compose up` beforehand as failsafe environment
- [ ] Practice run 2× with a stopwatch — **must finish < 4:00**
