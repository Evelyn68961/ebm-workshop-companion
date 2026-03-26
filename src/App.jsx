import { useState, useRef, useEffect, useCallback } from "react";

// ─── i18n ───
const translations = {
  zh: {
    appName: "EBM 工作坊",
    appSubtitle: "實證醫學讀書會",
    joinTitle: "加入工作坊",
    roomCode: "房間代碼",
    yourName: "你的名字",
    selectGroup: "選擇組別",
    join: "加入",
    enterRoomCode: "輸入 4 位數代碼",
    enterName: "輸入你的名字",
    group: "組",
    facilitator: "主持人",
    createSession: "建立場次",
    paperTitle: "論文標題",
    paperAuthors: "作者",
    selectPaperType: "選擇論文類型",
    rct: "隨機對照試驗 (RCT)",
    srma: "系統性回顧 / 統合分析 (SR/MA)",
    create: "建立",
    roomCodeIs: "房間代碼",
    shareThis: "分享此代碼給參與者",
    discussion: "討論中",
    reporting: "報告中",
    startDiscussion: "開始討論",
    startReporting: "開始報告",
    endSession: "結束場次",
    timer: "計時器",
    min: "分鐘",
    allAnswers: "所有組別回答",
    conceptHelp: "概念說明",
    typeAnswer: "在這裡輸入你的回答...",
    participants: "參與者",
    article: "文獻",
    questions: "題目",
    dashboard: "儀表板",
    viewPdf: "查看完整 PDF",
    paperInfo: "本月文獻",
    studyType: "研究類型",
    back: "返回",
    noAnswerYet: "尚未作答",
    editing: "正在編輯...",
    groupMembers: "組員",
    switchLang: "EN",
    pico_p: "P (族群)",
    pico_i: "I (介入)",
    pico_c: "C (對照)",
    pico_o: "O (結果)",
    adminMode: "主持人模式",
    participantMode: "參與者模式",
    numberOfGroups: "組數",
    summary: "摘要",
    close: "收起",
    challenge: "進階挑戰",
    challengeDesc: "回答基本題後，挑戰更深入的思考題！",
    unlockChallenge: "🔥 解鎖進階挑戰",
    challengeUnlocked: "🔥 進階挑戰",
    typeAdvancedAnswer: "在這裡輸入你的進階回答...",
    advancedHint: "思考提示",
  },
  en: {
    appName: "EBM Workshop",
    appSubtitle: "Evidence-Based Medicine Journal Club",
    joinTitle: "Join Workshop",
    roomCode: "Room Code",
    yourName: "Your Name",
    selectGroup: "Select Group",
    join: "Join",
    enterRoomCode: "Enter 4-digit code",
    enterName: "Enter your name",
    group: "Group",
    facilitator: "Facilitator",
    createSession: "Create Session",
    paperTitle: "Paper Title",
    paperAuthors: "Authors",
    selectPaperType: "Select Paper Type",
    rct: "Randomized Controlled Trial (RCT)",
    srma: "Systematic Review / Meta-Analysis (SR/MA)",
    create: "Create",
    roomCodeIs: "Room Code",
    shareThis: "Share this code with participants",
    discussion: "Discussion",
    reporting: "Reporting",
    startDiscussion: "Start Discussion",
    startReporting: "Start Reporting",
    endSession: "End Session",
    timer: "Timer",
    min: "min",
    allAnswers: "All Groups' Answers",
    conceptHelp: "Concept Help",
    typeAnswer: "Type your answer here...",
    participants: "Participants",
    article: "Article",
    questions: "Questions",
    dashboard: "Dashboard",
    viewPdf: "View Full PDF",
    paperInfo: "This Month's Paper",
    studyType: "Study Type",
    back: "Back",
    noAnswerYet: "No answer yet",
    editing: "editing...",
    groupMembers: "Members",
    switchLang: "中",
    pico_p: "P (Population)",
    pico_i: "I (Intervention)",
    pico_c: "C (Comparison)",
    pico_o: "O (Outcome)",
    adminMode: "Facilitator Mode",
    participantMode: "Participant Mode",
    numberOfGroups: "Number of Groups",
    summary: "Summary",
    close: "Collapse",
    challenge: "Challenge",
    challengeDesc: "After answering the basics, tackle a deeper thinking question!",
    unlockChallenge: "🔥 Unlock Challenge",
    challengeUnlocked: "🔥 Challenge",
    typeAdvancedAnswer: "Type your advanced answer here...",
    advancedHint: "Thinking Hint",
  },
};

// ─── Question Templates ───
const RCT_QUESTIONS = {
  zh: [
    { id: 1, short: "PICO", title: "這項研究是否有明確、可回答的臨床問題？PICO 是什麼？" },
    { id: 2, short: "隨機", title: "這一篇文章有隨機分派嗎？隨機分派的方法可信嗎？分組結果是否可能被預測（分派隱匿）？" },
    { id: 3, short: "盲性", title: "這一篇文章有維持盲性嗎？怎麼做到的，對象有誰？如果沒做到，會發生什麼事情呢？" },
    { id: 4, short: "基線", title: "隨機分派後的兩組研究對象基本特徵是否相似？" },
    { id: 5, short: "ITT", title: "所有受試者都有納入最後的分析 (ITT) 嗎？受試者退出的原因是什麼？" },
    { id: 6, short: "終點", title: "這一篇研究結果主要是看什麼（試驗終點）？是否客觀且具臨床意義？" },
    { id: 7, short: "效果", title: "這一篇研究的治療效果有多大？估計是否精準？利益是否大於風險與不良反應？" },
    { id: 8, short: "應用", title: "這一篇研究可應用於臨床執業嗎？介入在實務上是否可行？使用時該注意什麼？" },
  ],
  en: [
    { id: 1, short: "PICO", title: "Does this study have a clear, answerable clinical question? What is the PICO?" },
    { id: 2, short: "Random", title: "Was randomization performed? Is the method credible? Could allocation be predicted (concealment)?" },
    { id: 3, short: "Blind", title: "Was blinding maintained? How? For whom? If not, what are the consequences?" },
    { id: 4, short: "Baseline", title: "Are baseline characteristics similar between the two groups after randomization?" },
    { id: 5, short: "ITT", title: "Were all participants included in the final analysis (ITT)? What were the reasons for dropout?" },
    { id: 6, short: "Endpoint", title: "What is the primary endpoint? Is it objective and clinically meaningful?" },
    { id: 7, short: "Effect", title: "How large is the treatment effect? Is the estimate precise? Do benefits outweigh risks?" },
    { id: 8, short: "Apply", title: "Can these results be applied to clinical practice? Is the intervention feasible?" },
  ],
};

const SRMA_QUESTIONS = {
  zh: [
    { id: 1, short: "PICO", title: "這項研究是否有明確、可回答的臨床問題？PICO 是什麼？" },
    { id: 2, short: "搜尋", title: "這一篇文章有檢索所有重要的、相關的研究嗎？納入與排除標準是什麼？" },
    { id: 3, short: "品質", title: "這一篇文章是否採用適當可靠的方法來評估納入的研究品質？" },
    { id: 4, short: "合併", title: "這一篇研究主要結果有合併嗎？合併方法或模型是什麼？合併方式合理嗎？" },
    { id: 5, short: "結果", title: "整體結果如何？研究之間有異質性嗎？結果精準嗎？" },
    { id: 6, short: "應用", title: "這項研究結果可以應用於臨床執業嗎？介入在實務上是否可行？" },
  ],
  en: [
    { id: 1, short: "PICO", title: "Does this study have a clear, answerable clinical question? What is the PICO?" },
    { id: 2, short: "Search", title: "Did the article search all important, relevant studies? What are the inclusion/exclusion criteria?" },
    { id: 3, short: "Quality", title: "Did the article use appropriate, reliable methods to assess the quality of included studies?" },
    { id: 4, short: "Synthesis", title: "Were results pooled? What pooling method/model was used? Is it appropriate?" },
    { id: 5, short: "Results", title: "What are the overall results? Is there heterogeneity? Are results precise?" },
    { id: 6, short: "Apply", title: "Can these results be applied to clinical practice? Is the intervention feasible?" },
  ],
};

