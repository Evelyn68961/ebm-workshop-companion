# EBM Workshop Companion 📋

A mobile-first web app for hospital pharmacy department EBM (Evidence-Based Medicine) journal club workshops. Pharmacists read a clinical paper, answer structured critical appraisal questions in groups on their phones, and all answers are displayed live on a facilitator's projected dashboard.

> Built for 輔醫藥劑部 實證臨床能力培訓課程

## Features

- **Two paper templates** — RCT (8 questions) and Systematic Review / Meta-Analysis (6 questions)
- **Group-based question assignment** — each group only sees their assigned questions
- **Inline EBM concept help** — tap 💡 on any question for a beginner-friendly explainer (randomization, blinding, ITT, RoB, GRADE, forest plots, etc.)
- **Facilitator dashboard** — projected view with timer, phase controls, and live answers from each group
- **Phone-first design** — built for pharmacists typing answers on their phones during the 25-minute discussion
- **Bilingual** — Chinese (default) / English toggle

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open `http://localhost:3000` in your browser.

### Demo mode

No backend setup needed for testing:

1. Click **參與者模式** (Participant Mode)
2. Enter any 4-digit code (e.g. `1234`)
3. Pick RCT or SR/MA, enter a name, select a group
4. You'll see the workshop screen with your group's assigned questions

To test the facilitator view:

1. Click **主持人模式** (Facilitator Mode)
2. Select paper type, enter a title, click **建立**
3. Use the dashboard to control phases and view answers

## Tech Stack

- **React** (Vite)
- **Vercel** (hosting)
- **Supabase** (database + realtime — coming soon)

## Project Structure

```
├── index.html
├── package.json
├── vite.config.js
├── EBM_WORKSHOP_COMPANION_PLAN.md   ← architecture & design doc
└── src/
    ├── main.jsx
    └── App.jsx                      ← all screens, questions, concept help
```

## Workshop Flow

```
Facilitator creates session (paper type + title + groups)
  → Shares 4-digit room code
  → Pharmacists join on their phones

25 min Discussion Phase:
  → Each group answers their assigned questions
  → 💡 concept help available for every question

25 min Reporting Phase:
  → Facilitator dashboard shows all answers
  → Groups present their answers
```

### Question Assignment

**RCT (8 questions):**

| Group | Questions |
|-------|-----------|
| 組 1 | Q1 PICO, Q2 Randomization |
| 組 2 | Q3 Blinding, Q4 Baseline |
| 組 3 | Q5 ITT/Attrition, Q6 Endpoints |
| 組 4 | Q7 Effect Size, Q8 Applicability |

**SR/MA (6 questions):**

| Group | Questions |
|-------|-----------|
| 組 1 | Q1 PICO, Q2 Search Strategy |
| 組 2 | Q3 Quality Assessment |
| 組 3 | Q4 Data Synthesis |
| 組 4 | Q5 Results/Heterogeneity, Q6 Applicability |

## Roadmap

- [x] Core UI — home, join, workshop, admin, dashboard
- [x] Two question templates (RCT + SR/MA)
- [x] Group-to-question assignment
- [x] EBM concept help (12 topic cards)
- [x] Timer + phase controls
- [x] Bilingual (ZH/EN)
- [ ] Supabase realtime (sync answers across devices)
- [ ] PDF upload + in-app reader
- [ ] QR code for room code
- [ ] Session history + export

## License

MIT
