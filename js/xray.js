/* DRIFTX Business X-Ray™ — trilingual (EN / HE / AR) client-side diagnostic.
   One DriftX X-Ray — three native experiences. Deterministic weighted scoring
   (DriftX methodology as data), phrased in the user's language. No backend. */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const el = (t, cls, html) => { const e = document.createElement(t); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const LANGS = ["en", "he", "ar"];
  const L = () => { const l = document.documentElement.lang; return LANGS.includes(l) ? l : "en"; };
  const P = (o) => (o && (o[L()] != null ? o[L()] : o.en)) || "";

  /* ===================== Translations ===================== */
  const T = {
    // intro
    kicker: { en: "How healthy is<br>your <span class='gradient-text'>business?</span>", he: "כמה בריא<br>העסק <span class='gradient-text'>שלך?</span>", ar: "ما مدى صحّة<br><span class='gradient-text'>عملك؟</span>" },
    intro: { en: "Answer a few questions about your team, sales, management and marketing — and DriftX AI will show you exactly what's holding your business back, and what to fix first.",
      he: "ענה על מספר שאלות בנוגע לצוות, למכירות, לניהול ולשיווק שלך — ו-DriftX AI יראה לך בדיוק מה מעכב את העסק, ומה כדאי לתקן קודם.",
      ar: "أجب عن بضعة أسئلة حول فريقك ومبيعاتك وإدارتك وتسويقك — وسيُظهر لك DriftX AI بالضبط ما الذي يعيق نمو عملك، وما الذي يجب تحسينه أولاً." },
    lvlQuick: { en: "Quick Check", he: "בדיקה מהירה", ar: "فحص سريع" },
    lvlFull: { en: "Full Business X-Ray", he: "אבחון עסקי מלא", ar: "تشخيص الأعمال الكامل" },
    lvlPro: { en: "DriftX Professional Audit", he: "אודיט מקצועי של DriftX", ar: "تدقيق DriftX الاحترافي" },
    tMinsQ: { en: "3–5 minutes", he: "3–5 דקות", ar: "3–5 دقائق" },
    tMinsF: { en: "8–12 minutes", he: "8–12 דקות", ar: "8–12 دقيقة" },
    tPro: { en: "With our team", he: "עם הצוות שלנו", ar: "مع فريقنا" },
    q15: { en: "~15 questions", he: "כ-15 שאלות", ar: "~15 سؤالاً" },
    adaptive: { en: "Adaptive questions", he: "שאלות דינמיות", ar: "أسئلة تكيّفية" },
    realdata: { en: "Real data & calls", he: "נתוני אמת ושיחות", ar: "بيانات ومكالمات حقيقية" },
    recommended: { en: "Recommended", he: "מומלץ", ar: "موصى به" },
    quickList: { en: ["Business Score", "Top 3 problems", "Where to start"], he: ["ציון עסקי", "3 בעיות מרכזיות", "מאיפה מתחילים"], ar: ["درجة العمل", "أهم 3 مشاكل", "من أين تبدأ"] },
    fullList: { en: ["Full diagnosis + radar", "Root-cause analysis", "30-day action plan", "Growth readiness"], he: ["אבחון מלא + ראדאר", "ניתוח שורש הבעיה", "תוכנית פעולה ל-30 יום", "מוכנות לצמיחה"], ar: ["تشخيص كامل + رادار", "تحليل السبب الجذري", "خطة عمل 30 يوماً", "الجاهزية للنمو"] },
    proList: { en: ["Deep operational audit", "Employees · calls · CRM", "Implementation plan"], he: ["אודיט תפעולי מעמיק", "עובדים · שיחות · CRM", "תוכנית יישום"], ar: ["تدقيق تشغيلي عميق", "الموظفون · المكالمات · CRM", "خطة تنفيذ"] },
    privacy: { en: "This is a diagnostic estimate based on your answers, not a guarantee of results. You choose ranges — no exact financials or trade secrets required. Your inputs stay in your browser for this assessment.",
      he: "זהו אומדן אבחוני המבוסס על תשובותיך, לא הבטחת תוצאות. בוחרים טווחים — אין צורך בנתונים כספיים מדויקים או בסודות מסחריים. הנתונים נשמרים בדפדפן שלך עבור הבדיקה.",
      ar: "هذا تقدير تشخيصي مبني على إجاباتك، وليس ضماناً للنتائج. تختار نطاقات — دون الحاجة إلى أرقام مالية دقيقة أو أسرار تجارية. تبقى مدخلاتك في متصفّحك لأجل هذا التقييم." },
    // basics
    step1: { en: "Step 1 — Your business", he: "שלב 1 — העסק שלך", ar: "الخطوة 1 — عملك" },
    basicsSub: { en: "A few quick facts to tailor the diagnostic.", he: "כמה פרטים מהירים כדי להתאים את האבחון.", ar: "بضع حقائق سريعة لتخصيص التشخيص." },
    start: { en: "Start the X-Ray →", he: "התחל אבחון →", ar: "ابدأ التشخيص →" },
    back: { en: "‹ Back", he: "‹ חזרה", ar: "‹ رجوع" },
    select: { en: "Select…", he: "בחר…", ar: "اختر…" },
    // scanning
    scanning: { en: "Scanning your business", he: "DriftX AI מנתח את העסק שלך", ar: "يقوم DriftX AI بتحليل عملك" },
    detecting: { en: "Detecting opportunities to improve…", he: "מזהה נקודות לשיפור…", ar: "جاري تحديد فرص التحسين…" },
    // results
    yourScore: { en: "Your Business X-Ray Score", he: "ציון האבחון של העסק שלך", ar: "درجة تشخيص عملك" },
    dims: { en: "The 8 dimensions of your business", he: "8 הממדים של העסק שלך", ar: "أبعاد عملك الثمانية" },
    diagTitle: { en: "We analyzed 8 areas — here's the diagnosis", he: "ניתחנו 8 תחומים — הנה האבחון", ar: "حلّلنا 8 مجالات — إليك التشخيص" },
    rootTitle: { en: "Root-cause analysis — why {x} is your biggest opportunity", he: "ניתוח שורש — למה {x} היא ההזדמנות הגדולה שלך", ar: "تحليل السبب الجذري — لماذا {x} هي فرصتك الأكبر" },
    rootNote: { en: "More leads won't always fix this. Most of the gap comes from how existing opportunities are handled.", he: "עוד לידים לא תמיד יפתרו את זה. רוב הפער נובע מהאופן שבו מטפלים בהזדמנויות הקיימות.", ar: "المزيد من العملاء لن يحلّ هذا دائماً. معظم الفجوة تأتي من طريقة التعامل مع الفرص الحالية." },
    fixFirst: { en: "What to fix first", he: "במה כדאי להתמקד קודם", ar: "ما الذي يجب تحسينه أولاً" },
    currently: { en: "currently", he: "כרגע", ar: "حالياً" },
    planTitle: { en: "Your 30-day improvement plan", he: "תוכנית השיפור שלך ל-30 יום", ar: "خطة تطوير عملك خلال 30 يوماً" },
    planFocus: { en: "Focused on your weakest areas first:", he: "ממוקד קודם בתחומים החלשים ביותר:", ar: "يركّز أولاً على أضعف المجالات:" },
    implReady: { en: "Implementation & readiness", he: "יישום ומוכנות", ar: "التطبيق والجاهزية" },
    implScore: { en: "DriftX Implementation Score", he: "רמת היישום בעסק", ar: "مستوى التطبيق في عملك" },
    implDesc: { en: "You currently implement {p}% of the recommended DriftX business framework.", he: "העסק שלך מיישם כיום כ-{p}% מהתהליכים במתודולוגיית DriftX.", ar: "يطبّق عملك حالياً نحو {p}% من العمليات ضمن منهجية DriftX." },
    growth: { en: "Growth Readiness", he: "מוכנות לצמיחה", ar: "الجاهزية للنمو" },
    growthDesc: { en: "How ready your business is to scale, based on the parameters assessed.", he: "עד כמה העסק ערוך לצמיחה, לפי הפרמטרים שנבדקו.", ar: "مدى جاهزية عملك للنمو، بناءً على المعايير التي جرى تقييمها." },
    simTitle: { en: "What happens if you improve?", he: "מה יקרה אם תשתפר?", ar: "ماذا يحدث إذا تحسّنت؟" },
    simLeads: { en: "Monthly leads", he: "לידים בחודש", ar: "عملاء محتملون شهرياً" },
    simConv: { en: "Conversion", he: "המרה", ar: "التحويل" },
    simCust: { en: "Customers / mo", he: "לקוחות / חודש", ar: "عملاء / شهرياً" },
    simCap: { en: "Improve conversion by {d} points → {g} customers/month. Illustrative scenario, not a guarantee.", he: "שפר המרה ב-{d} נקודות → {g} לקוחות בחודש. תרחיש להמחשה, לא הבטחה.", ar: "حسّن التحويل بمقدار {d} نقاط → {g} عميلاً شهرياً. سيناريو توضيحي وليس ضماناً." },
    risksTitle: { en: "What to be careful about", he: "על מה כדאי לשים לב", ar: "ما الذي يجب الانتباه إليه" },
    helpTitle: { en: "How DriftX can help", he: "איך DriftX יכולה לעזור", ar: "كيف يمكن لـ DriftX مساعدتك" },
    biggestOpp: { en: "Your biggest opportunity", he: "ההזדמנות הגדולה שלך", ar: "فرصتك الأكبر" },
    buildPlan: { en: "Build my improvement plan with DriftX", he: "בנו איתי תוכנית שיפור", ar: "ابنِ خطة تطوير عملي مع DriftX" },
    restart: { en: "Start over", he: "התחל מחדש", ar: "ابدأ من جديد" },
    // bands
    bStrong: { en: "Strong", he: "חזק", ar: "قوي" },
    bNeeds: { en: "Needs improvement", he: "דורש שיפור", ar: "بحاجة إلى تحسين" },
    bCrit: { en: "Opportunity", he: "הזדמנות", ar: "فرصة مهمة" },
    readyHigh: { en: "High Potential", he: "פוטנציאל גבוה", ar: "إمكانات عالية" },
    readyMid: { en: "Improvement Required", he: "נדרש שיפור", ar: "يحتاج إلى تحسين" },
    readyLow: { en: "Critical", he: "קריטי", ar: "بحاجة إلى تدخّل" },
    hl70: { en: "Solid foundation, clear upside.", he: "בסיס איתן, פוטנציאל ברור.", ar: "أساس متين وإمكانات واضحة." },
    hl55: { en: "Real potential — a few gaps are holding you back.", he: "פוטנציאל אמיתי — כמה פערים מעכבים אותך.", ar: "إمكانات حقيقية — بعض الفجوات تعيقك." },
    hl0: { en: "Big opportunities are waiting right now.", he: "הזדמנויות גדולות מחכות ממש עכשיו.", ar: "فرص كبيرة تنتظرك الآن." },
    weeks: { en: ["Week 1 — Audit", "Week 2 — Train", "Week 3 — Systemize", "Week 4 — Measure"], he: ["שבוע 1 — בדיקה", "שבוע 2 — הדרכה", "שבוע 3 — הטמעה", "שבוע 4 — מדידה"], ar: ["الأسبوع 1 — مراجعة", "الأسبوع 2 — تدريب", "الأسبوع 3 — أتمتة", "الأسبوع 4 — قياس"] },
    weekItems: {
      en: [["Review recent sales calls", "Define KPIs & follow-up rules", "Map the current process"], ["Sales training & role-plays", "Objection handling", "Document scripts"], ["CRM automation", "Lead tracking & scoring", "Manager dashboard"], ["Measure results", "Compare employees", "Adjust the process"]],
      he: [["בדיקת שיחות מכירה", "הגדרת KPI וכללי Follow-up", "מיפוי התהליך הקיים"], ["הדרכת מכירות וסימולציות", "טיפול בהתנגדויות", "תיעוד תסריטים"], ["אוטומציה של CRM", "מעקב וניקוד לידים", "דשבורד למנהל"], ["מדידת תוצאות", "השוואת עובדים", "כיול התהליך"]],
      ar: [["مراجعة مكالمات المبيعات", "تحديد مؤشرات الأداء وقواعد المتابعة", "رسم العملية الحالية"], ["تدريب المبيعات ومحاكاة", "التعامل مع الاعتراضات", "توثيق السيناريوهات"], ["أتمتة CRM", "تتبّع وتقييم العملاء", "لوحة متابعة للمدير"], ["قياس النتائج", "مقارنة الموظفين", "ضبط العملية"]] },
  };

  /* Categories (names per language) */
  const CATS = {
    management: { w: 1.2, n: { en: "Management", he: "ניהול", ar: "الإدارة" }, s: { en: "Mgmt", he: "ניהול", ar: "إدارة" } },
    sales: { w: 1.4, n: { en: "Sales", he: "מכירות", ar: "المبيعات" }, s: { en: "Sales", he: "מכירות", ar: "مبيعات" } },
    employees: { w: 1.0, n: { en: "Employees", he: "עובדים", ar: "الموظفون" }, s: { en: "People", he: "עובדים", ar: "موظفون" } },
    training: { w: 1.1, n: { en: "Training", he: "הדרכה", ar: "التدريب" }, s: { en: "Train", he: "הדרכה", ar: "تدريب" } },
    marketing: { w: 1.1, n: { en: "Marketing", he: "שיווק", ar: "التسويق" }, s: { en: "Mktg", he: "שיווק", ar: "تسويق" } },
    leadmgmt: { w: 1.3, n: { en: "Lead Management", he: "ניהול לידים", ar: "إدارة العملاء المحتملين" }, s: { en: "Leads", he: "לידים", ar: "عملاء" } },
    cx: { w: 1.0, n: { en: "Customer Experience", he: "חוויית לקוח", ar: "تجربة العميل" }, s: { en: "CX", he: "לקוח", ar: "تجربة" } },
    control: { w: 1.0, n: { en: "Business Control", he: "בקרה עסקית", ar: "الرقابة على الأداء" }, s: { en: "Control", he: "בקרה", ar: "رقابة" } },
  };
  const CATKEYS = Object.keys(CATS);

  /* Priority names + service glossary */
  const PRIO = {
    management: { en: "Management control & KPIs", he: "בקרה ניהולית ו-KPI", ar: "الرقابة الإدارية ومؤشرات الأداء" },
    sales: { en: "Sales process & performance", he: "תהליך וביצועי מכירות", ar: "عملية وأداء المبيعات" },
    employees: { en: "People & individual targets", he: "עובדים ויעדים אישיים", ar: "الموظفون والأهداف الفردية" },
    training: { en: "Team training & call QA", he: "הדרכת צוות ו-QA שיחות", ar: "تدريب الفريق ومراقبة جودة المكالمات" },
    marketing: { en: "Marketing by revenue, not volume", he: "שיווק לפי הכנסה, לא כמות", ar: "التسويق بالإيراد لا بالكمّية" },
    leadmgmt: { en: "Lead follow-up & CRM automation", he: "מעקב לידים ואוטומציית CRM", ar: "متابعة العملاء وأتمتة CRM" },
    cx: { en: "Post-sale experience & retention", he: "חוויה לאחר מכירה ושימור", ar: "تجربة ما بعد البيع والاحتفاظ" },
    control: { en: "Funnel tracking & data", he: "מעקב פאנל ונתונים", ar: "تتبّع المسار والبيانات" },
  };
  const SV = {
    salesAudit: { en: "Sales system audit", he: "בדיקת מערך המכירות", ar: "تقييم منظومة المبيعات" },
    salesProcess: { en: "Sales process development", he: "בניית תהליך מכירה", ar: "بناء وتطوير عملية البيع" },
    training: { en: "Sales team training", he: "הדרכת אנשי מכירות", ar: "تدريب فريق المبيعات" },
    callAnalysis: { en: "Call analysis", he: "ניתוח שיחות", ar: "تحليل المكالمات" },
    scripts: { en: "Sales scripts", he: "בניית תסריטי מכירה", ar: "تطوير سيناريوهات البيع" },
    objections: { en: "Objection handling", he: "טיפול בהתנגדויות", ar: "التعامل مع الاعتراضات" },
    kpi: { en: "KPI implementation", he: "בניית KPI", ar: "بناء مؤشرات الأداء KPI" },
    mgrCoaching: { en: "Management coaching", he: "הדרכת מנהלים", ar: "تدريب المديرين" },
    crm: { en: "CRM setup & automation", he: "הקמת CRM ואוטומציה", ar: "إعداد وأتمتة CRM" },
    process: { en: "Process design", he: "עיצוב תהליכי עבודה", ar: "تصميم آليات العمل" },
    dashboards: { en: "Reporting & dashboards", he: "דוחות ודשבורדים", ar: "التقارير ولوحات المتابعة" },
    roleFit: { en: "Role-fit assessment", he: "התאמת עובדים לתפקיד", ar: "تقييم ملاءمة الموظفين للأدوار" },
    targets: { en: "Individual targets", he: "יעדים אישיים", ar: "أهداف فردية" },
    perfScore: { en: "Performance scoring", he: "מדידת ביצועים", ar: "قياس الأداء" },
    onboarding: { en: "Structured onboarding", he: "תהליך קליטה מובנה", ar: "برنامج تأهيل منظّم" },
    rolePlay: { en: "Role-play sessions", he: "סימולציות מכירה", ar: "جلسات محاكاة بيع" },
    callQA: { en: "Call QA & coaching", he: "QA ואימון שיחות", ar: "مراقبة الجودة وتدريب المكالمات" },
    leadRevenue: { en: "Lead-source revenue tracking", he: "מדידת הכנסה לפי מקור ליד", ar: "تتبّع الإيراد حسب مصدر العميل" },
    offerAudience: { en: "Offer & audience refinement", he: "חידוד הצעה וקהל", ar: "تحسين العرض والجمهور" },
    channels: { en: "Channel strategy", he: "אסטרטגיית ערוצים", ar: "استراتيجية القنوات" },
    landing: { en: "Landing-page optimization", he: "אופטימיזציית דפי נחיתה", ar: "تحسين صفحات الهبوط" },
    followup: { en: "Follow-up cadence", he: "קצב Follow-up", ar: "إيقاع المتابعة" },
    leadScoring: { en: "Lead scoring", he: "ניקוד לידים", ar: "تقييم العملاء المحتملين" },
    pipeline: { en: "Pipeline management", he: "ניהול Pipeline", ar: "إدارة خط الأنابيب" },
    retention: { en: "Retention program", he: "תוכנית שימור", ar: "برنامج الاحتفاظ بالعملاء" },
    feedback: { en: "Customer feedback loop", he: "לולאת משוב לקוחות", ar: "حلقة ملاحظات العملاء" },
    funnel: { en: "Funnel tracking", he: "מעקב פאנל", ar: "تتبّع مسار التحويل" },
    sot: { en: "Single source of truth", he: "מקור אמת יחיד", ar: "مصدر حقيقة واحد" },
    decisionKpi: { en: "Decision KPIs", he: "מדדי החלטה", ar: "مؤشرات القرار" },
  };
  const CATINFO = {
    management: { services: ["mgrCoaching", "kpi", "process", "dashboards"],
      low: { en: "There's a real opportunity to structure roles, KPIs and performance tracking so decisions rely on data, not gut feeling.", he: "יש הזדמנות אמיתית לבנות תפקידים, KPI ומעקב ביצועים כדי שההחלטות יתבססו על נתונים ולא על תחושת בטן.", ar: "هناك فرصة حقيقية لهيكلة الأدوار ومؤشرات الأداء ومتابعة الأداء بحيث تُبنى القرارات على البيانات لا على الحدس." },
      mid: { en: "You have goals, but management control and consistent tracking can be tightened.", he: "יש יעדים, אך ניתן להדק את הבקרה הניהולית והמעקב העקבי.", ar: "لديك أهداف، لكن يمكن إحكام الرقابة الإدارية والمتابعة المنتظمة." },
      high: { en: "Management is structured with clear roles and KPIs — a real strength.", he: "הניהול מובנה עם תפקידים ו-KPI ברורים — חוזקה אמיתית.", ar: "الإدارة منظّمة بأدوار ومؤشرات واضحة — نقطة قوة حقيقية." } },
    sales: { services: ["salesProcess", "objections", "scripts", "callAnalysis", "kpi"],
      low: { en: "A defined, measured sales process would lift response speed, objection handling and closing across the team.", he: "תהליך מכירה מוגדר ומדיד ישפר מהירות תגובה, טיפול בהתנגדויות וסגירה בכל הצוות.", ar: "عملية بيع محدّدة وقابلة للقياس سترفع سرعة الاستجابة ومعالجة الاعتراضات والإغلاق لدى الفريق." },
      mid: { en: "A sales motion exists but isn't fully documented or measured across the team.", he: "קיים תהליך מכירה אך הוא אינו מתועד או נמדד במלואו.", ar: "توجد عملية بيع لكنها غير موثّقة أو مقيسة بالكامل عبر الفريق." },
      high: { en: "Your sales process is defined and measured — keep reinforcing it.", he: "תהליך המכירה מוגדר ונמדד — המשיכו לחזק אותו.", ar: "عملية مبيعاتك محدّدة ومقيسة — واصل تعزيزها." } },
    employees: { services: ["roleFit", "targets", "perfScore", "onboarding"],
      low: { en: "Aligning people, roles and individual targets — and comparing performance — is a strong growth lever.", he: "התאמת אנשים, תפקידים ויעדים אישיים — והשוואת ביצועים — היא מנוף צמיחה חזק.", ar: "مواءمة الأشخاص والأدوار والأهداف الفردية — ومقارنة الأداء — رافعة نمو قوية." },
      mid: { en: "Employees have some targets, but measurement and role-fit could be tighter.", he: "לעובדים יש יעדים מסוימים, אך ניתן להדק מדידה והתאמה לתפקיד.", ar: "لدى الموظفين بعض الأهداف، لكن يمكن إحكام القياس وملاءمة الأدوار." },
      high: { en: "The right people are in the right roles with measured performance.", he: "האנשים הנכונים בתפקידים הנכונים עם ביצועים נמדדים.", ar: "الأشخاص المناسبون في الأدوار المناسبة مع أداء مقيس." } },
    training: { services: ["onboarding", "training", "rolePlay", "callQA"],
      low: { en: "Structured onboarding, ongoing training and call QA would raise team performance quickly.", he: "קליטה מובנית, הדרכה מתמשכת ו-QA לשיחות ישפרו במהירות את ביצועי הצוות.", ar: "برنامج تأهيل منظّم وتدريب مستمر ومراقبة جودة المكالمات سيرفع أداء الفريق بسرعة." },
      mid: { en: "Some training happens, but it isn't consistent or reviewed systematically.", he: "מתקיימת הדרכה מסוימת, אך היא אינה עקבית או נבדקת באופן שיטתי.", ar: "يحدث بعض التدريب، لكنه غير منتظم أو مُراجَع بشكل منهجي." },
      high: { en: "You invest in structured training and QA — a strong foundation.", he: "אתם משקיעים בהדרכה מובנית ו-QA — בסיס חזק.", ar: "أنت تستثمر في تدريب منظّم ومراقبة جودة — أساس قوي." } },
    marketing: { services: ["leadRevenue", "offerAudience", "channels", "landing"],
      low: { en: "Measuring revenue and quality by source (not just volume) would sharpen every marketing decision.", he: "מדידת הכנסה ואיכות לפי מקור (ולא רק כמות) תחדד כל החלטה שיווקית.", ar: "قياس الإيراد والجودة حسب المصدر (لا الكمّية فقط) سيصقل كل قرار تسويقي." },
      mid: { en: "You track some marketing metrics, but not revenue by source.", he: "אתם עוקבים אחר חלק מהמדדים, אך לא אחר הכנסה לפי מקור.", ar: "تتابع بعض مقاييس التسويق، لكن ليس الإيراد حسب المصدر." },
      high: { en: "Marketing is measured by revenue and quality, not just volume.", he: "השיווק נמדד לפי הכנסה ואיכות, לא רק כמות.", ar: "يُقاس التسويق بالإيراد والجودة، لا بالكمّية فقط." } },
    leadmgmt: { services: ["crm", "followup", "leadScoring", "pipeline"],
      low: { en: "A consistent follow-up cadence and lead scoring would stop opportunities leaking mid-funnel.", he: "קצב Follow-up עקבי וניקוד לידים ימנעו נזילת הזדמנויות באמצע הפאנל.", ar: "إيقاع متابعة منتظم وتقييم للعملاء سيمنع تسرّب الفرص في منتصف المسار." },
      mid: { en: "Leads are managed, but follow-up cadence and scoring aren't fully structured.", he: "הלידים מנוהלים, אך קצב ה-Follow-up והניקוד אינם מובנים במלואם.", ar: "تُدار العملاء المحتملون، لكن إيقاع المتابعة والتقييم غير مُهيكلين بالكامل." },
      high: { en: "Leads are tracked, prioritized and followed up with a clear cadence.", he: "הלידים נמדדים, מתועדפים ומקבלים Follow-up בקצב ברור.", ar: "يُتابَع العملاء ويُرتّبون بأولوية بإيقاع واضح." } },
    cx: { services: ["followup", "retention", "feedback"],
      low: { en: "Structured post-sale follow-up and retention tracking would grow repeat revenue.", he: "Follow-up מובנה לאחר מכירה ומעקב שימור יגדילו הכנסה חוזרת.", ar: "متابعة منظّمة بعد البيع وتتبّع الاحتفاظ سيُنمّيان الإيراد المتكرّر." },
      mid: { en: "Post-sale experience is decent but not systematic.", he: "החוויה לאחר המכירה סבירה אך אינה שיטתית.", ar: "تجربة ما بعد البيع جيدة لكنها غير منهجية." },
      high: { en: "Customers are followed up, satisfied and coming back — a strength.", he: "הלקוחות מקבלים Follow-up, מרוצים וחוזרים — חוזקה.", ar: "العملاء يُتابَعون وراضون ويعودون — نقطة قوة." } },
    control: { services: ["funnel", "sot", "dashboards", "decisionKpi"],
      low: { en: "A single source of truth and funnel tracking would turn scattered data into confident decisions.", he: "מקור אמת יחיד ומעקב פאנל יהפכו נתונים מפוזרים להחלטות בטוחות.", ar: "مصدر حقيقة واحد وتتبّع المسار سيحوّلان البيانات المبعثرة إلى قرارات واثقة." },
      mid: { en: "You track some numbers, but data is scattered across tools.", he: "אתם עוקבים אחר חלק מהמספרים, אך הנתונים מפוזרים בין כלים.", ar: "تتابع بعض الأرقام، لكن البيانات مبعثرة بين الأدوات." },
      high: { en: "You run on data with a single source of truth and funnel tracking.", he: "אתם פועלים לפי נתונים עם מקור אמת יחיד ומעקב פאנל.", ar: "تعمل بالبيانات مع مصدر حقيقة واحد وتتبّع للمسار." } },
  };

  /* Reusable answer scales (labels per language, scores fixed) */
  const SC = {
    MAT: { s: [15, 45, 72, 95], l: { en: ["Not really", "Somewhat", "Mostly", "Fully"], he: ["לא ממש", "במידה מסוימת", "ברובו", "באופן מלא"], ar: ["ليس فعلاً", "إلى حدٍّ ما", "في الغالب", "بشكل كامل"] } },
    YNT: { s: [15, 45, 72, 95], l: { en: ["No", "Partially", "Yes", "Yes, and tracked"], he: ["לא", "באופן חלקי", "כן", "כן, ונמדד"], ar: ["لا", "جزئياً", "نعم", "نعم، ومُتابَع"] } },
    IMPL: { s: [15, 45, 72, 95], l: { en: ["No", "Basic", "Yes", "Yes, automated"], he: ["לא", "בסיסי", "כן", "כן, אוטומטי"], ar: ["لا", "أساسي", "نعم", "نعم، آلي"] } },
    FREQ: { s: [15, 45, 72, 95], l: { en: ["Never", "Rarely", "Monthly", "Weekly"], he: ["אף פעם", "לעיתים רחוקות", "חודשי", "שבועי"], ar: ["أبداً", "نادراً", "شهرياً", "أسبوعياً"] } },
    QUAL: { s: [15, 45, 72, 95], l: { en: ["Low", "Mixed", "Good", "Excellent"], he: ["נמוכה", "מעורבת", "טובה", "מצוינת"], ar: ["منخفضة", "متفاوتة", "جيدة", "ممتازة"] } },
    SPEED: { s: [15, 45, 78, 98], l: { en: ["Hours or days", "Within an hour", "Within minutes", "Instant / automated"], he: ["שעות או ימים", "תוך שעה", "תוך דקות", "מיידי / אוטומטי"], ar: ["ساعات أو أيام", "خلال ساعة", "خلال دقائق", "فوري / آلي"] } },
    CRM: { s: [15, 40, 72, 95], l: { en: ["No", "Spreadsheets", "Basic CRM", "CRM + automation"], he: ["לא", "גיליונות", "CRM בסיסי", "CRM + אוטומציה"], ar: ["لا", "جداول", "CRM أساسي", "CRM + أتمتة"] } },
    PROC: { s: [15, 45, 72, 95], l: { en: ["No process", "Loosely", "Mostly", "Documented & trained"], he: ["אין תהליך", "באופן רופף", "ברובו", "מתועד ומודרך"], ar: ["لا عملية", "بشكل غير منظّم", "في الغالب", "موثّقة ومُدرّبة"] } },
    DATA: { s: [15, 40, 65, 95], l: { en: ["Gut feeling", "Mostly gut", "Mixed", "Data-driven"], he: ["תחושת בטן", "בעיקר תחושה", "מעורב", "מבוסס נתונים"], ar: ["الحدس", "غالباً الحدس", "مزيج", "مبني على البيانات"] } },
  };

  /* Questions — text per language, options from a scale */
  const Q = [
    { cat: "management", scale: "MAT", q: { en: "Are roles and responsibilities clearly defined?", he: "האם התפקידים והאחריות מוגדרים בבירור?", ar: "هل الأدوار والمسؤوليات محدّدة بوضوح؟" } },
    { cat: "management", scale: "YNT", impl: "kpi", q: { en: "Do managers track performance using defined KPIs?", he: "האם המנהלים עוקבים אחר ביצועים באמצעות KPI מוגדרים?", ar: "هل يتابع المدراء الأداء عبر مؤشرات أداء محدّدة؟" } },
    { cat: "management", scale: "FREQ", q: { en: "Do you hold regular team meetings with a clear agenda?", he: "האם מתקיימות ישיבות צוות סדירות עם סדר יום ברור?", ar: "هل تعقدون اجتماعات فريق منتظمة بجدول واضح؟" } },
    { cat: "sales", scale: "PROC", impl: "process", q: { en: "Do your salespeople follow a defined sales process?", he: "האם אנשי המכירות פועלים לפי תהליך מכירה מוגדר?", ar: "هل يتّبع مندوبو المبيعات عملية بيع محدّدة؟" } },
    { cat: "sales", scale: "SPEED", q: { en: "How fast is your first response to a new lead?", he: "כמה מהר מגיעה התגובה הראשונה לליד חדש?", ar: "ما سرعة أول استجابة لعميل محتمل جديد؟" } },
    { cat: "sales", scale: "MAT", q: { en: "Do you handle objections with a consistent method?", he: "האם אתם מטפלים בהתנגדויות בשיטה עקבית?", ar: "هل تعالجون الاعتراضات بأسلوب منهجي ثابت؟" } },
    { cat: "sales", scale: "YNT", impl: "agentconv", showIf: (b) => b.sellers !== "0", q: { en: "Do you measure each salesperson's conversion rate?", he: "האם אתם מודדים את יחס ההמרה של כל איש מכירות?", ar: "هل تقيسون معدّل تحويل كل مندوب مبيعات؟" } },
    { cat: "employees", scale: "MAT", q: { en: "Are the right people in the right roles?", he: "האם האנשים הנכונים נמצאים בתפקידים הנכונים?", ar: "هل الأشخاص المناسبون في الأدوار المناسبة؟" } },
    { cat: "employees", scale: "YNT", impl: "targets", q: { en: "Do employees have individual monthly targets?", he: "האם לכל עובד יש יעד חודשי אישי?", ar: "هل لكل موظف هدف شهري فردي؟" } },
    { cat: "employees", scale: "YNT", impl: "perfscore", q: { en: "Is employee performance measured and compared?", he: "האם ביצועי העובדים נמדדים ומושווים?", ar: "هل يُقاس أداء الموظفين ويُقارَن؟" } },
    { cat: "training", scale: "IMPL", impl: "onboarding", q: { en: "Does a new employee get a structured onboarding plan?", he: "האם עובד חדש מקבל תוכנית קליטה מובנית?", ar: "هل يحصل الموظف الجديد على برنامج تأهيل منظّم؟" } },
    { cat: "training", scale: "FREQ", q: { en: "Do you run ongoing sales training or role-plays?", he: "האם מתקיימות הדרכות מכירה או סימולציות באופן שוטף?", ar: "هل تُجرون تدريباً مستمراً للمبيعات أو محاكاة؟" } },
    { cat: "training", scale: "MAT", impl: "callmon", q: { en: "Are calls reviewed for quality (QA)?", he: "האם השיחות נבדקות לאיכות (QA)?", ar: "هل تُراجَع المكالمات للجودة (QA)؟" } },
    { cat: "marketing", scale: "YNT", q: { en: "Do you know your cost per qualified lead?", he: "האם אתם יודעים מה העלות לליד מוכשר?", ar: "هل تعرفون تكلفة العميل المؤهّل الواحد؟" } },
    { cat: "marketing", scale: "YNT", q: { en: "Do you measure revenue by lead source (not just volume)?", he: "האם אתם מודדים הכנסה לפי מקור ליד (לא רק כמות)?", ar: "هل تقيسون الإيراد حسب مصدر العميل (لا الكمّية فقط)؟" } },
    { cat: "marketing", scale: "QUAL", q: { en: "Is your incoming lead quality consistent and high?", he: "האם איכות הלידים הנכנסים עקבית וגבוהה?", ar: "هل جودة العملاء الواردين ثابتة وعالية؟" } },
    { cat: "leadmgmt", scale: "MAT", impl: "leadtrack", q: { en: "Are leads consistently followed up (multiple attempts)?", he: "האם הלידים מקבלים Follow-up עקבי (מספר ניסיונות)?", ar: "هل تُتابَع العملاء بانتظام (عدّة محاولات)؟" } },
    { cat: "leadmgmt", scale: "CRM", impl: "crm", q: { en: "Do you use a CRM to manage leads & pipeline?", he: "האם אתם משתמשים ב-CRM לניהול לידים ו-Pipeline?", ar: "هل تستخدمون CRM لإدارة العملاء وخط الأنابيب؟" } },
    { cat: "leadmgmt", scale: "YNT", q: { en: "Are leads prioritized or scored?", he: "האם הלידים מתועדפים או מנוקדים?", ar: "هل يُرتّب العملاء بالأولوية أو يُقيَّمون؟" } },
    { cat: "cx", scale: "IMPL", q: { en: "Do you have structured follow-up after the sale?", he: "האם יש Follow-up מובנה לאחר המכירה?", ar: "هل لديكم متابعة منظّمة بعد البيع؟" } },
    { cat: "cx", scale: "YNT", q: { en: "Do you measure customer satisfaction or retention?", he: "האם אתם מודדים שביעות רצון או שימור לקוחות?", ar: "هل تقيسون رضا العملاء أو الاحتفاظ بهم؟" } },
    { cat: "cx", scale: "MAT", q: { en: "Do customers come back and buy again?", he: "האם הלקוחות חוזרים וקונים שוב?", ar: "هل يعود العملاء ويشترون مجدداً؟" } },
    { cat: "control", scale: "YNT", q: { en: "Do you track conversion rates across the funnel?", he: "האם אתם עוקבים אחר יחסי המרה לאורך הפאנל?", ar: "هل تتابعون معدّلات التحويل عبر المسار؟" } },
    { cat: "control", scale: "DATA", q: { en: "Are decisions based on data or gut feeling?", he: "האם ההחלטות מבוססות על נתונים או על תחושת בטן?", ar: "هل تُبنى القرارات على البيانات أم على الحدس؟" } },
    { cat: "control", scale: "MAT", q: { en: "Do you have a single source of truth for business data?", he: "האם יש מקור אמת יחיד לנתוני העסק?", ar: "هل لديكم مصدر حقيقة واحد لبيانات العمل؟" } },
  ];

  const BASICS = [
    { id: "industry", q: { en: "What does your business do?", he: "מה העסק שלך עושה?", ar: "ماذا يعمل عملك؟" }, opts: [
      ["services", { en: "Services", he: "שירותים", ar: "خدمات" }], ["ecom", { en: "E-commerce / Online", he: "מסחר אונליין", ar: "تجارة إلكترونية" }],
      ["retail", { en: "Retail / Store", he: "קמעונאות / חנות", ar: "تجزئة / متجر" }], ["realestate", { en: "Real estate", he: "נדל\"ן", ar: "عقارات" }],
      ["health", { en: "Health / Clinic", he: "בריאות / מרפאה", ar: "صحّة / عيادة" }], ["saas", { en: "SaaS / Tech", he: "SaaS / טכנולוגיה", ar: "برمجيات / تقنية" }],
      ["edu", { en: "Education", he: "חינוך", ar: "تعليم" }], ["other", { en: "Other", he: "אחר", ar: "أخرى" }] ] },
    { id: "team", q: { en: "How many people work in the business?", he: "כמה אנשים עובדים בעסק?", ar: "كم عدد العاملين في العمل؟" }, opts: [
      ["1-3", { en: "1–3", he: "1–3", ar: "1–3" }], ["4-10", { en: "4–10", he: "4–10", ar: "4–10" }], ["11-30", { en: "11–30", he: "11–30", ar: "11–30" }], ["31-100", { en: "31–100", he: "31–100", ar: "31–100" }], ["100+", { en: "100+", he: "100+", ar: "100+" }] ] },
    { id: "sellers", q: { en: "How many salespeople?", he: "כמה אנשי מכירות?", ar: "كم عدد مندوبي المبيعات؟" }, opts: [
      ["0", { en: "0", he: "0", ar: "0" }], ["1-2", { en: "1–2", he: "1–2", ar: "1–2" }], ["3-5", { en: "3–5", he: "3–5", ar: "3–5" }], ["6-15", { en: "6–15", he: "6–15", ar: "6–15" }], ["16+", { en: "16+", he: "16+", ar: "16+" }] ] },
    { id: "leads", q: { en: "Monthly leads (approx.)", he: "לידים בחודש (בערך)", ar: "العملاء المحتملون شهرياً (تقريباً)" }, opts: [
      ["l50", { en: "< 50", he: "< 50", ar: "< 50" }], ["l200", { en: "50–200", he: "50–200", ar: "50–200" }], ["l500", { en: "200–500", he: "200–500", ar: "200–500" }], ["l2000", { en: "500–2000", he: "500–2000", ar: "500–2000" }], ["l2000+", { en: "2000+", he: "2000+", ar: "2000+" }] ] },
    { id: "deals", q: { en: "Monthly deals / new customers", he: "עסקאות / לקוחות חדשים בחודש", ar: "الصفقات / العملاء الجدد شهرياً" }, opts: [
      ["d10", { en: "< 10", he: "< 10", ar: "< 10" }], ["d30", { en: "10–30", he: "10–30", ar: "10–30" }], ["d80", { en: "30–80", he: "30–80", ar: "30–80" }], ["d300", { en: "80–300", he: "80–300", ar: "80–300" }], ["d300+", { en: "300+", he: "300+", ar: "300+" }] ] },
    { id: "crm", q: { en: "Do you use a CRM?", he: "האם אתם משתמשים ב-CRM?", ar: "هل تستخدمون CRM؟" }, opts: [
      ["no", { en: "No", he: "לא", ar: "لا" }], ["sheets", { en: "Spreadsheets", he: "גיליונות", ar: "جداول" }], ["yes", { en: "Yes", he: "כן", ar: "نعم" }] ] },
  ];
  const MIDLEADS = { l50: 40, l200: 125, l500: 350, l2000: 1000, "l2000+": 3000 };
  const MIDDEALS = { d10: 6, d30: 20, d80: 55, d300: 180, "d300+": 500 };

  /* ===================== State ===================== */
  const S = { level: "full", step: "intro", qi: 0, basics: {}, answers: {}, queue: [] };
  const root = $("#xrayApp");
  if (!root) return;
  const qkey = (q) => q.cat + ":" + q.q.en.slice(0, 18);

  function render() {
    if (S.step === "intro") return renderIntro();
    if (S.step === "basics") return renderBasics();
    if (S.step === "quiz") return renderQuiz();
    if (S.step === "scan") return renderScan();
    if (S.step === "result") return renderResult();
  }

  function renderIntro() {
    root.innerHTML = "";
    const lvl = (key, tier, mins, list, feat) => `
      <div class="xr-level ${feat ? "is-featured" : ""}" data-lvl="${key}">
        ${feat ? `<div class="ribbon">${P(T.recommended)}</div>` : ""}
        <div class="tier">${P(tier)}</div><h3>${mins.h}</h3><div class="time">${mins.t}</div>
        <ul>${list.map(x => `<li>${x}</li>`).join("")}</ul></div>`;
    const w = el("div", "xr-hero");
    w.innerHTML = `
      <div class="eyebrow">DriftX Business X-Ray™</div>
      <div class="xr-kicker">${P(T.kicker)}</div>
      <p class="lead muted">${P(T.intro)}</p>
      <div class="xr-levels">
        ${lvl("quick", T.lvlQuick, { h: P(T.tMinsQ), t: P(T.q15) }, P(T.quickList), false)}
        ${lvl("full", T.lvlFull, { h: P(T.tMinsF), t: P(T.adaptive) }, P(T.fullList), true)}
        ${lvl("pro", T.lvlPro, { h: P(T.tPro), t: P(T.realdata) }, P(T.proList), false)}
      </div>
      <p class="xr-note">${P(T.privacy)}</p>`;
    root.appendChild(w);
    w.querySelectorAll(".xr-level").forEach((c) => c.addEventListener("click", () => {
      if (c.dataset.lvl === "pro") { window.location.href = "../#contact"; return; }
      S.level = c.dataset.lvl; S.step = "basics"; render();
    }));
  }

  function renderBasics() {
    root.innerHTML = "";
    const w = el("div", "xr-q");
    w.innerHTML = `<div class="xr-cat">${P(T.step1)}</div><div class="xr-q__text">${P(T.basicsSub)}</div>
      <div class="xr-basics" id="xrBasics"></div>
      <div class="xr-actions"><button class="btn btn--primary" id="xrGo">${P(T.start)}</button>
      <button class="btn btn--ghost" id="xrBack2">${P(T.back)}</button></div>`;
    root.appendChild(w);
    const holder = $("#xrBasics", w);
    BASICS.forEach((f) => {
      const fld = el("div", "xr-field");
      fld.innerHTML = `<label>${P(f.q)}</label><select data-id="${f.id}"><option value="">${P(T.select)}</option>${f.opts.map(o => `<option value="${o[0]}" ${S.basics[f.id] === o[0] ? "selected" : ""}>${P(o[1])}</option>`).join("")}</select>`;
      holder.appendChild(fld);
    });
    $("#xrGo", w).addEventListener("click", () => {
      holder.querySelectorAll("select").forEach((s) => { if (s.value) S.basics[s.dataset.id] = s.value; });
      buildQueue(); S.step = "quiz"; S.qi = 0; render();
    });
    $("#xrBack2", w).addEventListener("click", () => { S.step = "intro"; render(); });
  }

  function buildQueue() {
    let qs = Q.filter((q) => !q.showIf || q.showIf(S.basics));
    if (S.level === "quick") { const seen = {}; qs = qs.filter((q) => (seen[q.cat] = (seen[q.cat] || 0) + 1) <= 2); }
    S.queue = qs;
  }

  function renderQuiz() {
    if (!S.queue.length) buildQueue();
    const q = S.queue[S.qi]; const sc = SC[q.scale];
    root.innerHTML = "";
    const top = el("div", "xr-top");
    top.innerHTML = `<button class="back" id="xrBack">${P(T.back)}</button>
      <span class="xr-cat">${P(CATS[q.cat].n)}</span>
      <span class="xr-progress"><span style="width:${(S.qi / S.queue.length) * 100}%"></span></span>
      <span class="xr-count">${S.qi + 1} / ${S.queue.length}</span>`;
    const card = el("div", "xr-q");
    card.innerHTML = `<div class="xr-q__text">${P(q.q)}</div><div class="xr-opts"></div>`;
    const opts = $(".xr-opts", card);
    sc.l[L() in sc.l ? L() : "en"].forEach((label, i) => {
      const b = el("button", "xr-opt");
      const cur = S.answers[qkey(q)];
      if (cur && cur.i === i) b.classList.add("sel");
      b.innerHTML = `<span class="dot"></span><span>${label}</span>`;
      b.addEventListener("click", () => {
        S.answers[qkey(q)] = { i, s: sc.s[i], cat: q.cat, impl: q.impl };
        if (S.qi < S.queue.length - 1) { S.qi++; render(); } else { S.step = "scan"; render(); }
      });
      opts.appendChild(b);
    });
    root.appendChild(top); root.appendChild(card);
    $("#xrBack", top).addEventListener("click", () => { if (S.qi > 0) { S.qi--; render(); } else { S.step = "basics"; render(); } });
  }

  function renderScan() {
    root.innerHTML = "";
    const w = el("div", "xr-scan");
    w.innerHTML = `<div class="xr-scan__x"><svg viewBox="0 0 100 100"><path d="M50 2C52 30 70 48 98 50 70 52 52 70 50 98 48 70 30 52 2 50 30 48 48 30 50 2Z"/></svg></div>
      <h2>${P(T.scanning)}<span class="grad-accent">…</span></h2>
      <div style="font-size:clamp(24px,4vw,40px);font-weight:900;margin-top:6px"><span class="word grad-accent" id="xrWord">${P(CATS.sales.n)}</span></div>
      <div class="xr-scan__bar"><span id="xrScanBar"></span></div>
      <div class="xr-scan__list" id="xrScanList">${CATKEYS.map(k => `<span>${P(CATS[k].n)}</span>`).join("")}</div>
      <p class="muted" style="margin-top:16px;font-size:14px">${P(T.detecting)}</p>`;
    root.appendChild(w);
    const words = CATKEYS.map(k => P(CATS[k].n));
    const listSpans = w.querySelectorAll(".xr-scan__list span");
    if (reduce) { S.step = "result"; render(); return; }
    let i = 0, p = 0;
    const wordT = setInterval(() => { $("#xrWord", w).textContent = words[i % words.length]; i++; }, 360);
    const barT = setInterval(() => {
      p += 4 + Math.random() * 5; if (p > 100) p = 100;
      $("#xrScanBar", w).style.width = p + "%";
      const active = Math.floor((p / 100) * listSpans.length);
      listSpans.forEach((s, k) => s.classList.toggle("on", k <= active));
      if (p >= 100) { clearInterval(barT); clearInterval(wordT); setTimeout(() => { S.step = "result"; render(); }, 350); }
    }, 120);
  }

  /* ---------- scoring ---------- */
  function scores() {
    const by = {}, cnt = {}; CATKEYS.forEach((k) => { by[k] = 0; cnt[k] = 0; });
    Object.values(S.answers).forEach((a) => { by[a.cat] += a.s; cnt[a.cat]++; });
    const cat = {}; CATKEYS.forEach((k) => { cat[k] = cnt[k] ? Math.round(by[k] / cnt[k]) : 60; });
    let num = 0, den = 0; CATKEYS.forEach((k) => { num += cat[k] * CATS[k].w; den += CATS[k].w; });
    return { cat, overall: Math.round(num / den) };
  }
  const band = (s) => s >= 80 ? "high" : s >= 65 ? "ok" : s >= 50 ? "mid" : "low";
  const bandTag = (s) => s >= 65 ? { c: "ok", t: P(T.bStrong) } : s >= 50 ? { c: "warn", t: P(T.bNeeds) } : { c: "crit", t: P(T.bCrit) };
  function implementation() {
    const items = ["crm", "targets", "callmon", "leadtrack", "perfscore", "onboarding", "process", "kpi"];
    let done = 0; items.forEach((k) => { const a = Object.values(S.answers).find((x) => x.impl === k); if (a && a.s >= 65) done++; });
    return Math.round((done / items.length) * 100);
  }

  function renderResult() {
    root.innerHTML = "";
    const sc = scores(), impl = implementation();
    const ranked = CATKEYS.map((k) => ({ k, name: P(CATS[k].n), s: sc.cat[k] })).sort((a, b) => a.s - b.s);
    const weakest = ranked[0], strong = ranked[ranked.length - 1];
    const growth = clamp(Math.round(0.5 * sc.overall + 0.3 * impl + 0.2 * ((sc.cat.sales + sc.cat.leadmgmt) / 2)), 0, 100);
    const ob = sc.overall >= 70 ? { cls: "good", t: P(T.readyHigh) } : sc.overall >= 55 ? { cls: "mid", t: P(T.readyMid) } : { cls: "low", t: P(T.readyLow) };
    const w = el("div", "xr-result");

    const head = el("div", "xr-scorehead");
    head.innerHTML = `<div class="xr-bigscore" id="xrBig"><span class="n" id="xrN">0</span><span class="of">/ 100</span></div>
      <div><div class="label">${P(T.yourScore)}</div><h2>${sc.overall >= 70 ? P(T.hl70) : sc.overall >= 55 ? P(T.hl55) : P(T.hl0)}</h2>
      <span class="xr-band ${ob.cls}">${ob.t}</span></div>`;
    w.appendChild(head);

    w.appendChild(block(P(T.dims), radarHTML(sc.cat, ranked)));

    const diag = el("div", "xr-diag");
    [ranked[0], ranked[1], ranked[2], strong].forEach((r) => {
      const bt = bandTag(r.s), bnd = band(r.s), info = CATINFO[r.k];
      diag.appendChild(el("div", "item " + bt.c, `<div class="head"><span class="name">${r.name}</span><span><span class="tag">${bt.t}</span> · <span class="pct">${r.s}%</span></span></div>
        <p>${bnd === "low" ? P(info.low) : bnd === "mid" ? P(info.mid) : P(info.high)}</p>`));
    });
    const db = block(P(T.diagTitle), ""); db.appendChild(diag); w.appendChild(db);

    const contrib = ranked.slice(0, 5).map((r) => ({ name: r.name, deficit: (100 - r.s) * CATS[r.k].w }));
    const tot = contrib.reduce((a, c) => a + c.deficit, 0) || 1;
    const rows = contrib.map((c) => `<div class="r"><span>${c.name}</span><span class="track"><i style="width:${Math.round(c.deficit / tot * 100)}%"></i></span><span class="p">${Math.round(c.deficit / tot * 100)}%</span></div>`).join("");
    w.appendChild(block(P(T.rootTitle).replace("{x}", weakest.name), `<div class="xr-root">${rows}</div><p class="muted" style="margin-top:14px;font-size:13.5px">${P(T.rootNote)}</p>`));

    const prio = ranked.slice(0, 4).map((r, i) => `<div class="p"><span class="num">#${i + 1}</span><div><h4>${P(PRIO[r.k])}</h4><p>${P(CATS[r.k].n)} · ${P(T.currently)} ${r.s}%</p></div></div>`).join("");
    w.appendChild(block(P(T.fixFirst), `<div class="xr-prio">${prio}</div>`));

    w.appendChild(block(P(T.planTitle), planHTML(ranked)));

    const tiles = `<div class="xr-tiles">
      <div class="xr-tile"><div class="k">${P(T.implScore)}</div><div class="big" id="xrImpl">0%</div><div class="meter"><i style="width:${impl}%"></i></div><p>${P(T.implDesc).replace("{p}", impl)}</p></div>
      <div class="xr-tile"><div class="k">${P(T.growth)}</div><div class="big" id="xrGrow">0</div><div class="meter"><i style="width:${growth}%"></i></div><p>${P(T.growthDesc)}</p></div></div>`;
    w.appendChild(block(P(T.implReady), tiles));

    w.appendChild(block(P(T.simTitle), simHTML()));

    const risks = buildRisks(sc);
    if (risks.length) w.appendChild(block(P(T.risksTitle), `<div class="xr-risks">${risks.map(r => `<div class="r">${r}</div>`).join("")}</div>`));

    const info = CATINFO[weakest.k];
    const help = `<div class="xr-help"><div class="prob">${P(T.biggestOpp)}</div><h3>${P(PRIO[weakest.k])}</h3>
      <ul>${info.services.map(s => `<li>${P(SV[s])}</li>`).join("")}</ul>
      <div class="xr-actions" style="margin-top:0"><a class="btn btn--primary" href="../#contact" data-cursor="Let's Talk">${P(T.buildPlan)}</a>
      <button class="btn btn--ghost" id="xrRestart">${P(T.restart)}</button></div></div>`;
    w.appendChild(block(P(T.helpTitle), help));

    w.appendChild(el("p", "xr-note", P(T.privacy)));
    root.appendChild(w);

    animateNumber($("#xrN"), sc.overall);
    $("#xrBig").style.setProperty("--p", reduce ? sc.overall : 0);
    if (!reduce) setTimeout(() => { let p = 0; const t = setInterval(() => { p += 3; if (p >= sc.overall) { p = sc.overall; clearInterval(t); } $("#xrBig").style.setProperty("--p", p); }, 16); }, 120);
    animateNumber($("#xrImpl"), impl, "%"); animateNumber($("#xrGrow"), growth);
    const rst = $("#xrRestart"); if (rst) rst.addEventListener("click", () => { S.step = "intro"; S.answers = {}; S.basics = {}; render(); window.scrollTo(0, 0); });
    setupSim();
  }

  function block(title, html) { const b = el("div", "xr-block"); b.innerHTML = `<h3>${title}</h3>${html}`; return b; }
  function radarHTML(cat, ranked) {
    const R = 120, cx = 150, cy = 150, n = CATKEYS.length;
    const pt = (i, r) => [cx + r * Math.cos(-Math.PI / 2 + i * 2 * Math.PI / n), cy + r * Math.sin(-Math.PI / 2 + i * 2 * Math.PI / n)];
    let grid = "", axes = "", labels = "";
    [0.25, 0.5, 0.75, 1].forEach((f) => grid += `<polygon points="${CATKEYS.map((k, i) => pt(i, R * f).join(",")).join(" ")}" fill="none" stroke="rgba(255,255,255,0.08)"/>`);
    CATKEYS.forEach((k, i) => { const [x, y] = pt(i, R); axes += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="rgba(255,255,255,0.06)"/>`;
      const [lx, ly] = pt(i, R + 20); labels += `<text x="${lx}" y="${ly}" font-size="8.5" fill="#8B95AC" text-anchor="middle" dominant-baseline="middle">${P(CATS[k].s)}</text>`; });
    const poly = CATKEYS.map((k, i) => pt(i, R * cat[k] / 100).join(",")).join(" ");
    const dots = CATKEYS.map((k, i) => { const [x, y] = pt(i, R * cat[k] / 100); return `<circle cx="${x}" cy="${y}" r="3" fill="#F7A200"/>`; }).join("");
    const legend = ranked.slice().sort((a, b) => b.s - a.s).map((r) => {
      const col = r.s >= 65 ? "var(--lime)" : r.s >= 50 ? "var(--yellow)" : "var(--coral)";
      return `<div class="row"><span>${r.name}</span><span class="bar"><i style="width:${r.s}%;background:${col}"></i></span><span class="v">${r.s}</span></div>`;
    }).join("");
    return `<div class="xr-radar"><svg viewBox="0 0 300 300" dir="ltr">${grid}${axes}<polygon points="${poly}" fill="rgba(247,162,0,0.18)" stroke="#F7A200" stroke-width="2"/>${dots}${labels}</svg><div class="legend">${legend}</div></div>`;
  }
  function planHTML(ranked) {
    const top = ranked.slice(0, 3).map(r => r.name);
    const weeks = P(T.weeks), items = P(T.weekItems);
    return `<div class="xr-plan">${weeks.map((wk, i) => `<div class="xr-week"><div class="w">${wk}</div><ul>${items[i].map(x => `<li>${x}</li>`).join("")}</ul></div>`).join("")}</div>
      <p class="muted" style="margin-top:14px;font-size:13.5px">${P(T.planFocus)} ${top.join(", ")}.</p>`;
  }
  function simHTML() {
    const leads = MIDLEADS[S.basics.leads] || 500, deals = MIDDEALS[S.basics.deals] || Math.round(leads * 0.1);
    const conv = clamp(Math.round(deals / leads * 100), 1, 60);
    return `<div class="xr-sim" data-leads="${leads}" data-conv="${conv}">
      <div class="row"><div class="stat"><div class="n">${leads.toLocaleString()}</div><div class="l">${P(T.simLeads)}</div></div><div class="arrow">→</div>
      <div class="stat"><div class="n" id="simConv">${conv}%</div><div class="l">${P(T.simConv)}</div></div><div class="arrow">→</div>
      <div class="stat"><div class="n up" id="simCust">${Math.round(leads * conv / 100)}</div><div class="l">${P(T.simCust)}</div></div></div>
      <input type="range" id="simRange" min="0" max="15" value="0">
      <p class="cap">${P(T.simCap).replace("{d}", '<span class="delta" id="simDelta">+0</span>').replace("{g}", '<span class="delta" id="simGain">+0</span>')}</p></div>`;
  }
  function setupSim() {
    const sim = $(".xr-sim", root); if (!sim) return;
    const leads = +sim.dataset.leads, base = +sim.dataset.conv, range = $("#simRange", sim);
    range.addEventListener("input", () => {
      const d = +range.value, nc = base + d;
      $("#simConv", sim).textContent = nc + "%"; $("#simCust", sim).textContent = Math.round(leads * nc / 100);
      $("#simDelta", sim).textContent = "+" + d; $("#simGain", sim).textContent = "+" + (Math.round(leads * nc / 100) - Math.round(leads * base / 100));
    });
  }
  function buildRisks(sc) {
    const RK = {
      solo: { en: "Over-dependence on one or two salespeople.", he: "תלות יתר באיש מכירות אחד או שניים.", ar: "اعتماد مفرط على مندوب أو اثنين." },
      train: { en: "No structured employee training or onboarding.", he: "אין הדרכה או קליטה מובנית לעובדים.", ar: "لا يوجد تدريب أو تأهيل منظّم للموظفين." },
      lead: { en: "Leads aren't followed up consistently — opportunities leak.", he: "הלידים לא מקבלים Follow-up עקבי — הזדמנויות נוזלות.", ar: "لا تُتابَع العملاء بانتظام — تتسرّب الفرص." },
      call: { en: "No structured call monitoring or QA.", he: "אין ניטור שיחות או QA מובנה.", ar: "لا توجد مراقبة أو جودة منظّمة للمكالمات." },
      mkt: { en: "Marketing decisions are based on lead volume rather than revenue.", he: "החלטות שיווק מבוססות על כמות לידים ולא על הכנסה.", ar: "قرارات التسويق مبنية على كمّية العملاء لا الإيراد." },
      data: { en: "Decisions rely on gut feeling — no single source of truth.", he: "ההחלטות מבוססות תחושת בטן — אין מקור אמת יחיד.", ar: "القرارات تعتمد على الحدس — لا مصدر حقيقة واحد." },
      perf: { en: "No measurable employee / manager KPIs.", he: "אין KPI מדידים לעובדים / מנהלים.", ar: "لا مؤشرات أداء قابلة للقياس للموظفين / المدراء." },
    };
    const r = [], get = (impl) => Object.values(S.answers).find(x => x.impl === impl);
    if (S.basics.sellers === "1-2") r.push(P(RK.solo));
    if (sc.cat.training < 55) r.push(P(RK.train));
    if (sc.cat.leadmgmt < 55) r.push(P(RK.lead));
    if (get("callmon") && get("callmon").s < 55 && S.basics.sellers !== "0") r.push(P(RK.call));
    if (sc.cat.marketing < 60) r.push(P(RK.mkt));
    if (sc.cat.control < 55) r.push(P(RK.data));
    if (get("perfscore") && get("perfscore").s < 55) r.push(P(RK.perf));
    return r.slice(0, 6);
  }
  function animateNumber(node, target, suffix) {
    if (!node) return; suffix = suffix || "";
    if (reduce) { node.textContent = target + suffix; return; }
    let cur = 0; const t = setInterval(() => { cur += Math.max(1, Math.ceil((target - cur) * 0.12)); if (cur >= target) { cur = target; clearInterval(t); } node.textContent = cur + suffix; }, 24);
  }

  /* ---------- language: persist, URL, live switch ---------- */
  const langBtn = (l) => document.querySelector('.lang button[data-lang="' + l + '"]');
  new MutationObserver(() => render()).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  const ql = new URLSearchParams(location.search).get("lang");
  if (ql && LANGS.includes(ql) && langBtn(ql) && document.documentElement.lang !== ql) {
    langBtn(ql).click();  // app.js applyLang sets lang/dir/localStorage → observer re-renders
  } else {
    render();
  }
})();