// ─── Advanced Challenge Questions ───
// One per basic question — requires synthesis, clinical judgment, and deeper EBM reasoning.
// Keyed by basic question id. Same group assignment as basic questions.

const RCT_ADVANCED = {
  zh: {
    1: { short: "PICO+", title: "如果你要設計一個後續研究來解決這篇研究的局限性，你的 PICO 會怎麼寫？為什麼這樣設計更好？" },
    2: { short: "隨機+", title: "這篇研究的隨機分派方法可能導致什麼樣的選擇偏差？如果改用不同的隨機方法，結果會不會改變？請說明偏差的方向。" },
    3: { short: "盲性+", title: "假設這篇研究改為開放標籤設計，哪些結果指標最容易受到影響？請排出風險順序並說明理由。" },
    4: { short: "基線+", title: "如果兩組之間某個基線特徵有臨床上重要的差異（即使 p > 0.05），你會如何判斷它是否影響了結果？你會建議什麼統計方法來處理？" },
    5: { short: "ITT+", title: "假設退出率從實際數值上升到 30%，且退出者大多來自介入組——這對結果的方向和可信度有什麼影響？請做最佳與最差情境分析。" },
    6: { short: "終點+", title: "這篇研究使用的主要終點是替代指標還是病人導向結果？如果是替代指標，你能舉出歷史上「替代指標改善但臨床結果反而變差」的例子嗎？" },
    7: { short: "效果+", title: "請計算 NNT，並用「以你目前照顧的病人為例」來解釋這個數字對你的臨床決策有什麼意義。這個 NNT 在你的情境中值得嗎？" },
    8: { short: "應用+", title: "寫一段 30 秒的「電梯簡報」：向你的主管推薦（或不推薦）採用這篇研究的治療方案，並提出具體的執行計畫或替代方案。" },
  },
  en: {
    1: { short: "PICO+", title: "If you were to design a follow-up study addressing this paper's limitations, how would you write the PICO? Why is your design better?" },
    2: { short: "Random+", title: "What selection bias could this study's randomization method introduce? If a different method were used, might the results change? Describe the direction of bias." },
    3: { short: "Blind+", title: "If this study were redesigned as open-label, which outcome measures would be most vulnerable? Rank them by risk and explain your reasoning." },
    4: { short: "Baseline+", title: "If a baseline characteristic differed clinically between groups (even with p > 0.05), how would you assess whether it affected the results? What statistical approach would you suggest?" },
    5: { short: "ITT+", title: "If the dropout rate rose to 30% and most dropouts were from the intervention arm — how would this affect the results' direction and credibility? Do a best-case and worst-case scenario analysis." },
    6: { short: "Endpoint+", title: "Is this study's primary endpoint a surrogate or patient-oriented outcome? If surrogate, can you name a historical example where a surrogate improved but clinical outcomes worsened?" },
    7: { short: "Effect+", title: "Calculate the NNT and explain what this number means for your own clinical practice. Is this NNT worthwhile in your setting? Consider costs, risks, and patient preferences." },
    8: { short: "Apply+", title: "Write a 30-second 'elevator pitch': recommend (or don't recommend) adopting this study's intervention to your supervisor, with a specific implementation plan or alternative." },
  },
};

const SRMA_ADVANCED = {
  zh: {
    1: { short: "PICO+", title: "這篇統合分析的 PICO 與其納入的個別研究的 PICO 之間有什麼差異？這些差異如何影響結論的適用性？" },
    2: { short: "搜尋+", title: "如果作者遺漏了一個包含 200 人、效果量為零的研究，這對合併結果會有什麼影響？這反映了什麼類型的偏差？" },
    3: { short: "品質+", title: "如果將所有被評為「高偏差風險」的研究排除後重新分析，你預期合併效果量會如何變化？為什麼？請說明偏差方向的推論邏輯。" },
    4: { short: "合併+", title: "作者選擇了固定效應或隨機效應模型——如果改用另一個模型，結果可能會如何不同？在什麼情況下兩種模型的結果會差異最大？" },
    5: { short: "結果+", title: "I² 值代表的是異質性的「比例」而非「大小」。請舉例說明：什麼情況下 I² = 80% 但臨床上不用太擔心？什麼情況下 I² = 30% 但其實問題很大？" },
    6: { short: "應用+", title: "基於這篇統合分析的證據等級 (GRADE)，寫一份給醫療團隊的「臨床建議摘要」（3-5 句話），包含建議強度、證據確定性、以及需要注意的限制。" },
  },
  en: {
    1: { short: "PICO+", title: "What are the differences between this meta-analysis's PICO and the PICOs of the individual included studies? How do these differences affect the applicability of the conclusions?" },
    2: { short: "Search+", title: "If the authors missed a 200-patient study with a null effect, how would this impact the pooled result? What type of bias does this reflect?" },
    3: { short: "Quality+", title: "If all studies rated 'high risk of bias' were excluded and the analysis re-run, how would you expect the pooled effect to change? Why? Explain your reasoning about bias direction." },
    4: { short: "Synthesis+", title: "The authors chose a fixed-effect or random-effects model — if they had used the other, how might results differ? Under what conditions is the difference between models largest?" },
    5: { short: "Results+", title: "I² measures the proportion, not the magnitude, of heterogeneity. Give an example where I² = 80% is clinically acceptable, and another where I² = 30% is actually concerning." },
    6: { short: "Apply+", title: "Based on this meta-analysis's GRADE certainty, write a 'clinical recommendation summary' (3-5 sentences) for your healthcare team, including recommendation strength, certainty of evidence, and key caveats." },
  },
};

