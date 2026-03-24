# EBM Workshop Companion — Architecture Plan

> **Purpose:** A mobile-first web app for the 輔醫藥劑部 monthly EBM workshop. Pharmacists read a paper, answer structured appraisal questions in groups on their phones, and all answers are displayed live on a facilitator screen.
>
> **Audience:** ~12 pharmacists + interns per session, most with no EBM background.
>
> **Language:** Chinese default, English interface available.
>
> **Repo:** `ebm-workshop-companion` (GitHub, separate from MA101)
>
> **Deploy:** Vercel (auto-deploy on push to `main`)

---

## 1. User Flows

### Flow A — Facilitator (主持人)

```
Admin page:
  → Select paper type: RCT or SR/MA
  → Fill in: paper title, authors
  → Set number of groups (2–4)
  → Create session → get a 4-digit room code

Workshop day:
  → Open facilitator dashboard on projector (laptop browser)
  → Share room code (QR code in Phase 2)
  → Control phases: Setup → Discussion (25 min) → Reporting (25 min)
  → See each group's assigned answer appear in real time
  → Each question shows ONE group's answer (the assigned group)
```

### Flow B — Pharmacist (participant)

```
Open app on phone → enter room code + name + select group
  → Sees ONLY their group's assigned questions (not all questions)
  → Paper title/authors shown in collapsible header

During 25-min discussion:
  → Answer assigned question(s) — typing on phone
  → Tap 💡 next to any question for EBM concept explainer
  → Groupmates can edit the same answer (last-write-wins for now)

During 25-min reporting:
  → Facilitator screen shows all questions with each group's answer
```

---

## 2. Screen Map (5 screens built)

```
┌─────────────────────────────────────────────────┐
│                   PUBLIC                         │
│                                                  │
│  ① Home Screen                                   │
│     - "參與者模式" button → Join                  │
│     - "主持人模式" button → Admin                 │
│     - Language toggle (ZH/EN)                    │
│                                                  │
│  ② Join Screen                                   │
│     - Enter 4-digit room code                    │
│     - Enter name                                 │
│     - Paper type selector (demo mode only)       │
│     - Select group (color-coded: 1–4)            │
│                                                  │
│  ③ Workshop Screen (phone, scrollable)           │
│     ┌──────────────────────────────────┐         │
│     │ Header: app name, room code,     │         │
│     │         timer, lang toggle       │         │
│     ├──────────────────────────────────┤         │
│     │ Group badge + phase indicator    │         │
│     ├──────────────────────────────────┤         │
│     │ Paper header (collapsible):      │         │
│     │   title, authors, type badge     │         │
│     ├──────────────────────────────────┤         │
│     │ Sticky tab bar (group's Qs only) │         │
│     ├──────────────────────────────────┤         │
│     │ Only assigned questions:         │         │
│     │  ┌── Question ───────────────┐   │         │
│     │  │ # badge + question text   │   │         │
│     │  │ [💡 concept help] expand  │   │         │
│     │  │ textarea (answer area)    │   │         │
│     │  └───────────────────────────┘   │         │
│     └──────────────────────────────────┘         │
│                                                  │
├─────────────────────────────────────────────────┤
│                FACILITATOR                       │
│                                                  │
│  ④ Admin: Create Session                         │
│     - Paper type: RCT or SR/MA                   │
│     - Paper title + authors                      │
│     - Number of groups (2/3/4)                   │
│     - Generate room code                         │
│     (NO PICO — participants fill that in Q1)     │
│                                                  │
│  ⑤ Facilitator Dashboard (projector view)        │
│     - Large room code display                    │
│     - Paper title + type badge                   │
│     - Phase controls: Setup → Discussion →       │
│       Reporting → End                            │
│     - 25-min countdown timer                     │
│     - Participant list (name + group)            │
│     - One card per question:                     │
│       question text + assigned group badge +     │
│       that group's answer (or "尚未作答")         │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## 3. Question Templates & Group Assignments

### Template A — RCT (隨機分派試驗) — 8 Questions

| # | Section | Question (Chinese) | Assigned To |
|---|---------|-------------------|-------------|
| Q1 | PICO | 這項研究是否有明確、可回答的臨床問題？PICO 是什麼？ | **組 1** |
| Q2 | Randomization | 這一篇文章有隨機分派嗎？隨機分派的方法可信嗎？分組結果是否可能被預測（分派隱匿）？ | **組 1** |
| Q3 | Blinding | 這一篇文章有維持盲性嗎？怎麼做到的，對象有誰？如果沒做到，會發生什麼事情呢？ | **組 2** |
| Q4 | Baseline | 隨機分派後的兩組研究對象基本特徵是否相似？ | **組 2** |
| Q5 | ITT / Attrition | 所有受試者都有納入最後的分析 (ITT) 嗎？受試者退出的原因是什麼？ | **組 3** |
| Q6 | Endpoints | 這一篇研究結果主要是看什麼（試驗終點）？是否客觀且具臨床意義？ | **組 3** |
| Q7 | Effect Size | 這一篇研究的治療效果有多大？估計是否精準？利益是否大於風險與不良反應？ | **組 4** |
| Q8 | Applicability | 這一篇研究可應用於臨床執業嗎？介入在實務上是否可行？使用時該注意什麼？ | **組 4** |

### Template B — SR/MA (系統性回顧及統合分析) — 6 Questions

| # | Section | Question (Chinese) | Assigned To |
|---|---------|-------------------|-------------|
| Q1 | PICO | 這項研究是否有明確、可回答的臨床問題？PICO 是什麼？ | **組 1** |
| Q2 | Search & Selection | 這一篇文章有檢索所有重要的、相關的研究嗎？納入與排除標準是什麼？ | **組 1** |
| Q3 | Quality Assessment | 這一篇文章是否採用適當可靠的方法來評估納入的研究品質？ | **組 2** |
| Q4 | Data Synthesis | 這一篇研究主要結果有合併嗎？合併方法或模型是什麼？合併方式合理嗎？ | **組 3** |
| Q5 | Results & Heterogeneity | 整體結果如何？研究之間有異質性嗎？結果精準嗎？ | **組 4** |
| Q6 | Applicability | 這項研究結果可以應用於臨床執業嗎？介入在實務上是否可行？ | **組 4** |

### Assignment logic (hardcoded in `getGroupForQuestion()`):

```
RCT:   Q1-2 → G1 | Q3-4 → G2 | Q5-6 → G3 | Q7-8 → G4
SR/MA: Q1-2 → G1 | Q3 → G2   | Q4 → G3   | Q5-6 → G4
```

Participants only see and edit questions assigned to their group. Dashboard shows one group's answer per question.

---

## 4. Tech Stack

| Layer | Choice | Status |
|-------|--------|--------|
| Frontend | React (Vite) | ✅ Built |
| Hosting | Vercel | ✅ Deployed |
| Database | Supabase | ⬜ Not wired yet |
| Realtime sync | Supabase Realtime | ⬜ Not wired yet |
| PDF storage | Supabase Storage | ⬜ Phase 2 |
| PDF viewing | react-pdf | ⬜ Phase 2 |
| i18n | Custom (ZH/EN object) | ✅ Built |
| Auth | Room code for participants; password for admin | ✅ Partial (room code works, admin password not yet) |

### Project structure

```
ebm-workshop-companion/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── EBM_WORKSHOP_COMPANION_PLAN.md  ← this file
└── src/
    ├── main.jsx
    └── App.jsx                     ← all screens, questions, concept help (~1200 lines)
