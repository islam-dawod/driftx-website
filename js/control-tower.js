/* DRIFTX Marketing Control Tower — /ai-marketing/
   Trilingual (EN / HE / AR) product page + interactive cockpit demo.
   All copy lives here as {en,he,ar} triples so each language is a native
   experience, not a translation. No backend, no dependencies. */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const LANGS = ["en", "he", "ar"];
  const L = () => { const l = document.documentElement.lang; return LANGS.includes(l) ? l : "en"; };
  const P = (o) => (o == null ? "" : (typeof o === "string" ? o : (o[L()] != null ? o[L()] : o.en)));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ===================== UI labels ===================== */
  const T = {
    secPrinciple: { en: "The principle", he: "עיקרון היסוד", ar: "المبدأ الأساسي" },
    secJourney: { en: "Journey & ownership", he: "המסע והאחריות", ar: "المسار والمسؤولية" },
    secCockpit: { en: "Live cockpit", he: "חדר הבקרה", ar: "غرفة القيادة" },
    secModules: { en: "System modules", he: "מודולי המערכת", ar: "وحدات النظام" },
    secDomains: { en: "Diagnostic catalog", he: "קטלוג האבחון", ar: "فهرس التشخيص" },
    secScores: { en: "Scoring engine", he: "מנוע הציונים", ar: "محرك التقييم" },
    secAI: { en: "AI engine", he: "מנוע ה-AI", ar: "محرك الذكاء الاصطناعي" },
    secRules: { en: "Rules & alerts", he: "כללים והתראות", ar: "القواعد والتنبيهات" },
    secIncident: { en: "Incident management", he: "ניהול אירועים", ar: "إدارة الحوادث" },
    secIntegrations: { en: "Integrations", he: "אינטגרציות", ar: "التكاملات" },
    secKPIs: { en: "KPI dictionary", he: "מילון KPI", ar: "قاموس المؤشرات" },
    secAssessment: { en: "Business assessment", he: "שאלון האבחון", ar: "استبيان التشخيص" },
    secRoadmap: { en: "Delivery plan", he: "תוכנית היישום", ar: "خطة التنفيذ" },
    secNFR: { en: "Engineering standards", he: "דרישות הנדסיות", ar: "المعايير الهندسية" },
    secAC: { en: "Acceptance criteria", he: "קריטריוני קבלה", ar: "معايير القبول" },
    secDecisions: { en: "Before we build", he: "לפני שמפתחים", ar: "قبل التطوير" },

    cockTitle: { en: "Executive Cockpit — demo data", he: "חדר בקרה ניהולי — נתוני דמו", ar: "غرفة القيادة التنفيذية — بيانات تجريبية" },
    cockLive: { en: "Live", he: "חי", ar: "مباشر" },
    overall: { en: "Overall success", he: "אחוז הצלחה עסקי", ar: "نسبة النجاح التجاري" },
    trustGate: {
      en: "Data Trust is below the 60 threshold, so the system will not present a final score as fact. Everything below is a low-confidence estimate until the data gap is closed.",
      he: "Data Trust נמוך מסף 60, ולכן המערכת לא מציגה ציון סופי כעובדה. כל מה שמתחת הוא אומדן באמינות נמוכה עד לסגירת פער הנתונים.",
      ar: "مؤشر الثقة بالبيانات أدنى من حدّ 60، لذلك لا يعرض النظام نتيجة نهائية كحقيقة. كل ما يلي تقدير منخفض الثقة حتى إغلاق فجوة البيانات."
    },
    funnelTitle: { en: "Funnel — platform to paid", he: "המשפך — מפלטפורמה לתשלום", ar: "المسار — من المنصّة إلى الدفع" },
    incTitle: { en: "Open incidents", he: "אירועים פתוחים", ar: "الحوادث المفتوحة" },
    incHint: { en: "Select an incident to see the AI analysis", he: "בחר אירוע כדי לראות את ניתוח ה-AI", ar: "اختر حادثاً لعرض تحليل الذكاء الاصطناعي" },
    domain: { en: "Domain", he: "תחום", ar: "المجال" },
    owner: { en: "Owner", he: "אחראי", ar: "المسؤول" },
    approver: { en: "Approver", he: "מאשר", ar: "المعتمد" },
    stage: { en: "Stage", he: "שלב", ar: "المرحلة" },
    advisor: { en: "DriftX AI Advisor", he: "יועץ ה-AI של DriftX", ar: "مستشار DriftX الذكي" },
    conf: { en: "Confidence", he: "רמת ביטחון", ar: "مستوى الثقة" },
    tFact: { en: "Fact", he: "עובדה", ar: "حقيقة" },
    tEst: { en: "Estimate", he: "אומדן", ar: "تقدير" },
    tReco: { en: "Recommendation", he: "המלצה", ar: "توصية" },
    tAppr: { en: "Needs human approval", he: "מחייב אישור אנושי", ar: "يتطلب موافقة بشرية" },
    whatHappened: { en: "What happened", he: "מה קרה", ar: "ما الذي حدث" },
    whyMatters: { en: "Why it matters", he: "למה זה חשוב", ar: "لماذا هذا مهم" },
    evidence: { en: "Evidence", he: "ראיות", ar: "الأدلة" },
    rootCause: { en: "Root cause — ranked alternatives", he: "שורש הבעיה — חלופות מדורגות", ar: "السبب الجذري — بدائل مرتّبة" },
    corrective: { en: "Corrective action", he: "פעולה מתקנת", ar: "إجراء تصحيحي" },
    preventive: { en: "Preventive action", he: "פעולה מונעת", ar: "إجراء وقائي" },
    verify: { en: "Closure verification", he: "אימות סגירה", ar: "التحقق من الإغلاق" },
    sevMath: { en: "Severity = Impact × Urgency × Scope × Confidence", he: "חומרה = השפעה × דחיפות × היקף × ביטחון", ar: "الخطورة = الأثر × الإلحاح × النطاق × الثقة" },
    demoNote: {
      en: "Demo data. In the live system every number is a drill-down into the source record, with its sync time and confidence level.",
      he: "נתוני דמו. במערכת החיה כל מספר הוא Drill-down לרשומת המקור, עם זמן הסנכרון ורמת הביטחון.",
      ar: "بيانات تجريبية. في النظام الحقيقي كل رقم هو تنقّل إلى سجل المصدر، مع وقت المزامنة ومستوى الثقة."
    },
    allOwners: { en: "All", he: "הכול", ar: "الكل" },
    critical: { en: "Critical", he: "קריטי", ar: "حرج" },
    high: { en: "High", he: "גבוה", ar: "مرتفع" },
    medium: { en: "Medium", he: "בינוני", ar: "متوسط" },
    low: { en: "Low", he: "נמוך", ar: "منخفض" }
  };

  /* ===================== 4. Journey & ownership ===================== */
  const JOURNEY = [
    { st: "01", n: { en: "Advertising", he: "פרסום", ar: "الإعلان" }, e: "Impression → Click",
      o: { en: "Marketing", he: "שיווק", ar: "التسويق" }, m: "CPM · CTR · CPC · Spend" },
    { st: "02", n: { en: "Landing page", he: "דף נחיתה", ar: "صفحة الهبوط" }, e: "Visit → Form / Call",
      o: { en: "Marketing + IT", he: "שיווק + IT", ar: "التسويق + IT" },
      m: { en: "CVR · speed · errors", he: "CVR · מהירות · שגיאות", ar: "CVR · السرعة · الأخطاء" } },
    { st: "03", n: { en: "Lead capture", he: "קליטת ליד", ar: "استقبال العميل" }, e: "Submit → CRM",
      o: "CRM / IT", m: { en: "Capture gap · sync time", he: "פער קליטה · זמן סנכרון", ar: "فجوة الاستقبال · زمن المزامنة" } },
    { st: "04", n: { en: "Assignment & handling", he: "שיוך וטיפול", ar: "الإسناد والمعالجة" }, e: "Assignment → First Contact",
      o: { en: "Sales", he: "מכירות", ar: "المبيعات" }, m: "Response Time · Contact Rate" },
    { st: "05", n: { en: "Qualification", he: "הכשרה", ar: "التأهيل" }, e: "Contact → Qualified",
      o: { en: "Sales + Marketing", he: "מכירות + שיווק", ar: "المبيعات + التسويق" }, m: "Qualified Rate · CPQL" },
    { st: "06", n: { en: "Follow-up & sale", he: "מעקב ומכירה", ar: "المتابعة والبيع" }, e: "Follow-up → Payment",
      o: { en: "Sales", he: "מכירות", ar: "المبيعات" }, m: "Sale CVR · CAC · Revenue" },
    { st: "07", n: { en: "Service delivery", he: "אספקת שירות", ar: "تقديم الخدمة" }, e: "Payment → Completion",
      o: { en: "Operations / Service", he: "תפעול / שירות", ar: "التشغيل / الخدمة" }, m: "SLA · Refund · Complaints" },
    { st: "08", n: { en: "Loyalty", he: "נאמנות", ar: "الولاء" }, e: "Experience → Review / Referral",
      o: { en: "Service + Marketing", he: "שירות + שיווק", ar: "الخدمة + التسويق" }, m: "Rating · NPS · Referral" }
  ];
  /* ===================== Cockpit: funnel labels ===================== */
  const FSTEPS = [
    { en: "Clicks", he: "קליקים", ar: "النقرات" },
    { en: "Landing visits", he: "כניסות לדף", ar: "زيارات الصفحة" },
    { en: "Leads at source", he: "לידים במקור", ar: "عملاء في المصدر" },
    { en: "Leads in CRM", he: "לידים ב-CRM", ar: "عملاء في CRM" },
    { en: "Contacted", he: "נוצר קשר", ar: "تم التواصل" },
    { en: "Qualified", he: "מוכשרים", ar: "مؤهّلون" },
    { en: "Sold", he: "נמכרו", ar: "مبيعات" },
    { en: "Paid", he: "שולמו", ar: "مدفوعة" }
  ];

  /* ===================== Cockpit: scenarios ===================== */
  const SCEN = [
    {
      tab: { en: "Leads +34%, sales flat", he: "לידים +34%, מכירות בקיפאון", ar: "عملاء +34%، مبيعات ثابتة" },
      overall: 71, trust: 88,
      funnel: [12400, 11180, 486, 481, 442, 121, 27, 26],
      leaks: { 5: { en: "Qualified rate 27% — was 41%", he: "Qualified Rate 27% — היה 41%", ar: "نسبة التأهيل 27% — كانت 41%" },
               6: { en: "Sale CVR 22% of qualified", he: "Sale CVR 22% מהמוכשרים", ar: "تحويل البيع 22% من المؤهّلين" } },
      kpis: [
        { k: "Data Trust", v: "88", d: { en: "+3 vs last week", he: "+3 מול שבוע קודם", ar: "+3 مقابل الأسبوع الماضي" }, dir: "up", m: 88 },
        { k: "Funnel Health", v: "64", d: { en: "−9 vs last week", he: "−9 מול שבוע קודם", ar: "−9 مقابل الأسبوع الماضي" }, dir: "down", m: 64 },
        { k: "CPL", v: "₪38", d: "−21%", dir: "up", m: 78 },
        { k: "CPQL", v: "₪152", d: "+44%", dir: "down", m: 41 },
        { k: "Revenue", v: "₪418K", d: { en: "flat", he: "בקיפאון", ar: "ثابت" }, dir: "flat", m: 55 },
        { k: { en: "Median response", he: "חציון תגובה", ar: "وسيط الاستجابة" }, v: "1:52", d: { en: "SLA 15 min", he: "SLA 15 דק'", ar: "SLA 15 د" }, dir: "down", m: 22 }
      ],
      inc: [
        {
          I: 4, U: 4, S: 2, C: 0.9,
          dom: { en: "Lead quality", he: "איכות לידים", ar: "جودة العملاء" },
          stage: { en: "Qualification", he: "הכשרה", ar: "التأهيل" },
          own: { en: "Marketing + Sales", he: "שיווק + מכירות", ar: "التسويق + المبيعات" },
          title: { en: "Lead volume rose 34% while qualified rate fell from 41% to 27%",
            he: "כמות הלידים עלתה ב-34% בעוד ש-Qualified Rate צנח מ-41% ל-27%",
            ar: "ارتفع حجم العملاء 34% بينما هبطت نسبة التأهيل من 41% إلى 27%" },
          what: { en: "Since the budget increase on the 4th, the account is delivering more leads at a lower CPL — but the share that passes qualification dropped by 14 points. CPL is down 21%; CPQL is up 44%.",
            he: "מאז הגדלת התקציב ב-4 בחודש החשבון מייצר יותר לידים ב-CPL נמוך יותר — אך שיעור הלידים שעוברים הכשרה ירד ב-14 נקודות. ה-CPL ירד ב-21%, ה-CPQL עלה ב-44%.",
            ar: "منذ زيادة الميزانية في الرابع من الشهر يولّد الحساب عملاء أكثر بتكلفة أقل — لكن نسبة من يجتازون التأهيل انخفضت 14 نقطة. تكلفة العميل انخفضت 21%، وتكلفة العميل المؤهّل ارتفعت 44%." },
          why: { en: "This is the classic case where marketing looks like it is winning and sales looks like it is failing, and neither is true. The business is paying more for every real opportunity, and reps are burning capacity on leads that cannot buy.",
            he: "זה המקרה הקלאסי שבו נראה שהשיווק מצליח והמכירות נכשלות — ושתי המסקנות שגויות. העסק משלם יותר על כל הזדמנות אמיתית, והנציגים שורפים זמן על לידים שלא יכולים לקנות.",
            ar: "هذه هي الحالة الكلاسيكية التي يبدو فيها أن التسويق ناجح والمبيعات فاشلة، وكلا الاستنتاجين خطأ. الشركة تدفع أكثر مقابل كل فرصة حقيقية، والمندوبون يستهلكون وقتهم على عملاء غير قادرين على الشراء." },
          ev: [
            { en: "Audience expanded from 3 to 9 interest groups on the 4th (Meta change log)", he: "הקהל הורחב מ-3 ל-9 קבוצות עניין ב-4 בחודש (Meta change log)", ar: "توسّع الجمهور من 3 إلى 9 مجموعات اهتمام في الرابع (سجل تغييرات Meta)" },
            { en: "Qualified rate by campaign: brand 39%, generic 18% (CRM, 486 records)", he: "Qualified Rate לפי קמפיין: מותג 39%, גנרי 18% (CRM, 486 רשומות)", ar: "نسبة التأهيل حسب الحملة: العلامة 39%، العام 18% (CRM، 486 سجلاً)" },
            { en: "63% of unqualified leads marked \"budget below range\"", he: "63% מהלידים שנפסלו סומנו \"תקציב מתחת לטווח\"", ar: "63% من العملاء غير المؤهّلين وُسموا \"ميزانية أدنى من النطاق\"" }
          ],
          rc: [
            { t: { en: "Audience expansion pulled in low-intent traffic", he: "הרחבת הקהל הכניסה תנועה בכוונה נמוכה", ar: "توسيع الجمهور جذب زيارات منخفضة النيّة" }, p: 46 },
            { t: { en: "Offer and price mismatch for the new segment", he: "אי-התאמה בין ההצעה והמחיר לסגמנט החדש", ar: "عدم تطابق العرض والسعر مع الشريحة الجديدة" }, p: 27 },
            { t: { en: "Qualification definition drifting between reps", he: "הגדרת Qualified נסחפת בין נציגים", ar: "تباين تعريف \"المؤهّل\" بين المندوبين" }, p: 18 },
            { t: { en: "Form change removed a qualifying field", he: "שינוי בטופס הסיר שדה מסנן", ar: "تغيير في النموذج أزال حقلاً مؤهِّلاً" }, p: 9 }
          ],
          corr: { en: "Split the generic campaign from brand, return the audience to the 3 proven groups for 7 days, and re-add the budget-range field to the form.",
            he: "להפריד את הקמפיין הגנרי מהמותגי, להחזיר את הקהל ל-3 הקבוצות המוכחות ל-7 ימים, ולהחזיר לטופס את שדה טווח התקציב.",
            ar: "فصل الحملة العامة عن حملة العلامة، وإرجاع الجمهور إلى المجموعات الثلاث المُثبتة لسبعة أيام، وإعادة حقل نطاق الميزانية إلى النموذج." },
          prev: { en: "Add CPQL — not CPL — as the optimisation KPI, and alert whenever qualified rate drops more than 8 points against the 30-day baseline.",
            he: "להגדיר CPQL — ולא CPL — כ-KPI לאופטימיזציה, ולהתריע בכל ירידה של יותר מ-8 נקודות ב-Qualified Rate מול Baseline של 30 יום.",
            ar: "اعتماد تكلفة العميل المؤهّل — لا تكلفة العميل — كمؤشر التحسين، والتنبيه عند أي هبوط يتجاوز 8 نقاط في نسبة التأهيل مقابل خط أساس 30 يوماً." },
          ver: { en: "Qualified rate back above 36% over 200 leads, with CPQL below ₪120.",
            he: "Qualified Rate חוזר מעל 36% על 200 לידים, עם CPQL מתחת ל-₪120.",
            ar: "عودة نسبة التأهيل إلى ما فوق 36% على 200 عميل، مع تكلفة عميل مؤهّل أقل من ₪120." }
        },
        {
          I: 4, U: 5, S: 2, C: 1,
          dom: { en: "Sales execution", he: "ביצועי מכירות", ar: "أداء المبيعات" },
          stage: { en: "Assignment & handling", he: "שיוך וטיפול", ar: "الإسناد والمعالجة" },
          own: { en: "Sales manager", he: "מנהל מכירות", ar: "مدير المبيعات" },
          title: { en: "Median first response is 1h 52m against a 15-minute SLA",
            he: "חציון תגובה ראשונה 1:52 מול SLA של 15 דקות",
            ar: "وسيط أول استجابة 1:52 مقابل SLA من 15 دقيقة" },
          what: { en: "44 of 481 leads received no first contact inside the SLA window; 12 of them have had no contact at all for over 24 hours. All 12 belong to two reps who were assigned 3.4× the team average.",
            he: "44 מתוך 481 לידים לא קיבלו מגע ראשון בתוך חלון ה-SLA; ל-12 מהם אין כל מגע מעל 24 שעות. כל 12 שייכים לשני נציגים שקיבלו פי 3.4 מהממוצע בצוות.",
            ar: "44 من 481 عميلاً لم يتلقّوا تواصلاً أولاً داخل نافذة SLA؛ و12 منهم بلا أي تواصل لأكثر من 24 ساعة. الاثنا عشر جميعهم لمندوبين اثنين أُسند إليهما 3.4 ضعف متوسط الفريق." },
          why: { en: "Response speed is the single strongest predictor of contact rate in this account. At the current contact rate, those 44 leads represent roughly ₪31K of pipeline that the business already paid to generate.",
            he: "מהירות התגובה היא החזאי החזק ביותר ל-Contact Rate בחשבון הזה. לפי ה-Contact Rate הנוכחי, 44 הלידים האלה שווים כ-₪31K פייפליין שהעסק כבר שילם עליו.",
            ar: "سرعة الاستجابة هي أقوى مؤشر على معدّل التواصل في هذا الحساب. وفق المعدّل الحالي، يمثّل هؤلاء الـ44 عميلاً نحو ₪31 ألفاً من خطّ الفرص دفعت الشركة ثمنه بالفعل." },
          ev: [
            { en: "Response distribution: 68% under 15 min, 22% over 2 h, 10% never", he: "פיזור תגובה: 68% מתחת ל-15 דק', 22% מעל 2 שעות, 10% ללא מגע", ar: "توزّع الاستجابة: 68% أقل من 15 د، 22% أكثر من ساعتين، 10% بلا تواصل" },
            { en: "Assignment load: rep A 118 leads, rep B 104, team median 31", he: "עומס שיוך: נציג A 118 לידים, נציג B 104, חציון צוות 31", ar: "حمل الإسناد: المندوب A 118 عميلاً، B 104، وسيط الفريق 31" },
            { en: "Round-robin rule last edited 11 days ago (audit log)", he: "כלל ה-Round-robin נערך לאחרונה לפני 11 יום (Audit Log)", ar: "قاعدة التوزيع الدوري عُدّلت آخر مرة قبل 11 يوماً (سجل التدقيق)" }
          ],
          rc: [
            { t: { en: "Round-robin rule not updated after the shift change", he: "כלל השיוך לא עודכן לאחר שינוי המשמרות", ar: "قاعدة التوزيع لم تُحدَّث بعد تغيير الورديات" }, p: 58 },
            { t: { en: "No escalation when SLA is breached", he: "אין הסלמה בעת חריגת SLA", ar: "لا تصعيد عند تجاوز SLA" }, p: 24 },
            { t: { en: "Volume spike beyond team capacity", he: "זינוק בכמות מעל קיבולת הצוות", ar: "ارتفاع الحجم فوق قدرة الفريق" }, p: 18 }
          ],
          corr: { en: "Reassign the 12 untouched leads now, cap per-rep daily assignment at 45, and call the SLA-breached list today.",
            he: "לשייך מחדש מיד את 12 הלידים ללא מגע, להגביל שיוך יומי ל-45 לנציג, ולחייג היום לרשימת חריגות ה-SLA.",
            ar: "إعادة إسناد الـ12 عميلاً بلا تواصل الآن، وتحديد سقف إسناد يومي بـ45 لكل مندوب، والاتصال بقائمة تجاوزات SLA اليوم." },
          prev: { en: "Auto-reassign any lead with no first contact after 20 minutes, escalate to the manager at 40, and tie the round-robin rule to the live shift roster.",
            he: "שיוך אוטומטי מחדש לכל ליד ללא מגע לאחר 20 דקות, הסלמה למנהל ב-40, וקישור כלל השיוך ללוח המשמרות החי.",
            ar: "إعادة إسناد تلقائية لأي عميل بلا تواصل بعد 20 دقيقة، وتصعيد للمدير عند 40، وربط قاعدة التوزيع بجدول الورديات الفعلي." },
          ver: { en: "Median response under 15 minutes for 7 consecutive days and zero leads untouched over 4 hours.",
            he: "חציון תגובה מתחת ל-15 דקות במשך 7 ימים רצופים, ואפס לידים ללא מגע מעל 4 שעות.",
            ar: "وسيط استجابة أقل من 15 دقيقة سبعة أيام متتالية، وصفر عملاء بلا تواصل لأكثر من 4 ساعات." }
        }
      ]
    },
    {
      tab: { en: "Platform 220 leads, CRM 176", he: "בפלטפורמה 220 לידים, ב-CRM 176", ar: "المنصّة 220 عميلاً، CRM 176" },
      overall: 58, trust: 54, gated: true,
      funnel: [6900, 6120, 220, 176, 168, 71, 19, 18],
      leaks: { 3: { en: "44 leads never reached the CRM (20%)", he: "44 לידים לא הגיעו ל-CRM (20%)", ar: "44 عميلاً لم يصلوا إلى CRM (20%)" } },
      kpis: [
        { k: "Data Trust", v: "54", d: { en: "below threshold", he: "מתחת לסף", ar: "أدنى من الحد" }, dir: "down", m: 54 },
        { k: "Funnel Health", v: "61", d: { en: "estimate", he: "אומדן", ar: "تقدير" }, dir: "flat", m: 61 },
        { k: "Data Match Rate", v: "80%", d: { en: "target 99%", he: "יעד 99%", ar: "الهدف 99%" }, dir: "down", m: 80 },
        { k: { en: "Missing UTM", he: "UTM חסר", ar: "UTM مفقود" }, v: "31%", d: { en: "of leads", he: "מהלידים", ar: "من العملاء" }, dir: "down", m: 31 },
        { k: "Revenue", v: "₪186K", d: { en: "partially attributed", he: "מיוחס חלקית", ar: "منسوب جزئياً" }, dir: "flat", m: 48 },
        { k: { en: "Last sync", he: "סנכרון אחרון", ar: "آخر مزامنة" }, v: "03:12", d: { en: "CRM webhook failing", he: "Webhook של CRM נכשל", ar: "فشل webhook الـCRM" }, dir: "down", m: 12 }
      ],
      inc: [
        {
          I: 5, U: 5, S: 2, C: 1,
          dom: "CRM", stage: { en: "Lead capture", he: "קליטת ליד", ar: "استقبال العميل" },
          own: "CRM / IT",
          title: { en: "44 leads (20%) never reached the CRM — webhook failing since 03:12",
            he: "44 לידים (20%) לא הגיעו ל-CRM — ה-Webhook נכשל מאז 03:12",
            ar: "44 عميلاً (20%) لم يصلوا إلى CRM — الـwebhook متعطّل منذ 03:12" },
          what: { en: "The CRM endpoint has been returning 401 since a token rotation at 03:12. Google and Meta both report 220 leads; the CRM holds 176. All 44 missing records are in the dead-letter queue and are recoverable.",
            he: "נקודת הקצה של ה-CRM מחזירה 401 מאז החלפת Token ב-03:12. גוגל ומטא מדווחים על 220 לידים; ב-CRM יש 176. כל 44 הרשומות החסרות נמצאות ב-Dead-letter Queue וניתנות לשחזור.",
            ar: "نقطة نهاية الـCRM تُعيد 401 منذ تدوير الرمز في 03:12. تُبلّغ جوجل وميتا عن 220 عميلاً؛ وفي الـCRM 176. جميع السجلات الـ44 المفقودة في قائمة الرسائل الميتة وقابلة للاستعادة." },
          why: { en: "These are people who raised their hand and were never contacted. Beyond the lost revenue, every downstream number — conversion, CPL, rep performance — is measured against an incomplete denominator, which is why Data Trust dropped to 54 and the overall score is now an estimate rather than a fact.",
            he: "מדובר באנשים שהרימו יד ואף אחד לא חזר אליהם. מעבר לאובדן ההכנסה, כל מדד במורד הזרם — המרה, CPL, ביצועי נציגים — נמדד מול מכנה חסר, ולכן ה-Data Trust ירד ל-54 והציון הכולל הוא אומדן ולא עובדה.",
            ar: "هؤلاء أشخاص أبدوا اهتماماً ولم يتواصل معهم أحد. وإلى جانب الإيراد المفقود، كل رقم لاحق — التحويل، تكلفة العميل، أداء المندوبين — يُقاس مقابل مقام ناقص، ولهذا هبطت الثقة بالبيانات إلى 54 وأصبحت النتيجة الكلية تقديراً لا حقيقة." },
          ev: [
            { en: "Connector log: 44 × HTTP 401 between 03:12 and 09:40", he: "Connector Log: 44 × HTTP 401 בין 03:12 ל-09:40", ar: "سجل الموصل: 44 × HTTP 401 بين 03:12 و09:40" },
            { en: "Platform vs CRM count: 220 / 176 (Data Match Rate 80%)", he: "ספירה פלטפורמה מול CRM: 220 / 176 (Data Match Rate 80%)", ar: "العدد في المنصّة مقابل CRM: 220 / 176 (نسبة المطابقة 80%)" },
            { en: "Dead-letter queue holds all 44 payloads with full field data", he: "ב-Dead-letter Queue שמורות כל 44 הרשומות עם כל השדות", ar: "قائمة الرسائل الميتة تحتفظ بكل الـ44 سجلاً بحقولها الكاملة" }
          ],
          rc: [
            { t: { en: "Service-account token rotated without updating the connector secret", he: "Token של חשבון השירות הוחלף ללא עדכון ה-Secret של ה-Connector", ar: "تدوير رمز حساب الخدمة دون تحديث سرّ الموصل" }, p: 71 },
            { t: { en: "No alert on consecutive connector failures", he: "אין התראה על כשלים רצופים ב-Connector", ar: "لا تنبيه على أعطال متتالية في الموصل" }, p: 21 },
            { t: { en: "CRM API rate limit", he: "מגבלת קצב ב-API של ה-CRM", ar: "حدّ معدّل في واجهة الـCRM" }, p: 8 }
          ],
          corr: { en: "Refresh the connector secret, replay the 44 queued records with their original timestamps, and hand the list to sales flagged as delayed contact.",
            he: "לרענן את ה-Secret של ה-Connector, לשחזר את 44 הרשומות מהתור עם חתימות הזמן המקוריות, ולהעביר את הרשימה למכירות בסימון \"מגע באיחור\".",
            ar: "تحديث سرّ الموصل، وإعادة إدخال السجلات الـ44 من القائمة بطوابعها الزمنية الأصلية، وتسليم القائمة للمبيعات موسومة كتواصل متأخر." },
          prev: { en: "Alert on two consecutive connector failures, run an hourly platform-to-CRM count reconciliation, and put secret rotation on a monitored calendar.",
            he: "התראה על שני כשלים רצופים ב-Connector, התאמת ספירה שעתית בין הפלטפורמה ל-CRM, וניהול החלפת Secrets בלוח זמנים מנוטר.",
            ar: "تنبيه على عطلين متتاليين في الموصل، ومطابقة أعداد ساعية بين المنصّة والـCRM، وإدارة تدوير الأسرار عبر جدول مُراقب." },
          ver: { en: "Data Match Rate back above 99% for 48 hours and all 44 leads showing a first-contact timestamp.",
            he: "Data Match Rate חוזר מעל 99% במשך 48 שעות, ולכל 44 הלידים יש חתימת זמן של מגע ראשון.",
            ar: "عودة نسبة المطابقة إلى ما فوق 99% لمدة 48 ساعة، ووجود طابع زمني لأول تواصل لكل الـ44 عميلاً." }
        },
        {
          I: 3, U: 3, S: 3, C: 0.8,
          dom: { en: "Tracking & attribution", he: "Tracking וייחוס", ar: "التتبّع والنسب" },
          stage: { en: "Lead capture", he: "קליטת ליד", ar: "استقبال العميل" },
          own: "Data / IT",
          title: { en: "31% of leads carry no UTM — attribution cannot be trusted this week",
            he: "ל-31% מהלידים אין UTM — לא ניתן לסמוך על הייחוס השבוע",
            ar: "31% من العملاء بلا UTM — لا يمكن الاعتماد على النسب هذا الأسبوع" },
          what: { en: "Leads arriving through the WhatsApp button and the phone tap on mobile lose their campaign parameters, so they land in the CRM as direct. Three campaigns are being judged on partial credit.",
            he: "לידים שנכנסים דרך כפתור ה-WhatsApp והקשה על הטלפון במובייל מאבדים את פרמטרי הקמפיין, ולכן נקלטים ב-CRM כ-Direct. שלושה קמפיינים נמדדים על קרדיט חלקי.",
            ar: "العملاء الوافدون عبر زر واتساب ونقرة الهاتف على الموبايل يفقدون معطيات الحملة، فيُسجّلون في الـCRM كـDirect. ثلاث حملات تُقاس على نسبة جزئية." },
          why: { en: "Budget decisions made on partial attribution move money away from campaigns that are actually producing revenue. The system therefore blocks any automatic budget recommendation while this is open.",
            he: "החלטות תקציב על בסיס ייחוס חלקי מזיזות כסף מקמפיינים שדווקא מייצרים הכנסה. לכן המערכת חוסמת כל המלצת תקציב אוטומטית כל עוד האירוע פתוח.",
            ar: "قرارات الميزانية المبنية على نسب جزئية تنقل المال بعيداً عن حملات تُنتج إيراداً فعلاً. لذلك يمنع النظام أي توصية ميزانية آلية طالما الحادث مفتوح." },
          ev: [
            { en: "1,904 sessions with utm_source, 621 leads without it (GA4 + CRM join)", he: "1,904 סשנים עם utm_source, 621 לידים בלעדיו (חיבור GA4 + CRM)", ar: "1,904 جلسة تحمل utm_source، و621 عميلاً بدونه (ربط GA4 + CRM)" },
            { en: "WhatsApp deep link drops query parameters on iOS", he: "ה-Deep Link של WhatsApp מאבד פרמטרים ב-iOS", ar: "الرابط العميق لواتساب يُسقط المعطيات على iOS" },
            { en: "Offline sales upload has no click ID column", he: "העלאת Offline Sales ללא עמודת Click ID", ar: "تحميل المبيعات دون الإنترنت بلا عمود Click ID" }
          ],
          rc: [
            { t: { en: "Click parameters not persisted before the outbound redirect", he: "פרמטרי הקליק לא נשמרים לפני ההפניה החוצה", ar: "معطيات النقرة لا تُحفظ قبل التحويل الخارجي" }, p: 54 },
            { t: { en: "No first-party cookie fallback for messaging channels", he: "אין Fallback של Cookie צד-ראשון לערוצי הודעות", ar: "لا بديل لكوكيز الطرف الأول لقنوات المراسلة" }, p: 31 },
            { t: { en: "Offline conversion import missing identifiers", he: "יבוא המרות Offline ללא מזהים", ar: "استيراد التحويلات دون الإنترنت بلا معرّفات" }, p: 15 }
          ],
          corr: { en: "Persist click IDs in first-party storage on landing, append them to the WhatsApp and call links, and re-upload the last 30 days of offline sales with identifiers.",
            he: "לשמור Click ID ב-Storage צד-ראשון בכניסה לדף, להצמיד אותו לקישורי WhatsApp והטלפון, ולהעלות מחדש 30 יום של Offline Sales עם מזהים.",
            ar: "حفظ معرّفات النقرة في تخزين الطرف الأول عند الهبوط، وإلحاقها بروابط واتساب والاتصال، وإعادة تحميل مبيعات 30 يوماً دون الإنترنت مع المعرّفات." },
          prev: { en: "Nightly synthetic test that submits a tagged lead through every channel and fails the build if the UTM does not arrive in the CRM.",
            he: "בדיקה סינתטית לילית ששולחת ליד מתויג בכל ערוץ ומכשילה את התהליך אם ה-UTM לא מגיע ל-CRM.",
            ar: "اختبار اصطناعي ليلي يرسل عميلاً موسوماً عبر كل قناة ويُفشل العملية إن لم يصل الـUTM إلى الـCRM." },
          ver: { en: "Missing-UTM share under 5% for 7 days across all channels.",
            he: "שיעור ה-UTM החסר מתחת ל-5% במשך 7 ימים בכל הערוצים.",
            ar: "نسبة الـUTM المفقود أقل من 5% لسبعة أيام في كل القنوات." }
        }
      ]
    },
    {
      tab: { en: "CPL +41%, CTR −38%", he: "CPL +41%, CTR −38%", ar: "تكلفة العميل +41%، CTR −38%" },
      overall: 66, trust: 91,
      funnel: [8100, 7290, 214, 212, 199, 84, 21, 20],
      leaks: { 0: { en: "CTR 2.1% — was 3.4%", he: "CTR 2.1% — היה 3.4%", ar: "CTR 2.1% — كان 3.4%" },
               2: { en: "CPL ₪71 against a ₪50 plan", he: "CPL ₪71 מול תכנון ₪50", ar: "تكلفة العميل ₪71 مقابل خطة ₪50" } },
      kpis: [
        { k: "Data Trust", v: "91", d: { en: "healthy", he: "תקין", ar: "سليم" }, dir: "up", m: 91 },
        { k: "Funnel Health", v: "68", d: "−6", dir: "down", m: 68 },
        { k: "CPL", v: "₪71", d: "+41%", dir: "down", m: 34 },
        { k: "Frequency", v: "6.1", d: { en: "threshold 3.5", he: "סף 3.5", ar: "الحد 3.5" }, dir: "down", m: 25 },
        { k: "ROAS", v: "2.4", d: { en: "target 3.5", he: "יעד 3.5", ar: "الهدف 3.5" }, dir: "down", m: 52 },
        { k: { en: "Budget pace", he: "קצב תקציב", ar: "وتيرة الميزانية" }, v: "118%", d: { en: "of plan", he: "מהתכנון", ar: "من الخطة" }, dir: "down", m: 40 }
      ],
      inc: [
        {
          I: 3, U: 4, S: 2, C: 0.95,
          dom: { en: "Creative & content", he: "קריאייטיב ותוכן", ar: "الإبداع والمحتوى" },
          stage: { en: "Advertising", he: "פרסום", ar: "الإعلان" },
          own: { en: "Media buyer + Content", he: "Media Buyer + תוכן", ar: "مشتري الإعلانات + المحتوى" },
          title: { en: "Creative fatigue: frequency 6.1 with CTR down 38% over 14 days",
            he: "Creative Fatigue: Frequency 6.1 עם ירידה של 38% ב-CTR ב-14 יום",
            ar: "إجهاد الإبداع: التكرار 6.1 مع هبوط 38% في CTR خلال 14 يوماً" },
          what: { en: "The same three creatives have been serving to the same audience for 26 days. Frequency climbed from 2.3 to 6.1 while CTR fell from 3.4% to 2.1%, pushing CPC up 34% and CPL up 41%. Conversion rate after the click did not change.",
            he: "אותם שלושה קריאייטיבים מוצגים לאותו קהל 26 יום. ה-Frequency עלה מ-2.3 ל-6.1 בעוד ה-CTR ירד מ-3.4% ל-2.1%, מה שהעלה CPC ב-34% ו-CPL ב-41%. יחס ההמרה אחרי הקליק לא השתנה.",
            ar: "نفس الإبداعات الثلاثة تُعرض لنفس الجمهور 26 يوماً. صعد التكرار من 2.3 إلى 6.1 بينما هبط CTR من 3.4% إلى 2.1%، مما رفع CPC 34% وتكلفة العميل 41%. معدّل التحويل بعد النقرة لم يتغيّر." },
          why: { en: "The unchanged post-click conversion rate is what makes this diagnosable: the offer and the landing page are fine, the audience is simply saturated. Without a creative rotation the same lead volume will keep costing more every week.",
            he: "העובדה שיחס ההמרה אחרי הקליק לא השתנה היא מה שמאפשר לאבחן: ההצעה ודף הנחיתה תקינים, הקהל פשוט רווי. בלי רוטציית קריאייטיב אותה כמות לידים תעלה יותר כל שבוע.",
            ar: "ثبات معدّل التحويل بعد النقرة هو ما يجعل التشخيص ممكناً: العرض وصفحة الهبوط سليمان، والجمهور مُشبَع فقط. بدون تدوير الإبداعات سيزداد سعر نفس عدد العملاء كل أسبوع." },
          ev: [
            { en: "Frequency 2.3 → 6.1 over 26 days (Meta delivery)", he: "Frequency 2.3 → 6.1 במשך 26 יום (Meta Delivery)", ar: "التكرار 2.3 → 6.1 خلال 26 يوماً (توصيل Meta)" },
            { en: "CTR 3.4% → 2.1%, CPC +34%, post-click CVR steady at 2.6%", he: "CTR 3.4% → 2.1%, CPC +34%, CVR אחרי קליק יציב על 2.6%", ar: "CTR 3.4% → 2.1%، CPC +34%، التحويل بعد النقرة ثابت 2.6%" },
            { en: "No new creative uploaded since the 29th (asset log)", he: "לא הועלה קריאייטיב חדש מאז ה-29 (Asset Log)", ar: "لم يُحمّل إبداع جديد منذ 29 (سجل الأصول)" }
          ],
          rc: [
            { t: { en: "Audience saturation — no creative rotation", he: "רוויית קהל — אין רוטציית קריאייטיב", ar: "إشباع الجمهور — لا تدوير للإبداعات" }, p: 68 },
            { t: { en: "Audience too narrow for the spend level", he: "הקהל צר מדי לרמת ההוצאה", ar: "الجمهور ضيّق جداً لمستوى الإنفاق" }, p: 22 },
            { t: { en: "Auction pressure from a new competitor", he: "לחץ מכרז ממתחרה חדש", ar: "ضغط مزاد من منافس جديد" }, p: 10 }
          ],
          corr: { en: "Ship four new creatives in two angles this week, cap frequency at 3.5, and pause the two ad sets above frequency 5.",
            he: "להעלות ארבעה קריאייטיבים חדשים בשני זוויות מסר השבוע, להגביל Frequency ל-3.5, ולעצור את שני ה-Ad Sets מעל Frequency 5.",
            ar: "إطلاق أربعة إبداعات جديدة بزاويتَي رسالة هذا الأسبوع، وتحديد سقف تكرار 3.5، وإيقاف مجموعتَي الإعلانات فوق تكرار 5." },
          prev: { en: "Standing rule: open a creative-refresh task automatically when frequency rises while CTR falls across a 7-day window.",
            he: "כלל קבוע: לפתוח משימת רענון קריאייטיב אוטומטית כאשר ה-Frequency עולה וה-CTR יורד בחלון של 7 ימים.",
            ar: "قاعدة دائمة: فتح مهمة تحديث إبداع تلقائياً عند ارتفاع التكرار مع هبوط CTR خلال نافذة 7 أيام." },
          ver: { en: "CTR back above 3.0% and CPL under ₪55 across 200 leads.",
            he: "CTR חוזר מעל 3.0% ו-CPL מתחת ל-₪55 על 200 לידים.",
            ar: "عودة CTR إلى ما فوق 3.0% وتكلفة عميل أقل من ₪55 على 200 عميل." }
        },
        {
          I: 4, U: 3, S: 2, C: 0.85, approval: true,
          dom: { en: "Budget & billing", he: "תקציב ו-Billing", ar: "الميزانية والفواتير" },
          stage: { en: "Advertising", he: "פרסום", ar: "الإعلان" },
          own: { en: "Marketing manager", he: "מנהל שיווק", ar: "مدير التسويق" },
          appr: { en: "Finance + Management", he: "כספים + הנהלה", ar: "المالية + الإدارة" },
          title: { en: "The profitable campaign is capped by budget while a weak one keeps spending",
            he: "הקמפיין הרווחי מוגבל בתקציב בעוד קמפיין חלש ממשיך להוציא",
            ar: "الحملة المربحة مقيّدة بالميزانية بينما تواصل حملة ضعيفة الإنفاق" },
          what: { en: "Campaign \"Service — North\" is Limited by Budget at ROAS 4.1, while \"Generic — National\" spent ₪18.4K at ROAS 1.2. Total pace is at 118% of plan, so the month will overspend without producing the revenue.",
            he: "הקמפיין \"שירות — צפון\" מסומן Limited by Budget ב-ROAS 4.1, בעוד \"גנרי — ארצי\" הוציא ₪18.4K ב-ROAS 1.2. קצב ההוצאה הכולל עומד על 118% מהתכנון, כך שהחודש יחרוג בהוצאה בלי לייצר את ההכנסה.",
            ar: "حملة \"الخدمة — الشمال\" مقيّدة بالميزانية عند ROAS 4.1، بينما أنفقت \"عام — وطني\" ₪18.4 ألفاً عند ROAS 1.2. الوتيرة الإجمالية 118% من الخطة، فسيتجاوز الشهر الإنفاق دون تحقيق الإيراد." },
          why: { en: "This is a pure allocation loss, not a performance problem — the money is already committed, it is simply pointed at the wrong campaign. Moving it is a financial action, so the system recommends and a human approves.",
            he: "זה אובדן הקצאה טהור, לא בעיית ביצועים — הכסף כבר מחויב, הוא פשוט מכוון לקמפיין הלא נכון. העברה היא פעולה כספית, ולכן המערכת ממליצה ואדם מאשר.",
            ar: "هذه خسارة تخصيص صافية لا مشكلة أداء — المال ملتزَم أصلاً، لكنه موجّه إلى الحملة الخطأ. والنقل إجراء مالي، لذلك يوصي النظام ويعتمد الإنسان." },
          ev: [
            { en: "\"Service — North\": Limited by Budget 9 of 14 days, ROAS 4.1", he: "\"שירות — צפון\": Limited by Budget ב-9 מתוך 14 יום, ROAS 4.1", ar: "\"الخدمة — الشمال\": مقيّدة بالميزانية 9 من 14 يوماً، ROAS 4.1" },
            { en: "\"Generic — National\": ₪18.4K spend, ROAS 1.2, CPQL ₪410", he: "\"גנרי — ארצי\": הוצאה ₪18.4K, ROAS 1.2, CPQL ₪410", ar: "\"عام — وطني\": إنفاق ₪18.4 ألف، ROAS 1.2، CPQL ₪410" },
            { en: "Month-to-date pace 118% of the approved plan", he: "קצב מתחילת החודש 118% מהתכנון המאושר", ar: "الوتيرة من بداية الشهر 118% من الخطة المعتمدة" }
          ],
          rc: [
            { t: { en: "Budget allocated by channel, not by verified return", he: "התקציב מוקצה לפי ערוץ ולא לפי תשואה מאומתת", ar: "الميزانية موزّعة حسب القناة لا حسب مردود مُتحقَّق" }, p: 62 },
            { t: { en: "No pacing rule tied to ROAS thresholds", he: "אין כלל Pacing הקשור לספי ROAS", ar: "لا قاعدة وتيرة مرتبطة بحدود ROAS" }, p: 26 },
            { t: { en: "Seasonal demand shift toward the north region", he: "שינוי ביקוש עונתי לטובת אזור הצפון", ar: "تحوّل موسمي في الطلب نحو منطقة الشمال" }, p: 12 }
          ],
          corr: { en: "Recommended: move ₪12K from \"Generic — National\" to \"Service — North\" and hold the rest. Projected effect: +₪34K revenue at the same total spend (estimate, ±18%).",
            he: "מומלץ: להעביר ₪12K מ\"גנרי — ארצי\" ל\"שירות — צפון\" ולהחזיק את היתרה. השפעה צפויה: +₪34K הכנסה באותה הוצאה כוללת (אומדן, ±18%).",
            ar: "الموصى به: نقل ₪12 ألفاً من \"عام — وطني\" إلى \"الخدمة — الشمال\" وتثبيت الباقي. الأثر المتوقّع: +₪34 ألفاً إيراداً بنفس الإنفاق الإجمالي (تقدير، ±18%)." },
          prev: { en: "Weekly allocation review against verified ROAS, with an automatic recommendation whenever a campaign is budget-capped above target return.",
            he: "סקירת הקצאה שבועית מול ROAS מאומת, עם המלצה אוטומטית בכל פעם שקמפיין מוגבל בתקציב מעל התשואה היעד.",
            ar: "مراجعة تخصيص أسبوعية مقابل ROAS مُتحقَّق، مع توصية آلية كلما كانت حملة مقيّدة بالميزانية فوق المردود المستهدف." },
          ver: { en: "Blended ROAS above 3.0 within 14 days at a pace of 100% ±5% of plan.",
            he: "ROAS משוקלל מעל 3.0 בתוך 14 יום בקצב של 100% ±5% מהתכנון.",
            ar: "ROAS مركّب فوق 3.0 خلال 14 يوماً بوتيرة 100% ±5% من الخطة." }
        }
      ]
    },
    {
      tab: { en: "Sales −22%, marketing stable", he: "מכירות −22%, שיווק יציב", ar: "المبيعات −22%، التسويق مستقر" },
      overall: 62, trust: 86,
      funnel: [9600, 8640, 268, 265, 251, 108, 19, 15],
      leaks: { 6: { en: "Sale CVR 17.6% — was 24%", he: "Sale CVR 17.6% — היה 24%", ar: "تحويل البيع 17.6% — كان 24%" },
               7: { en: "4 refunds in 11 days", he: "4 החזרים ב-11 יום", ar: "4 استردادات في 11 يوماً" } },
      kpis: [
        { k: "Data Trust", v: "86", d: { en: "healthy", he: "תקין", ar: "سليم" }, dir: "up", m: 86 },
        { k: "Funnel Health", v: "59", d: "−11", dir: "down", m: 59 },
        { k: "CPL", v: "₪44", d: { en: "stable", he: "יציב", ar: "مستقر" }, dir: "flat", m: 72 },
        { k: { en: "Rating", he: "דירוג", ar: "التقييم" }, v: "3.8", d: { en: "was 4.6", he: "היה 4.6", ar: "كان 4.6" }, dir: "down", m: 38 },
        { k: { en: "Refunds", he: "החזרים", ar: "الاستردادات" }, v: "4", d: { en: "11 days", he: "11 יום", ar: "11 يوماً" }, dir: "down", m: 30 },
        { k: { en: "Delivery SLA", he: "SLA אספקה", ar: "SLA التسليم" }, v: "62%", d: { en: "target 95%", he: "יעד 95%", ar: "الهدف 95%" }, dir: "down", m: 62 }
      ],
      inc: [
        {
          I: 5, U: 4, S: 2, C: 0.9,
          dom: { en: "Product & service delivery", he: "המוצר ואספקת השירות", ar: "المنتج وتقديم الخدمة" },
          stage: { en: "Service delivery", he: "אספקת שירות", ar: "تقديم الخدمة" },
          own: { en: "Operations", he: "תפעול", ar: "التشغيل" },
          title: { en: "Sales are down because delivery is late — marketing metrics are unchanged",
            he: "המכירות יורדות כי האספקה מתעכבת — מדדי השיווק לא השתנו",
            ar: "المبيعات تهبط لأن التسليم متأخر — ومؤشرات التسويق لم تتغيّر" },
          what: { en: "CPL, CTR, lead volume and qualified rate are all inside their normal range. What changed is downstream: delivery SLA fell to 62%, four refunds were issued in 11 days, the public rating dropped from 4.6 to 3.8, and close rate on referral-sourced leads halved.",
            he: "ה-CPL, ה-CTR, כמות הלידים ו-Qualified Rate כולם בטווח הרגיל. מה שהשתנה נמצא במורד הזרם: SLA האספקה ירד ל-62%, הונפקו 4 החזרים ב-11 יום, הדירוג הציבורי ירד מ-4.6 ל-3.8, ואחוז הסגירה על לידים מהמלצות נחצה בשניים.",
            ar: "تكلفة العميل وCTR وحجم العملاء ونسبة التأهيل كلها داخل نطاقها الطبيعي. ما تغيّر يقع لاحقاً: هبط SLA التسليم إلى 62%، وصدرت أربع استردادات في 11 يوماً، ونزل التقييم العام من 4.6 إلى 3.8، وانخفض معدّل الإغلاق على عملاء التوصيات إلى النصف." },
          why: { en: "This is exactly the case the system exists to prevent: a service failure that gets charged to marketing. Pouring more budget in now would raise CAC and generate more negative reviews. The correct first action is operational, not promotional.",
            he: "זה בדיוק המקרה שהמערכת נבנתה כדי למנוע: כשל בשירות שנרשם על חשבון השיווק. הזרמת תקציב נוסף כרגע תעלה את ה-CAC ותייצר עוד ביקורות שליליות. הפעולה הראשונה הנכונה היא תפעולית, לא פרסומית.",
            ar: "هذه بالضبط الحالة التي بُني النظام لمنعها: خلل في الخدمة يُحمَّل على التسويق. زيادة الميزانية الآن سترفع تكلفة الاستحواذ وتولّد مراجعات سلبية أكثر. الإجراء الأول الصحيح تشغيلي لا ترويجي." },
          ev: [
            { en: "Delivery SLA 95% → 62% starting the 9th (operations log)", he: "SLA אספקה 95% → 62% מה-9 בחודש (Operations Log)", ar: "SLA التسليم 95% → 62% منذ التاسع (سجل التشغيل)" },
            { en: "7 of 9 negative reviews mention waiting time", he: "7 מתוך 9 ביקורות שליליות מזכירות זמן המתנה", ar: "7 من 9 مراجعات سلبية تذكر زمن الانتظار" },
            { en: "Marketing metrics within ±4% of the 60-day baseline", he: "מדדי השיווק בטווח ±4% מ-Baseline של 60 יום", ar: "مؤشرات التسويق داخل ±4% من خط أساس 60 يوماً" }
          ],
          rc: [
            { t: { en: "Installation capacity below committed lead time", he: "קיבולת ההתקנה נמוכה מזמן האספקה שהובטח", ar: "قدرة التركيب أدنى من مدة التسليم الملتزَم بها" }, p: 57 },
            { t: { en: "Supplier delay on one product line", he: "עיכוב ספק בקו מוצר אחד", ar: "تأخّر مورّد في خطّ منتج واحد" }, p: 29 },
            { t: { en: "Sales promising dates the operation never confirmed", he: "מכירות מבטיחות תאריכים שהתפעול לא אישר", ar: "المبيعات تَعِد بمواعيد لم يؤكّدها التشغيل" }, p: 14 }
          ],
          corr: { en: "Freeze the aggressive lead-time promise in scripts and ads, contact the 23 waiting customers with a real date, and reduce spend on the affected product line for 10 days.",
            he: "להקפיא את הבטחת זמן האספקה האגרסיבית בתסריטים ובמודעות, ליצור קשר עם 23 הלקוחות הממתינים עם תאריך אמיתי, ולהקטין הוצאה על קו המוצר המושפע ל-10 ימים.",
            ar: "تجميد وعد مدة التسليم المتشدّد في السيناريوهات والإعلانات، والتواصل مع 23 عميلاً منتظراً بموعد حقيقي، وتقليص الإنفاق على خطّ المنتج المتأثر عشرة أيام." },
          prev: { en: "Bind advertised lead time to live operational capacity, and route every after-sale complaint back to both marketing and sales as a feedback loop.",
            he: "לקשור את זמן האספקה המפורסם לקיבולת התפעולית בזמן אמת, ולנתב כל תלונה שלאחר מכירה חזרה לשיווק ולמכירות כלולאת משוב.",
            ar: "ربط مدة التسليم المُعلنة بالقدرة التشغيلية الحقيقية، وتوجيه كل شكوى بعد البيع إلى التسويق والمبيعات كحلقة تغذية راجعة." },
          ver: { en: "Delivery SLA above 90% for 14 days, zero new waiting-time reviews, close rate back above 22%.",
            he: "SLA אספקה מעל 90% במשך 14 יום, אפס ביקורות חדשות על זמן המתנה, ואחוז סגירה חוזר מעל 22%.",
            ar: "SLA التسليم فوق 90% لأربعة عشر يوماً، وصفر مراجعات جديدة عن الانتظار، وعودة معدّل الإغلاق فوق 22%." }
        },
        {
          I: 3, U: 4, S: 2, C: 0.95,
          dom: { en: "Reputation & reviews", he: "מוניטין וביקורות", ar: "السمعة والمراجعات" },
          stage: { en: "Loyalty", he: "נאמנות", ar: "الولاء" },
          own: { en: "Service + Marketing", he: "שירות + שיווק", ar: "الخدمة + التسويق" },
          title: { en: "Public rating fell 4.6 → 3.8; 9 negative reviews with no response",
            he: "הדירוג הציבורי ירד מ-4.6 ל-3.8; 9 ביקורות שליליות ללא מענה",
            ar: "هبط التقييم العام 4.6 → 3.8؛ تسع مراجعات سلبية بلا ردّ" },
          what: { en: "Nine negative reviews were published in 11 days and none received a reply inside the 24-hour SLA. Branded search CTR fell 12% over the same period, which is the visible commercial cost of the rating drop.",
            he: "תשע ביקורות שליליות פורסמו ב-11 יום ואף אחת לא קיבלה מענה בתוך SLA של 24 שעות. ה-CTR בחיפוש ממותג ירד ב-12% באותה תקופה — זה המחיר העסקי הנראה של ירידת הדירוג.",
            ar: "نُشرت تسع مراجعات سلبية في 11 يوماً ولم تتلقَّ أي منها رداً داخل SLA الـ24 ساعة. وهبط CTR البحث باسم العلامة 12% في الفترة ذاتها، وهو الثمن التجاري الظاهر لانخفاض التقييم." },
          why: { en: "Reviews are the last stage of the funnel and the first thing the next buyer sees. An unanswered complaint keeps costing money long after the operational issue behind it is fixed.",
            he: "ביקורות הן השלב האחרון במשפך והדבר הראשון שהקונה הבא רואה. תלונה ללא מענה ממשיכה לעלות כסף זמן רב אחרי שהבעיה התפעולית שמאחוריה נפתרה.",
            ar: "المراجعات هي المرحلة الأخيرة في المسار وأول ما يراه المشتري التالي. والشكوى بلا ردّ تستمر في تكليف المال بعد إصلاح الخلل التشغيلي وراءها بوقت طويل." },
          ev: [
            { en: "9 reviews at 1–2 stars, average response time: none", he: "9 ביקורות של 1–2 כוכבים, זמן תגובה ממוצע: אין", ar: "تسع مراجعات بنجمة أو نجمتين، متوسط زمن الردّ: لا شيء" },
            { en: "Sentiment root cause: 7 waiting time, 2 communication", he: "שורש הסנטימנט: 7 זמן המתנה, 2 תקשורת", ar: "جذر المشاعر: 7 زمن انتظار، 2 تواصل" },
            { en: "Branded search CTR −12% over the same 11 days", he: "CTR בחיפוש ממותג −12% באותם 11 יום", ar: "CTR البحث باسم العلامة −12% في الأيام الـ11 نفسها" }
          ],
          rc: [
            { t: { en: "No owner assigned to review response", he: "אין אחראי מוגדר למענה לביקורות", ar: "لا مسؤول محدّد للردّ على المراجعات" }, p: 61 },
            { t: { en: "Complaints not linked to the operational incident", he: "התלונות לא מקושרות לאירוע התפעולי", ar: "الشكاوى غير مرتبطة بالحادث التشغيلي" }, p: 27 },
            { t: { en: "Genuine service failure beyond communication", he: "כשל שירות אמיתי מעבר לתקשורת", ar: "خلل خدمة حقيقي يتجاوز التواصل" }, p: 12 }
          ],
          corr: { en: "Assign an owner, reply to all nine with the approved template within 24 hours, and close the loop personally with the three customers still waiting.",
            he: "להגדיר אחראי, להשיב לכל התשע בתבנית המאושרת בתוך 24 שעות, ולסגור מעגל אישית עם שלושת הלקוחות שעדיין ממתינים.",
            ar: "تعيين مسؤول، والردّ على التسع كلها بالقالب المعتمد خلال 24 ساعة، وإغلاق الحلقة شخصياً مع العملاء الثلاثة الذين ما زالوا ينتظرون." },
          prev: { en: "Route every new review into the incident queue with a 24-hour SLA, classified by root cause rather than by sentiment alone.",
            he: "לנתב כל ביקורת חדשה לתור האירועים עם SLA של 24 שעות, בסיווג לפי שורש הבעיה ולא לפי סנטימנט בלבד.",
            ar: "توجيه كل مراجعة جديدة إلى قائمة الحوادث بـSLA من 24 ساعة، مصنّفة حسب السبب الجذري لا حسب المشاعر وحدها." },
          ver: { en: "100% response inside SLA for 30 days and rating back above 4.3.",
            he: "100% מענה בתוך ה-SLA במשך 30 יום ודירוג חוזר מעל 4.3.",
            ar: "ردّ 100% داخل SLA لثلاثين يوماً وعودة التقييم فوق 4.3." }
        }
      ]
    }
  ];
  /* ===================== 5. System modules ===================== */
  const MODULES = [
    { id: "5.1", n: { en: "Executive control center", he: "מרכז בקרה ניהולי", ar: "مركز القيادة الإداري" },
      d: { en: "KPI cards, funnel health, period comparison, budget against target, revenue, CAC and ROAS, critical events and the decisions waiting for management.",
        he: "כרטיסי KPI, בריאות המשפך, השוואה לתקופה קודמת, תקציב מול יעד, הכנסה, CAC ו-ROAS, אירועים קריטיים וההחלטות הממתינות להנהלה.",
        ar: "بطاقات المؤشرات، وصحة المسار، ومقارنة الفترات، والميزانية مقابل الهدف، والإيراد وCAC وROAS، والأحداث الحرجة والقرارات التي تنتظر الإدارة." } },
    { id: "5.2", n: { en: "Advertising channels", he: "ניהול ערוצי פרסום", ar: "إدارة قنوات الإعلان" },
      d: { en: "Google and Meta by account, campaign, ad set, ad and country; policy and payment status; CPC, CPL, CPM, CTR, frequency; Limited by Budget, Learning Limited and creative fatigue.",
        he: "Google ו-Meta לפי חשבון, קמפיין, Ad Set, מודעה ומדינה; סטטוס מדיניות ותשלום; CPC, CPL, CPM, CTR, Frequency; Limited by Budget, Learning Limited ו-Creative Fatigue.",
        ar: "جوجل وميتا حسب الحساب والحملة ومجموعة الإعلانات والإعلان والدولة؛ حالة السياسة والدفع؛ CPC وCPL وCPM وCTR والتكرار؛ التقييد بالميزانية والتعلّم المحدود وإجهاد الإبداع." } },
    { id: "5.3", n: { en: "Lead & CRM control", he: "בקרת לידים ו-CRM", ar: "رقابة العملاء والـCRM" },
      d: { en: "Platform-to-CRM reconciliation, duplicates, missing UTM, wrong source, sync delay, ownerless leads, stale status, unsynced sales and missing lost reasons.",
        he: "התאמה בין ספירת הפלטפורמה ל-CRM, כפילויות, UTM חסר, Source שגוי, עיכוב סנכרון, ליד ללא בעלים, Status לא מעודכן, מכירה שאינה מסונכרנת ו-Lost Reason חסר.",
        ar: "مطابقة المنصّة مع الـCRM، والتكرارات، وUTM المفقود، والمصدر الخطأ، وتأخّر المزامنة، والعملاء بلا مالك، والحالة غير المحدّثة، والمبيعات غير المتزامنة، وأسباب الخسارة الناقصة." } },
    { id: "5.4", n: { en: "Lead quality", he: "איכות לידים", ar: "جودة العملاء" },
      d: { en: "Qualified / unqualified classification by capability, fit, country, intent, decision authority and purchase window; a 0–100 quality score; quality analysis by campaign, market and rep.",
        he: "סיווג Qualified/Unqualified לפי יכולת, התאמה, מדינה, כוונה, בעל החלטה וטווח רכישה; ציון איכות 0–100; ניתוח איכות לפי קמפיין, שוק ונציג.",
        ar: "تصنيف مؤهّل/غير مؤهّل حسب القدرة والملاءمة والدولة والنيّة وصاحب القرار ونطاق الشراء؛ درجة جودة 0–100؛ وتحليل الجودة حسب الحملة والسوق والمندوب." } },
    { id: "5.5", n: { en: "Sales performance", he: "ביצועי מכירות", ar: "أداء المبيعات" },
      d: { en: "Response time, attempts, follow-up, contact / appointment / sale rate, CRM data hygiene, gaps between reps, and success by lead quality and assignment.",
        he: "זמן תגובה, מספר ניסיונות, Follow-up, Contact/Appointment/Sale Rate, איכות הזנת CRM, פערים בין עובדים והצלחה לפי איכות ליד והקצאה.",
        ar: "زمن الاستجابة، وعدد المحاولات، والمتابعة، ومعدّلات التواصل والمواعيد والبيع، ونظافة إدخال الـCRM، والفوارق بين المندوبين، والنجاح حسب جودة العميل والإسناد." } },
    { id: "5.6", n: { en: "Website & landing pages", he: "אתר ודפי נחיתה", ar: "الموقع وصفحات الهبوط" },
      d: { en: "Uptime, load time, mobile, SSL / domain / hosting, forms, WhatsApp, CTA, thank-you page, conversion events and scheduled synthetic tests.",
        he: "זמינות, זמן טעינה, מובייל, SSL/דומיין/אחסון, טפסים, WhatsApp, CTA, Thank You Page, אירועי Conversion ובדיקות סינתטיות מתוזמנות.",
        ar: "التوفّر، وزمن التحميل، والموبايل، وSSL والنطاق والاستضافة، والنماذج، وواتساب، وزر الإجراء، وصفحة الشكر، وأحداث التحويل، واختبارات اصطناعية مجدولة." } },
    { id: "5.7", n: { en: "Tracking & attribution", he: "Tracking ו-Attribution", ar: "التتبّع والنسب" },
      d: { en: "GA4, Google Ads, Meta Pixel / CAPI, events, duplicates, UTM, offline sales, and source agreement across systems.",
        he: "בקרת GA4, Google Ads, Meta Pixel/CAPI, Events, כפילויות, UTM, Offline Sales והתאמת מקור בין המערכות.",
        ar: "GA4 وجوجل Ads وبكسل ميتا/CAPI، والأحداث، والتكرارات، وUTM، والمبيعات دون اتصال، وتوافق المصدر بين الأنظمة." } },
    { id: "5.8", n: { en: "Content & brand", he: "תוכן ומותג", ar: "المحتوى والعلامة" },
      d: { en: "Content calendar, approval workflow, usage rights, language and cultural fit, CTA and offer quality, creative versions, logo and colour consistency, fatigue metrics.",
        he: "לוח תוכן, תהליך אישור, זכויות שימוש, התאמת שפה ותרבות, איכות CTA והצעה, גרסאות Creative, עקביות לוגו וצבעים ומדדי עייפות.",
        ar: "تقويم المحتوى، ومسار الاعتماد، وحقوق الاستخدام، وملاءمة اللغة والثقافة، وجودة زر الإجراء والعرض، ونسخ الإبداعات، وثبات الشعار والألوان، ومؤشرات الإجهاد." } },
    { id: "5.9", n: { en: "Reputation & service", he: "מוניטין ושירות", ar: "السمعة والخدمة" },
      d: { en: "Comments, reviews and complaints in one place, sentiment, root cause, approved response, escalation, SLA, fake / spam handling, and closure only after the root cause is treated.",
        he: "איחוד Comments/Reviews/Complaints, Sentiment, מקור הבעיה, תגובה מאושרת, הסלמה, SLA, Fake/Spam וסגירה רק לאחר טיפול בשורש.",
        ar: "توحيد التعليقات والمراجعات والشكاوى، والمشاعر، ومصدر المشكلة، والردّ المعتمد، والتصعيد، وSLA، والمزيّف والمزعج، والإغلاق بعد معالجة الجذر فقط." } },
    { id: "5.10", n: { en: "Accounts & permissions", he: "חשבונות והרשאות", ar: "الحسابات والصلاحيات" },
      d: { en: "Asset map across Ads, Pages, Instagram, TikTok, LinkedIn, GA4, GTM, domains, hosting, CRM, WhatsApp and YouTube; company ownership, backup admin, 2FA, and revoking access for people who left.",
        he: "מפת נכסים: Ads, Pages, Instagram, TikTok, LinkedIn, GA4, GTM, דומיינים, אחסון, CRM, WhatsApp ו-YouTube; בעלות חברה, Admin גיבוי, 2FA וביטול גישה לעובדים שעזבו.",
        ar: "خريطة الأصول: Ads والصفحات وإنستغرام وتيك توك ولينكدإن وGA4 وGTM والنطاقات والاستضافة والـCRM وواتساب ويوتيوب؛ ملكية الشركة، ومشرف احتياطي، و2FA، وإلغاء وصول من تركوا العمل." } },
    { id: "5.11", n: { en: "Budget & billing", he: "תקציב ו-Billing", ar: "الميزانية والفواتير" },
      d: { en: "Budget against target, spend pace, limits and declined cards, gaps between countries, a profitable campaign that was paused or a weak one still running — each with a proposed decision and its expected effect.",
        he: "תקציב מול יעד, קצב הוצאה, Limit ודחיית כרטיס, פערים בין מדינות, קמפיין רווחי שנעצר או חלש שממשיך — כל אחד עם הצעת החלטה והשפעה צפויה.",
        ar: "الميزانية مقابل الهدف، ووتيرة الإنفاق، والحدود ورفض البطاقة، والفوارق بين الدول، وحملة مربحة أُوقفت أو ضعيفة ما زالت تعمل — كل منها مع قرار مقترح وأثره المتوقّع." } },
    { id: "5.12", n: { en: "Markets, competitors & seasonality", he: "שווקים, מתחרים ועונתיות", ar: "الأسواق والمنافسون والموسمية" },
      d: { en: "Language, culture, cost, purchasing power, active hours, competitors, holidays, economic and political conditions, and product or regulatory changes.",
        he: "השוואת שפה, תרבות, עלות, יכולת קנייה, שעות פעילות, מתחרים, חגים, מצב כלכלי ופוליטי ושינויי מוצר או רגולציה.",
        ar: "مقارنة اللغة والثقافة والتكلفة والقدرة الشرائية وساعات النشاط والمنافسين والأعياد والحالة الاقتصادية والسياسية وتغيّرات المنتج أو التنظيم." } },
    { id: "5.13", n: { en: "Incidents & tasks", he: "ניהול אירועים ומשימות", ar: "إدارة الحوادث والمهام" },
      d: { en: "Automatic or manual incident creation, severity, impact, owner, SLA, timeline, evidence, root cause, corrective and preventive action, and verified closure.",
        he: "פתיחת Incident אוטומטית או ידנית, חומרה, השפעה, אחראי, SLA, Timeline, ראיות, Root Cause, פעולות תיקון ומניעה ואימות סגירה.",
        ar: "فتح حادث آلياً أو يدوياً، والخطورة، والأثر، والمسؤول، وSLA، والخط الزمني، والأدلة، والسبب الجذري، والإجراءات التصحيحية والوقائية، والتحقق من الإغلاق." } },
    { id: "5.14", n: { en: "Reports", he: "דוחות", ar: "التقارير" },
      d: { en: "Daily operational, weekly for management and monthly trends: performance, data gaps, open problems, solutions, ownership and the decisions required.",
        he: "דוח יומי תפעולי, שבועי להנהלה וחודשי מגמות: ביצועים, פערי נתונים, בעיות פתוחות, פתרונות, אחריות והחלטות נדרשות.",
        ar: "تقرير يومي تشغيلي، وأسبوعي للإدارة، وشهري للاتجاهات: الأداء، وفجوات البيانات، والمشكلات المفتوحة، والحلول، والمسؤولية، والقرارات المطلوبة." } }
  ];

  /* ===================== 6. The 30 risk domains ===================== */
  const DGROUPS = [
    { k: "mkt", n: { en: "Marketing", he: "שיווק", ar: "التسويق" } },
    { k: "sales", n: { en: "Sales", he: "מכירות", ar: "المبيعات" } },
    { k: "data", n: { en: "Data / IT", he: "נתונים / IT", ar: "البيانات / IT" } },
    { k: "svc", n: { en: "Service", he: "שירות", ar: "الخدمة" } },
    { k: "mgmt", n: { en: "Management", he: "ניהול", ar: "الإدارة" } },
    { k: "fin", n: { en: "Finance & legal", he: "כספים ומשפט", ar: "المالية والقانون" } },
    { k: "brand", n: { en: "Brand & content", he: "מותג ותוכן", ar: "العلامة والمحتوى" } }
  ];
  const DOMAINS = [
    { g: "mkt", n: { en: "Google Ads", he: "Google Ads", ar: "Google Ads" }, o: "Marketing" },
    { g: "mkt", n: { en: "Meta Ads", he: "Meta Ads", ar: "Meta Ads" }, o: "Marketing" },
    { g: "brand", n: { en: "Social media pages", he: "עמודי סושיאל", ar: "صفحات التواصل" }, o: "Social" },
    { g: "svc", n: { en: "Negative feedback & reputation", he: "תגובות שליליות ומוניטין", ar: "التعليقات السلبية والسمعة" }, o: "Service + Marketing" },
    { g: "data", n: { en: "CRM", he: "CRM", ar: "CRM" }, o: "CRM / IT" },
    { g: "mkt", n: { en: "Lead quality", he: "איכות לידים", ar: "جودة العملاء" }, o: "Marketing + Sales" },
    { g: "sales", n: { en: "Sales affecting marketing", he: "מכירות שמשפיעות על שיווק", ar: "المبيعات المؤثّرة على التسويق" }, o: "Sales" },
    { g: "data", n: { en: "Website & landing pages", he: "אתר ודפי נחיתה", ar: "الموقع وصفحات الهبوط" }, o: "IT + Marketing" },
    { g: "data", n: { en: "Tracking & analytics", he: "Tracking ואנליטיקס", ar: "التتبّع والتحليلات" }, o: "Data / IT" },
    { g: "brand", n: { en: "Content", he: "תוכן", ar: "المحتوى" }, o: "Content" },
    { g: "mkt", n: { en: "Campaign planning", he: "תכנון קמפיינים", ar: "تخطيط الحملات" }, o: "Marketing" },
    { g: "fin", n: { en: "Budget & payment", he: "תקציב ותשלום", ar: "الميزانية والدفع" }, o: "Finance + Marketing" },
    { g: "data", n: { en: "Accounts & permissions", he: "חשבונות והרשאות", ar: "الحسابات والصلاحيات" }, o: "IT / Admin" },
    { g: "sales", n: { en: "WhatsApp & messaging", he: "WhatsApp והודעות", ar: "واتساب والرسائل" }, o: "Sales / IT" },
    { g: "svc", n: { en: "Customer service", he: "שירות לקוחות", ar: "خدمة العملاء" }, o: "Service" },
    { g: "svc", n: { en: "Reviews", he: "Reviews", ar: "المراجعات" }, o: "Service + Marketing" },
    { g: "brand", n: { en: "Identity & brand", he: "זהות ומותג", ar: "الهوية والعلامة" }, o: "Brand" },
    { g: "fin", n: { en: "Law & advertising policy", he: "משפט ומדיניות פרסום", ar: "القانون وسياسة الإعلان" }, o: "Legal + Marketing" },
    { g: "mkt", n: { en: "Competitors", he: "מתחרים", ar: "المنافسون" }, o: "Marketing" },
    { g: "mkt", n: { en: "Different markets", he: "שווקים שונים", ar: "أسواق مختلفة" }, o: "Marketing" },
    { g: "mgmt", n: { en: "Offers & pricing", he: "Offers ומחירים", ar: "العروض والأسعار" }, o: "Management + Sales" },
    { g: "mgmt", n: { en: "Cross-department communication", he: "תקשורת בין מחלקות", ar: "التواصل بين الأقسام" }, o: "Management" },
    { g: "data", n: { en: "Reports & data", he: "דוחות ונתונים", ar: "التقارير والبيانات" }, o: "Data" },
    { g: "mgmt", n: { en: "KPIs", he: "KPIs", ar: "مؤشرات الأداء" }, o: "Management" },
    { g: "mgmt", n: { en: "Team management", he: "ניהול צוות", ar: "إدارة الفريق" }, o: "Department heads" },
    { g: "mgmt", n: { en: "Time & priorities", he: "זמן וסדרי עדיפויות", ar: "الوقت والأولويات" }, o: "Management" },
    { g: "data", n: { en: "External failures", he: "תקלות חיצוניות", ar: "الأعطال الخارجية" }, o: "IT / Vendor" },
    { g: "mgmt", n: { en: "Seasonality & external conditions", he: "עונתיות ותנאים חיצוניים", ar: "الموسمية والظروف الخارجية" }, o: "Management" },
    { g: "svc", n: { en: "The product / service", he: "המוצר / השירות", ar: "المنتج / الخدمة" }, o: "Product / Operations" },
    { g: "mgmt", n: { en: "The full funnel", he: "המשפך המלא", ar: "المسار الكامل" }, o: "Management" }
  ];
  /* ===================== 8. Scoring engine ===================== */
  const SCORES = [
    { n: "Implementation Score", w: "10%", d: { en: "Weighted average of verified controls by importance — how much of the method is actually implemented, not how much was promised.",
      he: "ממוצע משוקלל של בקרות מאומתות לפי חשיבות — כמה מהשיטה מיושם בפועל, לא כמה הובטח.",
      ar: "متوسط مرجّح للضوابط المُتحقَّقة حسب الأهمية — كم من المنهج مطبّق فعلاً، لا كم وُعد به." } },
    { n: "Data Trust Score", w: "10%", d: { en: "Completeness × consistency × freshness × cross-source agreement. This is the gate: below 60, no final score is presented as fact.",
      he: "שלמות × עקביות × טריות × התאמה בין מקורות. זה השער: מתחת ל-60 אין ציון סופי המוצג כעובדה.",
      ar: "الاكتمال × الاتساق × الحداثة × التوافق بين المصادر. هذا هو البوّابة: أدنى من 60 لا تُعرض نتيجة نهائية كحقيقة." } },
    { n: "Funnel Health", w: "25%", d: { en: "A weight per stage against its target and its deviation — the health of the journey from click to review.",
      he: "משקל לכל שלב מול היעד והחריגה שלו — בריאות המסע מקליק עד Review.",
      ar: "وزن لكل مرحلة مقابل هدفها وانحرافها — صحة المسار من النقرة إلى المراجعة." } },
    { n: "Marketing Score", w: "20%", d: { en: "Media, lead quality, tracking, landing pages and brand — the performance that is genuinely inside marketing's control.",
      he: "מדיה, איכות לידים, Tracking, דפי נחיתה ומותג — הביצועים שנמצאים באמת בשליטת השיווק.",
      ar: "الوسائط وجودة العملاء والتتبّع وصفحات الهبوط والعلامة — الأداء الواقع فعلاً تحت سيطرة التسويق." } },
    { n: "Sales Execution", w: "20%", d: { en: "Response, follow-up, CRM hygiene and conversion — measured on what sales controls, not on lead volume.",
      he: "תגובה, Follow-up, היגיינת CRM והמרה — נמדד על מה שבשליטת המכירות, לא על כמות הלידים.",
      ar: "الاستجابة والمتابعة ونظافة الـCRM والتحويل — مقيسة على ما تسيطر عليه المبيعات، لا على حجم العملاء." } },
    { n: "Customer Experience", w: "15%", d: { en: "SLA, complaints, refunds and reviews — the part of the funnel that decides whether growth compounds.",
      he: "SLA, תלונות, החזרים וביקורות — החלק במשפך שקובע אם הצמיחה מצטברת.",
      ar: "SLA والشكاوى والاستردادات والمراجعات — الجزء الذي يحدّد إن كان النمو يتراكم." } },
    { n: "Overall Success", w: "100%", d: { en: "The weighted result — presented only when data reliability passes the threshold. Weights are configurable per business model.",
      he: "התוצאה המשוקללת — מוצגת רק כאשר אמינות הנתונים עוברת את הסף. המשקלים ניתנים להגדרה לפי מודל העסק.",
      ar: "النتيجة المرجّحة — تُعرض فقط عندما تتجاوز موثوقية البيانات الحدّ. والأوزان قابلة للتعريف حسب نموذج العمل." } }
  ];
  const BANDS = [
    { c: "green", r: "85–100", s: { en: "Green — stable", he: "ירוק — יציב", ar: "أخضر — مستقر" }, a: { en: "Maintain and improve", he: "שימור ושיפור", ar: "الحفاظ والتحسين" } },
    { c: "yellow", r: "70–84", s: { en: "Yellow — attention", he: "צהוב — דורש תשומת לב", ar: "أصفر — يحتاج انتباهاً" }, a: { en: "Scheduled action plan", he: "תוכנית פעולה מתוזמנת", ar: "خطة عمل مجدولة" } },
    { c: "orange", r: "50–69", s: { en: "Orange — high risk", he: "כתום — סיכון גבוה", ar: "برتقالي — خطر مرتفع" }, a: { en: "Immediate owner action", he: "טיפול מיידי של בעל התחום", ar: "معالجة فورية من صاحب المجال" } },
    { c: "red", r: "0–49", s: { en: "Red — critical", he: "אדום — קריטי", ar: "أحمر — حرج" }, a: { en: "Escalate to management, war room", he: "הסלמה להנהלה ו-War Room", ar: "تصعيد للإدارة وغرفة أزمة" } }
  ];

  /* ===================== 9. AI engine ===================== */
  const AIROLES = [
    { en: "Classifies every event into one of the 30 risk domains and its stage in the funnel.", he: "מסווג כל אירוע לאחד מ-30 תחומי הסיכון ולשלב שלו במשפך.", ar: "يصنّف كل حادث إلى أحد مجالات الخطر الثلاثين وإلى مرحلته في المسار." },
    { en: "Analyses root cause with ranked alternatives, and shows the evidence behind each conclusion.", he: "מנתח Root Cause עם חלופות מדורגות, ומציג את הראיות לכל מסקנה.", ar: "يحلّل السبب الجذري ببدائل مرتّبة، ويعرض الأدلة وراء كل استنتاج." },
    { en: "Explains it in plain language for the owner: what happened, why it matters, who must act, and the risk of not acting.", he: "מסביר בשפה פשוטה לבעל העסק: מה קרה, למה זה חשוב, מי צריך לפעול ומה הסיכון אם לא יטופל.", ar: "يشرح بلغة بسيطة لصاحب العمل: ما حدث، ولماذا يهم، ومن يجب أن يتحرّك، وما خطر التجاهل." },
    { en: "Builds an action plan from DriftX playbooks and training, with an owner, a target and a verification metric.", he: "בונה תוכנית פעולה לפי Playbooks והדרכות DriftX, עם אחראי, יעד ומדד אימות.", ar: "يبني خطة عمل من أدلّة وتدريبات DriftX، مع مسؤول وهدف ومقياس تحقّق." },
    { en: "Compares trends, detects anomalies and projects impact — always marked as an estimate.", he: "משווה מגמות, מזהה אנומליות וחוזה השפעה — תוך סימון שמדובר באומדן.", ar: "يقارن الاتجاهات ويكتشف الشواذ ويتوقّع الأثر — مع وسمه دائماً كتقدير." },
    { en: "Produces the management summary in Hebrew, Arabic or English, keeping professional terms in English where that is clearer.", he: "מפיק סיכום הנהלה בעברית, ערבית או אנגלית, עם מינוחים מקצועיים באנגלית היכן שזה ברור יותר.", ar: "ينتج ملخّص الإدارة بالعبرية أو العربية أو الإنجليزية، مع مصطلحات مهنية بالإنجليزية حيث يكون ذلك أوضح." }
  ];
  const LAYERS = [
    { l: "Knowledge Base", d: { en: "Training material, SOPs, scripts, brand guidelines, policies, and previously solved problems.", he: "הדרכות, SOP, תסריטים, Brand Guidelines, מדיניות ותקלות שנפתרו בעבר.", ar: "التدريبات وإجراءات العمل والسيناريوهات وأدلة العلامة والسياسات والمشكلات التي حُلّت سابقاً." } },
    { l: "Retrieval", d: { en: "Pulls the relevant passages with their version, date and document owner.", he: "אחזור המקטעים הרלוונטיים עם גרסה, תאריך ובעל המסמך.", ar: "استرجاع المقاطع ذات الصلة مع النسخة والتاريخ ومالك المستند." } },
    { l: "Rules Engine", d: { en: "Deterministic rules for thresholds, SLA and cross-source reconciliation. Numbers are never left to the model.", he: "כללים דטרמיניסטיים לספים, SLA והתאמות נתונים. המספרים לא נשארים לשיקול המודל.", ar: "قواعد حتمية للحدود وSLA ومطابقة البيانات. الأرقام لا تُترك لتقدير النموذج." } },
    { l: "LLM", d: { en: "Explanation, summary, classification and proposed action — on top of the evidence, never instead of it.", he: "הסבר, סיכום, סיווג והצעת פעולה — על בסיס הראיות, לא במקומן.", ar: "الشرح والتلخيص والتصنيف واقتراح الإجراء — فوق الأدلة، لا بدلاً منها." } },
    { l: "Human Approval", d: { en: "Required for financial, legal, external-publishing or system-changing actions.", he: "נדרש לפעולות כספיות, משפטיות, פרסום חיצוני או שינוי מערכת.", ar: "مطلوبة للإجراءات المالية والقانونية والنشر الخارجي أو تغيير النظام." } }
  ];
  const SAFETY = [
    { en: "No invented data. Every answer carries its source, its update time and its confidence level.", he: "אין המצאת נתונים. כל תשובה מציגה מקור, זמן עדכון ורמת ביטחון.", ar: "لا اختلاق للبيانات. كل إجابة تحمل مصدرها ووقت تحديثها ومستوى ثقتها." },
    { en: "A recommendation is not executed automatically. High-risk actions require human approval.", he: "המלצה אינה מתבצעת אוטומטית. פעולות בסיכון גבוה מחייבות אישור אנושי.", ar: "التوصية لا تُنفّذ آلياً. والإجراءات عالية الخطورة تتطلب موافقة بشرية." },
    { en: "Shadow ban, click fraud or an external failure are never declared without signals and verification tests.", he: "אין לקבוע Shadow Ban, Click Fraud או תקלה חיצונית ללא סימנים ומבחני אימות.", ar: "لا يُقرَّر حظر ظلّي أو نقرات مزيّفة أو عطل خارجي دون مؤشرات واختبارات تحقّق." },
    { en: "Fact, calculation, hypothesis and recommendation are always visually separated.", he: "הפרדה ברורה בין עובדה, חישוב, השערה והמלצה.", ar: "فصل واضح بين الحقيقة والحساب والفرضية والتوصية." },
    { en: "Every playbook change is versioned and auditable.", he: "כל שינוי ב-Playbook נשמר בגרסה ומאפשר Audit.", ar: "كل تغيير في دليل العمل يُحفظ بنسخة ويقبل التدقيق." }
  ];

  /* ===================== 10. Rules & alerts ===================== */
  const RULES = [
    { n: { en: "Lead gap", he: "פער לידים", ar: "فجوة العملاء" },
      c: { en: "Platform-to-CRM gap above threshold after the delay window", he: "פער מעל סף בין Platform ל-CRM לאחר חלון ההשהיה", ar: "فجوة تتجاوز الحد بين المنصّة والـCRM بعد نافذة التأخير" },
      a: { en: "Incident to CRM / IT", he: "Incident ל-CRM / IT", ar: "حادث إلى CRM / IT" } },
    { n: { en: "Untouched lead", he: "ליד ללא טיפול", ar: "عميل بلا معالجة" },
      c: { en: "No first contact inside the SLA", he: "אין First Contact בתוך ה-SLA", ar: "لا تواصل أول داخل SLA" },
      a: { en: "Alert the rep, then the manager", he: "התראה לנציג ואז למנהל", ar: "تنبيه المندوب ثم المدير" } },
    { n: { en: "Creative fatigue", he: "Creative Fatigue", ar: "إجهاد الإبداع" },
      c: { en: "Frequency rising while CTR falls across the window", he: "Frequency עולה ו-CTR יורד לאורך החלון", ar: "التكرار يصعد وCTR يهبط خلال النافذة" },
      a: { en: "Creative replacement task", he: "משימת החלפת Creative", ar: "مهمة استبدال الإبداع" } },
    { n: { en: "Suspect tracking", he: "Tracking חשוד", ar: "تتبّع مريب" },
      c: { en: "Duplicate conversions, or a collapse with no traffic change", he: "Conversion כפול, או צניחה ללא שינוי בתנועה", ar: "تحويلات مكرّرة أو هبوط دون تغيّر الزيارات" },
      a: { en: "Events / tags check", he: "בדיקת Events/Tags", ar: "فحص الأحداث والوسوم" } },
    { n: { en: "Budget at risk", he: "תקציב בסיכון", ar: "ميزانية في خطر" },
      c: { en: "Spend pace deviates from plan", he: "קצב הוצאה חורג מהתכנון", ar: "وتيرة الإنفاق تنحرف عن الخطة" },
      a: { en: "Recommendation only — change requires approval", he: "המלצה בלבד — שינוי מחייב אישור", ar: "توصية فقط — التغيير يتطلب موافقة" } },
    { n: { en: "Quality declining", he: "איכות יורדת", ar: "الجودة تتراجع" },
      c: { en: "Qualified rate drops significantly against baseline", he: "Qualified Rate יורד משמעותית מול Baseline", ar: "نسبة التأهيل تهبط بوضوح مقابل خط الأساس" },
      a: { en: "Check targeting, offer and sales handling", he: "בדיקת Targeting, הצעה וטיפול מכירות", ar: "فحص الاستهداف والعرض ومعالجة المبيعات" } },
    { n: { en: "Site down", he: "אתר לא זמין", ar: "الموقع غير متاح" },
      c: { en: "Health check fails twice", he: "בדיקת Health נכשלת פעמיים", ar: "فحص السلامة يفشل مرتين" },
      a: { en: "Critical incident", he: "Critical Incident", ar: "حادث حرج" } },
    { n: { en: "Reputation", he: "מוניטין", ar: "السمعة" },
      c: { en: "Severe negative response or a sensitive keyword", he: "תגובה שלילית חמורה או מילה רגישה", ar: "ردّ سلبي حادّ أو كلمة حسّاسة" },
      a: { en: "Response SLA and escalation", he: "SLA תגובה והסלמה", ar: "SLA للردّ وتصعيد" } },
    { n: { en: "Risky permission", he: "הרשאה מסוכנת", ar: "صلاحية خطرة" },
      c: { en: "Unknown admin or stale 2FA", he: "Admin לא מוכר או 2FA ישן", ar: "مشرف غير معروف أو 2FA قديم" },
      a: { en: "Security incident", he: "Security Incident", ar: "حادث أمني" } },
    { n: { en: "Unreliable data", he: "נתונים לא אמינים", ar: "بيانات غير موثوقة" },
      c: { en: "Data Trust below threshold", he: "Data Trust מתחת לסף", ar: "الثقة بالبيانات أدنى من الحد" },
      a: { en: "Block decisive conclusions", he: "חסימת מסקנות החלטיות", ar: "حجب الاستنتاجات القاطعة" } }
  ];
  /* ===================== 11. Incident lifecycle ===================== */
  const LIFE = [
    { n: { en: "Detected", he: "זוהה", ar: "مكتشف" } },
    { n: { en: "Verified", he: "אומת", ar: "مُتحقَّق" }, key: true },
    { n: { en: "Classified", he: "סווג", ar: "مُصنَّف" } },
    { n: { en: "Assigned", he: "הוקצה", ar: "مُسنَد" }, key: true },
    { n: { en: "In progress", he: "בטיפול", ar: "قيد المعالجة" } },
    { n: { en: "Waiting on third party", he: "ממתין לצד שלישי", ar: "بانتظار طرف ثالث" } },
    { n: { en: "Resolved", he: "נפתר", ar: "مُحلّ" } },
    { n: { en: "Verified closed", he: "אומת", ar: "تحقّق الإغلاق" }, key: true },
    { n: { en: "Closed", he: "נסגר", ar: "مُغلق" } },
    { n: { en: "Reviewed for prevention", he: "נבדק למניעה", ar: "مُراجَع للوقاية" }, key: true }
  ];
  const INCFIELDS = [
    { a: { en: "ID & timing", he: "מזהה ותאריך", ar: "المعرّف والتوقيت" }, b: { en: "ID, detection time, estimated start time", he: "ID, זמן גילוי, זמן התחלה משוער", ar: "المعرّف، وقت الاكتشاف، وقت البداية المقدّر" } },
    { a: { en: "Source", he: "מקור", ar: "المصدر" }, b: { en: "API, user, monitoring, customer or AI", he: "API, משתמש, ניטור, לקוח או AI", ar: "واجهة، مستخدم، مراقبة، عميل أو ذكاء اصطناعي" } },
    { a: { en: "Domain & stage", he: "תחום ושלב", ar: "المجال والمرحلة" }, b: { en: "One of the 30 domains plus the funnel stage", he: "אחד מ-30 התחומים ושלב במשפך", ar: "أحد المجالات الثلاثين ومرحلة المسار" } },
    { a: { en: "Impact", he: "השפעה", ar: "الأثر" }, b: { en: "Leads, money, market, customers, reputation, legal", he: "לידים, כסף, שוק, לקוחות, מוניטין, משפט", ar: "العملاء، المال، السوق، الزبائن، السمعة، القانون" } },
    { a: { en: "Severity & confidence", he: "חומרה וביטחון", ar: "الخطورة والثقة" }, b: { en: "Severity score with an explicit confidence factor", he: "ציון חומרה עם מקדם ביטחון מפורש", ar: "درجة خطورة مع معامل ثقة صريح" } },
    { a: { en: "Ownership", he: "אחריות", ar: "المسؤولية" }, b: { en: "Owner, collaborators, approver", he: "Owner, Collaborators, Approver", ar: "المسؤول، المتعاونون، المُعتمد" } },
    { a: "SLA", b: { en: "Response target, resolution target, deadline", he: "יעד תגובה, יעד פתרון, Deadline", ar: "هدف الاستجابة، هدف الحل، الموعد النهائي" } },
    { a: { en: "Evidence", he: "ראיות", ar: "الأدلة" }, b: { en: "Links, data, logs, screenshots", he: "קישורים, נתונים, Logs, צילומי מסך", ar: "روابط، بيانات، سجلات، لقطات شاشة" } },
    { a: "Root cause", b: { en: "A verified cause, or an explicit \"not yet determined\"", he: "גורם מאומת, או \"טרם נקבע\" במפורש", ar: "سبب مُتحقَّق، أو \"لم يُحدَّد بعد\" صراحةً" } },
    { a: { en: "Action", he: "פעולה", ar: "الإجراء" }, b: { en: "Corrective action plus preventive action", he: "פעולה מתקנת ופעולה מונעת", ar: "إجراء تصحيحي وإجراء وقائي" } },
    { a: { en: "Closure verification", he: "אימות סגירה", ar: "التحقق من الإغلاق" }, b: { en: "An automatic or human check, and its result", he: "בדיקה אוטומטית או אנושית והתוצאה שלה", ar: "فحص آلي أو بشري ونتيجته" } },
    { a: "Postmortem", b: { en: "Mandatory for a critical or repeating incident", he: "חובה לאירוע קריטי או חוזר", ar: "إلزامي للحادث الحرج أو المتكرر" } }
  ];

  /* ===================== 14. Integrations ===================== */
  const INTEG = [
    { s: "Google Ads", d: "Spend, Clicks, Keywords, Conversions, Status", f: { en: "Every 15–60 min", he: "כל 15–60 דקות", ar: "كل 15–60 دقيقة" } },
    { s: "Meta", d: "Spend, Leads, Creative, Delivery, Events", f: { en: "Every 15–60 min", he: "כל 15–60 דקות", ar: "كل 15–60 دقيقة" } },
    { s: "GA4 / GTM", d: "Sessions, Events, Conversions", f: { en: "Hourly / daily", he: "שעתי / יומי", ar: "ساعي / يومي" } },
    { s: "CRM", d: "Leads, Status, Owner, Activities, Sales", f: { en: "Webhook + periodic backfill", he: "Webhook + השלמה תקופתית", ar: "Webhook + استكمال دوري" } },
    { s: { en: "Website", he: "אתר", ar: "الموقع" }, d: "Forms, Health, Performance, Errors", f: { en: "Realtime + monitoring", he: "Realtime + ניטור", ar: "فوري + مراقبة" } },
    { s: "WhatsApp / Email", d: "Messages, Delivery, Response", f: "Webhook" },
    { s: "Finance / Payments", d: "Payments, Revenue, Refunds", f: { en: "Webhook / daily", he: "Webhook / יומי", ar: "Webhook / يومي" } },
    { s: "Reviews", d: "Rating, Text, Response", f: { en: "Hourly / daily", he: "שעתי / יומי", ar: "ساعي / يومي" } }
  ];
  const CONNNOTE = {
    en: "Every connector reports last successful sync, latency, records read and written, an error log, retry with backoff, a dead-letter queue and a failure alert. Timestamps are stored in UTC and displayed in the organisation's timezone.",
    he: "כל Connector מדווח על Last Successful Sync, Latency, רשומות שנקראו ונכתבו, Error Log, Retry עם Backoff, Dead-letter Queue והתראת כשל. נתוני זמן נשמרים ב-UTC ומוצגים באזור הזמן של הארגון.",
    ar: "كل موصل يُبلّغ عن آخر مزامنة ناجحة، والكمون، والسجلات المقروءة والمكتوبة، وسجل الأخطاء، وإعادة المحاولة بتراجع، وقائمة الرسائل الميتة، وتنبيه العطل. تُحفظ الأوقات بـUTC وتُعرض بتوقيت المنظمة."
  };

  /* ===================== 16. KPI dictionary ===================== */
  const KPIS = [
    { k: "CPL", d: { en: "Spend / valid leads", he: "Spend / לידים תקינים", ar: "الإنفاق / العملاء الصحيحين" } },
    { k: "CPQL", d: { en: "Spend / qualified leads", he: "Spend / לידים מוכשרים", ar: "الإنفاق / العملاء المؤهّلين" } },
    { k: "Lead Capture Rate", d: { en: "Leads captured in the CRM / leads at the source", he: "לידים שנקלטו ב-CRM / לידים במקור", ar: "العملاء المستقبَلون في CRM / العملاء في المصدر" } },
    { k: "Lead Response Time", d: { en: "First contact time − lead created time", he: "זמן מגע ראשון − זמן יצירת הליד", ar: "وقت أول تواصل − وقت إنشاء العميل" } },
    { k: "Contact Rate", d: { en: "Leads contacted / leads assigned", he: "לידים שנוצר איתם קשר / לידים שהוקצו", ar: "العملاء المتواصل معهم / العملاء المُسندون" } },
    { k: "Qualification Rate", d: { en: "Qualified / contacted", he: "מוכשרים / נוצר קשר", ar: "المؤهّلون / المتواصل معهم" } },
    { k: "Appointment Rate", d: { en: "Appointments / qualified", he: "פגישות / מוכשרים", ar: "المواعيد / المؤهّلون" } },
    { k: "Sales Conversion", d: { en: "Sales / qualified and sales / leads — both are shown, never one alone", he: "מכירות / מוכשרים ומכירות / לידים — שניהם מוצגים, לא אחד לבד", ar: "المبيعات / المؤهّلون والمبيعات / العملاء — يُعرض الاثنان، لا واحد وحده" } },
    { k: "CAC", d: { en: "Total acquisition cost / new customers", he: "עלות רכישה כוללת / לקוחות חדשים", ar: "إجمالي تكلفة الاستحواذ / العملاء الجدد" } },
    { k: "ROAS", d: { en: "Attributed revenue / ad spend", he: "הכנסה מיוחסת / הוצאת פרסום", ar: "الإيراد المنسوب / الإنفاق الإعلاني" } },
    { k: "Data Match Rate", d: { en: "Matching records between sources / expected records", he: "רשומות תואמות בין מקורות / רשומות צפויות", ar: "السجلات المتطابقة بين المصادر / السجلات المتوقّعة" } },
    { k: "Incident MTTA / MTTR", d: { en: "Mean time to acknowledge / to resolve an incident", he: "זמן ממוצע לאישור / לפתרון אירוע", ar: "الزمن المتوسط للإقرار / للحل" } },
    { k: "SLA Compliance", d: { en: "Incidents and leads handled in time / total", he: "אירועים ולידים שטופלו בזמן / סך הכול", ar: "الحوادث والعملاء المعالجون في الوقت / الإجمالي" } }
  ];

  /* ===================== 7. Assessment ===================== */
  const ASSESSVALS = [
    { v: { en: "Implemented & verified", he: "מיושם ומאומת", ar: "مطبّق ومُتحقَّق" }, s: "100", d: { en: "A process exists and current evidence backs it", he: "יש תהליך וראיה עדכנית", ar: "توجد عملية ودليل حديث" } },
    { v: { en: "Partially implemented", he: "מיושם חלקית", ar: "مطبّق جزئياً" }, s: "60", d: { en: "Exists but not consistent, or not in every unit", he: "קיים אך לא עקבי או לא בכל היחידות", ar: "موجود لكن غير متّسق أو ليس في كل الوحدات" } },
    { v: { en: "Planned", he: "מתוכנן", ar: "مخطّط" }, s: "30", d: { en: "There is an owner and a date, but it has not started", he: "יש אחראי ומועד אך טרם הופעל", ar: "هناك مسؤول وموعد لكنه لم يبدأ" } },
    { v: { en: "Not implemented", he: "לא מיושם", ar: "غير مطبّق" }, s: "0", d: { en: "No process, no control", he: "אין תהליך ואין בקרה", ar: "لا عملية ولا رقابة" } },
    { v: { en: "Not relevant", he: "לא רלוונטי", ar: "غير ذي صلة" }, s: "—", d: { en: "Excluded from the denominator, with a written reason", he: "מוצא מהמכנה עם הסבר", ar: "يُستثنى من المقام مع تفسير" } }
  ];
  const ASSESSQS = [
    { a: "Tracking", q: { en: "Is every lead stored with source, campaign and UTM?", he: "האם כל ליד נשמר עם Source, Campaign ו-UTM?", ar: "هل يُحفظ كل عميل مع المصدر والحملة وUTM؟" }, e: { en: "CRM sample against the source", he: "דגימת CRM מול המקור", ar: "عيّنة CRM مقابل المصدر" } },
    { a: "CRM", q: { en: "Do you get an alert if a lead does not arrive inside the time window?", he: "האם מתקבלת התראה אם ליד לא נכנס בתוך חלון הזמן?", ar: "هل يصلكم تنبيه إن لم يدخل عميل داخل نافذة الوقت؟" }, e: "Log / API" },
    { a: "Sales", q: { en: "Is a first-response SLA defined — and actually measured?", he: "האם מוגדר SLA לתגובה ראשונה — ונמדד בפועל?", ar: "هل يوجد SLA لأول استجابة — ويُقاس فعلاً؟" }, e: "Timestamp" },
    { a: "Quality", q: { en: "Is there an agreed definition of a qualified lead?", he: "האם קיימת הגדרה מוסכמת ל-Qualified Lead?", ar: "هل يوجد تعريف متّفق عليه للعميل المؤهّل؟" }, e: { en: "Policy + data", he: "מדיניות + נתונים", ar: "سياسة + بيانات" } },
    { a: "Content", q: { en: "Is there an approval process before publishing?", he: "האם יש תהליך אישור לפני פרסום?", ar: "هل توجد عملية اعتماد قبل النشر؟" }, e: "Workflow" },
    { a: "Accounts", q: { en: "Are the assets company-owned, with a backup admin and 2FA?", he: "האם הנכסים בבעלות החברה, עם Admin גיבוי ו-2FA?", ar: "هل الأصول بملكية الشركة، مع مشرف احتياطي و2FA؟" }, e: "Audit" },
    { a: "Reputation", q: { en: "Is a negative response classified by root cause?", he: "האם תגובה שלילית מסווגת לפי שורש הבעיה?", ar: "هل يُصنّف الردّ السلبي حسب السبب الجذري؟" }, e: "Incident" },
    { a: "Finance", q: { en: "Is the lead target aligned with the budget and the expected CPL?", he: "האם יעד הלידים מותאם לתקציב ול-CPL הצפוי?", ar: "هل هدف العملاء متوافق مع الميزانية وتكلفة العميل المتوقّعة؟" }, e: "Plan" },
    { a: "Service", q: { en: "Does an after-sale complaint travel back to marketing and sales?", he: "האם תלונה שלאחר מכירה חוזרת לשיווק ולמכירות?", ar: "هل تعود شكوى ما بعد البيع إلى التسويق والمبيعات؟" }, e: "Feedback" },
    { a: "Management", q: { en: "Is there a weekly report with decisions and owners?", he: "האם יש דוח שבועי עם החלטות ואחראים?", ar: "هل يوجد تقرير أسبوعي بالقرارات والمسؤولين؟" }, e: "Report" }
  ];

  /* ===================== 19. Delivery plan ===================== */
  const PHASES = [
    { p: "0", n: { en: "Discovery", he: "Discovery", ar: "الاستكشاف" }, dur: { en: "2–3 weeks", he: "2–3 שבועות", ar: "2–3 أسابيع" },
      sc: { en: "Sources, KPIs, SLA, CRM mapping and playbooks", he: "מקורות, KPI, SLA, מיפוי CRM ו-Playbooks", ar: "المصادر والمؤشرات وSLA وخريطة CRM وأدلة العمل" }, out: "Solution design" },
    { p: "1", n: { en: "Foundation", he: "Foundation", ar: "الأساس" }, dur: { en: "4–6 weeks", he: "4–6 שבועות", ar: "4–6 أسابيع" },
      sc: { en: "Identity, permissions, data model, first connectors", he: "זהויות, הרשאות, מודל נתונים, Connectors ראשונים", ar: "الهويات والصلاحيات ونموذج البيانات والموصلات الأولى" }, out: "Data hub" },
    { p: "2", n: "MVP", dur: { en: "6–8 weeks", he: "6–8 שבועות", ar: "6–8 أسابيع" },
      sc: { en: "Dashboards, funnel, incidents, rules, reports", he: "דשבורדים, משפך, אירועים, כללים, דוחות", ar: "اللوحات والمسار والحوادث والقواعد والتقارير" }, out: { en: "Live pilot", he: "Pilot פעיל", ar: "تجربة حيّة" } },
    { p: "3", n: "AI Advisor", dur: { en: "4–6 weeks", he: "4–6 שבועות", ar: "4–6 أسابيع" },
      sc: { en: "Knowledge, RAG, assessments, recommendations", he: "Knowledge, RAG, שאלונים, המלצות", ar: "المعرفة وRAG والاستبيانات والتوصيات" }, out: { en: "Governed AI", he: "AI מבוקר", ar: "ذكاء اصطناعي مُحكوم" } },
    { p: "4", n: { en: "Expansion", he: "Expansion", ar: "التوسّع" }, dur: { en: "6–10 weeks", he: "6–10 שבועות", ar: "6–10 أسابيع" },
      sc: { en: "Sales QA, service, finance, forecast", he: "Sales QA, שירות, כספים, Forecast", ar: "جودة المبيعات والخدمة والمالية والتوقّع" }, out: { en: "Extended version", he: "גרסה מורחבת", ar: "نسخة موسّعة" } },
    { p: "5", n: { en: "Optimization", he: "Optimization", ar: "التحسين" }, dur: { en: "Continuous", he: "רציף", ar: "مستمر" },
      sc: { en: "Threshold calibration, A/B, playbooks, impact measurement", he: "כיול ספים, A/B, Playbooks ומדידת השפעה", ar: "معايرة الحدود وA/B وأدلة العمل وقياس الأثر" }, out: { en: "Continuous improvement", he: "שיפור מתמשך", ar: "تحسين مستمر" } }
  ];
  const PRIOS = [
    { p: "P0", d: { en: "Lead capture, source-to-CRM reconciliation, sales SLA, incidents, permissions, audit and Data Trust.",
      he: "קליטת לידים, התאמת מקור↔CRM, SLA מכירות, אירועים, הרשאות, Audit ו-Data Trust.",
      ar: "استقبال العملاء، ومطابقة المصدر↔CRM، وSLA المبيعات، والحوادث، والصلاحيات، والتدقيق، والثقة بالبيانات." } },
    { p: "P1", d: { en: "Lead quality, reports, landing and tracking health, budget, and the playbook-based recommendation engine.",
      he: "איכות לידים, דוחות, בריאות Landing ו-Tracking, תקציב ומנוע המלצות מבוסס Playbook.",
      ar: "جودة العملاء، والتقارير، وسلامة صفحات الهبوط والتتبّع، والميزانية، ومحرك التوصيات المبني على أدلة العمل." } },
    { p: "P2", d: { en: "Reputation, content workflow, reviews, finance, call transcription and forecasting.",
      he: "מוניטין, Content Workflow, ביקורות, כספים, תמלול שיחות וחיזוי.",
      ar: "السمعة، ومسار المحتوى، والمراجعات، والمالية، وتفريغ المكالمات، والتوقّع." } }
  ];

  /* ===================== 15. Engineering standards ===================== */
  const NFR = [
    { a: { en: "Performance", he: "ביצועים", ar: "الأداء" }, b: { en: "Main dashboard under 3 s at P95; standard API actions under 1 s where possible", he: "דשבורד מרכזי עד 3 שניות ב-P95; פעולות API רגילות עד שנייה היכן שניתן", ar: "اللوحة الرئيسية أقل من 3 ثوانٍ عند P95؛ وعمليات الواجهة العادية أقل من ثانية حيث أمكن" } },
    { a: { en: "Availability", he: "זמינות", ar: "التوفّر" }, b: { en: "99.9% target, with live connector status", he: "יעד 99.9%, עם חיווי סטטוס חיבורים", ar: "هدف 99.9%، مع بيان حالة الاتصالات" } },
    { a: { en: "Scale", he: "סקייל", ar: "التوسّع" }, b: { en: "Multi-tenant, data isolation, queued sync processing", he: "Multi-tenant, הפרדת נתונים, תורים לעיבוד סנכרונים", ar: "متعدد المستأجرين، وفصل البيانات، وطوابير لمعالجة المزامنة" } },
    { a: { en: "Security", he: "אבטחה", ar: "الأمان" }, b: { en: "TLS, encryption at rest, secrets vault, MFA, RBAC, IP and session controls", he: "TLS, הצפנה במנוחה, Secrets Vault, MFA, RBAC, בקרות IP ו-Session", ar: "TLS، وتشفير في السكون، وخزنة أسرار، وMFA، وRBAC، وضوابط IP والجلسات" } },
    { a: { en: "Privacy", he: "פרטיות", ar: "الخصوصية" }, b: { en: "Data minimisation, masking, retention, export and delete per law and contract", he: "Data Minimization, Masking, Retention, ייצוא ומחיקה לפי דין והסכם", ar: "تقليل البيانات، والحجب، والاستبقاء، والتصدير والحذف وفق القانون والعقد" } },
    { a: "Audit", b: { en: "Immutable log of actions, permissions, recommendations and approvals", he: "לוג בלתי ניתן לעריכה לפעולות, הרשאות, המלצות ואישורים", ar: "سجل غير قابل للتعديل للإجراءات والصلاحيات والتوصيات والموافقات" } },
    { a: { en: "Backup", he: "גיבוי", ar: "النسخ الاحتياطي" }, b: { en: "Encrypted backups, restore tests, defined RPO / RTO", he: "גיבוי מוצפן, בדיקות שחזור, יעדי RPO/RTO מוגדרים", ar: "نسخ مشفّرة، واختبارات استعادة، وأهداف RPO/RTO محدّدة" } },
    { a: { en: "Accessibility", he: "נגישות", ar: "الوصولية" }, b: { en: "WCAG 2.2 AA, keyboard navigation, contrast, alt text", he: "WCAG 2.2 AA, ניווט מקלדת, ניגודיות וטקסט חלופי", ar: "WCAG 2.2 AA، وتنقّل بلوحة المفاتيح، وتباين، ونص بديل" } },
    { a: { en: "Localisation", he: "לוקליזציה", ar: "التوطين" }, b: { en: "Full RTL, dates, currencies and numbers per market", he: "RTL מלא, תאריכים, מטבעות ומספרים לפי שוק", ar: "RTL كامل، وتواريخ وعملات وأرقام حسب السوق" } },
    { a: "Observability", b: { en: "Logs, metrics, traces, error tracking and alerting", he: "Logs, Metrics, Traces, Error Tracking והתראות", ar: "سجلات ومقاييس وتتبّعات وتتبّع أخطاء وتنبيهات" } }
  ];

  /* ===================== 18. Acceptance criteria ===================== */
  const AC = [
    { en: "A new lead from a connected source appears in the system and in the CRM with source and UTM inside the SLA window.", he: "ליד חדש ממקור מחובר מופיע במערכת וב-CRM עם Source ו-UTM בתוך חלון ה-SLA.", ar: "عميل جديد من مصدر موصول يظهر في النظام وفي الـCRM مع المصدر وUTM داخل نافذة SLA." },
    { en: "A count gap above threshold opens an incident with evidence, an owner and a severity.", he: "פער ספירה מעל הסף יוצר Incident עם ראיות, אחראי וחומרה.", ar: "فجوة عدّ تتجاوز الحدّ تفتح حادثاً بأدلة ومسؤول وخطورة." },
    { en: "An incident cannot be closed without a documented verification check.", he: "לא ניתן לסגור Incident ללא בדיקת אימות מתועדת.", ar: "لا يمكن إغلاق حادث دون فحص تحقّق موثّق." },
    { en: "Every KPI drills down to the records and to the source of the update.", he: "כל KPI מאפשר Drill-down לרשומות ולמקור העדכון.", ar: "كل مؤشر يسمح بالتنقّل إلى السجلات وإلى مصدر التحديث." },
    { en: "The system distinguishes a fact from an estimate from an AI recommendation, and displays confidence.", he: "המערכת מבדילה בין נתון, אומדן והמלצת AI ומציגה Confidence.", ar: "يميّز النظام بين المعطى والتقدير وتوصية الذكاء الاصطناعي، ويعرض الثقة." },
    { en: "A success score is never presented as certain while Data Trust is below the threshold.", he: "ציון הצלחה אינו מוצג כוודאי כאשר Data Trust נמוך מהסף.", ar: "لا تُعرض نتيجة النجاح كمؤكدة عندما تكون الثقة بالبيانات أدنى من الحد." },
    { en: "Permissions prevent a user from seeing an organisation or market they were not assigned.", he: "הרשאות מונעות ממשתמש לצפות בארגון או שוק שלא הוקצה לו.", ar: "الصلاحيات تمنع المستخدم من رؤية منظمة أو سوق لم يُسند إليه." },
    { en: "Changing a budget or stopping a campaign requires permission and approval per policy.", he: "שינוי תקציב או עצירת קמפיין מחייבים הרשאה ואישור לפי מדיניות.", ar: "تغيير ميزانية أو إيقاف حملة يتطلب صلاحية وموافقة وفق السياسة." },
    { en: "Hebrew and Arabic render RTL without reversing numbers or English terms.", he: "עברית וערבית מוצגות RTL ללא היפוך מספרים ומונחים באנגלית.", ar: "العبرية والعربية تُعرضان RTL دون قلب الأرقام أو المصطلحات الإنجليزية." },
    { en: "The weekly report is produced automatically with KPIs, problems, solutions and decisions.", he: "הדוח השבועי מופק אוטומטית עם KPI, בעיות, פתרונות והחלטות.", ar: "يُنتَج التقرير الأسبوعي آلياً مع المؤشرات والمشكلات والحلول والقرارات." },
    { en: "Every AI recommendation points to data or to a knowledge item at an identified version.", he: "כל המלצת AI מפנה לנתונים או לפריט ידע בגרסה מזוהה.", ar: "كل توصية ذكاء اصطناعي تُشير إلى بيانات أو إلى عنصر معرفة بنسخة محدّدة." },
    { en: "A disconnected connector or an API failure is detected and reported — it never fails quietly.", he: "ניתוק Connector או כשל API מזוהים ומדווחים — ללא אובדן שקט.", ar: "انفصال موصل أو فشل واجهة يُكتشف ويُبلَّغ — دون فشل صامت." }
  ];

  /* ===================== 21. Decisions to lock ===================== */
  const DECISIONS = [
    { en: "Which CRM is live, and how good are its API and webhooks?", he: "איזה CRM פעיל, ומה איכות ה-API וה-Webhooks שלו?", ar: "أي CRM قائم، وما جودة واجهته وwebhooks؟" },
    { en: "Which brands, countries and currencies are in the first wave?", he: "אילו מותגים, מדינות ומטבעות נכללים בגל הראשון?", ar: "أي علامات ودول وعملات تدخل الموجة الأولى؟" },
    { en: "What is the definition of a qualified lead, per service and per market?", he: "מהי הגדרת Qualified Lead לכל שירות ולכל שוק?", ar: "ما تعريف العميل المؤهّل، لكل خدمة وكل سوق؟" },
    { en: "What are the approved SLAs and targets for each team?", he: "מהם ה-SLA והיעדים המאושרים לכל צוות?", ar: "ما SLA والأهداف المعتمدة لكل فريق؟" },
    { en: "Which source is the system of record for sale, revenue and refund?", he: "איזה מקור הוא מערכת הרשומה ל-Sale, Revenue ו-Refund?", ar: "أي مصدر هو نظام السجل للبيع والإيراد والاسترداد؟" },
    { en: "Which AI actions are allowed automatically, and which require approval?", he: "אילו פעולות AI מותרות אוטומטית ואילו מחייבות אישור?", ar: "أي إجراءات الذكاء الاصطناعي مسموحة آلياً وأيها يتطلب موافقة؟" },
    { en: "What is the data-retention and legal permission policy in each market?", he: "מהי מדיניות שמירת הנתונים וההרשאות המשפטית בכל שוק?", ar: "ما سياسة الاستبقاء والصلاحيات القانونية في كل سوق؟" },
    { en: "Which DriftX trainings and playbooks enter the first version?", he: "אילו הדרכות ו-Playbooks של DriftX ייכנסו לגרסה הראשונה?", ar: "أي تدريبات وأدلّة DriftX تدخل النسخة الأولى؟" }
  ];
  /* ===================== Render helpers ===================== */
  const H = (id, num, eyebrow, title, lead, body) =>
    '<section class="section" id="' + id + '"><div class="container">' +
      '<div class="ct-head reveal"><div class="ct-num">' + num + '</div>' +
      '<div class="eyebrow">' + eyebrow + '</div><h2>' + title + '</h2>' +
      (lead ? '<p class="lead">' + lead + '</p>' : '') + '</div>' +
      '<div class="reveal" data-delay="1" style="margin-top:34px">' + body + '</div>' +
    '</div></section>';

  /* ---- 01 principle ---- */
  function secPrinciple() {
    const bad = [
      { en: "Sales are down, so marketing is blamed.", he: "המכירות יורדות, ולכן מאשימים את השיווק.", ar: "المبيعات تهبط، فيُلام التسويق." },
      { en: "Lead volume is up, so the month is declared a success.", he: "כמות הלידים עלתה, ולכן מכריזים על החודש כהצלחה.", ar: "حجم العملاء ارتفع، فيُعلن الشهر نجاحاً." },
      { en: "Every department shows a different number from a different screen.", he: "כל מחלקה מציגה מספר אחר ממסך אחר.", ar: "كل قسم يعرض رقماً مختلفاً من شاشة مختلفة." },
      { en: "Problems are discovered weeks later, by accident.", he: "הבעיות מתגלות שבועות אחר כך, במקרה.", ar: "المشكلات تُكتشف بعد أسابيع، بالمصادفة." },
      { en: "Nobody owns the failure, so nothing is verified as fixed.", he: "אף אחד לא אחראי לכשל, ולכן שום דבר לא מאומת כמתוקן.", ar: "لا أحد مسؤول عن الخلل، فلا شيء يُتحقَّق من إصلاحه." }
    ];
    const good = [
      { en: "Each stage has an owner, a metric and an SLA.", he: "לכל שלב יש אחראי, מדד ו-SLA.", ar: "لكل مرحلة مسؤول ومقياس وSLA." },
      { en: "Quality, speed, conversion, revenue and profit — not volume.", he: "איכות, מהירות, המרה, הכנסה ורווח — לא כמות.", ar: "الجودة والسرعة والتحويل والإيراد والربح — لا الكمّية." },
      { en: "One source of truth, with a visible reliability score.", he: "מקור אמת אחד, עם ציון אמינות גלוי.", ar: "مصدر حقيقة واحد، بدرجة موثوقية ظاهرة." },
      { en: "Anomalies open an incident automatically, with evidence attached.", he: "חריגות פותחות Incident אוטומטית, עם ראיות מצורפות.", ar: "الشواذ تفتح حادثاً آلياً، مع أدلة مرفقة." },
      { en: "Closure requires a verification test, not a status change.", he: "סגירה מחייבת בדיקת אימות, לא שינוי סטטוס.", ar: "الإغلاق يتطلب فحص تحقّق، لا تغيير حالة." }
    ];
    const li = (a) => a.map((x) => '<li>' + P(x) + '</li>').join('');
    const body = '<div class="ct-vs">' +
      '<div class="ct-vs__col bad"><h4>' + P({ en: "How it usually works", he: "איך זה עובד בדרך כלל", ar: "كيف يعمل الأمر عادةً" }) + '</h4><ul>' + li(bad) + '</ul></div>' +
      '<div class="ct-vs__col good"><h4>' + P({ en: "How the control tower works", he: "איך עובד חדר הבקרה", ar: "كيف تعمل غرفة القيادة" }) + '</h4><ul>' + li(good) + '</ul></div>' +
      '</div>';
    return H("principle", "01", P(T.secPrinciple),
      P({ en: "A drop in sales is not necessarily a marketing failure. A rise in leads is not necessarily a success.",
        he: "ירידה במכירות אינה בהכרח כשל שיווקי. עלייה בכמות הלידים אינה בהכרח הצלחה.",
        ar: "هبوط المبيعات ليس بالضرورة فشلاً تسويقياً. وارتفاع عدد العملاء ليس بالضرورة نجاحاً." }),
      P({ en: "The system exists to end the argument with evidence: it separates marketing conversion from sales conversion, gives every stage of the journey a named owner, and measures quality, response speed, conversion, revenue and profitability instead of volume.",
        he: "המערכת נבנתה כדי לסיים את הוויכוח בעזרת ראיות: היא מפרידה בין Marketing Conversion ל-Sales Conversion, נותנת לכל שלב במסע בעל אחריות בשם, ומודדת איכות, מהירות תגובה, המרה, הכנסה ורווחיות במקום כמות.",
        ar: "بُني النظام لإنهاء الجدال بالأدلة: يفصل تحويل التسويق عن تحويل المبيعات، ويمنح كل مرحلة في المسار مسؤولاً بالاسم، ويقيس الجودة وسرعة الاستجابة والتحويل والإيراد والربحية بدلاً من الكمّية." }),
      body);
  }

  /* ---- 02 journey ---- */
  function secJourney() {
    const body = '<div class="ct-chain">' + JOURNEY.map((j) =>
      '<div class="ct-link"><div class="st">' + j.st + '</div><h4>' + P(j.n) + '</h4>' +
      '<div class="ev">' + P(j.e) + '</div><div class="own">' + P(j.o) + '</div>' +
      '<div class="mx">' + P(j.m) + '</div></div>').join('') + '</div>';
    return H("journey", "02", P(T.secJourney),
      P({ en: "Eight stages, eight owners, no shared blame.", he: "שמונה שלבים, שמונה אחראים, בלי אשמה מפוזרת.", ar: "ثماني مراحل، ثمانية مسؤولين، بلا لوم موزّع." }),
      P({ en: "Responsibility follows control. Marketing is measured on what marketing controls, sales on what sales controls, and operations on delivery — so a failure in one stage is never charged to another.",
        he: "האחריות הולכת אחרי השליטה. השיווק נמדד על מה שבשליטתו, המכירות על מה שבשליטתן, והתפעול על האספקה — כך שכשל בשלב אחד לא נרשם על חשבון שלב אחר.",
        ar: "المسؤولية تتبع السيطرة. التسويق يُقاس على ما يسيطر عليه، والمبيعات على ما تسيطر عليه، والتشغيل على التسليم — فلا يُحمَّل خلل مرحلة على مرحلة أخرى." }),
      body);
  }

  /* ---- 04 modules ---- */
  function secModules() {
    const body = '<div class="ct-grid">' + MODULES.map((m) =>
      '<div class="ct-cardx"><div class="id">' + m.id + '</div><h4>' + P(m.n) + '</h4><p>' + P(m.d) + '</p></div>').join('') + '</div>';
    return H("modules", "04", P(T.secModules),
      P({ en: "Fourteen modules, one operating system for growth.", he: "ארבעה-עשר מודולים, מערכת הפעלה אחת לצמיחה.", ar: "أربع عشرة وحدة، نظام تشغيل واحد للنمو." }),
      P({ en: "Advertising, leads, CRM, sales, website, tracking, content, reputation, accounts, budget, markets, incidents and reporting — connected, not adjacent.",
        he: "פרסום, לידים, CRM, מכירות, אתר, Tracking, תוכן, מוניטין, חשבונות, תקציב, שווקים, אירועים ודוחות — מחוברים, לא סמוכים.",
        ar: "الإعلان والعملاء والـCRM والمبيعات والموقع والتتبّع والمحتوى والسمعة والحسابات والميزانية والأسواق والحوادث والتقارير — مترابطة لا متجاورة." }),
      body);
  }

  /* ---- 05 domains ---- */
  function secDomains() {
    const filt = '<div class="ct-filter" id="ctFilter"><button data-g="all" class="on">' + P(T.allOwners) + '</button>' +
      DGROUPS.map((g) => '<button data-g="' + g.k + '">' + P(g.n) + '</button>').join('') + '</div>';
    const doms = '<div class="ct-doms" id="ctDoms">' + DOMAINS.map((d, i) =>
      '<div class="ct-dom" data-g="' + d.g + '"><div class="n">' + String(i + 1).padStart(2, "0") + '</div>' +
      '<div><div class="t">' + P(d.n) + '</div><div class="o">' + P(d.o) + '</div></div></div>').join('') + '</div>';
    return H("domains", "05", P(T.secDomains),
      P({ en: "Thirty risk domains — every place a business quietly loses money.", he: "שלושים תחומי סיכון — כל מקום שבו עסק מאבד כסף בשקט.", ar: "ثلاثون مجال خطر — كل موضع تخسر فيه الشركة مالاً بصمت." }),
      P({ en: "Each domain is diagnosed the same way: deterministic rules, source data, and a human check. Filter by the function that owns it.",
        he: "כל תחום מאובחן באותו אופן: כללים דטרמיניסטיים, נתוני מקור ובדיקה אנושית. סננו לפי הפונקציה שאחראית עליו.",
        ar: "كل مجال يُشخَّص بالطريقة ذاتها: قواعد حتمية، وبيانات مصدر، وفحص بشري. رشّح حسب الوظيفة المسؤولة." }),
      filt + doms);
  }

  /* ---- 06 scoring ---- */
  function secScoring() {
    const rows = '<div class="ct-rows">' + SCORES.map((s) =>
      '<div class="ct-row"><div class="a">' + s.n + ' <span style="color:var(--turq);font-size:12px">' + s.w + '</span></div>' +
      '<div class="b">' + P(s.d) + '</div></div>').join('') + '</div>';
    const formula = '<div class="ct-formula">Overall Success = <span>25%</span> Funnel Health + <span>20%</span> Marketing + <span>20%</span> Sales + <span>15%</span> CX + <span>10%</span> Implementation + <span>10%</span> Data Trust</div>';
    const bands = '<div class="ct-bands" style="margin-top:26px">' + BANDS.map((b) =>
      '<div class="ct-bandc ' + b.c + '"><div class="rg">' + b.r + '</div><div class="st">' + P(b.s) + '</div><p>' + P(b.a) + '</p></div>').join('') + '</div>';
    const sev = '<div class="ct-formula" style="margin-top:14px">' + P(T.sevMath) +
      ' &nbsp;·&nbsp; Impact <span>1–5</span> × Urgency <span>1–5</span> × Scope <span>1–3</span> × Confidence <span>0.5–1.0</span></div>' +
      '<p class="ct-note" style="margin-top:12px">' + P({
        en: "The confidence factor is what stops the AI from presenting a hypothesis as a fact. Impact includes lost revenue, lead count, legal and reputational exposure, and how long the failure has been running.",
        he: "מקדם הביטחון הוא מה שמונע מה-AI להציג השערה כעובדה. ההשפעה כוללת אובדן הכנסה, מספר לידים, חשיפה משפטית ומוניטינית ומשך התקלה.",
        ar: "معامل الثقة هو ما يمنع الذكاء الاصطناعي من تقديم فرضية كحقيقة. والأثر يشمل الإيراد المفقود وعدد العملاء والتعرّض القانوني والسمعوي ومدة الخلل."
      }) + '</p>';
    return H("scoring", "06", P(T.secScores),
      P({ en: "A business success percentage you can defend.", he: "אחוז הצלחה עסקי שאפשר להגן עליו.", ar: "نسبة نجاح تجاري يمكن الدفاع عنها." }),
      P({ en: "Seven scores, explicit weights, and one hard rule: if Data Trust falls below 60, the system refuses to present a final score as fact and marks it a low-confidence estimate instead.",
        he: "שבעה ציונים, משקלים מפורשים וכלל אחד קשיח: אם ה-Data Trust יורד מ-60, המערכת מסרבת להציג ציון סופי כעובדה ומסמנת אותו כאומדן באמינות נמוכה.",
        ar: "سبع درجات، وأوزان صريحة، وقاعدة صلبة واحدة: إذا هبطت الثقة بالبيانات دون 60، يرفض النظام عرض نتيجة نهائية كحقيقة ويَسِمها تقديراً منخفض الثقة." }),
      rows + formula + bands + sev);
  }

  /* ---- 07 AI ---- */
  function secAI() {
    const roles = '<ul class="chk">' + AIROLES.map((r) => '<li>' + P(r) + '</li>').join('') + '</ul>';
    const layers = '<div class="ct-layers" style="margin-top:30px">' + LAYERS.map((l) =>
      '<div class="ct-layer"><div class="lv">' + l.l + '</div><p>' + P(l.d) + '</p></div>').join('') + '</div>';
    const safety = '<div class="ct-panel" style="margin-top:30px"><div class="eyebrow">' +
      P({ en: "Safety & reliability rules", he: "כללי בטיחות ואמינות", ar: "قواعد السلامة والموثوقية" }) + '</div>' +
      '<ul class="chk" style="margin-top:18px">' + SAFETY.map((s) => '<li>' + P(s) + '</li>').join('') + '</ul></div>';
    return H("ai", "07", P(T.secAI),
      P({ en: "AI that shows its evidence — or says nothing.", he: "AI שמציג את הראיות שלו — או שותק.", ar: "ذكاء اصطناعي يُظهر أدلته — أو يصمت." }),
      P({ en: "The rules engine owns the numbers. The model owns the explanation. Every conclusion carries its source, its version and its confidence, and any financial, legal or public action waits for a human.",
        he: "מנוע הכללים אחראי על המספרים. המודל אחראי על ההסבר. כל מסקנה נושאת מקור, גרסה ורמת ביטחון, וכל פעולה כספית, משפטית או פומבית מחכה לאדם.",
        ar: "محرك القواعد مسؤول عن الأرقام. والنموذج مسؤول عن الشرح. كل استنتاج يحمل مصدره ونسخته ومستوى ثقته، وكل إجراء مالي أو قانوني أو علني ينتظر إنساناً." }),
      roles + layers + safety);
  }

  /* ---- 08 rules ---- */
  function secRules() {
    const body = '<div class="ct-tw"><table class="ct-table"><thead><tr>' +
      '<th>' + P({ en: "Rule", he: "כלל", ar: "القاعدة" }) + '</th>' +
      '<th>' + P({ en: "Condition", he: "תנאי", ar: "الشرط" }) + '</th>' +
      '<th>' + P({ en: "Event / action", he: "אירוע / פעולה", ar: "الحادث / الإجراء" }) + '</th></tr></thead><tbody>' +
      RULES.map((r) => '<tr><td>' + P(r.n) + '</td><td>' + P(r.c) + '</td><td>' + P(r.a) + '</td></tr>').join('') +
      '</tbody></table></div>';
    return H("rules", "08", P(T.secRules),
      P({ en: "Deterministic rules, then alerts with a budget.", he: "כללים דטרמיניסטיים, ואז התראות עם תקציב.", ar: "قواعد حتمية، ثم تنبيهات بميزانية." }),
      P({ en: "Thresholds are code, not opinion. Alerts are deduplicated, given a cooldown and a severity, and capped by an alert budget — because an inbox nobody reads is the same as no monitoring at all.",
        he: "הספים הם קוד, לא דעה. ההתראות מאוחדות, מקבלות Cooldown וחומרה, ומוגבלות ב-Alert Budget — כי תיבה שאף אחד לא קורא שווה לאפס ניטור.",
        ar: "الحدود شيفرة لا رأي. والتنبيهات تُوحَّد وتُمنح فترة تهدئة ودرجة خطورة وتُقيَّد بميزانية تنبيهات — فصندوق لا يقرأه أحد يساوي انعدام المراقبة." }),
      body);
  }

  /* ---- 09 incident ---- */
  function secIncident() {
    const life = '<div class="ct-life">' + LIFE.map((s) =>
      '<div class="s' + (s.key ? ' key' : '') + '">' + P(s.n) + '</div>').join('') + '</div>';
    const fields = '<div class="ct-rows" style="margin-top:26px">' + INCFIELDS.map((f) =>
      '<div class="ct-row"><div class="a">' + P(f.a) + '</div><div class="b">' + P(f.b) + '</div></div>').join('') + '</div>';
    return H("incident", "09", P(T.secIncident),
      P({ en: "From detected to verified closed — nothing skips a step.", he: "מזוהה עד אימות סגירה — בלי לדלג על שלב.", ar: "من الاكتشاف إلى التحقق من الإغلاق — دون تجاوز خطوة." }),
      P({ en: "Every incident carries an owner, an SLA, its evidence, a root cause or an explicit \"not yet determined\", a corrective and a preventive action — and it cannot be closed without a documented verification.",
        he: "לכל אירוע יש אחראי, SLA, ראיות, Root Cause או \"טרם נקבע\" במפורש, פעולה מתקנת ופעולה מונעת — ולא ניתן לסגור אותו בלי אימות מתועד.",
        ar: "كل حادث يحمل مسؤولاً وSLA وأدلته وسبباً جذرياً أو \"لم يُحدَّد بعد\" صراحةً وإجراءً تصحيحياً ووقائياً — ولا يمكن إغلاقه دون تحقّق موثّق." }),
      life + fields);
  }

  /* ---- 10 integrations ---- */
  function secIntegrations() {
    const body = '<div class="ct-tw"><table class="ct-table"><thead><tr>' +
      '<th>' + P({ en: "System", he: "מערכת", ar: "النظام" }) + '</th>' +
      '<th>' + P({ en: "Data", he: "נתונים", ar: "البيانات" }) + '</th>' +
      '<th>' + P({ en: "Target frequency", he: "תדירות יעד", ar: "وتيرة الهدف" }) + '</th></tr></thead><tbody>' +
      INTEG.map((i) => '<tr><td>' + P(i.s) + '</td><td>' + P(i.d) + '</td><td>' + P(i.f) + '</td></tr>').join('') +
      '</tbody></table></div><p class="ct-note" style="margin-top:14px">' + P(CONNNOTE) + '</p>';
    return H("integrations", "10", P(T.secIntegrations),
      P({ en: "Connectors that fail loudly.", he: "Connectors שנכשלים בקול.", ar: "موصلات تفشل بصوت عالٍ." }),
      P({ en: "A silent integration failure is the most expensive bug in marketing operations, because everything downstream keeps looking normal. Every connector is monitored, retried, queued and alerted.",
        he: "כשל שקט באינטגרציה הוא הבאג היקר ביותר בתפעול שיווקי, כי כל מה שאחריו ממשיך להיראות תקין. כל Connector מנוטר, חוזר לנסות, נכנס לתור ומתריע.",
        ar: "الفشل الصامت في التكامل هو أغلى عِلّة في تشغيل التسويق، لأن كل ما يليه يبدو طبيعياً. كل موصل مراقَب ويعيد المحاولة ويدخل الطابور ويُنبّه." }),
      body);
  }

  /* ---- 11 KPIs ---- */
  function secKPIs() {
    const body = '<div class="ct-rows">' + KPIS.map((k) =>
      '<div class="ct-row"><div class="a">' + k.k + '</div><div class="b">' + P(k.d) + '</div></div>').join('') + '</div>';
    return H("kpis", "11", P(T.secKPIs),
      P({ en: "One definition per metric, agreed before the first dashboard.", he: "הגדרה אחת לכל מדד, מוסכמת לפני הדשבורד הראשון.", ar: "تعريف واحد لكل مقياس، متّفق عليه قبل أول لوحة." }),
      P({ en: "Most reporting arguments are definition arguments. These are locked in a data dictionary, so a number means the same thing in marketing, in sales and in the board report.",
        he: "רוב הוויכוחים על דוחות הם ויכוחים על הגדרות. ההגדרות נעולות ב-Data Dictionary, כך שמספר אומר אותו דבר בשיווק, במכירות ובדוח ההנהלה.",
        ar: "معظم الجدال حول التقارير جدال حول التعريفات. هذه مقفلة في قاموس بيانات، فيعني الرقم الشيء ذاته في التسويق والمبيعات وتقرير الإدارة." }),
      body);
  }

  /* ---- 12 assessment ---- */
  function secAssessment() {
    const vals = '<div class="ct-bands">' + ASSESSVALS.slice(0, 4).map((v, i) =>
      '<div class="ct-bandc ' + ["green", "yellow", "orange", "red"][i] + '"><div class="rg">' + v.s + '</div>' +
      '<div class="st">' + P(v.v) + '</div><p>' + P(v.d) + '</p></div>').join('') + '</div>' +
      '<p class="ct-note" style="margin-top:12px">' + P(ASSESSVALS[4].v) + ' — ' + P(ASSESSVALS[4].d) + '</p>';
    const qs = '<div class="ct-tw" style="margin-top:26px"><table class="ct-table"><thead><tr>' +
      '<th>' + P({ en: "Area", he: "תחום", ar: "المجال" }) + '</th>' +
      '<th>' + P({ en: "Control question", he: "שאלת בקרה", ar: "سؤال الرقابة" }) + '</th>' +
      '<th>' + P({ en: "Evidence required", he: "ראיה נדרשת", ar: "الدليل المطلوب" }) + '</th></tr></thead><tbody>' +
      ASSESSQS.map((q) => '<tr><td>' + P(q.a) + '</td><td style="color:var(--ink-2)">' + P(q.q) + '</td><td>' + P(q.e) + '</td></tr>').join('') +
      '</tbody></table></div>';
    return H("assessment", "12", P(T.secAssessment),
      P({ en: "An answer without evidence is marked unverified.", he: "תשובה ללא ראיה מסומנת \"לא מאומת\".", ar: "إجابة بلا دليل تُوسم \"غير مُتحقَّقة\"." }),
      P({ en: "The assessment runs at setup and then as a periodic audit. Every question is tied to a piece of evidence — an API value, a document, a system check or a role-holder's confirmation — and feeds the Implementation Score.",
        he: "השאלון מופעל בהקמה ואז כביקורת תקופתית. כל שאלה מקושרת לראיה — נתון API, מסמך, בדיקת מערכת או אישור בעל תפקיד — ומזינה את ה-Implementation Score.",
        ar: "يُجرى الاستبيان عند الإعداد ثم كتدقيق دوري. كل سؤال مرتبط بدليل — قيمة من واجهة، أو مستند، أو فحص نظام، أو تأكيد صاحب دور — ويغذّي درجة التطبيق." }),
      vals + qs);
  }

  /* ---- 13 roadmap ---- */
  function secRoadmap() {
    const ph = '<div class="ct-phases">' + PHASES.map((p) =>
      '<div class="ct-phase"><div class="p">' + p.p + '</div>' +
      '<div><h4>' + P(p.n) + '</h4><div class="dur">' + P(p.dur) + '</div></div>' +
      '<div class="sc">' + P(p.sc) + '</div><div class="out">' + P(p.out) + '</div></div>').join('') + '</div>';
    const pr = '<div class="ct-prios">' + PRIOS.map((p) =>
      '<div class="ct-prio"><div class="p0">' + p.p + '</div><p>' + P(p.d) + '</p></div>').join('') + '</div>';
    return H("roadmap", "13", P(T.secRoadmap),
      P({ en: "Six phases. A working pilot before the AI layer.", he: "שישה שלבים. Pilot עובד לפני שכבת ה-AI.", ar: "ست مراحل. تجربة عاملة قبل طبقة الذكاء الاصطناعي." }),
      P({ en: "Data first, decisions second, AI third. The advisor only earns trust once the numbers underneath it are verifiable.",
        he: "קודם נתונים, אחר כך החלטות, ואז AI. היועץ זוכה לאמון רק כשהמספרים שמתחתיו ניתנים לאימות.",
        ar: "البيانات أولاً، ثم القرارات، ثم الذكاء الاصطناعي. لا يكسب المستشار الثقة إلا حين تصبح الأرقام تحته قابلة للتحقق." }),
      ph + pr);
  }

  /* ---- 14 NFR ---- */
  function secNFR() {
    const body = '<div class="ct-rows">' + NFR.map((n) =>
      '<div class="ct-row"><div class="a">' + P(n.a) + '</div><div class="b">' + P(n.b) + '</div></div>').join('') + '</div>';
    return H("standards", "14", P(T.secNFR),
      P({ en: "Multi-tenant, auditable, accessible, RTL-native.", he: "Multi-tenant, בר-אודיט, נגיש ו-RTL מלידה.", ar: "متعدد المستأجرين، قابل للتدقيق، متاح، وRTL أصالةً." }),
      "", body);
  }

  /* ---- 15 acceptance ---- */
  function secAC() {
    const body = '<ul class="ct-ac">' + AC.map((a, i) =>
      '<li><b>AC-' + String(i + 1).padStart(2, "0") + '</b><span>' + P(a) + '</span></li>').join('') + '</ul>';
    return H("acceptance", "15", P(T.secAC),
      P({ en: "Twelve criteria. Anything less is a dashboard, not a control tower.", he: "שנים-עשר קריטריונים. פחות מזה הוא דשבורד, לא חדר בקרה.", ar: "اثنا عشر معياراً. وما دون ذلك لوحة عرض لا غرفة قيادة." }),
      "", body);
  }

  /* ---- 16 decisions + CTA ---- */
  function secDecisions() {
    const body = '<ul class="ct-qs">' + DECISIONS.map((d) => '<li>' + P(d) + '</li>').join('') + '</ul>';
    const cta = '<section class="section" id="talk"><div class="container container--narrow ct-cta">' +
      '<h2 class="reveal gradient-text">' + P({ en: "Let's map your funnel first.", he: "בואו נמפה קודם את המשפך שלך.", ar: "لنرسم مسارك أولاً." }) + '</h2>' +
      '<p class="lead reveal" data-delay="1">' + P({
        en: "Send us your channels, your CRM and your current numbers. We will come back with where the money is leaking, who owns each leak, and what the first 30 days look like.",
        he: "שלחו לנו את הערוצים, ה-CRM והמספרים הנוכחיים. נחזור עם המקומות שבהם הכסף נוזל, מי אחראי לכל נזילה, ואיך נראים 30 הימים הראשונים.",
        ar: "أرسل لنا قنواتك ونظام الـCRM وأرقامك الحالية. سنعود بموضع تسرّب المال، ومَن المسؤول عن كل تسرّب، وكيف تبدو الثلاثون يوماً الأولى."
      }) + '</p>' +
      '<div class="btn-row reveal" data-delay="2" style="justify-content:center">' +
      '<a href="../#contact" class="btn btn--primary" data-cursor="Talk">' + P({ en: "Book a discovery call", he: "לתאם שיחת Discovery", ar: "حدّد جلسة استكشاف" }) + '</a>' +
      '<a href="../x-ray/" class="btn btn--ghost" data-cursor="X-Ray">' + P({ en: "Run the Business X-Ray", he: "להריץ Business X-Ray", ar: "شغّل تشخيص الأعمال" }) + '</a></div>' +
      '<div class="ct-def reveal" data-delay="3">' + P({
        en: "Success, defined: <b>the right leads</b> + <b>controlled cost</b> + <b>fast, professional handling</b> + <b>conversion into revenue</b> + <b>good service</b> + <b>data you can trust</b>.",
        he: "הגדרת הצלחה: <b>לידים מתאימים</b> + <b>עלות נשלטת</b> + <b>טיפול מהיר ומקצועי</b> + <b>המרה להכנסה</b> + <b>שירות טוב</b> + <b>נתונים אמינים</b>.",
        ar: "تعريف النجاح: <b>عملاء مناسبون</b> + <b>تكلفة مضبوطة</b> + <b>معالجة سريعة ومهنية</b> + <b>تحويل إلى إيراد</b> + <b>خدمة جيدة</b> + <b>بيانات موثوقة</b>."
      }) + '</div></div></section>';
    return H("decisions", "16", P(T.secDecisions),
      P({ en: "Eight decisions to lock before a single line of code.", he: "שמונה החלטות לקבע לפני שורת קוד אחת.", ar: "ثمانية قرارات تُحسم قبل أول سطر شيفرة." }),
      P({ en: "Most failed implementations fail here, not in engineering. These answers define the data model, the scoring weights and what the AI is allowed to do on its own.",
        he: "רוב ההטמעות הכושלות נכשלות כאן, לא בפיתוח. התשובות האלה מגדירות את מודל הנתונים, את משקלי הציונים ומה ה-AI רשאי לעשות לבד.",
        ar: "معظم التطبيقات الفاشلة تفشل هنا، لا في الهندسة. هذه الأجوبة تحدّد نموذج البيانات وأوزان التقييم وما يُسمح للذكاء الاصطناعي بفعله وحده." }),
      body) + cta;
  }
  /* ===================== 03 Cockpit ===================== */
  let scenIdx = 0, incIdx = 0;

  const sevBand = (v) => (v >= 45 ? "critical" : v >= 25 ? "high" : v >= 12 ? "medium" : "low");
  const scoreBand = (v) => (v >= 85 ? "green" : v >= 70 ? "yellow" : v >= 50 ? "orange" : "red");
  const bandLabel = (b) => P(b === "critical" ? T.critical : b === "high" ? T.high : b === "medium" ? T.medium : T.low);
  const nf = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  function ring(v, band) {
    const C = 2 * Math.PI * 66;
    const off = C * (1 - Math.max(0, Math.min(100, v)) / 100);
    const col = { green: "var(--lime)", yellow: "var(--yellow)", orange: "var(--brand)", red: "var(--coral)" }[band];
    return '<div class="ct-ring"><svg viewBox="0 0 148 148" aria-hidden="true">' +
      '<circle class="trk" cx="74" cy="74" r="66"></circle>' +
      '<circle class="val" cx="74" cy="74" r="66" stroke="' + col + '" ' +
      'stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + C.toFixed(1) + '" data-off="' + off.toFixed(1) + '"></circle>' +
      '</svg><div><b>' + v + '</b><div class="of">/ 100</div></div></div>';
  }

  function advisorHTML(inc) {
    const sev = inc.I * inc.U * inc.S * inc.C;
    const band = sevBand(sev);
    return '<div class="ct-adv">' +
      '<div class="ct-adv__head"><span class="who">' + P(T.advisor) + '</span>' +
      '<span class="ct-tag fact">' + P(T.tFact) + '</span><span class="ct-tag est">' + P(T.tEst) + '</span>' +
      '<span class="ct-tag reco">' + P(T.tReco) + '</span>' +
      (inc.approval ? '<span class="ct-tag appr">' + P(T.tAppr) + '</span>' : '') + '</div>' +

      '<div class="ct-owners">' +
      '<span class="o">' + P(T.domain) + ': <b>' + P(inc.dom) + '</b></span>' +
      '<span class="o">' + P(T.stage) + ': <b>' + P(inc.stage) + '</b></span>' +
      '<span class="o">' + P(T.owner) + ': <b>' + P(inc.own) + '</b></span>' +
      (inc.appr ? '<span class="o">' + P(T.approver) + ': <b>' + P(inc.appr) + '</b></span>' : '') +
      '<span class="o">' + P(T.conf) + ': <b>' + Math.round(inc.C * 100) + '%</b></span>' +
      '<span class="o">Severity: <b>' + sev.toFixed(1) + '</b> · ' + bandLabel(band) + '</span></div>' +

      '<div class="ct-blk"><div class="h"><b>' + P(T.whatHappened) + '</b><span class="ct-tag fact">' + P(T.tFact) + '</span></div><p>' + P(inc.what) + '</p></div>' +
      '<div class="ct-blk"><div class="h"><b>' + P(T.whyMatters) + '</b><span class="ct-tag est">' + P(T.tEst) + '</span></div><p>' + P(inc.why) + '</p></div>' +
      '<div class="ct-blk"><div class="h"><b>' + P(T.evidence) + '</b></div><ul class="ct-ev">' +
        inc.ev.map((e) => '<li>' + P(e) + '</li>').join('') + '</ul></div>' +
      '<div class="ct-blk"><div class="h"><b>' + P(T.rootCause) + '</b><span class="ct-tag est">' + P(T.tEst) + '</span></div>' +
        '<div class="ct-rc">' + inc.rc.map((r) =>
          '<div class="r"><div class="t">' + P(r.t) + '</div><div class="p">' + r.p + '%</div>' +
          '<div class="bar"><i data-w="' + r.p + '"></i></div></div>').join('') + '</div></div>' +
      '<div class="ct-act">' +
        '<div class="a"><div class="k">' + P(T.corrective) + '</div><p>' + P(inc.corr) + '</p></div>' +
        '<div class="a"><div class="k">' + P(T.preventive) + '</div><p>' + P(inc.prev) + '</p></div>' +
      '</div>' +
      '<div class="ct-blk"><div class="h"><b>' + P(T.verify) + '</b><span class="ct-tag reco">' + P(T.tReco) + '</span></div><p>' + P(inc.ver) + '</p></div>' +
      '</div>';
  }

  function cockBodyHTML() {
    const s = SCEN[scenIdx];
    const band = scoreBand(s.overall);
    const max = Math.max.apply(null, s.funnel);

    const score = '<div class="ct-score">' + ring(s.overall, band) +
      '<div class="lbl">' + P(T.overall) + '</div>' +
      '<div class="ct-band ' + band + '">' + (s.gated
        ? P({ en: "Low-confidence estimate", he: "אומדן באמינות נמוכה", ar: "تقدير منخفض الثقة" })
        : P(BANDS.find((b) => b.c === band).s)) + '</div></div>';

    const tiles = '<div class="ct-tiles">' + s.kpis.map((k) =>
      '<div class="ct-tile"><div class="k">' + P(k.k) + '</div><div class="v">' + P(k.v) + '</div>' +
      '<div class="d ' + k.dir + '">' + P(k.d) + '</div>' +
      '<div class="meter"><i data-w="' + k.m + '" style="background:' +
      (k.m >= 70 ? "var(--lime)" : k.m >= 45 ? "var(--yellow)" : "var(--coral)") + '"></i></div></div>').join('') + '</div>';

    const gate = s.gated ? '<div class="ct-gate"><div class="ico">⚠</div><p><b>Data Trust ' + s.trust + '/100.</b> ' + P(T.trustGate) + '</p></div>' : '';

    const funnel = '<div><div class="eyebrow" style="margin-bottom:14px">' + P(T.funnelTitle) + '</div><div class="ct-funnel">' +
      s.funnel.map((v, i) => {
        const leak = s.leaks[i];
        return '<div class="ct-fstep' + (leak ? ' leak' : '') + '">' +
          '<div class="row"><span class="l">' + P(FSTEPS[i]) + '</span><span class="n">' + nf(v) + '</span></div>' +
          '<div class="trk"><i data-w="' + Math.max(1.5, (v / max) * 100).toFixed(2) + '"></i></div>' +
          (leak ? '<div class="ct-leak">' + P(leak) + '</div>' : '') + '</div>';
      }).join('') + '</div></div>';

    const incs = '<div><div class="eyebrow" style="margin-bottom:6px">' + P(T.incTitle) + '</div>' +
      '<p class="ct-note" style="margin-bottom:14px">' + P(T.incHint) + '</p><div class="ct-inc">' +
      s.inc.map((inc, i) => {
        const sev = inc.I * inc.U * inc.S * inc.C, b = sevBand(sev);
        return '<button class="ct-incrow' + (i === incIdx ? ' on' : '') + '" data-inc="' + i + '" aria-pressed="' + (i === incIdx) + '">' +
          '<span class="ct-sev ' + b + '">' + sev.toFixed(0) + '<small>' + bandLabel(b) + '</small></span>' +
          '<span><span class="ti">' + P(inc.title) + '</span><span class="me">' +
            '<span>' + P(inc.dom) + '</span><span>· ' + P(T.owner) + ': ' + P(inc.own) + '</span>' +
            '<span>· ' + P(T.conf) + ' ' + Math.round(inc.C * 100) + '%</span></span></span>' +
          '<span class="go">→</span></button>';
      }).join('') + '</div></div>';

    return score + tiles + gate + funnel + incs + advisorHTML(s.inc[incIdx]);
  }

  function paintCockBody() {
    const body = $("#ctBody");
    if (!body) return;
    body.innerHTML = cockBodyHTML();
    /* wrap score + tiles into the two-column top row */
    const score = $(".ct-score", body), tiles = $(".ct-tiles", body);
    if (score && tiles) {
      const top = document.createElement("div");
      top.className = "ct-cock__top";
      body.insertBefore(top, score);
      top.appendChild(score); top.appendChild(tiles);
    }
    const grow = () => {
      $$("[data-w]", body).forEach((el) => { el.style.width = el.getAttribute("data-w") + "%"; });
      const r = $(".ct-ring .val", body);
      if (r) r.style.strokeDashoffset = r.getAttribute("data-off");
    };
    if (reduce) grow(); else requestAnimationFrame(() => requestAnimationFrame(grow));
    $$(".ct-incrow", body).forEach((b) => b.addEventListener("click", () => {
      incIdx = parseInt(b.getAttribute("data-inc"), 10) || 0;
      paintCockBody();
      const adv = $(".ct-adv");
      if (adv && !reduce) adv.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }));
  }

  function secCockpit() {
    const tabs = '<div class="ct-scn" id="ctScn">' + SCEN.map((s, i) =>
      '<button data-s="' + i + '"' + (i === scenIdx ? ' class="on"' : '') + '>' + P(s.tab) + '</button>').join('') + '</div>';
    const shell = '<div class="ct-cock">' +
      '<div class="ct-cock__bar"><span class="dots"><i></i><i></i><i></i></span>' +
      '<span class="ttl">' + P(T.cockTitle) + '</span>' +
      '<span class="live"><i></i>' + P(T.cockLive) + '</span></div>' +
      tabs + '<div class="ct-cock__body" id="ctBody"></div></div>' +
      '<p class="ct-note" style="margin-top:14px">' + P(T.demoNote) + '</p>';
    return H("cockpit", "03", P(T.secCockpit),
      P({ en: "The same week, seen from the control tower.", he: "אותו שבוע, במבט מחדר הבקרה.", ar: "الأسبوع نفسه، بعين غرفة القيادة." }),
      P({ en: "Four situations every business recognises. Pick one and follow it end to end: the score, the reliability of the data behind it, where the funnel leaks, and the AI analysis with its evidence, its ranked root causes and the owner who has to act.",
        he: "ארבעה מצבים שכל עסק מכיר. בחרו אחד ועקבו אחריו מקצה לקצה: הציון, אמינות הנתונים שמאחוריו, איפה המשפך נוזל, וניתוח ה-AI עם הראיות, שורשי הבעיה המדורגים והאחראי שצריך לפעול.",
        ar: "أربع حالات تعرفها كل شركة. اختر واحدة وتابعها من طرف إلى طرف: النتيجة، وموثوقية البيانات وراءها، وموضع تسرّب المسار، وتحليل الذكاء الاصطناعي بأدلته وأسبابه الجذرية المرتّبة والمسؤول الذي يجب أن يتحرّك." }),
      shell);
  }

  /* ===================== Render + wire ===================== */
  function reveal(root) {
    const els = $$(".reveal", root);
    if (reduce || !("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
    els.forEach((e) => io.observe(e));
  }

  function render() {
    const app = $("#ctApp");
    if (!app) return;
    app.innerHTML = secPrinciple() + secJourney() + secCockpit() + secModules() + secDomains() +
      secScoring() + secAI() + secRules() + secIncident() + secIntegrations() + secKPIs() +
      secAssessment() + secRoadmap() + secNFR() + secAC() + secDecisions();

    paintCockBody();

    $$("#ctScn button").forEach((b) => b.addEventListener("click", () => {
      scenIdx = parseInt(b.getAttribute("data-s"), 10) || 0;
      incIdx = 0;
      $$("#ctScn button").forEach((x) => x.classList.toggle("on", x === b));
      paintCockBody();
    }));

    const filter = $("#ctFilter");
    if (filter) filter.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      const g = b.getAttribute("data-g");
      $$("#ctFilter button").forEach((x) => x.classList.toggle("on", x === b));
      $$("#ctDoms .ct-dom").forEach((d) => d.classList.toggle("dim", g !== "all" && d.getAttribute("data-g") !== g));
    });

    reveal(app);
  }

  render();
  /* app.js applyLang flips <html lang>; re-render so every string is native */
  new MutationObserver(() => render()).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  const ql = new URLSearchParams(location.search).get("lang");
  if (ql && LANGS.includes(ql)) {
    const b = document.querySelector('.lang button[data-lang="' + ql + '"]');
    if (b && document.documentElement.lang !== ql) b.click();
  }
})();