// ─── Advanced Concept Help (Hints) ───
const ADVANCED_HINTS = {
  zh: {
    rct: {
      1: [
        "想一想：這篇研究的族群、介入方式、或結果指標有什麼可以改進的地方？",
        "你可以考慮：更精確的族群界定、更實際的對照組、或更有臨床意義的結果指標。",
      ],
      2: [
        "區塊隨機如果區塊大小被猜到，就可能破壞分派隱匿。",
        "思考：偏差是會「高估」還是「低估」治療效果？",
      ],
      3: [
        "主觀結果（如疼痛評分）比客觀結果（如死亡率）更容易受盲性缺失影響。",
        "想想看：研究者知道分組後，可能在哪些環節做出不同的決定？",
      ],
      4: [
        "記住：p 值的大小取決於樣本數，不完全反映差異的臨床重要性。",
        "可以考慮的方法：多變量調整分析 (adjusted analysis)、傾向分數匹配 (propensity score matching)。",
      ],
      5: [
        "最佳情境：假設所有退出的介入組病人都有好結果。最差情境：假設他們都有壞結果。",
        "如果兩種情境下結論都不變 → 結果穩健。如果結論翻轉 → 退出是嚴重問題。",
      ],
      6: [
        "經典案例：心律不整藥物 (CAST trial) 減少了心律不整（替代指標），但增加了死亡率。",
        "替代指標的可信度取決於它與臨床結果之間的因果連結強度。",
      ],
      7: [
        "NNT = 1 / ARR。ARR = 對照組事件率 − 介入組事件率。",
        "考慮：你的病人的基線風險可能與研究族群不同，NNT 會隨之改變。",
      ],
      8: [
        "好的電梯簡報包含：問題 → 證據摘要 → 建議 → 下一步。",
        "別忘了提到：成本、可行性、以及需要監測的事項。",
      ],
    },
    srma: {
      1: [
        "注意「PICO 漂移」：統合分析可能納入了 PICO 略有不同的研究。",
        "例如：不同研究中的「標準治療」對照組可能差異很大。",
      ],
      2: [
        "這就是「發表偏差」——陰性結果的研究較不容易被發表。",
        "一個 200 人的零效果研究會把合併效果量拉向零（無效線方向）。",
      ],
      3: [
        "高偏差風險的研究通常會高估效果量。排除它們後，效果量通常會縮小。",
        "但也有例外：如果偏差是非差異性的（non-differential），可能反而低估效果。",
      ],
      4: [
        "固定效應模型在有異質性時會給大型研究過多權重。",
        "當研究間真實效果差異大（τ² 大）且研究大小差異也大時，兩種模型結果差異最大。",
      ],
      5: [
        "I² = 80% 但所有研究效果都在同一方向且臨床意義相近 → 不用太擔心。",
        "I² = 30% 但效果方向不一致（有些有害有些有益）→ 這才是真正的問題。",
      ],
      6: [
        "GRADE 建議格式：「我們建議/建議考慮 [介入]（[強/弱] 建議，[高/中/低/極低] 確定性證據）」",
        "記得提到最影響確定性的降級因素。",
      ],
    },
  },
  en: {
    rct: {
      1: [
        "Think about: what could be improved in the population, intervention, or outcome measure?",
        "Consider: a more precise population, a more practical comparator, or a more clinically meaningful outcome.",
      ],
      2: [
        "If block sizes are guessable in block randomization, allocation concealment is compromised.",
        "Think: would the bias overestimate or underestimate the treatment effect?",
      ],
      3: [
        "Subjective outcomes (e.g. pain scores) are more vulnerable to unblinding than objective ones (e.g. mortality).",
        "Consider: once investigators know the allocation, at which steps might they behave differently?",
      ],
      4: [
        "Remember: p-value magnitude depends on sample size and doesn't fully reflect clinical importance.",
        "Methods to consider: multivariable adjusted analysis, propensity score matching.",
      ],
      5: [
        "Best case: assume all intervention dropouts had good outcomes. Worst case: assume they all had bad outcomes.",
        "If conclusions hold in both scenarios → robust. If they flip → dropout is a serious concern.",
      ],
      6: [
        "Classic example: antiarrhythmics (CAST trial) reduced arrhythmias (surrogate) but increased mortality.",
        "A surrogate's credibility depends on the strength of its causal link to the clinical outcome.",
      ],
      7: [
        "NNT = 1 / ARR. ARR = control event rate − intervention event rate.",
        "Consider: your patient's baseline risk may differ from the study population, changing the NNT.",
      ],
      8: [
        "A good elevator pitch includes: problem → evidence summary → recommendation → next steps.",
        "Don't forget: cost, feasibility, and what needs to be monitored.",
      ],
    },
    srma: {
      1: [
        "Watch for 'PICO drift': meta-analyses may include studies with slightly different PICOs.",
        "For example, 'standard care' comparators can vary widely across included studies.",
      ],
      2: [
        "This is publication bias — studies with null results are less likely to be published.",
        "A 200-patient null study would pull the pooled estimate toward the null.",
      ],
      3: [
        "High risk-of-bias studies tend to overestimate effects. Excluding them usually shrinks the estimate.",
        "Exception: if bias is non-differential, it may actually underestimate the effect.",
      ],
      4: [
        "Fixed-effect models give excessive weight to large studies when heterogeneity exists.",
        "The two models diverge most when true effects vary (large τ²) AND study sizes differ substantially.",
      ],
      5: [
        "I² = 80% but all effects point the same direction and are clinically similar → manageable.",
        "I² = 30% but effects go in opposite directions (some harmful, some beneficial) → that's the real problem.",
      ],
      6: [
        "GRADE format: 'We recommend/suggest [intervention] (strong/conditional, high/moderate/low/very low certainty)'",
        "Mention the most important reason for any downgrading.",
      ],
    },
  },
};

// ─── Concept Help Content ───
const CONCEPT_HELP = {
  zh: {
    shared_pico: {
      title: "📋 什麼是 PICO？",
      content: [
        { type: "text", value: "PICO 是建構臨床問題的框架：" },
        { type: "list", items: [
          "P (Patient/Population) — 研究對象是誰？",
          "I (Intervention) — 介入措施是什麼？",
          "C (Comparison) — 對照組是什麼？",
          "O (Outcome) — 要測量的結果是什麼？"
        ]},
        { type: "tip", value: "好的 PICO 問題應該夠具體，可以直接用來搜尋文獻。" },
      ]
    },
    shared_apply: {
      title: "🏥 臨床適用性",
      content: [
        { type: "text", value: "評估研究結果能否應用於臨床：" },
        { type: "list", items: [
          "研究族群是否類似我的病人？",
          "介入措施在本院是否可行？",
          "效果大小是否有「臨床」意義？（不只統計顯著）",
          "藥物安定性、護理工作量、成本效益？",
          "病人偏好與順從性？"
        ]},
        { type: "tip", value: "NNT (Numbers Needed to Treat)：治療多少人才能多獲得一個好結果。NNT 越小 → 治療效果越好。" },
      ]
    },
    rct_2: {
      title: "🎲 隨機分派 & 分派隱匿",
      content: [
        { type: "text", value: "隨機分派確保兩組在已知和未知的干擾因素上平衡。" },
        { type: "subtitle", value: "常見方法" },
        { type: "list", items: [
          "簡單隨機 (Simple)：如擲硬幣、電腦亂數",
          "區塊隨機 (Block)：確保每段時間內兩組人數接近",
          "分層隨機 (Stratified)：先依重要因素分層再隨機",
          "最小化法 (Minimization)：動態平衡多個因素 ⭐"
        ]},
        { type: "subtitle", value: "分派隱匿 (Allocation Concealment)" },
        { type: "text", value: "在分派「之前」，無法預測下一個病人會被分到哪組。" },
        { type: "tip", value: "隨機 ≠ 隱匿：即使用了隨機方法，如果研究者能猜到下一個結果，仍有偏差。" },
      ]
    },
    rct_3: {
      title: "🕶️ 盲性 (Blinding)",
      content: [
        { type: "text", value: "讓參與者不知道分組，避免主觀偏差。" },
        { type: "list", items: [
          "單盲 (Single-blind)：受試者不知道",
          "雙盲 (Double-blind)：受試者 + 研究者都不知道",
          "三盲 (Triple-blind)：加上資料分析者也不知道",
          "開放標籤 (Open-label)：所有人都知道分組"
        ]},
        { type: "subtitle", value: "沒有盲性會怎樣？" },
        { type: "list", items: [
          "研究者可能對某組病人更積極治療",
          "病人心理預期影響主觀症狀",
          "結果判定可能受影響"
        ]},
        { type: "tip", value: "如果主要終點是「客觀指標」（如死亡率），盲性缺失的影響就比較小。" },
      ]
    },
    rct_4: {
      title: "📊 基線特徵比較 (Table 1)",
      content: [
        { type: "text", value: "確認隨機分派是否成功平衡兩組。" },
        { type: "list", items: [
          "看年齡、性別、疾病嚴重度、共病",
          "兩組數值是否相似（不只看 p 值）"
        ]},
        { type: "subtitle", value: "常見誤解" },
        { type: "list", items: [
          "p 值不顯著 ≠ 兩組一定相似",
          "小樣本可能有臨床重要的差異但 p > 0.05",
          "大型 RCT 中微小差異也可能 p < 0.05"
        ]},
        { type: "tip", value: "重點是看「臨床上」是否有重要差異，而非只看統計顯著性。" },
      ]
    },
    rct_5: {
      title: "📋 意向分析 (ITT) & 退出",
      content: [
        { type: "text", value: "ITT = 按照「原始分組」分析所有受試者，不管實際上有沒有完成治療。" },
        { type: "subtitle", value: "為什麼重要？" },
        { type: "list", items: [
          "保持隨機分派的完整性",
          "反映真實世界的治療效果"
        ]},
        { type: "subtitle", value: "分析變體" },
        { type: "list", items: [
          "ITT：所有隨機分派的人都納入",
          "mITT：排除少數特殊情況（如未取得同意）",
          "Per-protocol：只分析完全遵照方案的人"
        ]},
        { type: "tip", value: "退出率 > 20% 時要特別小心。退出原因如果與治療效果有關，可能造成偏差。" },
      ]
    },
    rct_6: {
      title: "🎯 試驗終點 (Endpoints)",
      content: [
        { type: "subtitle", value: "主要 vs 次要終點" },
        { type: "list", items: [
          "主要終點：研究最主要想回答的問題（只有一個）",
          "次要終點：額外觀察的結果（探索性質）"
        ]},
        { type: "subtitle", value: "終點品質" },
        { type: "list", items: [
          "客觀 (Hard)：死亡、住院天數 ⭐ → 不受測量者主觀影響",
          "主觀 (Soft)：疼痛評分、生活品質 → 可能受盲性缺失影響"
        ]},
        { type: "tip", value: "替代指標（如血壓下降）不一定能反映真正的臨床效益。優先看病人導向結果（如死亡率、中風）。" },
      ]
    },
    rct_7: {
      title: "📐 治療效果 & 精準度",
      content: [
        { type: "subtitle", value: "二分類結果常用指標" },
        { type: "list", items: [
          "RR (Risk Ratio)：相對風險比",
          "OR (Odds Ratio)：勝算比",
          "ARR (Absolute Risk Reduction)：絕對風險降低",
          "NNT = 1/ARR：需治療人數"
        ]},
        { type: "subtitle", value: "精準度" },
        { type: "list", items: [
          "看 95% CI（信賴區間）的寬度",
          "CI 窄 → 估計精準",
          "CI 跨越 1（OR/RR）或 0（差值）→ 統計不顯著"
        ]},
        { type: "tip", value: "例：死亡率 24.9% vs 26.8% → ARR = 1.9% → NNT ≈ 53（每治療 53 人多救 1 人）。" },
      ]
    },
    sr_2: {
      title: "🔍 搜尋策略 & 納入排除",
      content: [
        { type: "subtitle", value: "系統性搜尋的重點" },
        { type: "list", items: [
          "至少搜尋 2-3 個資料庫 (PubMed, Cochrane, Embase)",
          "使用 MeSH terms + 自由詞彙",
          "說明有無語言或時間限制",
          "是否搜尋灰色文獻（會議摘要、試驗登記）"
        ]},
        { type: "subtitle", value: "納入/排除標準" },
        { type: "list", items: [
          "事先定義（避免選擇性偏差）",
          "與 PICO 直接對應",
          "明確且可重複執行"
        ]},
      ]
    },
    sr_3: {
      title: "⚖️ RoB 2 & GRADE",
      content: [
        { type: "subtitle", value: "RoB 2 — 評估單一 RCT 偏差風險" },
        { type: "list", items: [
          "1. 隨機化過程",
          "2. 偏離預期介入措施",
          "3. 缺失結果數據",
          "4. 結果測量",
          "5. 選擇報告結果"
        ]},
        { type: "subtitle", value: "GRADE — 評估整體證據確定性" },
        { type: "text", value: "等級：高 → 中等 → 低 → 極低" },
        { type: "list", items: [
          "降級因素：偏差風險、不精確性、不一致性、間接性、發表偏差",
          "升級因素：大效果量、劑量反應、干擾因素方向"
        ]},
        { type: "tip", value: "品質保證：兩名獨立審查員分別評估 → 意見不同 → 討論 → 第三方仲裁。" },
      ]
    },
    sr_4: {
      title: "🔢 合併分析方法",
      content: [
        { type: "subtitle", value: "模型選擇" },
        { type: "list", items: [
          "固定效應 (Fixed-effect)：假設所有研究估計同一真實效果",
          "隨機效應 (Random-effects) ⭐：假設各研究真實效果有變異（較常用）"
        ]},
        { type: "subtitle", value: "效果量指標" },
        { type: "list", items: [
          "RR (Risk Ratio)、OR (Odds Ratio)",
          "MD (Mean Difference)、SMD (Standardized MD)"
        ]},
        { type: "tip", value: "貝氏分析可直接說「有 X% 的機率更好」，比傳統 p 值更具臨床解釋力。" },
      ]
    },
    sr_5: {
      title: "📊 結果 & 異質性",
      content: [
        { type: "subtitle", value: "讀懂 Forest Plot" },
        { type: "list", items: [
          "■ 方塊 = 個別研究效果量（大小 = 權重）",
          "─ 橫線 = 信賴區間",
          "◆ 菱形 = 合併效果量",
          "┃ 虛線 = 無效線（RR/OR=1 或 MD=0）"
        ]},
        { type: "subtitle", value: "異質性指標" },
        { type: "list", items: [
          "I²：研究間變異佔總變異的百分比",
          "0-25% 低 | 25-50% 中 | 50-75% 高 | >75% 非常高",
          "Q 檢定：p < 0.10 表示有顯著異質性（注意是 0.10）"
        ]},
        { type: "tip", value: "CI 未跨越無效線 → 統計顯著。CI 窄 → 精確。" },
      ]
    },
  },
  en: {} // EN mirrors ZH structure — omitted for brevity, falls back to ZH
};