```

---

## 5. Database Schema (for Supabase — not yet created)

### `workshop_sessions` table

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | Auto-generated |
| room_code | TEXT (unique) | 4-digit code for joining |
| paper_type | TEXT | "rct" or "srma" — determines which question template |
| title | TEXT | Paper title |
| authors | TEXT | Paper authors |
| num_groups | INT | 2, 3, or 4 |
| phase | TEXT | "setup" / "discussion" / "reporting" / "closed" |
| timer_end | TIMESTAMPTZ | When current phase timer expires |
| admin_password_hash | TEXT | Simple password for this session |
| created_at | TIMESTAMPTZ | Auto |

*No PICO columns — PICO is answered by participants in Q1.*
*No summary_cards or pdf_url yet — Phase 2.*

### `workshop_participants` table

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | Auto-generated |
| session_id | UUID (FK) | → workshop_sessions.id |
| name | TEXT | Participant display name |
| group_id | INT | Which group (1, 2, 3, 4) |
| joined_at | TIMESTAMPTZ | Auto |

### `workshop_answers` table

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | Auto-generated |
| session_id | UUID (FK) | → workshop_sessions.id |
| group_id | INT | The assigned group for this question |
| question_num | INT | 1–8 (RCT) or 1–6 (SR/MA) |
| content | TEXT | The group's answer (latest version) |
| updated_at | TIMESTAMPTZ | Auto-updated on each edit |
| updated_by | TEXT | Name of last editor |

**Realtime:** Subscribe to `workshop_answers` filtered by `session_id`. When any group member types, their edits are saved (debounced ~1s) and broadcast to:
- Other group members (same group_id) → they see the updated answer
- Facilitator dashboard → shows the assigned group's answer per question

---

## 6. EBM Concept Help Content

All concept help is built into `App.jsx` in the `CONCEPT_HELP` object. Each 💡 button expands an inline card with structured content (text, lists, subtitles, tips).

| Question | Concept Card | Key Topics |
|----------|-------------|------------|
| **Shared: PICO** | 📋 什麼是 PICO？ | P/I/C/O framework, example |
| **Shared: Applicability** | 🏥 臨床適用性 | External validity, NNT, feasibility |
| **RCT-Q2** | 🎲 隨機分派 & 分派隱匿 | Simple/block/stratified/minimization, concealment |
| **RCT-Q3** | 🕶️ 盲性 | Single/double/triple blind, open-label, consequences |
| **RCT-Q4** | 📊 基線特徵比較 | Reading Table 1, clinical vs statistical significance |
| **RCT-Q5** | 📋 意向分析 & 退出 | ITT/mITT/per-protocol, CONSORT, dropout rates |
| **RCT-Q6** | 🎯 試驗終點 | Primary/secondary, hard/soft, surrogate outcomes |
| **RCT-Q7** | 📐 治療效果 & 精準度 | RR, OR, ARR, NNT, CI interpretation |
| **SR-Q2** | 🔍 搜尋策略 & 納入排除 | Databases, MeSH, grey literature, criteria |
| **SR-Q3** | ⚖️ RoB 2 & GRADE | 5 bias domains, 4 certainty levels, reviewer process |
| **SR-Q4** | 🔢 合併分析方法 | Fixed vs random effects, Bayesian vs frequentist |
| **SR-Q5** | 📊 結果 & 異質性 | Forest plot reading, I², Q-test, precision |

---

## 7. Build Phases & Status

### Phase 1 — Core MVP ✅ BUILT (except realtime)

- [x] Project setup: Vite + React
- [x] Home screen with participant/facilitator mode buttons
- [x] Join screen (room code + name + group selection)
- [x] Paper type selector on join screen (demo mode)
- [x] Workshop screen: group sees ONLY assigned questions
- [x] Facilitator dashboard: one group's answer per question
- [x] Admin: create session (paper type + title + authors + groups)
- [x] Timer (25 min countdown, urgent pulse < 5 min)
- [x] Phase controls (Setup → Discussion → Reporting → End)
- [x] 💡 concept help cards (inline expandable, all 12 cards)
- [x] i18n: ZH default, EN toggle
- [x] Phone-first CSS: single column, large touch targets, sticky tab bar
- [x] Two question templates: RCT (8 Qs) and SR/MA (6 Qs)
- [x] Group-to-question assignment logic
- [x] Deployed on Vercel
- [ ] **Supabase realtime: answers sync across devices** ← NEXT

### Phase 2 — Article Integration & Backend

- [ ] Supabase tables + RLS policies
- [ ] Session persistence (create → store → join by room code across devices)
- [ ] Real-time answer syncing via Supabase Realtime
- [ ] Admin: PDF upload (Supabase Storage)
- [ ] Admin: paper metadata stored in DB
- [ ] Participant: article summary cards section
- [ ] Participant: in-app PDF viewer (react-pdf)
- [ ] QR code generation for room code

### Phase 3 — Polish

- [ ] Admin password protection
- [ ] Session history (past workshops, saved answers)
- [ ] Export answers to PDF/docx
- [ ] Facilitator: custom question-group assignments (override defaults)
- [ ] Concept library as standalone browsable page
- [ ] Animations and micro-interactions

---

## 8. Mobile Design Specs

```
Viewport: 375px (iPhone SE) to 428px (iPhone Pro Max)
Font: 'Noto Sans TC', 'Outfit', sans-serif
Body text: 15-16px
Question headings: 15px, weight 500
Touch targets: 44px minimum height
Spacing: 16px horizontal padding