function getConceptHelp(lang, paperType, questionId) {
  const helps = CONCEPT_HELP.zh; // Always use ZH content for now
  const questions = paperType === "rct" ? RCT_QUESTIONS.zh : SRMA_QUESTIONS.zh;
  const totalQs = questions.length;
  
  if (questionId === 1) return helps.shared_pico;
  if (questionId === totalQs) return helps.shared_apply;
  
  if (paperType === "rct") return helps[`rct_${questionId}`];
  return helps[`sr_${questionId}`];
}

// ─── Color System ───
const C = {
  teal: "#0E7C86",
  tealLight: "#E8F6F7",
  tealMid: "#B2DFE3",
  bg: "#F7F6F3",
  card: "#FFFFFF",
  dark: "#1B2838",
  muted: "#6B7A8D",
  border: "#E5E3DE",
  coral: "#E8734A",
  purple: "#7B68C8",
  gold: "#D4A843",
  blue: "#2E86C1",
  red: "#C0392B",
  green: "#27AE60",
};

const GROUP_COLORS = [C.coral, C.purple, C.gold, C.blue];

// ─── Styles ───
const font = "'Noto Sans TC', 'Outfit', -apple-system, sans-serif";

// ─── Components ───

function ConceptCard({ help, expanded, onToggle, lang }) {
  if (!help) return null;
  const t = translations[lang];
  return (
    <div style={{ marginBottom: 12 }}>
      <button
        onClick={onToggle}
        style={{
          display: "flex", alignItems: "center", gap: 8, width: "100%",
          padding: "10px 14px", background: expanded ? C.tealLight : `${C.teal}08`,
          border: `1.5px solid ${expanded ? C.teal : C.border}`,
          borderRadius: 10, cursor: "pointer", fontFamily: font,
          fontSize: 14, color: C.teal, fontWeight: 600,
          transition: "all 0.2s ease",
        }}
      >
        <span style={{ fontSize: 16 }}>💡</span>
        <span style={{ flex: 1, textAlign: "left" }}>{help.title}</span>
        <span style={{ fontSize: 12, color: C.muted, transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
      </button>
      {expanded && (
        <div style={{
          padding: "16px", marginTop: -1,
          background: C.tealLight, borderRadius: "0 0 10px 10px",
          border: `1.5px solid ${C.teal}`, borderTop: "none",
          animation: "slideDown 0.2s ease",
        }}>
          {help.content.map((block, i) => {
            if (block.type === "text") return <p key={i} style={{ margin: "0 0 8px", fontSize: 14, lineHeight: 1.7, color: C.dark }}>{block.value}</p>;
            if (block.type === "subtitle") return <p key={i} style={{ margin: "12px 0 6px", fontSize: 13, fontWeight: 700, color: C.teal }}>{block.value}</p>;
            if (block.type === "list") return (
              <div key={i} style={{ margin: "4px 0 8px" }}>
                {block.items.map((item, j) => (
                  <div key={j} style={{ display: "flex", gap: 8, marginBottom: 4, fontSize: 13.5, lineHeight: 1.6, color: C.dark }}>
                    <span style={{ color: C.teal, flexShrink: 0 }}>•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            );
            if (block.type === "tip") return (
              <div key={i} style={{
                marginTop: 8, padding: "10px 12px", background: "#FFF8E7",
                borderRadius: 8, borderLeft: `3px solid ${C.gold}`,
                fontSize: 13, lineHeight: 1.6, color: "#7A6520",
              }}>
                💡 {block.value}
              </div>
            );
            return null;
          })}
          <button onClick={onToggle} style={{
            marginTop: 12, padding: "6px 12px", background: "none",
            border: `1px solid ${C.teal}40`, borderRadius: 6,
            color: C.teal, fontSize: 12, cursor: "pointer", fontFamily: font,
          }}>{t.close}</button>
        </div>
      )}
    </div>
  );
}

function QuestionSection({ question, questionId, answer, onAnswerChange, advancedAnswer, onAdvancedAnswerChange, paperType, lang, groupColor }) {
  const [helpOpen, setHelpOpen] = useState(false);
  const [challengeOpen, setChallengeOpen] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const t = translations[lang];
  const help = getConceptHelp(lang, paperType, questionId);

  // Get the advanced question for this basic question
  const advQs = paperType === "rct" ? RCT_ADVANCED : SRMA_ADVANCED;
  const advQ = advQs[lang]?.[questionId];
  const hints = ADVANCED_HINTS[lang]?.[paperType]?.[questionId] || [];

  // Only allow challenge unlock if basic answer has some content
  const hasBasicAnswer = (answer || "").trim().length >= 10;

  return (
    <div id={`q-${questionId}`} style={{
      padding: "20px 0",
      borderBottom: `1px solid ${C.border}`,
    }}>
      {/* Question number badge + text */}
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: groupColor || C.teal, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 700, flexShrink: 0, marginTop: 2,
        }}>
          {questionId}
        </div>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: C.dark, fontWeight: 500 }}>
          {question.title}
        </p>
      </div>

      {/* Concept help */}
      <ConceptCard help={help} expanded={helpOpen} onToggle={() => setHelpOpen(!helpOpen)} lang={lang} />

      {/* Answer area */}
      <textarea
        value={answer || ""}
        onChange={(e) => onAnswerChange(questionId, e.target.value)}
        placeholder={t.typeAnswer}
        style={{
          width: "100%", minHeight: 120, padding: 14,
          border: `1.5px solid ${C.border}`, borderRadius: 10,
          fontSize: 15, lineHeight: 1.7, fontFamily: font,
          color: C.dark, background: C.card, resize: "vertical",
          boxSizing: "border-box",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => e.target.style.borderColor = groupColor || C.teal}
        onBlur={(e) => e.target.style.borderColor = C.border}
      />

      {/* ─── Advanced Challenge Section ─── */}
      {advQ && !challengeOpen && (
        <button
          onClick={() => hasBasicAnswer && setChallengeOpen(true)}
          style={{
            display: "flex", alignItems: "center", gap: 8, width: "100%",
            marginTop: 12, padding: "12px 14px",
            background: hasBasicAnswer ? "#FFF0EB" : `${C.border}40`,
            border: hasBasicAnswer ? `1.5px dashed ${C.coral}` : `1.5px dashed ${C.border}`,
            borderRadius: 10, cursor: hasBasicAnswer ? "pointer" : "default",
            fontFamily: font, fontSize: 14, fontWeight: 600,
            color: hasBasicAnswer ? C.coral : C.muted,
            transition: "all 0.2s ease",
            opacity: hasBasicAnswer ? 1 : 0.6,
          }}
        >
          <span style={{ fontSize: 16 }}>{hasBasicAnswer ? "🔥" : "🔒"}</span>
          <span style={{ flex: 1, textAlign: "left" }}>
            {hasBasicAnswer ? t.unlockChallenge : `${t.unlockChallenge} (${lang === "zh" ? "先回答基本題" : "answer basic Q first"})`}
          </span>
          {hasBasicAnswer && <span style={{ fontSize: 12 }}>→</span>}
        </button>
      )}

      {advQ && challengeOpen && (
        <div style={{
          marginTop: 12, padding: "16px",
          background: "#FFF8F5",
          border: `1.5px solid ${C.coral}40`,
          borderRadius: 12,
          animation: "fadeIn 0.3s ease",
        }}>
          {/* Advanced question header */}
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: `linear-gradient(135deg, ${C.coral}, ${C.red})`, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 800, flexShrink: 0, marginTop: 2,
            }}>
              🔥
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.coral, marginBottom: 4, letterSpacing: 0.5 }}>
                {t.challengeUnlocked} · {advQ.short}
              </div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: C.dark, fontWeight: 500 }}>
                {advQ.title}
              </p>
            </div>
          </div>

          {/* Hints toggle */}
          {hints.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <button
                onClick={() => setHintOpen(!hintOpen)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 12px", background: "none",
                  border: `1px solid ${C.gold}60`, borderRadius: 8,
                  cursor: "pointer", fontFamily: font,
                  fontSize: 12, color: C.gold, fontWeight: 600,
                }}
              >
                <span>💡</span>
                <span>{t.advancedHint}</span>
                <span style={{ fontSize: 10, transform: hintOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
              </button>
              {hintOpen && (
                <div style={{
                  marginTop: 8, padding: "10px 12px",
                  background: "#FFF8E7", borderRadius: 8,
                  borderLeft: `3px solid ${C.gold}`,
                  animation: "slideDown 0.2s ease",
                }}>
                  {hints.map((hint, i) => (
                    <div key={i} style={{ fontSize: 13, lineHeight: 1.6, color: "#7A6520", marginBottom: i < hints.length - 1 ? 6 : 0 }}>
                      💡 {hint}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Advanced answer area */}
          <textarea
            value={advancedAnswer || ""}
            onChange={(e) => onAdvancedAnswerChange(questionId, e.target.value)}
            placeholder={t.typeAdvancedAnswer}
            style={{
              width: "100%", minHeight: 100, padding: 14,
              border: `1.5px solid ${C.coral}30`, borderRadius: 10,
              fontSize: 15, lineHeight: 1.7, fontFamily: font,
              color: C.dark, background: C.card, resize: "vertical",
              boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => e.target.style.borderColor = C.coral}
            onBlur={(e) => e.target.style.borderColor = `${C.coral}30`}
          />
        </div>
      )}
    </div>
  );
}

function TabBar({ questions, activeQ, onSelect, groupColor }) {
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      const active = scrollRef.current.querySelector(`[data-qid="${activeQ}"]`);
      if (active) active.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeQ]);

  return (
    <div ref={scrollRef} style={{
      display: "flex", gap: 4, overflowX: "auto", padding: "8px 16px",
      background: C.card, borderBottom: `1px solid ${C.border}`,
      position: "sticky", top: 52, zIndex: 90,
      WebkitOverflowScrolling: "touch",
      msOverflowStyle: "none", scrollbarWidth: "none",
    }}>
      {questions.map((q) => (
        <button
          key={q.id} data-qid={q.id}
          onClick={() => onSelect(q.id)}
          style={{
            padding: "6px 14px", borderRadius: 20,
            border: activeQ === q.id ? `2px solid ${groupColor || C.teal}` : `1px solid ${C.border}`,
            background: activeQ === q.id ? `${groupColor || C.teal}12` : "transparent",
            color: activeQ === q.id ? (groupColor || C.teal) : C.muted,
            fontSize: 13, fontWeight: activeQ === q.id ? 700 : 500,
            cursor: "pointer", fontFamily: font, whiteSpace: "nowrap",
            flexShrink: 0, transition: "all 0.15s",
          }}
        >
          Q{q.id} {q.short}
        </button>
      ))}
    </div>
  );
}

function Timer({ endTime }) {
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    if (!endTime) return;
    const tick = () => {
      const diff = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setRemaining(diff);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const urgent = remaining < 300 && remaining > 0;

  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 12px", borderRadius: 20,
      background: urgent ? `${C.red}15` : `${C.teal}10`,
      color: urgent ? C.red : C.teal,
      fontWeight: 700, fontSize: 18, fontVariantNumeric: "tabular-nums",
      animation: urgent ? "pulse 1s infinite" : "none",
    }}>
      {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
    </div>
  );
}