Layout (participant, phone):
  ┌─────────────────────────┐
  │ EBM 工作坊  #1444  [EN] │  ← sticky header
  ├─────────────────────────┤
  │ 組1 · 高廷瑀    🗣 討論中│  ← group badge + phase
  ├─────────────────────────┤
  │ 📄 Paper title    ▼     │  ← collapsible article info
  ├─────────────────────────┤
  │ Q1 PICO │ Q2 隨機       │  ← sticky tabs (group's Qs only)
  ├─────────────────────────┤
  │ [1] Question text...    │
  │ [💡 概念說明]           │
  │ ┌─────────────────┐     │
  │ │ (answer area)    │     │
  │ └─────────────────┘     │
  │                         │
  │ [2] Question text...    │
  │ ...                     │
  └─────────────────────────┘

Color palette:
  Primary: #0E7C86 (teal)
  Background: #F7F6F3
  Card: #FFFFFF
  Text: #1B2838
  Muted: #6B7A8D
  Border: #E5E3DE
  Group 1: #E8734A (coral)
  Group 2: #7B68C8 (purple)
  Group 3: #D4A843 (gold)
  Group 4: #2E86C1 (blue)
  Concept help bg: #E8F6F7 (light teal)
  Tip bg: #FFF8E7 (light gold)
```

---

## 9. Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Separate app from MA101 | ✅ Yes | Different audience, lifecycle, UX |
| Auth for participants | ❌ None | Room code + name = zero friction |
| PICO in admin form | ❌ Removed | Participants fill in PICO as Q1 |
| Question assignment | Fixed per paper type | RCT: 2 Qs/group, SR/MA: 1-2 Qs/group |
| Each question → one group | ✅ Yes | Matches actual workshop format |
| Participant sees all Qs | ❌ No | Only sees assigned questions |
| Dashboard shows all groups per Q | ❌ No | Shows only the assigned group's answer |
| Realtime editing | Last-write-wins + indicator | True collab editing (CRDT) too complex |
| Framework | Vite + React | Modern, fast, separate from MA101's CRA |
| Demo mode | Any 4-digit code creates demo session | For testing without Supabase |