// ─── Main App ───
export default function App() {
  const [lang, setLang] = useState("zh");
  const [screen, setScreen] = useState("home"); // home, join, admin, workshop, dashboard
  const [session, setSession] = useState(null);
  const [userName, setUserName] = useState("");
  const [userGroup, setUserGroup] = useState(1);
  const [roomInput, setRoomInput] = useState("");
  const [answers, setAnswers] = useState({});
  const [advancedAnswers, setAdvancedAnswers] = useState({});
  const [activeQ, setActiveQ] = useState(1);
  const [phase, setPhase] = useState("setup");
  const [timerEnd, setTimerEnd] = useState(null);

  // Admin form state
  const [adminPaperType, setAdminPaperType] = useState("rct");
  const [adminTitle, setAdminTitle] = useState("");
  const [adminAuthors, setAdminAuthors] = useState("");
  const [adminPico, setAdminPico] = useState({ p: "", i: "", c: "", o: "" });
  const [adminGroups, setAdminGroups] = useState(4);

  const t = translations[lang];
  const toggleLang = () => setLang(lang === "zh" ? "en" : "zh");

  const questions = session?.paperType === "srma"
    ? (lang === "zh" ? SRMA_QUESTIONS.zh : SRMA_QUESTIONS.en)
    : (lang === "zh" ? RCT_QUESTIONS.zh : RCT_QUESTIONS.en);

  // Question → Group assignment
  // RCT (8 Qs, 4 groups): G1→Q1,Q2  G2→Q3,Q4  G3→Q5,Q6  G4→Q7,Q8
  // SR/MA (6 Qs, 4 groups): G1→Q1,Q2  G2→Q3  G3→Q4  G4→Q5,Q6
  const getGroupForQuestion = (qId, paperType) => {
    if (paperType === "rct") {
      if (qId <= 2) return 1;
      if (qId <= 4) return 2;
      if (qId <= 6) return 3;
      return 4;
    } else {
      if (qId <= 2) return 1;
      if (qId === 3) return 2;
      if (qId === 4) return 3;
      return 4;
    }
  };

  const getQuestionsForGroup = (groupId, paperType) => {
    return questions.filter(q => getGroupForQuestion(q.id, paperType) === groupId);
  };

  const myQuestions = session ? getQuestionsForGroup(userGroup, session.paperType) : [];

  // Sync activeQ to the group's first question when session or group changes
  useEffect(() => {
    if (myQuestions.length > 0 && !myQuestions.find(q => q.id === activeQ)) {
      setActiveQ(myQuestions[0].id);
    }
  }, [myQuestions, activeQ]);

  const createSession = () => {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    const newSession = {
      roomCode: code,
      paperType: adminPaperType,
      title: adminTitle,
      authors: adminAuthors,
      groups: Array.from({ length: adminGroups }, (_, i) => ({ id: i + 1, name: `${t.group} ${i + 1}` })),
      participants: [],
    };
    setSession(newSession);
    setPhase("setup");
    setScreen("dashboard");
  };

  const joinSession = () => {
    // If session exists and code matches, join it
    if (session && roomInput === session.roomCode) {
      setSession(prev => ({
        ...prev,
        participants: [...(prev.participants || []), { name: userName, groupId: userGroup }]
      }));
      setScreen("workshop");
      return;
    }

    // No Supabase yet — create a demo session with any 4-digit code
    if (roomInput.length === 4) {
      const demoSession = {
        roomCode: roomInput,
        paperType: adminPaperType,
        title: adminPaperType === "rct"
          ? "Continuous vs Intermittent β-Lactam Antibiotic Infusions in Critically Ill Patients With Sepsis (BLING III)"
          : "Prolonged vs Intermittent Infusions of β-Lactam Antibiotics in Adults With Sepsis or Septic Shock: A Systematic Review and Meta-Analysis",
        authors: adminPaperType === "rct"
          ? "Dulhunty JM, Brett SJ, De Waele JJ, et al. JAMA. 2024."
          : "Vardakas KZ, Voulgaris GL, Maliaros A, et al. JAMA. 2024.",
        groups: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        participants: [{ name: userName, groupId: userGroup }],
      };
      setSession(demoSession);
      setPhase("discussion");
      setTimerEnd(Date.now() + 25 * 60 * 1000);
      setScreen("workshop");
    }
  };

  const handleAnswerChange = useCallback((qId, value) => {
    setAnswers(prev => ({
      ...prev,
      [`${userGroup}-${qId}`]: { content: value, updatedBy: userName, updatedAt: Date.now() }
    }));
  }, [userGroup, userName]);

  const handleAdvancedAnswerChange = useCallback((qId, value) => {
    setAdvancedAnswers(prev => ({
      ...prev,
      [`${userGroup}-${qId}`]: { content: value, updatedBy: userName, updatedAt: Date.now() }
    }));
  }, [userGroup, userName]);

  const startTimer = (minutes) => {
    setTimerEnd(Date.now() + minutes * 60 * 1000);
  };

  const groupColor = GROUP_COLORS[(userGroup - 1) % GROUP_COLORS.length];

  // ─── Header ───
  const Header = ({ showBack, onBack }) => (
    <div style={{
      position: "sticky", top: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 16px", background: C.card,
      borderBottom: `1px solid ${C.border}`,
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {showBack && (
          <button onClick={onBack} style={{
            background: "none", border: "none", fontSize: 18, cursor: "pointer",
            color: C.teal, padding: "2px 4px",
          }}>←</button>
        )}
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.dark, letterSpacing: -0.3 }}>{t.appName}</div>
          {session?.roomCode && (
            <div style={{ fontSize: 11, color: C.muted }}>#{session.roomCode}</div>
          )}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {timerEnd && phase !== "setup" && <Timer endTime={timerEnd} />}
        <button onClick={toggleLang} style={{
          padding: "4px 10px", borderRadius: 6,
          border: `1px solid ${C.border}`, background: "none",
          fontSize: 12, fontWeight: 600, color: C.muted,
          cursor: "pointer", fontFamily: font,
        }}>{t.switchLang}</button>
      </div>
    </div>
  );

  // ─── HOME SCREEN ───
  if (screen === "home") {
    return (
      <div style={{ minHeight: "100dvh", background: C.bg, fontFamily: font }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap');
          * { box-sizing: border-box; margin: 0; }
          @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
          textarea:focus, input:focus { outline: none; }
          ::-webkit-scrollbar { display: none; }
        `}</style>
        <Header />
        <div style={{ padding: "60px 24px 40px", maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
          {/* Logo area */}
          <div style={{
            width: 80, height: 80, borderRadius: 20, background: `linear-gradient(135deg, ${C.teal}, ${C.teal}CC)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px", fontSize: 36,
            boxShadow: `0 8px 32px ${C.teal}30`,
          }}>📋</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: C.dark, marginBottom: 8 }}>{t.appName}</h1>
          <p style={{ fontSize: 14, color: C.muted, marginBottom: 48 }}>{t.appSubtitle}</p>

          {/* Join button */}
          <button
            onClick={() => setScreen("join")}
            style={{
              width: "100%", padding: "16px", borderRadius: 12,
              background: C.teal, color: "#fff", border: "none",
              fontSize: 16, fontWeight: 600, cursor: "pointer",
              fontFamily: font, marginBottom: 12,
              boxShadow: `0 4px 16px ${C.teal}30`,
              transition: "transform 0.1s",
            }}
            onMouseDown={e => e.target.style.transform = "scale(0.98)"}
            onMouseUp={e => e.target.style.transform = "scale(1)"}
          >
            {t.participantMode}
          </button>

          {/* Admin button */}
          <button
            onClick={() => setScreen("admin")}
            style={{
              width: "100%", padding: "16px", borderRadius: 12,
              background: "transparent", color: C.teal,
              border: `2px solid ${C.teal}`, fontSize: 16,
              fontWeight: 600, cursor: "pointer", fontFamily: font,
              transition: "transform 0.1s",
            }}
            onMouseDown={e => e.target.style.transform = "scale(0.98)"}
            onMouseUp={e => e.target.style.transform = "scale(1)"}
          >
            {t.adminMode}
          </button>
        </div>
      </div>
    );
  }

  // ─── JOIN SCREEN ───
  if (screen === "join") {
    return (
      <div style={{ minHeight: "100dvh", background: C.bg, fontFamily: font }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap');
          * { box-sizing: border-box; margin: 0; }
          textarea:focus, input:focus { outline: none; }
        `}</style>
        <Header showBack onBack={() => setScreen("home")} />
        <div style={{ padding: "32px 24px", maxWidth: 420, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.dark, marginBottom: 28 }}>{t.joinTitle}</h2>

          {/* Room code */}
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 6 }}>{t.roomCode}</label>
          <input
            value={roomInput}
            onChange={e => setRoomInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder={t.enterRoomCode}
            inputMode="numeric"
            style={{
              width: "100%", padding: "14px", borderRadius: 10,
              border: `1.5px solid ${C.border}`, fontSize: 20,
              fontFamily: font, letterSpacing: 8, textAlign: "center",
              fontWeight: 700, color: C.dark, background: C.card,
              marginBottom: 20, boxSizing: "border-box",
            }}
          />

          {/* Name */}
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 6 }}>{t.yourName}</label>
          <input
            value={userName}
            onChange={e => setUserName(e.target.value)}
            placeholder={t.enterName}
            style={{
              width: "100%", padding: "14px", borderRadius: 10,
              border: `1.5px solid ${C.border}`, fontSize: 16,
              fontFamily: font, color: C.dark, background: C.card,
              marginBottom: 20, boxSizing: "border-box",
            }}
          />

          {/* Paper type (only shown for demo mode — no session exists yet) */}
          {!session && (
            <>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 10 }}>{t.selectPaperType}</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                {["rct", "srma"].map(type => (
                  <button key={type} onClick={() => setAdminPaperType(type)} style={{
                    padding: "12px", borderRadius: 10,
                    border: adminPaperType === type ? `2.5px solid ${C.teal}` : `1.5px solid ${C.border}`,
                    background: adminPaperType === type ? C.tealLight : C.card,
                    color: adminPaperType === type ? C.teal : C.muted,
                    fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: font,
                  }}>
                    {type === "rct" ? "🧪 RCT" : "📊 SR/MA"}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Group selection */}
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 10 }}>{t.selectGroup}</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
            {(session?.groups || [1,2,3,4].map(i => ({ id: i }))).map((g, idx) => (
              <button
                key={g.id}
                onClick={() => setUserGroup(g.id)}
                style={{
                  padding: "14px", borderRadius: 10,
                  border: userGroup === g.id ? `2.5px solid ${GROUP_COLORS[idx]}` : `1.5px solid ${C.border}`,
                  background: userGroup === g.id ? `${GROUP_COLORS[idx]}10` : C.card,
                  color: userGroup === g.id ? GROUP_COLORS[idx] : C.muted,
                  fontSize: 15, fontWeight: 600, cursor: "pointer",
                  fontFamily: font, transition: "all 0.15s",
                }}
              >
                {t.group} {g.id}
              </button>
            ))}
          </div>

          {/* Join button */}
          <button
            onClick={joinSession}
            disabled={roomInput.length < 4 || !userName.trim()}
            style={{
              width: "100%", padding: "16px", borderRadius: 12,
              background: (roomInput.length < 4 || !userName.trim()) ? C.border : C.teal,
              color: "#fff", border: "none", fontSize: 16,
              fontWeight: 600, cursor: (roomInput.length < 4 || !userName.trim()) ? "default" : "pointer",
              fontFamily: font, transition: "background 0.2s",
            }}
          >
            {t.join}
          </button>
        </div>
      </div>
    );
  }

  // ─── ADMIN SCREEN ───
  if (screen === "admin") {
    return (
      <div style={{ minHeight: "100dvh", background: C.bg, fontFamily: font }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap');
          * { box-sizing: border-box; margin: 0; }
          textarea:focus, input:focus { outline: none; }
        `}</style>
        <Header showBack onBack={() => setScreen("home")} />
        <div style={{ padding: "32px 24px", maxWidth: 480, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.dark, marginBottom: 28 }}>{t.createSession}</h2>

          {/* Paper type */}
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 10 }}>{t.selectPaperType}</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
            {["rct", "srma"].map(type => (
              <button key={type} onClick={() => setAdminPaperType(type)} style={{
                padding: "14px 12px", borderRadius: 10,
                border: adminPaperType === type ? `2.5px solid ${C.teal}` : `1.5px solid ${C.border}`,
                background: adminPaperType === type ? C.tealLight : C.card,
                color: adminPaperType === type ? C.teal : C.muted,
                fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: font,
              }}>
                {type === "rct" ? "🧪 RCT" : "📊 SR/MA"}
                <div style={{ fontSize: 11, fontWeight: 400, marginTop: 4 }}>
                  {type === "rct" ? (lang === "zh" ? "隨機對照試驗" : "Randomized Controlled Trial") : (lang === "zh" ? "系統性回顧/統合分析" : "Systematic Review / Meta-Analysis")}
                </div>
              </button>
            ))}
          </div>

          {/* Paper info */}
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 6 }}>{t.paperTitle}</label>
          <input value={adminTitle} onChange={e => setAdminTitle(e.target.value)} style={{
            width: "100%", padding: "12px", borderRadius: 10, border: `1.5px solid ${C.border}`,
            fontSize: 14, fontFamily: font, color: C.dark, background: C.card,
            marginBottom: 16, boxSizing: "border-box",
          }} />

          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 6 }}>{t.paperAuthors}</label>
          <input value={adminAuthors} onChange={e => setAdminAuthors(e.target.value)} style={{
            width: "100%", padding: "12px", borderRadius: 10, border: `1.5px solid ${C.border}`,
            fontSize: 14, fontFamily: font, color: C.dark, background: C.card,
            marginBottom: 16, boxSizing: "border-box",
          }} />

          {/* Groups */}
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 8, marginTop: 16 }}>{t.numberOfGroups}</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            {[2, 3, 4].map(n => (
              <button key={n} onClick={() => setAdminGroups(n)} style={{
                padding: "10px 20px", borderRadius: 8,
                border: adminGroups === n ? `2px solid ${C.teal}` : `1.5px solid ${C.border}`,
                background: adminGroups === n ? C.tealLight : C.card,
                color: adminGroups === n ? C.teal : C.muted,
                fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: font,
              }}>{n}</button>
            ))}
          </div>

          <button onClick={createSession} disabled={!adminTitle.trim()} style={{
            width: "100%", padding: "16px", borderRadius: 12,
            background: !adminTitle.trim() ? C.border : C.teal,
            color: "#fff", border: "none", fontSize: 16,
            fontWeight: 600, cursor: !adminTitle.trim() ? "default" : "pointer",
            fontFamily: font, boxShadow: adminTitle.trim() ? `0 4px 16px ${C.teal}30` : "none",
          }}>{t.create}</button>
        </div>
      </div>
    );
  }

  // ─── FACILITATOR DASHBOARD ───
  if (screen === "dashboard") {
    const qs = session?.paperType === "srma"
      ? (lang === "zh" ? SRMA_QUESTIONS.zh : SRMA_QUESTIONS.en)
      : (lang === "zh" ? RCT_QUESTIONS.zh : RCT_QUESTIONS.en);

    return (
      <div style={{ minHeight: "100dvh", background: C.bg, fontFamily: font }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap');
          * { box-sizing: border-box; margin: 0; }
          @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
        `}</style>
        <Header showBack onBack={() => setScreen("home")} />
        <div style={{ padding: "24px", maxWidth: 960, margin: "0 auto" }}>
          {/* Session info bar */}
          <div style={{
            display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16,
            padding: "16px 20px", background: C.card, borderRadius: 12,
            border: `1px solid ${C.border}`, marginBottom: 20,
          }}>
            <div>
              <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{t.roomCodeIs}</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: C.teal, letterSpacing: 6 }}>{session?.roomCode}</div>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>{session?.title}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{session?.authors}</div>
              <div style={{
                display: "inline-block", padding: "2px 8px", borderRadius: 4, marginTop: 4,
                background: session?.paperType === "rct" ? `${C.coral}15` : `${C.purple}15`,
                color: session?.paperType === "rct" ? C.coral : C.purple,
                fontSize: 11, fontWeight: 600,
              }}>
                {session?.paperType === "rct" ? "RCT" : "SR/MA"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {phase === "setup" && (
                <button onClick={() => { setPhase("discussion"); startTimer(25); }} style={{
                  padding: "10px 20px", borderRadius: 8, background: C.green, color: "#fff",
                  border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: font,
                }}>{t.startDiscussion}</button>
              )}
              {phase === "discussion" && (
                <button onClick={() => { setPhase("reporting"); startTimer(25); }} style={{
                  padding: "10px 20px", borderRadius: 8, background: C.blue, color: "#fff",
                  border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: font,
                }}>{t.startReporting}</button>
              )}
              {phase === "reporting" && (
                <button onClick={() => { setPhase("setup"); setTimerEnd(null); }} style={{
                  padding: "10px 20px", borderRadius: 8, background: C.red, color: "#fff",
                  border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: font,
                }}>{t.endSession}</button>
              )}
            </div>
          </div>

          {/* Phase + Timer */}
          {phase !== "setup" && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{
                padding: "4px 12px", borderRadius: 20,
                background: phase === "discussion" ? `${C.green}15` : `${C.blue}15`,
                color: phase === "discussion" ? C.green : C.blue,
                fontSize: 13, fontWeight: 700,
              }}>
                {phase === "discussion" ? `🗣 ${t.discussion}` : `📢 ${t.reporting}`}
              </div>
              <Timer endTime={timerEnd} />
            </div>
          )}

          {/* Participants */}
          {session?.participants?.length > 0 && (
            <div style={{ marginBottom: 20, padding: "12px 16px", background: C.card, borderRadius: 10, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 8 }}>{t.participants} ({session.participants.length})</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {session.participants.map((p, i) => (
                  <span key={i} style={{
                    padding: "3px 10px", borderRadius: 12, fontSize: 12,
                    background: `${GROUP_COLORS[(p.groupId - 1) % 4]}15`,
                    color: GROUP_COLORS[(p.groupId - 1) % 4],
                    fontWeight: 500,
                  }}>
                    {p.name} · {t.group}{p.groupId}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Answers: one card per question, showing the assigned group's answer */}
          {qs.map(q => {
            const assignedGroupId = getGroupForQuestion(q.id, session?.paperType);
            const gIdx = assignedGroupId - 1;
            const gColor = GROUP_COLORS[gIdx % 4];
            const ans = answers[`${assignedGroupId}-${q.id}`];
            const advAns = advancedAnswers[`${assignedGroupId}-${q.id}`];
            const advQs = session?.paperType === "rct" ? RCT_ADVANCED : SRMA_ADVANCED;
            const advQ = advQs[lang]?.[q.id];
            return (
              <div key={q.id} style={{
                marginBottom: 16, padding: "16px 20px",
                background: C.card, borderRadius: 12,
                border: `1px solid ${C.border}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 7, background: gColor, color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700,
                  }}>{q.id}</div>
                  <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: C.dark }}>{q.short}: {q.title}</div>
                  <div style={{
                    padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700,
                    background: `${gColor}15`, color: gColor,
                  }}>{t.group} {assignedGroupId}</div>
                </div>

                <div style={{
                  padding: "12px 14px", borderRadius: 8,
                  background: `${gColor}06`,
                  border: `1px solid ${gColor}25`,
                  minHeight: 60,
                }}>
                  <div style={{ fontSize: 14, lineHeight: 1.7, color: C.dark, whiteSpace: "pre-wrap" }}>
                    {ans?.content || <span style={{ color: C.muted, fontStyle: "italic", fontSize: 13 }}>{t.noAnswerYet}</span>}
                  </div>
                  {ans?.updatedBy && (
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>✏️ {ans.updatedBy}</div>
                  )}
                </div>

                {/* Advanced challenge answer on dashboard */}
                {advQ && advAns?.content && (
                  <div style={{
                    marginTop: 10, padding: "12px 14px", borderRadius: 8,
                    background: "#FFF8F5",
                    border: `1px solid ${C.coral}30`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                      <span style={{ fontSize: 12 }}>🔥</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.coral }}>{t.challenge}: {advQ.short}</span>
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.7, color: C.dark, whiteSpace: "pre-wrap" }}>
                      {advAns.content}
                    </div>
                    {advAns.updatedBy && (
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>✏️ {advAns.updatedBy}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── WORKSHOP SCREEN (Participant) ───
  if (screen === "workshop") {
    return (
      <div style={{ minHeight: "100dvh", background: C.bg, fontFamily: font }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap');
          * { box-sizing: border-box; margin: 0; }
          @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
          textarea:focus, input:focus { outline: none; }
          ::-webkit-scrollbar { display: none; }
        `}</style>
        <Header showBack onBack={() => setScreen("home")} />

        {/* Group badge */}
        <div style={{
          padding: "8px 16px", background: `${groupColor}08`,
          borderBottom: `1px solid ${groupColor}20`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              padding: "3px 10px", borderRadius: 12,
              background: `${groupColor}18`, color: groupColor,
              fontSize: 12, fontWeight: 700,
            }}>{t.group} {userGroup}</div>
            <span style={{ fontSize: 13, color: C.dark, fontWeight: 500 }}>{userName}</span>
          </div>
          {phase !== "setup" && (
            <div style={{
              padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600,
              background: phase === "discussion" ? `${C.green}12` : `${C.blue}12`,
              color: phase === "discussion" ? C.green : C.blue,
            }}>
              {phase === "discussion" ? `🗣 ${t.discussion}` : `📢 ${t.reporting}`}
            </div>
          )}
        </div>

        {/* Article summary (collapsible) */}
        {session?.title && (
          <ArticleSummary session={session} lang={lang} t={t} />
        )}

        {/* Question tabs — only this group's assigned questions */}
        <TabBar
          questions={myQuestions}
          activeQ={activeQ}
          onSelect={(qId) => {
            setActiveQ(qId);
          }}
          groupColor={groupColor}
        />

        {/* Show only the active question */}
        <div style={{ padding: "0 16px 80px" }}>
          {myQuestions.filter(q => q.id === activeQ).map(q => (
            <QuestionSection
              key={q.id}
              question={q}
              questionId={q.id}
              answer={answers[`${userGroup}-${q.id}`]?.content}
              onAnswerChange={handleAnswerChange}
              advancedAnswer={advancedAnswers[`${userGroup}-${q.id}`]?.content}
              onAdvancedAnswerChange={handleAdvancedAnswerChange}
              paperType={session?.paperType || "rct"}
              lang={lang}
              groupColor={groupColor}
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
}

// ─── Article Summary Component ───
function ArticleSummary({ session, lang, t }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      margin: "0", borderBottom: `1px solid ${C.border}`,
    }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%", padding: "12px 16px",
          display: "flex", alignItems: "center", gap: 10,
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "'Noto Sans TC', sans-serif", textAlign: "left",
        }}
      >
        <span style={{ fontSize: 16 }}>📄</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.dark, lineHeight: 1.4 }}>{session.title}</div>
          <div style={{ fontSize: 11, color: C.muted }}>{session.authors}</div>
        </div>
        <span style={{
          fontSize: 12, color: C.muted,
          transform: expanded ? "rotate(180deg)" : "none",
          transition: "transform 0.2s",
        }}>▼</span>
      </button>

      {expanded && (
        <div style={{ padding: "0 16px 16px", animation: "slideDown 0.2s ease" }}>
          {/* Paper type badge */}
          <div style={{
            display: "inline-block", padding: "3px 10px", borderRadius: 6, marginBottom: 12,
            background: session.paperType === "rct" ? `${C.coral}12` : `${C.purple}12`,
            color: session.paperType === "rct" ? C.coral : C.purple,
            fontSize: 12, fontWeight: 600,
          }}>
            {session.paperType === "rct" ? "🧪 RCT" : "📊 SR/MA"}
          </div>

          {/* PICO breakdown */}
          {session.pico && (Object.values(session.pico).some(v => v)) && (
            <div style={{
              padding: "12px", borderRadius: 10,
              background: C.tealLight, border: `1px solid ${C.teal}20`,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.teal, marginBottom: 8 }}>PICO</div>
              {["p", "i", "c", "o"].map(key => (
                session.pico[key] ? (
                  <div key={key} style={{ display: "flex", gap: 8, marginBottom: 4, fontSize: 13, lineHeight: 1.5 }}>
                    <span style={{ fontWeight: 700, color: C.teal, width: 16, flexShrink: 0 }}>{key.toUpperCase()}</span>
                    <span style={{ color: C.dark }}>{session.pico[key]}</span>
                  </div>
                ) : null
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
