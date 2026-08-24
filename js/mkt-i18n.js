/* DRIFTX AI Marketing — system strings (EN / HE / AR).
   Every value is [en, he, ar]. Missing = falls back to en.
   Placeholders: {x} replaced from the vars object passed to T(). */
window.MKT_STR = {
  /* ---------- shell / nav ---------- */
  "app.name": ["DriftX AI Marketing", "DriftX AI Marketing", "DriftX AI Marketing"],
  "app.tag": ["System", "מערכת", "نظام"],
  "nav.dashboard": ["Dashboard", "דשבורד", "لوحة القيادة"],
  "nav.diagnosis": ["AI diagnosis", "אבחון AI", "التشخيص الذكي"],
  "nav.funnel": ["Funnel", "משפך", "المسار"],
  "nav.campaigns": ["Campaigns", "קמפיינים", "الحملات"],
  "nav.leads": ["Leads", "לידים", "العملاء"],
  "nav.team": ["Sales & team", "מכירות וצוות", "المبيعات والفريق"],
  "nav.issues": ["Issues & alerts", "בעיות והתראות", "المشكلات والتنبيهات"],
  "nav.tasks": ["Action plan", "תוכנית פעולה", "خطة العمل"],
  "nav.web": ["Site & tracking", "אתר ו-Tracking", "الموقع والتتبّع"],
  "nav.reputation": ["Content & reputation", "תוכן ומוניטין", "المحتوى والسمعة"],
  "nav.knowledge": ["DriftX knowledge", "מרכז הידע", "مركز المعرفة"],
  "nav.implementation": ["Implementation %", "אחוז יישום", "نسبة التطبيق"],
  "nav.reports": ["Reports", "דוחות", "التقارير"],
  "nav.settings": ["Settings & connections", "הגדרות וחיבורים", "الإعدادات والاتصالات"],
  "nav.grpOps": ["Operations", "תפעול", "التشغيل"],
  "nav.grpAnalyse": ["Analysis", "ניתוח", "التحليل"],
  "nav.grpImprove": ["Improvement", "שיפור", "التحسين"],
  "nav.support": ["Support", "תמיכה", "الدعم"],
  "nav.logout": ["Sign out", "התנתקות", "تسجيل الخروج"],
  "nav.theme": ["Theme", "מצב תצוגה", "المظهر"],

  /* ---------- top bar ---------- */
  "top.range": ["Date range", "טווח תאריכים", "المدى الزمني"],
  "top.d7": ["Last 7 days", "7 ימים אחרונים", "آخر 7 أيام"],
  "top.d30": ["Last 30 days", "30 ימים אחרונים", "آخر 30 يوماً"],
  "top.d90": ["Last 90 days", "90 ימים אחרונים", "آخر 90 يوماً"],
  "top.allCountries": ["All countries", "כל המדינות", "كل الدول"],
  "top.allSources": ["All sources", "כל המקורות", "كل المصادر"],
  "top.allDepts": ["All departments", "כל המחלקות", "كل الأقسام"],
  "top.rerun": ["Re-run diagnosis", "בצע אבחון מחדש", "أعد التشخيص"],
  "top.report": ["Generate report", "הפק דוח", "أنشئ تقريراً"],
  "top.alerts": ["Alerts", "התראות", "التنبيهات"],

  /* ---------- auth ---------- */
  "auth.title": ["Sign in to the system", "כניסה למערכת", "الدخول إلى النظام"],
  "auth.sub": ["Marketing & sales performance control", "בקרת ביצועי שיווק ומכירות", "رقابة أداء التسويق والمبيعات"],
  "auth.email": ["Work email", "אימייל בעבודה", "البريد المهني"],
  "auth.pass": ["Password", "סיסמה", "كلمة المرور"],
  "auth.remember": ["Remember me", "זכור אותי", "تذكّرني"],
  "auth.forgot": ["Forgot password", "שכחתי סיסמה", "نسيت كلمة المرور"],
  "auth.signin": ["Sign in", "כניסה", "دخول"],
  "auth.google": ["Continue with Google", "המשך עם Google", "المتابعة عبر Google"],
  "auth.or": ["or", "או", "أو"],
  "auth.2fa": ["Two-factor authentication", "אימות דו-שלבי", "التحقق بخطوتين"],
  "auth.needBackend": [
    "Google sign-in, password reset and two-factor authentication need the DriftX server. They are switched off in this build.",
    "כניסה עם Google, איפוס סיסמה ואימות דו-שלבי דורשים את שרת DriftX. הם כבויים בגרסה הזו.",
    "الدخول عبر Google وإعادة تعيين كلمة المرور والتحقق بخطوتين تتطلب خادم DriftX، وهي معطّلة في هذه النسخة."
  ],
  "auth.localOnly": [
    "This build runs entirely in your browser. Your email is stored locally to name the session — the password field is not read, not stored and not sent anywhere.",
    "הגרסה הזו רצה כולה בדפדפן שלך. האימייל נשמר מקומית כדי לזהות את הסשן — שדה הסיסמה לא נקרא, לא נשמר ולא נשלח לשום מקום.",
    "هذه النسخة تعمل بالكامل في متصفحك. يُخزَّن البريد محلياً لتسمية الجلسة — أما حقل كلمة المرور فلا يُقرأ ولا يُخزَّن ولا يُرسل."
  ],
  "auth.enter": ["Open the system", "כניסה למערכת", "افتح النظام"],
  "auth.emailReq": ["Enter an email address to continue.", "הזן כתובת אימייל כדי להמשיך.", "أدخل بريداً إلكترونياً للمتابعة."],
  "auth.backSite": ["Back to driftx.co", "חזרה ל-driftx.co", "العودة إلى driftx.co"],

  /* ---------- onboarding ---------- */
  "ob.title": ["Set up your business", "הקמת העסק", "إعداد عملك"],
  "ob.sub": [
    "Five steps. Nothing is diagnosed before the system knows your business, your structure, your sources and your targets.",
    "חמישה שלבים. המערכת לא מאבחנת דבר לפני שהיא מכירה את העסק, המבנה, המקורות והיעדים שלך.",
    "خمس خطوات. لا يشخّص النظام شيئاً قبل أن يعرف عملك وهيكلك ومصادرك وأهدافك."
  ],
  "ob.s1": ["Business", "פרטי העסק", "بيانات العمل"],
  "ob.s2": ["Structure", "מבנה החברה", "هيكل الشركة"],
  "ob.s3": ["Connections", "חיבורים", "الاتصالات"],
  "ob.s4": ["Targets", "יעדים", "الأهداف"],
  "ob.s5": ["Assessment", "שאלון אבחון", "استبيان التشخيص"],
  "ob.next": ["Continue", "המשך", "متابعة"],
  "ob.back": ["Back", "חזרה", "رجوع"],
  "ob.finish": ["Finish & open the dashboard", "סיום ופתיחת הדשבורד", "إنهاء وفتح اللوحة"],
  "ob.skip": ["Skip for now", "לדלג בשלב זה", "تخطَّ الآن"],
  "ob.req": ["Business name and industry are required.", "שם העסק ותחום הפעילות הם שדות חובה.", "اسم العمل ومجال النشاط حقلان مطلوبان."],
  "ob.bizName": ["Business name", "שם העסק", "اسم العمل"],
  "ob.industry": ["Industry", "תחום פעילות", "مجال النشاط"],
  "ob.website": ["Website", "אתר אינטרנט", "الموقع الإلكتروني"],
  "ob.countries": ["Countries you operate in", "מדינות פעילות", "دول النشاط"],
  "ob.langs": ["Operating languages", "שפות פעילות", "لغات النشاط"],
  "ob.employees": ["Employees", "מספר עובדים", "عدد الموظفين"],
  "ob.reps": ["Salespeople", "אנשי מכירות", "مندوبو المبيعات"],
  "ob.revenue": ["Estimated monthly revenue", "מחזור חודשי משוער", "الإيراد الشهري المقدّر"],
  "ob.budget": ["Monthly marketing budget", "תקציב שיווק חודשי", "ميزانية التسويق الشهرية"],
  "ob.services": ["Main services or products", "שירותים או מוצרים עיקריים", "الخدمات أو المنتجات الرئيسية"],
  "ob.avgDeal": ["Average deal value", "מחיר עסקה ממוצע", "متوسط قيمة الصفقة"],
  "ob.leadsMo": ["Monthly leads", "לידים בחודש", "العملاء شهرياً"],
  "ob.dealsMo": ["Monthly deals", "עסקאות בחודש", "الصفقات شهرياً"],
  "ob.goals": ["Business goals", "מטרות העסק", "أهداف العمل"],
  "ob.currency": ["Currency", "מטבע", "العملة"],
  "ob.deptsTitle": ["Which departments exist?", "אילו מחלקות קיימות?", "أي الأقسام موجودة؟"],
  "ob.deptsSub": [
    "Ownership is assigned per department, so a failure is never charged to the wrong team.",
    "האחריות מוקצית לפי מחלקה, כדי שכשל לא יירשם על הצוות הלא נכון.",
    "تُسند المسؤولية حسب القسم، حتى لا يُحمَّل الخلل على الفريق الخطأ."
  ],
  "ob.deptOwner": ["Owner name", "שם האחראי", "اسم المسؤول"],
  "ob.deptPeople": ["People", "עובדים", "الموظفون"],
  "ob.connTitle": ["Connect your data sources", "חיבור מקורות הנתונים", "اربط مصادر بياناتك"],
  "ob.connSub": [
    "Live tokens require the DriftX server. In this build a connection is marked as connected locally and fed by the demo dataset, and every screen tells you which mode it is in.",
    "טוקנים אמיתיים דורשים את שרת DriftX. בגרסה הזו חיבור מסומן כמחובר מקומית ומוזן ממערך נתוני הדמו, וכל מסך מציין באיזה מצב הוא נמצא.",
    "الرموز الحقيقية تتطلب خادم DriftX. في هذه النسخة يُوسم الاتصال كموصول محلياً ويُغذّى من بيانات العرض، وكل شاشة تبيّن الوضع الذي تعمل به."
  ],
  "ob.targetsSub": [
    "These become the thresholds of the rules engine. Every alert in the system is measured against the numbers you set here.",
    "אלה הופכים לספים של מנוע הכללים. כל התראה במערכת נמדדת מול המספרים שתגדיר כאן.",
    "تصبح هذه حدود محرك القواعد. كل تنبيه في النظام يُقاس مقابل الأرقام التي تحدّدها هنا."
  ],
  "ob.assessSub": [
    "Answer what is really running, not what is planned. An answer without evidence is scored as unverified.",
    "ענה על מה שמתקיים בפועל, לא על מה שמתוכנן. תשובה ללא ראיה נחשבת \"לא מאומת\".",
    "أجب عمّا يجري فعلاً، لا عمّا هو مخطّط. الإجابة بلا دليل تُحسب \"غير مُتحقَّقة\"."
  ],
  "ob.evidence": ["Evidence", "ראיה", "الدليل"],
  "ob.answered": ["{n} of {t} answered", "{n} מתוך {t} נענו", "أُجيب عن {n} من {t}"],

  /* ---------- targets ---------- */
  "tg.leads": ["Monthly lead target", "יעד לידים חודשי", "هدف العملاء الشهري"],
  "tg.qleads": ["Qualified lead target", "יעד לידים איכותיים", "هدف العملاء المؤهّلين"],
  "tg.cpl": ["Target CPL", "CPL רצוי", "تكلفة العميل المستهدفة"],
  "tg.cpql": ["Max cost per qualified lead", "עלות מקסימלית לליד איכותי", "الحد الأقصى لتكلفة العميل المؤهّل"],
  "tg.resp": ["Max first response (minutes)", "זמן תגובה מקסימלי (דקות)", "أقصى زمن استجابة (دقائق)"],
  "tg.contact": ["Target contact rate %", "אחוז יצירת קשר רצוי", "نسبة التواصل المستهدفة %"],
  "tg.appt": ["Target appointment rate %", "אחוז קביעת פגישה", "نسبة تحديد المواعيد %"],
  "tg.close": ["Target close rate %", "אחוז סגירת עסקה", "نسبة إغلاق الصفقات %"],
  "tg.revenue": ["Revenue target", "יעד הכנסה", "هدف الإيراد"],
  "tg.cac": ["Target CAC", "CAC רצוי", "تكلفة الاستحواذ المستهدفة"],
  "tg.roas": ["Target ROAS", "ROAS רצוי", "ROAS المستهدف"],
  "tg.attempts": ["Min follow-up attempts", "מספר ניסיונות מינימלי", "أدنى عدد محاولات متابعة"],

  /* ---------- dashboard ---------- */
  "dash.hi": ["Good day, {name}. Here is the state of your marketing and sales.", "יום טוב, {name}. הנה מצב מערך השיווק והמכירות שלך.", "يومك سعيد، {name}. هذه حالة منظومة التسويق والمبيعات لديك."],
  "dash.overall": ["Overall success score", "ציון הצלחה כללי", "نسبة النجاح العامة"],
  "dash.trust": ["Data reliability", "אמינות נתונים", "موثوقية البيانات"],
  "dash.updated": ["Updated {t}", "עודכן {t}", "حُدّث {t}"],
  "dash.vsPrev": ["vs previous period", "מול התקופה הקודמת", "مقابل الفترة السابقة"],
  "dash.mkHealth": ["Marketing health", "בריאות השיווק", "صحة التسويق"],
  "dash.salesPerf": ["Sales performance", "ביצועי מכירות", "أداء المبيعات"],
  "dash.cx": ["Customer experience", "חוויית לקוח", "تجربة العميل"],
  "dash.impl": ["DriftX implementation", "יישום שיטת DriftX", "تطبيق منهج DriftX"],
  "dash.needsNow": ["What needs attention now", "מה דורש טיפול עכשיו", "ما يحتاج معالجة الآن"],
  "dash.todayAI": ["AI recommendations for today", "המלצות AI להיום", "توصيات الذكاء الاصطناعي لليوم"],
  "dash.byDept": ["Performance by department & market", "ביצועים לפי מחלקה ושוק", "الأداء حسب القسم والسوق"],
  "dash.gate": [
    "Data reliability is {v}, below the 60 threshold. The overall score is shown as a low-confidence estimate, and automatic budget recommendations stay blocked until the data gap is closed.",
    "אמינות הנתונים היא {v}, מתחת לסף 60. הציון הכללי מוצג כאומדן באמינות נמוכה, והמלצות תקציב אוטומטיות חסומות עד לסגירת פער הנתונים.",
    "موثوقية البيانات {v}، أدنى من حدّ 60. تُعرض النتيجة العامة كتقدير منخفض الثقة، وتبقى توصيات الميزانية الآلية محجوبة حتى إغلاق فجوة البيانات."
  ],
  "dash.estimate": ["Low-confidence estimate", "אומדן באמינות נמוכה", "تقدير منخفض الثقة"],
  "dash.noIssues": ["No open issues above threshold. Everything measured is inside its target range.", "אין בעיות פתוחות מעל הסף. כל מה שנמדד נמצא בטווח היעד.", "لا مشكلات مفتوحة فوق الحد. كل ما يُقاس داخل نطاق هدفه."],

  /* ---------- generic table / labels ---------- */
  "l.severity": ["Severity", "חומרה", "الخطورة"],
  "l.issue": ["Issue", "הבעיה", "المشكلة"],
  "l.impact": ["Impact", "השפעה", "الأثر"],
  "l.owner": ["Owner", "אחראי", "المسؤول"],
  "l.due": ["Due", "זמן לטיפול", "المهلة"],
  "l.dept": ["Department", "מחלקה", "القسم"],
  "l.status": ["Status", "מצב", "الحالة"],
  "l.detected": ["Detected", "זוהה", "اكتُشف"],
  "l.updated": ["Last update", "עדכון אחרון", "آخر تحديث"],
  "l.leadsAffected": ["Leads affected", "לידים מושפעים", "عملاء متأثرون"],
  "l.moneyAtRisk": ["Estimated money at risk", "השפעה כספית משוערת", "الأثر المالي المقدّر"],
  "l.evidence": ["Evidence & data", "ראיות ונתונים", "الأدلة والبيانات"],
  "l.cause": ["Probable cause", "סיבה אפשרית", "السبب المحتمل"],
  "l.whatToDo": ["What to do", "מה צריך לעשות", "ما العمل"],
  "l.verify": ["How closure is verified", "כיצד ייבדק שנפתר", "كيف يُتحقَّق من الحل"],
  "l.started": ["Problem started", "הבעיה התחילה", "بدأت المشكلة"],
  "l.history": ["Action history", "היסטוריית פעולות", "سجل الإجراءات"],
  "l.target": ["Target", "יעד", "الهدف"],
  "l.actual": ["Actual", "בפועל", "الفعلي"],
  "l.gap": ["Gap", "פער", "الفجوة"],
  "l.none": ["None", "אין", "لا يوجد"],
  "l.all": ["All", "הכול", "الكل"],
  "l.open": ["Open", "פתוח", "مفتوح"],
  "l.today": ["Today", "היום", "اليوم"],
  "l.hours": ["{n}h", "{n} שעות", "{n} ساعة"],
  "l.days": ["{n}d", "{n} ימים", "{n} يوم"],
  "l.min": ["{n} min", "{n} דק'", "{n} د"],
  "l.of": ["of", "מתוך", "من"],
  "l.save": ["Save", "שמירה", "حفظ"],
  "l.saved": ["Saved", "נשמר", "تم الحفظ"],
  "l.cancel": ["Cancel", "ביטול", "إلغاء"],
  "l.close": ["Close", "סגירה", "إغلاق"],
  "l.back": ["Back", "חזרה", "رجوع"],
  "l.search": ["Search", "חיפוש", "بحث"],
  "l.export": ["Export / print", "ייצוא / הדפסה", "تصدير / طباعة"],
  "l.confidence": ["Confidence", "רמת ביטחון", "مستوى الثقة"],
  "l.fact": ["Fact", "עובדה", "حقيقة"],
  "l.est": ["Estimate", "אומדן", "تقدير"],
  "l.reco": ["Recommendation", "המלצה", "توصية"],
  "l.needsApproval": ["Needs approval", "מחייב אישור", "يتطلب موافقة"],
  "l.demoData": ["Demo data", "נתוני דמו", "بيانات عرض"],
  "l.noData": ["No data yet", "עדיין אין נתונים", "لا بيانات بعد"]
};
Object.assign(window.MKT_STR, {
  /* ---------- empty states ---------- */
  "empty.title": ["No data yet", "עדיין אין נתונים", "لا بيانات بعد"],
  "empty.body": [
    "Connect your advertising platform or your CRM to start the diagnosis.",
    "חבר את מערכת הפרסום או את ה-CRM כדי להתחיל באבחון.",
    "اربط منصّة الإعلان أو نظام الـCRM لبدء التشخيص."
  ],
  "empty.connect": ["Go to connections", "למסך החיבורים", "إلى شاشة الاتصالات"],
  "empty.demo": ["Load demo dataset instead", "טען מערך נתוני דמו", "حمّل بيانات عرض بدلاً من ذلك"],
  "empty.demoNote": [
    "The demo dataset is clearly labelled everywhere it appears. It is never presented as your business data.",
    "מערך הדמו מסומן בבירור בכל מקום שבו הוא מופיע. הוא לא מוצג כנתוני העסק שלך.",
    "بيانات العرض موسومة بوضوح في كل موضع تظهر فيه، ولا تُقدَّم أبداً كبيانات عملك."
  ],
  "demo.banner": [
    "Demo dataset — {n} leads, {c} campaigns, generated locally. These are not your business numbers.",
    "מערך נתוני דמו — {n} לידים, {c} קמפיינים, שנוצרו מקומית. אלה אינם המספרים של העסק שלך.",
    "بيانات عرض — {n} عميلاً و{c} حملة، مُولّدة محلياً. هذه ليست أرقام عملك."
  ],
  "demo.turnOff": ["Turn off demo data", "כיבוי נתוני דמו", "أوقف بيانات العرض"],
  "demo.engine": [
    "Analysis engine: DriftX rules + playbooks, running in your browser on the connected records. No text is generated without a number behind it.",
    "מנוע הניתוח: כללים ו-Playbooks של DriftX, רצים בדפדפן שלך על הרשומות המחוברות. אין טקסט שנוצר בלי מספר מאחוריו.",
    "محرك التحليل: قواعد وأدلّة DriftX، تعمل في متصفحك على السجلات الموصولة. لا نص يُولَّد دون رقم وراءه."
  ],

  /* ---------- funnel ---------- */
  "fn.title": ["Marketing & sales funnel", "משפך השיווק והמכירות", "مسار التسويق والمبيعات"],
  "fn.sub": [
    "Every stage shows who entered, who continued, the pass rate against target, and the department that owns the drop.",
    "כל שלב מציג מי נכנס, מי המשיך, אחוז המעבר מול היעד והמחלקה שאחראית לנשירה.",
    "كل مرحلة تُظهر مَن دخل ومَن استمرّ ونسبة الانتقال مقابل الهدف والقسم المسؤول عن التسرّب."
  ],
  "fn.ads": ["Advertising (impressions)", "פרסום (חשיפות)", "الإعلان (ظهور)"],
  "fn.clicks": ["Clicks", "קליקים", "النقرات"],
  "fn.landing": ["Landing page", "דף נחיתה", "صفحة الهبوط"],
  "fn.leads": ["Leads", "לידים", "العملاء"],
  "fn.crm": ["Reached the CRM", "נקלטו ב-CRM", "وصلوا إلى CRM"],
  "fn.assigned": ["Assigned to a rep", "הוקצו לנציג", "أُسندوا لمندوب"],
  "fn.contacted": ["Contacted", "נוצר קשר", "تم التواصل"],
  "fn.qualified": ["Qualified", "לידים איכותיים", "عملاء مؤهّلون"],
  "fn.followup": ["Followed up ({n}+ attempts)", "Follow-up ({n}+ ניסיונות)", "متابعة ({n}+ محاولات)"],
  "fn.appointment": ["Appointment", "פגישה", "موعد"],
  "fn.sale": ["Sale", "מכירה", "بيع"],
  "fn.paid": ["Payment", "תשלום", "دفع"],
  "fn.service": ["Service delivered", "שירות סופק", "خدمة مُقدَّمة"],
  "fn.review": ["Review", "ביקורת", "مراجعة"],
  "fn.passRate": ["Pass rate", "אחוז מעבר", "نسبة الانتقال"],
  "fn.lostHere": ["{n} lost here", "{n} אבדו כאן", "{n} فُقدوا هنا"],
  "fn.stageDetail": ["Stage detail", "פירוט שלב", "تفصيل المرحلة"],

  /* ---------- campaigns ---------- */
  "cm.title": ["Campaigns", "קמפיינים", "الحملات"],
  "cm.name": ["Campaign", "קמפיין", "الحملة"],
  "cm.platform": ["Platform", "פלטפורמה", "المنصّة"],
  "cm.country": ["Country", "מדינה", "الدولة"],
  "cm.budget": ["Budget", "תקציב", "الميزانية"],
  "cm.spend": ["Spend", "הוצאה", "الإنفاق"],
  "cm.impr": ["Impressions", "חשיפות", "الظهور"],
  "cm.clicks": ["Clicks", "קליקים", "النقرات"],
  "cm.leads": ["Leads", "לידים", "العملاء"],
  "cm.qleads": ["Qualified", "איכותיים", "مؤهّلون"],
  "cm.deals": ["Deals", "עסקאות", "الصفقات"],
  "cm.revenue": ["Revenue", "הכנסה", "الإيراد"],
  "cm.alert": ["Alert", "התראה", "تنبيه"],
  "cm.aiReco": ["AI recommendation", "המלצת AI", "توصية الذكاء"],
  "cm.perf": ["Performance over time", "ביצועים לאורך זמן", "الأداء عبر الزمن"],
  "cm.creatives": ["Creatives", "קריאייטיבים", "الإبداعات"],
  "cm.audiences": ["Audiences", "קהלים", "الجماهير"],
  "cm.terms": ["Search terms", "מילות חיפוש", "عبارات البحث"],
  "cm.negatives": ["Suggested negatives", "מילים לשלילה", "كلمات للاستبعاد"],
  "cm.byHour": ["By hour", "לפי שעה", "حسب الساعة"],
  "cm.byCountry": ["By country", "לפי מדינה", "حسب الدولة"],
  "cm.gapCrm": ["Platform vs CRM gap", "פער פלטפורמה מול CRM", "الفجوة بين المنصّة وCRM"],
  "cm.realSales": ["Sales actually traced to this campaign", "מכירות שאותרו בפועל מהקמפיין", "مبيعات تعقّبت فعلاً لهذه الحملة"],
  "cm.actions": ["Recommended actions", "פעולות מומלצות", "الإجراءات الموصى بها"],
  "cm.noAuto": [
    "The system never changes a budget or stops a campaign on its own. It prepares the decision; an authorised user approves it.",
    "המערכת לא משנה תקציב ולא עוצרת קמפיין בעצמה. היא מכינה את ההחלטה; משתמש מורשה מאשר.",
    "لا يغيّر النظام ميزانية ولا يوقف حملة من تلقاء نفسه. يُجهّز القرار، ويعتمده مستخدم مُصرَّح له."
  ],
  "cm.impressions0": ["Learning / limited delivery", "בלמידה / תפוצה מוגבלת", "قيد التعلّم / توصيل محدود"],
  "cm.limited": ["Limited by budget", "מוגבל בתקציב", "مقيّد بالميزانية"],
  "cm.fatigue": ["Creative fatigue", "עייפות קריאייטיב", "إجهاد الإبداع"],
  "cm.healthy": ["Healthy", "תקין", "سليم"],
  "cm.frequency": ["Frequency", "תדירות", "التكرار"],

  /* ---------- leads ---------- */
  "ld.title": ["Leads", "לידים", "العملاء"],
  "ld.name": ["Name", "שם", "الاسم"],
  "ld.phone": ["Phone", "טלפון", "الهاتف"],
  "ld.source": ["Source", "מקור", "المصدر"],
  "ld.created": ["Arrived", "תאריך כניסה", "تاريخ الوصول"],
  "ld.crmAt": ["Into CRM", "קליטה ב-CRM", "دخول CRM"],
  "ld.rep": ["Rep", "עובד מטפל", "المندوب"],
  "ld.respTime": ["Response", "זמן תגובה", "زمن الاستجابة"],
  "ld.attempts": ["Attempts", "ניסיונות", "المحاولات"],
  "ld.quality": ["Quality", "איכות", "الجودة"],
  "ld.lostReason": ["Lost reason", "סיבת אובדן", "سبب الخسارة"],
  "ld.dealValue": ["Deal value", "סכום עסקה", "قيمة الصفقة"],
  "ld.flags": ["Flags", "סימונים", "الإشارات"],
  "ld.unassigned": ["Unassigned", "לא הוקצה", "غير مُسند"],
  "ld.filterFlag": ["Filter by flag", "סינון לפי סימון", "ترشيح حسب الإشارة"],
  "ld.showing": ["Showing {n} of {t} leads", "מוצגים {n} מתוך {t} לידים", "يُعرض {n} من {t} عميلاً"],
  "flag.noCrm": ["Lost in integration", "אבד באינטגרציה", "فُقد في التكامل"],
  "flag.dup": ["Duplicate", "כפול", "مكرّر"],
  "flag.badPhone": ["Invalid number", "מספר שגוי", "رقم غير صحيح"],
  "flag.noUtm": ["Missing UTM", "UTM חסר", "UTM مفقود"],
  "flag.noSource": ["Missing source", "מקור חסר", "مصدر مفقود"],
  "flag.noOwner": ["Not assigned", "לא הוקצה", "غير مُسند"],
  "flag.slaBreach": ["Late first contact", "לא טופל בזמן", "تواصل متأخر"],
  "flag.noFollowup": ["No follow-up", "אין Follow-up", "لا متابعة"],
  "flag.soldNotMarked": ["Sold, not marked", "נמכר ולא סומן", "بِيع ولم يُوسم"],
  "flag.paidNoCampaign": ["Paid, unattributed", "שולם ללא שיוך", "دُفع بلا نسب"],
  "flag.noLostReason": ["No lost reason", "אין סיבת אובדן", "بلا سبب خسارة"],
  "st.new": ["New", "חדש", "جديد"],
  "st.contacted": ["Contacted", "נוצר קשר", "تم التواصل"],
  "st.qualified": ["Qualified", "איכותי", "مؤهّل"],
  "st.appointment": ["Appointment", "פגישה", "موعد"],
  "st.won": ["Won", "נסגר", "مكسوب"],
  "st.lost": ["Lost", "אבוד", "مفقود"],

  /* ---------- team ---------- */
  "tm.title": ["Sales & team", "מכירות וצוות", "المبيعات والفريق"],
  "tm.sub": [
    "Reps are not compared on deal count alone. The score adjusts for lead volume, lead quality, country, source, price band, tenure and handling time.",
    "הנציגים לא מושווים לפי מספר עסקאות בלבד. הציון מנרמל כמות לידים, איכות, מדינה, מקור, טווח מחיר, ותק וזמן טיפול.",
    "لا يُقارن المندوبون بعدد الصفقات وحده. الدرجة تُعدّل حسب حجم العملاء وجودتهم والدولة والمصدر ونطاق السعر والأقدمية وزمن المعالجة."
  ],
  "tm.rep": ["Rep", "נציג", "المندوب"],
  "tm.leadsGot": ["Leads received", "לידים שקיבל", "عملاء تلقّاهم"],
  "tm.avgQuality": ["Avg lead quality", "איכות לידים ממוצעת", "متوسط جودة العملاء"],
  "tm.contactRate": ["Contact rate", "אחוז יצירת קשר", "نسبة التواصل"],
  "tm.avgAttempts": ["Avg attempts", "ניסיונות בממוצע", "متوسط المحاولات"],
  "tm.followRate": ["Follow-up rate", "אחוז Follow-up", "نسبة المتابعة"],
  "tm.qualRate": ["Qualified rate", "אחוז איכותיים", "نسبة المؤهّلين"],
  "tm.appts": ["Appointments", "פגישות", "المواعيد"],
  "tm.deals": ["Deals", "עסקאות", "الصفقات"],
  "tm.closeRate": ["Close rate", "אחוז סגירה", "نسبة الإغلاق"],
  "tm.crmHygiene": ["CRM hygiene", "איכות עדכון CRM", "نظافة تحديث CRM"],
  "tm.trainings": ["Trainings completed", "הדרכות שהושלמו", "تدريبات مكتملة"],
  "tm.fairScore": ["Adjusted score", "ציון מנורמל", "درجة معدّلة"],
  "tm.tenure": ["Tenure (months)", "ותק (חודשים)", "الأقدمية (أشهر)"],
  "tm.improve": ["Where to improve", "נקודות לשיפור", "نقاط للتحسين"],
  "tm.aiForRep": ["AI read on this rep", "קריאת ה-AI על הנציג", "قراءة الذكاء للمندوب"],
  "tm.assignTraining": ["Assign DriftX training", "שיוך הדרכת DriftX", "إسناد تدريب DriftX"],
  "tm.assigned": ["Training assigned", "ההדרכה שויכה", "أُسند التدريب"],

  /* ---------- issues ---------- */
  "is.title": ["Issues & alerts", "בעיות והתראות", "المشكلات والتنبيهات"],
  "is.sub": [
    "An issue is opened by the rules engine from the data, not by opinion. It cannot be closed by pressing done — the metric has to come back inside range.",
    "בעיה נפתחת על ידי מנוע הכללים מתוך הנתונים, לא מתוך דעה. היא לא נסגרת בלחיצה על \"טופל\" — המדד חייב לחזור לטווח.",
    "تُفتح المشكلة بمحرك القواعد من البيانات لا بالرأي. ولا تُغلق بالضغط على \"تمّت\" — بل يجب أن يعود المقياس إلى نطاقه."
  ],
  "is.id": ["Issue ID", "מספר בעיה", "رقم المشكلة"],
  "is.type": ["Type", "סוג הבעיה", "نوع المشكلة"],
  "is.new": ["New", "חדש", "جديد"],
  "is.verify": ["Needs verification", "דורש אימות", "يحتاج تحقّقاً"],
  "is.assigned": ["Assigned", "הוקצה", "مُسندة"],
  "is.progress": ["In progress", "בטיפול", "قيد المعالجة"],
  "is.external": ["Waiting on third party", "ממתין לגורם חיצוני", "بانتظار طرف خارجي"],
  "is.resolved": ["Resolved", "נפתר", "محلولة"],
  "is.pendingCheck": ["Pending verification", "ממתין לאימות", "بانتظار التحقق"],
  "is.closed": ["Closed", "נסגר", "مغلقة"],
  "is.reopened": ["Reopened", "נפתח מחדש", "أُعيد فتحها"],
  "is.setStatus": ["Set status", "עדכון מצב", "تحديث الحالة"],
  "is.createTask": ["Create task from this issue", "צור משימה מהבעיה", "أنشئ مهمة من المشكلة"],
  "is.taskExists": ["Task already created", "משימה כבר נוצרה", "المهمة أُنشئت مسبقاً"],
  "is.checkNow": ["Run the verification check", "הרץ בדיקת אימות", "شغّل فحص التحقّق"],
  "is.checkPass": ["Verification passed — metric is back inside range. Issue closed.", "האימות עבר — המדד חזר לטווח. הבעיה נסגרה.", "نجح التحقّق — عاد المقياس إلى نطاقه. أُغلقت المشكلة."],
  "is.checkFail": ["Verification failed — the metric is still outside range, so the issue stays open.", "האימות נכשל — המדד עדיין מחוץ לטווח, ולכן הבעיה נשארת פתוחה.", "فشل التحقّق — ما زال المقياس خارج النطاق، لذا تبقى المشكلة مفتوحة."],
  "is.cantClose": ["Closing is blocked until the verification check passes.", "הסגירה חסומה עד שבדיקת האימות תעבור.", "الإغلاق محجوب حتى ينجح فحص التحقّق."],
  "is.noneTitle": ["Nothing above threshold", "אין חריגות מעל הסף", "لا تجاوزات فوق الحد"],

  /* ---------- tasks ---------- */
  "tk.title": ["Action plan", "תוכנית פעולה", "خطة العمل"],
  "tk.sub": [
    "Every recommendation becomes a task with an owner, a deadline, the DriftX training behind it and the KPI that proves it worked.",
    "כל המלצה הופכת למשימה עם אחראי, Deadline, ההדרכה של DriftX שמאחוריה וה-KPI שמוכיח שהיא עבדה.",
    "كل توصية تصبح مهمة بمسؤول وموعد نهائي وتدريب DriftX وراءها والمؤشر الذي يثبت نجاحها."
  ],
  "tk.name": ["Task", "משימה", "المهمة"],
  "tk.solves": ["Problem it solves", "הבעיה שהיא פותרת", "المشكلة التي تحلّها"],
  "tk.steps": ["Steps", "שלבי ביצוע", "خطوات التنفيذ"],
  "tk.kpi": ["Success KPI", "KPI להצלחה", "مؤشر النجاح"],
  "tk.training": ["Related DriftX training", "הדרכת DriftX קשורה", "تدريب DriftX ذو صلة"],
  "tk.priority": ["Priority", "עדיפות", "الأولوية"],
  "tk.before": ["Before", "לפני", "قبل"],
  "tk.after": ["After", "אחרי", "بعد"],
  "tk.start": ["Start", "התחלה", "البدء"],
  "tk.deadline": ["Deadline", "Deadline", "الموعد النهائي"],
  "tk.todo": ["To do", "לביצוע", "للتنفيذ"],
  "tk.doing": ["In progress", "בביצוע", "قيد التنفيذ"],
  "tk.done": ["Done", "בוצע", "منجزة"],
  "tk.markDone": ["Mark done", "סמן כבוצע", "وسم كمنجزة"],
  "tk.empty": ["No tasks yet. Open an issue and create a task from it, or run the AI diagnosis.", "אין משימות. פתח בעיה וצור ממנה משימה, או הרץ אבחון AI.", "لا مهام بعد. افتح مشكلة وأنشئ منها مهمة، أو شغّل التشخيص الذكي."],

  /* ---------- knowledge ---------- */
  "kb.title": ["DriftX knowledge & training", "מרכז הידע וההדרכות", "مركز المعرفة والتدريب"],
  "kb.sub": [
    "The system does not show every training to everyone. The engine matches the training to the problem it actually found in your data.",
    "המערכת לא מציגה כל הדרכה לכולם. המנוע מתאים את ההדרכה לבעיה שנמצאה בנתונים שלך.",
    "لا يعرض النظام كل تدريب للجميع. يطابق المحرك التدريب مع المشكلة التي وجدها فعلاً في بياناتك."
  ],
  "kb.matched": ["Matched to an open issue", "מותאם לבעיה פתוחה", "مطابق لمشكلة مفتوحة"],
  "kb.open": ["Open training", "פתח הדרכה", "افتح التدريب"],
  "kb.markDone": ["Mark completed", "סמן כהושלם", "وسم كمكتمل"],
  "kb.opened": ["Opened", "נפתח", "فُتح"],
  "kb.completed": ["Completed", "הושלם", "مكتمل"],
  "kb.notStarted": ["Not started", "לא התחיל", "لم يبدأ"],
  "kb.effect": ["Measured effect", "השפעה שנמדדה", "الأثر المقيس"],
  "kb.effectPending": ["Effect measured 7 days after completion", "ההשפעה נמדדת 7 ימים לאחר ההשלמה", "يُقاس الأثر بعد 7 أيام من الإكمال"],
  "kb.all": ["All trainings", "כל ההדרכות", "كل التدريبات"],

  /* ---------- implementation ---------- */
  "im.title": ["DriftX implementation", "אחוז יישום שיטת DriftX", "نسبة تطبيق منهج DriftX"],
  "im.sub": [
    "What the business actually runs from the DriftX method — scored on verified evidence, not on intentions.",
    "מה העסק באמת מיישם מתוך שיטת DriftX — מנוקד לפי ראיה מאומתת, לא לפי כוונות.",
    "ما يطبّقه العمل فعلاً من منهج DriftX — مُقيَّم على دليل مُتحقَّق لا على النوايا."
  ],
  "im.area": ["Area", "תחום", "المجال"],
  "im.implemented": ["Implemented", "מיושם", "مطبّق"],
  "im.partial": ["Partially implemented", "מיושם חלקית", "مطبّق جزئياً"],
  "im.planned": ["Planned", "מתוכנן", "مخطّط"],
  "im.not": ["Not implemented", "לא מיושם", "غير مطبّق"],
  "im.na": ["Not relevant", "לא רלוונטי", "غير ذي صلة"],
  "im.evidenceChecked": ["Evidence checked", "הראיה שנבדקה", "الدليل الذي فُحص"],
  "im.points": ["Completing this adds {n} points", "השלמה תוסיף {n} נקודות", "إتمام هذا يضيف {n} نقطة"],
  "im.good": ["Good", "טוב", "جيد"],
  "im.needs": ["Needs work", "דורש טיפול", "يحتاج معالجة"],
  "im.weak": ["Weak", "חלש", "ضعيف"],
  "im.answerIt": ["Answer the assessment", "מלא את השאלון", "أكمل الاستبيان"],

  /* ---------- reports ---------- */
  "rp.title": ["Reports", "דוחות", "التقارير"],
  "rp.weekly": ["Weekly board report", "דוח הנהלה שבועי", "تقرير الإدارة الأسبوعي"],
  "rp.summary": ["What changed, and what needs a decision", "מה השתנה ומה דורש החלטה", "ما تغيّر وما يحتاج قراراً"],
  "rp.kpiVs": ["KPIs against target and against last week", "KPI מול יעד ומול השבוע הקודם", "المؤشرات مقابل الهدف ومقابل الأسبوع الماضي"],
  "rp.quality": ["Lead quality & conversion by source", "איכות לידים והמרה לפי מקור", "جودة العملاء والتحويل حسب المصدر"],
  "rp.funnelGaps": ["Funnel gaps", "פערי המשפך", "فجوات المسار"],
  "rp.openIssues": ["Open and critical issues", "אירועים פתוחים וקריטיים", "المشكلات المفتوحة والحرجة"],
  "rp.fixed": ["Fixed and verified", "נפתרו ואומתו", "ما حُلّ وتحقّق"],
  "rp.decisions": ["Three decisions needed from management", "שלוש החלטות נדרשות מההנהלה", "ثلاثة قرارات مطلوبة من الإدارة"],
  "rp.nextWeek": ["Three priorities for next week", "שלוש עדיפויות לשבוע הבא", "ثلاث أولويات للأسبوع القادم"],
  "rp.generated": ["Generated {t} · {biz} · reliability {trust}/100", "הופק {t} · {biz} · אמינות {trust}/100", "أُنشئ {t} · {biz} · الموثوقية {trust}/100"],

  /* ---------- settings ---------- */
  "se.title": ["Settings & connections", "הגדרות וחיבורים", "الإعدادات والاتصالات"],
  "se.business": ["Business profile", "פרטי העסק", "بيانات العمل"],
  "se.depts": ["Departments & owners", "מחלקות ואחראים", "الأقسام والمسؤولون"],
  "se.conns": ["Data connections", "חיבורי נתונים", "اتصالات البيانات"],
  "se.targets": ["Targets & thresholds", "יעדים וספים", "الأهداف والحدود"],
  "se.assessment": ["Assessment answers", "תשובות השאלון", "أجوبة الاستبيان"],
  "se.data": ["Data & session", "נתונים וסשן", "البيانات والجلسة"],
  "se.reset": ["Delete everything stored in this browser", "מחיקת כל מה שנשמר בדפדפן", "حذف كل ما هو محفوظ في المتصفح"],
  "se.resetConfirm": ["This deletes the business, connections, targets, assessment, issues and tasks stored locally. Continue?", "הפעולה תמחק את העסק, החיבורים, היעדים, השאלון, הבעיות והמשימות שנשמרו מקומית. להמשיך?", "سيحذف هذا العمل والاتصالات والأهداف والاستبيان والمشكلات والمهام المحفوظة محلياً. أتريد المتابعة؟"],
  "se.storage": ["Everything is stored in this browser only (localStorage). Nothing is uploaded.", "הכול נשמר בדפדפן הזה בלבד (localStorage). שום דבר לא נשלח לשרת.", "كل شيء محفوظ في هذا المتصفح فقط (localStorage). لا شيء يُرسل إلى خادم."],
  "se.connect": ["Connect", "חבר", "اربط"],
  "se.disconnect": ["Disconnect", "נתק", "افصل"],
  "se.reauth": ["Re-authorise", "חדש הרשאה", "أعد التصريح"],
  "se.retry": ["Retry sync", "נסה סנכרון מחדש", "أعد المزامنة"],
  "conn.connected": ["Connected", "מחובר", "موصول"],
  "conn.needsAuth": ["Needs authorisation", "דורש הרשאה", "يحتاج تصريحاً"],
  "conn.syncErr": ["Sync error", "שגיאת סנכרון", "خطأ مزامنة"],
  "conn.off": ["Not connected", "לא מחובר", "غير موصول"],
  "conn.lastSync": ["Last sync: {t}", "סנכרון אחרון: {t}", "آخر مزامنة: {t}"],
  "conn.records": ["{n} records ingested", "{n} רשומות נקלטו", "{n} سجلاً استُقبلت"],
  "conn.never": ["never", "טרם בוצע", "لم تحدث"],

  /* ---------- web & reputation ---------- */
  "wb.title": ["Site & tracking", "אתר ו-Tracking", "الموقع والتتبّع"],
  "wb.uptime": ["Uptime (30d)", "זמינות (30 יום)", "التوفّر (30 يوماً)"],
  "wb.load": ["Load time (mobile)", "זמן טעינה (מובייל)", "زمن التحميل (موبايل)"],
  "wb.forms": ["Form submissions", "שליחות טופס", "إرسالات النموذج"],
  "wb.formErr": ["Form errors", "שגיאות טופס", "أخطاء النموذج"],
  "wb.utmCover": ["UTM coverage", "כיסוי UTM", "تغطية UTM"],
  "wb.evtDup": ["Duplicate conversion events", "אירועי המרה כפולים", "أحداث تحويل مكرّرة"],
  "wb.ssl": ["SSL & domain", "SSL ודומיין", "SSL والنطاق"],
  "wb.checks": ["Synthetic checks", "בדיקות סינתטיות", "اختبارات اصطناعية"],
  "wb.pass": ["passing", "עוברות", "ناجحة"],
  "wb.fail": ["failing", "נכשלות", "فاشلة"],
  "rep.title": ["Content & reputation", "תוכן ומוניטין", "المحتوى والسمعة"],
  "rep.rating": ["Public rating", "דירוג ציבורי", "التقييم العام"],
  "rep.reviews": ["Reviews (30d)", "ביקורות (30 יום)", "مراجعات (30 يوماً)"],
  "rep.negative": ["Negative, unanswered", "שליליות ללא מענה", "سلبية بلا ردّ"],
  "rep.respSla": ["Response SLA met", "עמידה ב-SLA תגובה", "الالتزام بـSLA الردّ"],
  "rep.complaints": ["Open complaints", "תלונות פתוחות", "شكاوى مفتوحة"],
  "rep.refunds": ["Refunds", "החזרים", "استردادات"],
  "rep.rootCauses": ["Complaint root causes", "שורשי התלונות", "جذور الشكاوى"],
  "rep.creativeAge": ["Oldest creative in rotation", "הקריאייטיב הישן ביותר", "أقدم إبداع في التدوير"],
  "rep.approval": ["Content approval workflow", "תהליך אישור תוכן", "مسار اعتماد المحتوى"]
});
/* ---------- catalogues ---------- */
window.MKT_DEPTS = [
  { k: "mgmt", n: ["Management", "הנהלה", "الإدارة"] },
  { k: "marketing", n: ["Marketing", "שיווק", "التسويق"] },
  { k: "sales", n: ["Sales", "מכירות", "المبيعات"] },
  { k: "service", n: ["Customer service", "שירות לקוחות", "خدمة العملاء"] },
  { k: "it", n: ["IT / CRM", "IT / CRM", "IT / CRM"] },
  { k: "finance", n: ["Finance", "כספים", "المالية"] },
  { k: "ops", n: ["Operations", "תפעול", "التشغيل"] },
  { k: "content", n: ["Content & design", "תוכן ועיצוב", "المحتوى والتصميم"] }
];

window.MKT_CONNS = [
  { k: "gads", n: ["Google Ads", "Google Ads", "Google Ads"], g: "ads", rec: 5400 },
  { k: "meta", n: ["Meta Ads", "Meta Ads", "Meta Ads"], g: "ads", rec: 6100 },
  { k: "ga4", n: ["Google Analytics 4", "Google Analytics 4", "Google Analytics 4"], g: "data", rec: 18400 },
  { k: "gtm", n: ["Google Tag Manager", "Google Tag Manager", "Google Tag Manager"], g: "data", rec: 0 },
  { k: "crm", n: ["CRM", "CRM", "CRM"], g: "crm", rec: 1240 },
  { k: "site", n: ["Website & landing pages", "אתר ודפי נחיתה", "الموقع وصفحات الهبوط"], g: "site", rec: 940 },
  { k: "wa", n: ["WhatsApp Business", "WhatsApp Business", "WhatsApp Business"], g: "msg", rec: 780 },
  { k: "tel", n: ["Telephony", "מערכת טלפוניה", "نظام الهاتف"], g: "msg", rec: 1120 },
  { k: "email", n: ["Email", "אימייל", "البريد الإلكتروني"], g: "msg", rec: 2300 },
  { k: "pay", n: ["Payments", "מערכת סליקה", "نظام الدفع"], g: "fin", rec: 210 },
  { k: "gbp", n: ["Google Business Profile", "Google Business Profile", "Google Business Profile"], g: "rep", rec: 96 },
  { k: "reviews", n: ["Reviews platforms", "מערכות Reviews", "منصّات المراجعات"], g: "rep", rec: 143 }
];

window.MKT_INDUSTRIES = [
  ["Services", "שירותים", "خدمات"], ["Retail / e-commerce", "קמעונאות / איקומרס", "تجزئة / تجارة إلكترونية"],
  ["Real estate", "נדל\"ן", "عقارات"], ["Health & clinics", "בריאות וקליניקות", "صحة وعيادات"],
  ["Education", "חינוך והכשרה", "تعليم وتدريب"], ["Construction & home", "בנייה ובית", "بناء ومنازل"],
  ["Automotive", "רכב", "سيارات"], ["Finance & insurance", "פיננסים וביטוח", "مالية وتأمين"],
  ["Technology / SaaS", "טכנולוגיה / SaaS", "تقنية / SaaS"], ["Travel & hospitality", "תיירות ואירוח", "سفر وضيافة"],
  ["Other", "אחר", "أخرى"]
];

window.MKT_TRAININGS = [
  { k: "followup", area: "sales", n: ["Follow-up that closes", "Follow-up שסוגר", "متابعة تُغلق"],
    d: ["The four-attempt cadence, timing windows, and what to say on each touch.", "מקצב ארבעת הניסיונות, חלונות הזמן ומה אומרים בכל מגע.", "إيقاع المحاولات الأربع ونوافذ التوقيت وما يُقال في كل تواصل."] },
  { k: "objections", area: "sales", n: ["Price objections", "התנגדויות מחיר", "اعتراضات السعر"],
    d: ["Reframing price against value, and the three responses that keep the deal alive.", "מיסגור מחדש של המחיר מול הערך, ושלוש התשובות שמשאירות את העסקה בחיים.", "إعادة تأطير السعر مقابل القيمة، والردود الثلاثة التي تُبقي الصفقة حيّة."] },
  { k: "speed", area: "sales", n: ["First response speed", "מהירות תגובה ראשונה", "سرعة أول استجابة"],
    d: ["Why the first 15 minutes decide the deal, and how to build the shift routine around it.", "למה 15 הדקות הראשונות מכריעות, ואיך בונים סביבן שגרת משמרת.", "لماذا تحسم أول 15 دقيقة الصفقة، وكيف تُبنى روتين الوردية حولها."] },
  { k: "discovery", area: "sales", n: ["Needs discovery", "בירור צרכים", "استكشاف الاحتياج"],
    d: ["The question set that separates a buyer from a browser in under four minutes.", "מערך השאלות שמפריד בין קונה למתעניין בפחות מארבע דקות.", "مجموعة الأسئلة التي تفصل المشتري عن المتفرّج في أقل من أربع دقائق."] },
  { k: "closing", area: "sales", n: ["Closing & commitment", "סגירה ומחויבות", "الإغلاق والالتزام"],
    d: ["Trial closes, the assumptive close, and handling the final hesitation.", "סגירות ניסיון, סגירה מובנת מאליה וטיפול בהיסוס האחרון.", "الإغلاقات التجريبية والإغلاق الافتراضي ومعالجة التردّد الأخير."] },
  { k: "scripts", area: "sales", n: ["Call scripts", "תסריטי שיחה", "سيناريوهات المكالمة"],
    d: ["Opening lines, structure and the exit that books the next step.", "פתיחות, מבנה והיציאה שקובעת את הצעד הבא.", "مقدمات وبنية وخروج يحدّد الخطوة التالية."] },
  { k: "leadmgmt", area: "crm", n: ["Lead handling & CRM hygiene", "טיפול בלידים והיגיינת CRM", "معالجة العملاء ونظافة CRM"],
    d: ["Required fields, status discipline, lost reasons and why the pipeline lies without them.", "שדות חובה, משמעת סטטוסים, סיבות אובדן ולמה בלעדיהם ה-Pipeline משקר.", "الحقول الإلزامية وانتظام الحالات وأسباب الخسارة ولماذا يكذب خطّ الفرص بدونها."] },
  { k: "targeting", area: "marketing", n: ["Targeting & offer fit", "Targeting והתאמת הצעה", "الاستهداف وملاءمة العرض"],
    d: ["Why cheaper leads often cost more, and how to buy intent instead of volume.", "למה לידים זולים יוצאים יקרים, ואיך קונים כוונה במקום כמות.", "لماذا يكون العميل الأرخص أغلى فعلاً، وكيف تشتري النيّة بدل الكمّية."] },
  { k: "creative", area: "marketing", n: ["Creative rotation", "רוטציית קריאייטיב", "تدوير الإبداعات"],
    d: ["Reading frequency against CTR, and shipping two new angles a week.", "קריאת Frequency מול CTR, והעלאת שתי זוויות מסר חדשות בשבוע.", "قراءة التكرار مقابل CTR، وإطلاق زاويتَي رسالة جديدتين أسبوعياً."] },
  { k: "campaigns", area: "marketing", n: ["Campaign management", "ניהול קמפיינים", "إدارة الحملات"],
    d: ["Structure, budget pacing, and optimising on CPQL instead of CPL.", "מבנה, קצב תקציב ואופטימיזציה על CPQL במקום CPL.", "البنية ووتيرة الميزانية والتحسين على CPQL بدل CPL."] },
  { k: "tracking", area: "data", n: ["Tracking & attribution", "Tracking וייחוס", "التتبّع والنسب"],
    d: ["Persisting click IDs, offline conversions, and proving a source end to end.", "שמירת Click ID, המרות Offline והוכחת מקור מקצה לקצה.", "حفظ معرّفات النقرة والتحويلات دون اتصال وإثبات المصدر من طرف لطرف."] },
  { k: "kpi", area: "mgmt", n: ["KPIs & team management", "KPI וניהול צוות", "المؤشرات وإدارة الفريق"],
    d: ["The weekly review that produces decisions instead of a status update.", "הסקירה השבועית שמייצרת החלטות במקום עדכון סטטוס.", "المراجعة الأسبوعية التي تُنتج قرارات لا تحديث حالة."] },
  { k: "service", area: "service", n: ["Service recovery", "התאוששות שירות", "استرداد الخدمة"],
    d: ["Answering a complaint so it stops costing money, and closing the loop with operations.", "מענה לתלונה כך שתפסיק לעלות כסף, וסגירת מעגל עם התפעול.", "الردّ على الشكوى بما يوقف خسارتها للمال، وإغلاق الحلقة مع التشغيل."] },
  { k: "reviews", area: "service", n: ["Reviews & reputation", "ביקורות ומוניטין", "المراجعات والسمعة"],
    d: ["Classifying by root cause, response templates, and asking for the review that offsets it.", "סיווג לפי שורש הבעיה, תבניות מענה ובקשת הביקורת שמאזנת אותה.", "التصنيف حسب السبب الجذري وقوالب الردّ وطلب المراجعة التي توازنها."] }
];

/* assessment: q = question, e = evidence required, area */
window.MKT_ASSESS = [
  { area: "tracking", q: ["Is every lead stored with source, campaign and UTM?", "האם כל ליד נשמר עם Source, Campaign ו-UTM?", "هل يُحفظ كل عميل مع المصدر والحملة وUTM؟"], e: ["CRM sample vs the source", "דגימת CRM מול המקור", "عيّنة CRM مقابل المصدر"] },
  { area: "tracking", q: ["Are offline sales pushed back to the ad platforms?", "האם מכירות Offline מוחזרות לפלטפורמות הפרסום?", "هل تُعاد المبيعات دون اتصال إلى منصّات الإعلان؟"], e: ["Conversion import log", "לוג יבוא המרות", "سجل استيراد التحويلات"] },
  { area: "crm", q: ["Do you get an alert when a lead does not reach the CRM in time?", "האם מתקבלת התראה כשליד לא נכנס ל-CRM בזמן?", "هل يصلكم تنبيه عند عدم وصول عميل إلى CRM في الوقت؟"], e: ["Webhook / API log", "לוג Webhook / API", "سجل Webhook / API"] },
  { area: "crm", q: ["Are required fields enforced, including lost reason?", "האם שדות חובה נאכפים, כולל סיבת אובדן?", "هل تُفرض الحقول الإلزامية، بما فيها سبب الخسارة؟"], e: ["CRM configuration", "הגדרות ה-CRM", "إعدادات CRM"] },
  { area: "sales", q: ["Is a first-response SLA defined and actually measured?", "האם מוגדר SLA לתגובה ראשונה ונמדד בפועל?", "هل يوجد SLA لأول استجابة ويُقاس فعلاً؟"], e: ["Timestamps", "חתימות זמן", "طوابع زمنية"] },
  { area: "sales", q: ["Is there a minimum follow-up cadence every rep works by?", "האם יש מקצב Follow-up מינימלי שכל נציג עובד לפיו?", "هل هناك إيقاع متابعة أدنى يعمل به كل مندوب؟"], e: ["Activity log", "לוג פעילות", "سجل النشاط"] },
  { area: "sales", q: ["Are calls reviewed for quality on a schedule?", "האם שיחות נבדקות לאיכות באופן קבוע?", "هل تُراجَع المكالمات للجودة بانتظام؟"], e: ["QA records", "רשומות QA", "سجلات QA"] },
  { area: "quality", q: ["Is there an agreed, written definition of a qualified lead?", "האם יש הגדרה כתובה ומוסכמת לליד איכותי?", "هل يوجد تعريف مكتوب ومتّفق عليه للعميل المؤهّل؟"], e: ["Policy document", "מסמך מדיניות", "مستند السياسة"] },
  { area: "marketing", q: ["Do you optimise on cost per qualified lead rather than cost per lead?", "האם מבצעים אופטימיזציה על CPQL ולא על CPL?", "هل تُحسّنون على تكلفة العميل المؤهّل لا تكلفة العميل؟"], e: ["Campaign settings + reports", "הגדרות קמפיין ודוחות", "إعدادات الحملات والتقارير"] },
  { area: "marketing", q: ["Is creative rotated on a fixed cadence?", "האם הקריאייטיב מוחלף במקצב קבוע?", "هل تُدوّر الإبداعات بإيقاع ثابت؟"], e: ["Asset log", "לוג נכסים", "سجل الأصول"] },
  { area: "content", q: ["Is there an approval workflow before publishing?", "האם יש תהליך אישור לפני פרסום?", "هل يوجد مسار اعتماد قبل النشر؟"], e: ["Workflow", "תהליך העבודה", "مسار العمل"] },
  { area: "accounts", q: ["Are all assets company-owned, with a backup admin and 2FA?", "האם כל הנכסים בבעלות החברה, עם Admin גיבוי ו-2FA?", "هل كل الأصول بملكية الشركة، مع مشرف احتياطي و2FA؟"], e: ["Access audit", "אודיט הרשאות", "تدقيق الوصول"] },
  { area: "service", q: ["Is a negative response classified by root cause and answered inside an SLA?", "האם תגובה שלילית מסווגת לפי שורש הבעיה ונענית בתוך SLA?", "هل يُصنّف الردّ السلبي حسب السبب الجذري ويُجاب داخل SLA؟"], e: ["Incident record", "רשומת אירוע", "سجل الحادث"] },
  { area: "service", q: ["Does an after-sale complaint travel back to marketing and sales?", "האם תלונה שלאחר מכירה חוזרת לשיווק ולמכירות?", "هل تعود شكوى ما بعد البيع إلى التسويق والمبيعات؟"], e: ["Feedback loop", "לולאת משוב", "حلقة التغذية الراجعة"] },
  { area: "mgmt", q: ["Is the lead target aligned to the budget and expected CPL?", "האם יעד הלידים מותאם לתקציב ול-CPL הצפוי?", "هل هدف العملاء متوافق مع الميزانية وCPL المتوقّعة؟"], e: ["Plan", "התכנון", "الخطة"] },
  { area: "mgmt", q: ["Is there a weekly report with named owners and decisions?", "האם יש דוח שבועי עם אחראים והחלטות?", "هل يوجد تقرير أسبوعي بمسؤولين وقرارات؟"], e: ["Report", "הדוח", "التقرير"] },
  { area: "training", q: ["Does a new rep get a structured onboarding plan?", "האם נציג חדש מקבל תוכנית קליטה מובנית?", "هل يحصل المندوب الجديد على خطة تأهيل منظّمة؟"], e: ["Onboarding plan", "תוכנית קליטה", "خطة التأهيل"] },
  { area: "training", q: ["Is training assigned from measured weakness rather than by schedule?", "האם הדרכה משויכת לפי חולשה שנמדדה ולא לפי לוח זמנים?", "هل يُسند التدريب حسب ضعف مقيس لا حسب جدول؟"], e: ["Training records", "רשומות הדרכה", "سجلات التدريب"] }
];

window.MKT_AREAS = {
  tracking: ["Tracking & attribution", "Tracking וייחוס", "التتبّع والنسب"],
  crm: ["Lead management & CRM", "ניהול לידים ו-CRM", "إدارة العملاء وCRM"],
  sales: ["Sales execution", "ביצועי מכירות", "أداء المبيعات"],
  quality: ["Lead quality", "איכות לידים", "جودة العملاء"],
  marketing: ["Campaign management", "ניהול קמפיינים", "إدارة الحملات"],
  content: ["Content & brand", "תוכן ומותג", "المحتوى والعلامة"],
  accounts: ["Accounts & access", "חשבונות והרשאות", "الحسابات والصلاحيات"],
  service: ["Customer service", "שירות לקוחות", "خدمة العملاء"],
  mgmt: ["Management & KPIs", "ניהול ו-KPI", "الإدارة والمؤشرات"],
  training: ["Team training", "הכשרת עובדים", "تدريب الفريق"],
  data: ["Data & reporting", "נתונים ודוחות", "البيانات والتقارير"]
};
/* ---------- issue templates (rules engine output) ----------
   t = title, why = business impact, causes = ranked alternatives,
   corr = corrective, prev = preventive, ver = verification test. */
window.MKT_ISS = {
  captureGap: {
    dept: "it", area: "crm", train: "leadmgmt",
    t: ["{n} leads never reached the CRM ({p}% of the period)", "{n} לידים לא הגיעו ל-CRM ({p}% מהתקופה)", "{n} عميلاً لم يصلوا إلى CRM ({p}% من الفترة)"],
    why: ["These are people who raised their hand and were never contacted. Beyond the lost revenue, every downstream metric is measured against an incomplete denominator, which is why data reliability drops.",
      "מדובר באנשים שהרימו יד ואף אחד לא חזר אליהם. מעבר לאובדן ההכנסה, כל מדד במורד הזרם נמדד מול מכנה חסר — ולכן אמינות הנתונים יורדת.",
      "هؤلاء أشخاص أبدوا اهتماماً ولم يتواصل معهم أحد. وإلى جانب الإيراد المفقود، كل مقياس لاحق يُقاس مقابل مقام ناقص، ولهذا تهبط موثوقية البيانات."],
    causes: [
      ["Connector token or webhook failing silently", "Token או Webhook של ה-Connector נכשל בשקט", "رمز أو webhook الموصل يفشل بصمت"],
      ["No alert on consecutive integration failures", "אין התראה על כשלים רצופים באינטגרציה", "لا تنبيه على أعطال تكامل متتالية"],
      ["Form field mismatch rejecting records", "אי-התאמה בשדות הטופס שדוחה רשומות", "عدم تطابق حقول النموذج يرفض السجلات"]
    ],
    corr: ["Refresh the connector credentials, replay the queued records with their original timestamps, and hand the list to sales flagged as delayed contact.",
      "לרענן את הרשאות ה-Connector, לשחזר את הרשומות מהתור עם חתימות הזמן המקוריות, ולהעביר את הרשימה למכירות בסימון \"מגע באיחור\".",
      "تحديث بيانات اعتماد الموصل، وإعادة إدخال السجلات المنتظرة بطوابعها الأصلية، وتسليم القائمة للمبيعات موسومة كتواصل متأخر."],
    prev: ["Alert on two consecutive connector failures and reconcile platform-to-CRM counts hourly.",
      "התראה על שני כשלים רצופים ב-Connector והתאמת ספירה שעתית בין הפלטפורמה ל-CRM.",
      "تنبيه على عطلين متتاليين في الموصل ومطابقة الأعداد بين المنصّة وCRM كل ساعة."],
    ver: ["Capture rate back above 99% for 48 hours.", "אחוז הקליטה חוזר מעל 99% במשך 48 שעות.", "عودة نسبة الاستقبال فوق 99% لمدة 48 ساعة."]
  },
  slaBreach: {
    dept: "sales", area: "sales", train: "speed",
    t: ["Median first response is {v} against a {t} target", "חציון תגובה ראשונה {v} מול יעד של {t}", "وسيط أول استجابة {v} مقابل هدف {t}"],
    why: ["Response speed is the strongest single predictor of contact rate. Every lead that waits past the SLA is a lead the business already paid for and is now losing to whoever answered first.",
      "מהירות התגובה היא החזאי החזק ביותר ל-Contact Rate. כל ליד שמחכה מעבר ל-SLA הוא ליד שהעסק כבר שילם עליו, ומאבד למי שענה ראשון.",
      "سرعة الاستجابة أقوى مؤشر منفرد على معدّل التواصل. كل عميل ينتظر بعد SLA هو عميل دفعت الشركة ثمنه وتخسره لمن أجاب أولاً."],
    causes: [
      ["Assignment rule not matched to the live shift roster", "כלל השיוך לא מותאם ללוח המשמרות בפועל", "قاعدة الإسناد غير مطابقة لجدول الورديات الفعلي"],
      ["No escalation when the SLA is breached", "אין הסלמה בעת חריגת SLA", "لا تصعيد عند تجاوز SLA"],
      ["Volume above team capacity in peak hours", "כמות מעל קיבולת הצוות בשעות השיא", "حجم يفوق قدرة الفريق في ساعات الذروة"]
    ],
    corr: ["Call the breached list today, cap per-rep daily assignment, and reassign anything untouched right now.",
      "לחייג היום לרשימת החריגות, להגביל שיוך יומי לנציג, ולשייך מחדש כל מה שלא טופל כרגע.",
      "الاتصال بقائمة التجاوزات اليوم، وتحديد سقف إسناد يومي لكل مندوب، وإعادة إسناد كل ما لم يُعالج الآن."],
    prev: ["Auto-reassign after {t}, escalate to the manager at double that, and tie assignment to the shift roster.",
      "שיוך אוטומטי מחדש אחרי {t}, הסלמה למנהל בכפול, וקישור השיוך ללוח המשמרות.",
      "إعادة إسناد تلقائية بعد {t}، وتصعيد للمدير عند الضعف، وربط الإسناد بجدول الورديات."],
    ver: ["Median response inside target for 7 consecutive days.", "חציון תגובה בתוך היעד 7 ימים רצופים.", "وسيط استجابة داخل الهدف سبعة أيام متتالية."]
  },
  noFollowup: {
    dept: "sales", area: "sales", train: "followup",
    t: ["{p}% of live leads got a single contact attempt", "{p}% מהלידים הפעילים קיבלו ניסיון קשר אחד", "{p}% من العملاء النشطين تلقّوا محاولة واحدة"],
    why: ["Most deals in this funnel close between the second and fourth attempt. Stopping at one attempt writes off leads that were already paid for and were never actually worked.",
      "רוב העסקאות במשפך הזה נסגרות בין הניסיון השני לרביעי. עצירה בניסיון אחד מוחקת לידים ששולם עליהם ולמעשה לא טופלו.",
      "معظم الصفقات في هذا المسار تُغلق بين المحاولة الثانية والرابعة. التوقّف عند محاولة واحدة يُهدر عملاء دُفع ثمنهم ولم يُعالَجوا فعلاً."],
    causes: [
      ["No minimum cadence defined or enforced", "לא מוגדר או נאכף מקצב מינימלי", "لا إيقاع أدنى محدّد أو مفروض"],
      ["Reps judged on new leads instead of worked leads", "נציגים נמדדים על לידים חדשים ולא על לידים שטופלו", "المندوبون يُقاسون بعملاء جدد لا بعملاء مُعالَجين"],
      ["No task or reminder created after the first call", "לא נוצרת משימה או תזכורת אחרי השיחה הראשונה", "لا مهمة أو تذكير يُنشأ بعد المكالمة الأولى"]
    ],
    corr: ["Rework the single-attempt list this week under the four-touch cadence and log every attempt.",
      "לעבוד מחדש השבוע על רשימת הניסיון הבודד לפי מקצב ארבעת המגעים ולתעד כל ניסיון.",
      "إعادة العمل هذا الأسبوع على قائمة المحاولة الواحدة وفق إيقاع اللمسات الأربع وتسجيل كل محاولة."],
    prev: ["Auto-create the next follow-up task on every call outcome that is not won or lost.",
      "יצירה אוטומטית של משימת Follow-up הבאה בכל תוצאת שיחה שאינה נסגר או אבוד.",
      "إنشاء مهمة المتابعة التالية تلقائياً لكل نتيجة مكالمة ليست مكسوبة أو مفقودة."],
    ver: ["Average attempts per worked lead above {t} for two weeks.", "ממוצע ניסיונות לליד מטופל מעל {t} במשך שבועיים.", "متوسط المحاولات لكل عميل مُعالَج فوق {t} لأسبوعين."]
  },
  cplUp: {
    dept: "marketing", area: "marketing", train: "campaigns",
    t: ["CPL rose to {v}, {p}% above the {t} target", "ה-CPL עלה ל-{v}, {p}% מעל היעד {t}", "ارتفعت تكلفة العميل إلى {v}، {p}% فوق الهدف {t}"],
    why: ["Cost per lead alone is not the verdict — but at this level the plan does not close. Either the lead target is unreachable inside the budget, or the money is pointed at the wrong campaigns.",
      "CPL לבדו אינו פסק דין — אבל ברמה הזו התכנון לא נסגר. או שיעד הלידים לא בר-השגה בתקציב, או שהכסף מכוון לקמפיינים הלא נכונים.",
      "تكلفة العميل وحدها ليست حكماً — لكن عند هذا المستوى لا تُغلق الخطة. فإمّا أن هدف العملاء غير قابل للتحقيق بالميزانية، أو أن المال موجَّه إلى الحملات الخطأ."],
    causes: [
      ["Auction pressure and audience saturation", "לחץ מכרז ורוויית קהל", "ضغط المزاد وإشباع الجمهور"],
      ["Budget allocated by channel instead of verified return", "התקציב מוקצה לפי ערוץ ולא לפי תשואה מאומתת", "الميزانية موزّعة حسب القناة لا حسب مردود مُتحقَّق"],
      ["Landing page or form friction reducing conversion", "חסמים בדף הנחיתה או בטופס שמורידים המרה", "عوائق في صفحة الهبوط أو النموذج تخفض التحويل"]
    ],
    corr: ["Move spend to the campaigns with proven qualified-lead cost, and pause the worst two for seven days.",
      "להעביר הוצאה לקמפיינים עם עלות ליד איכותי מוכחת, ולעצור את שני הגרועים לשבעה ימים.",
      "نقل الإنفاق إلى الحملات ذات تكلفة العميل المؤهّل المُثبتة، وإيقاف الأسوأ اثنتين سبعة أيام."],
    prev: ["Optimise and report on cost per qualified lead, and review allocation weekly against verified return.",
      "לבצע אופטימיזציה ולדווח על CPQL, ולסקור הקצאה שבועית מול תשואה מאומתת.",
      "التحسين والتقرير على تكلفة العميل المؤهّل، ومراجعة التخصيص أسبوعياً مقابل مردود مُتحقَّق."],
    ver: ["CPL inside target for 200 leads, with qualified rate not lower than today.", "CPL בתוך היעד על 200 לידים, ללא ירידה באחוז האיכותיים.", "تكلفة العميل داخل الهدف على 200 عميل، دون هبوط نسبة المؤهّلين."]
  },
  qualityDrop: {
    dept: "marketing", area: "quality", train: "targeting",
    t: ["Qualified rate is {p}%, against a {t}% baseline", "אחוז הלידים האיכותיים {p}%, מול Baseline של {t}%", "نسبة المؤهّلين {p}%، مقابل خط أساس {t}%"],
    why: ["This is the case where marketing looks like it is winning and sales looks like it is failing, and neither is true. The business pays more for every real opportunity while reps burn capacity on leads that cannot buy.",
      "זה המקרה שבו נראה שהשיווק מצליח והמכירות נכשלות — ושתי המסקנות שגויות. העסק משלם יותר על כל הזדמנות אמיתית, והנציגים שורפים זמן על לידים שלא יכולים לקנות.",
      "هذه الحالة التي يبدو فيها التسويق ناجحاً والمبيعات فاشلة، وكلاهما خطأ. تدفع الشركة أكثر لكل فرصة حقيقية بينما يستهلك المندوبون وقتهم على عملاء لا يقدرون على الشراء."],
    causes: [
      ["Audience expansion pulled in low-intent traffic", "הרחבת קהל הכניסה תנועה בכוונה נמוכה", "توسيع الجمهور جذب زيارات منخفضة النيّة"],
      ["Offer or price mismatch for the new segment", "אי-התאמה בין ההצעה או המחיר לסגמנט החדש", "عدم تطابق العرض أو السعر مع الشريحة الجديدة"],
      ["Qualification definition drifting between reps", "הגדרת ליד איכותי נסחפת בין נציגים", "تباين تعريف العميل المؤهّل بين المندوبين"]
    ],
    corr: ["Split generic from branded campaigns, return targeting to the proven groups for seven days, and re-add the qualifying field to the form.",
      "להפריד קמפיינים גנריים ממותגיים, להחזיר את הטירגוט לקבוצות המוכחות לשבעה ימים, ולהחזיר לטופס את שדה הסינון.",
      "فصل الحملات العامة عن حملات العلامة، وإرجاع الاستهداف إلى المجموعات المُثبتة سبعة أيام، وإعادة الحقل المؤهِّل إلى النموذج."],
    prev: ["Alert whenever qualified rate falls more than 8 points against the 30-day baseline, and write the qualified-lead definition into the CRM.",
      "התראה בכל ירידה של מעל 8 נקודות באחוז האיכותיים מול Baseline של 30 יום, וכתיבת הגדרת הליד האיכותי לתוך ה-CRM.",
      "تنبيه عند هبوط نسبة المؤهّلين أكثر من 8 نقاط مقابل خط أساس 30 يوماً، وكتابة تعريف العميل المؤهّل في CRM."],
    ver: ["Qualified rate back within 4 points of baseline over 200 leads.", "אחוז האיכותיים חוזר לטווח 4 נקודות מה-Baseline על 200 לידים.", "عودة نسبة المؤهّلين إلى 4 نقاط من خط الأساس على 200 عميل."]
  },
  fatigue: {
    dept: "content", area: "marketing", train: "creative",
    t: ["Creative fatigue on {c}: frequency {f}, CTR down {p}%", "עייפות קריאייטיב ב-{c}: Frequency {f}, CTR ירד {p}%", "إجهاد إبداعي في {c}: التكرار {f}، وCTR هبط {p}%"],
    why: ["Post-click conversion has not changed, which is what makes this diagnosable: the offer and the landing page are fine, the audience is simply saturated. Without rotation the same lead volume costs more every week.",
      "ההמרה אחרי הקליק לא השתנתה, וזה מה שמאפשר לאבחן: ההצעה ודף הנחיתה תקינים, הקהל פשוט רווי. בלי רוטציה אותה כמות לידים תעלה יותר כל שבוע.",
      "التحويل بعد النقرة لم يتغيّر، وهذا ما يجعل التشخيص ممكناً: العرض وصفحة الهبوط سليمان، والجمهور مُشبَع. وبدون تدوير سيزداد سعر نفس عدد العملاء أسبوعياً."],
    causes: [
      ["No creative rotation — audience saturation", "אין רוטציית קריאייטיב — רוויית קהל", "لا تدوير للإبداعات — إشباع الجمهور"],
      ["Audience too narrow for the spend level", "הקהל צר מדי לרמת ההוצאה", "الجمهور ضيّق جداً لمستوى الإنفاق"],
      ["Competitor entered the same auction", "מתחרה נכנס לאותו מכרז", "منافس دخل المزاد ذاته"]
    ],
    corr: ["Ship four new creatives in two message angles this week and cap frequency.", "להעלות ארבעה קריאייטיבים חדשים בשתי זוויות מסר השבוע ולהגביל Frequency.", "إطلاق أربعة إبداعات جديدة بزاويتَي رسالة هذا الأسبوع وتحديد سقف التكرار."],
    prev: ["Open a creative-refresh task automatically when frequency rises while CTR falls over a 7-day window.", "לפתוח משימת רענון קריאייטיב אוטומטית כשה-Frequency עולה וה-CTR יורד בחלון של 7 ימים.", "فتح مهمة تحديث إبداع تلقائياً عند ارتفاع التكرار وهبوط CTR خلال 7 أيام."],
    ver: ["CTR back within 10% of its 30-day best and CPL inside target.", "CTR חוזר לטווח 10% מהשיא של 30 יום ו-CPL בתוך היעד.", "عودة CTR إلى 10% من أفضل قيمة في 30 يوماً وتكلفة عميل داخل الهدف."]
  },
  budgetAlloc: {
    dept: "marketing", area: "marketing", train: "campaigns", approval: true,
    t: ["{c} is capped by budget at ROAS {r}, while {c2} keeps spending at ROAS {r2}", "{c} מוגבל בתקציב ב-ROAS {r}, בעוד {c2} ממשיך להוציא ב-ROAS {r2}", "{c} مقيّدة بالميزانية عند ROAS {r}، بينما تواصل {c2} الإنفاق عند ROAS {r2}"],
    why: ["This is an allocation loss, not a performance problem — the money is already committed, it is simply pointed at the wrong campaign. Moving it is a financial action, so the system recommends and a human approves.",
      "זה אובדן הקצאה, לא בעיית ביצועים — הכסף כבר מחויב, הוא פשוט מכוון לקמפיין הלא נכון. העברה היא פעולה כספית, ולכן המערכת ממליצה ואדם מאשר.",
      "هذه خسارة تخصيص لا مشكلة أداء — المال ملتزَم أصلاً لكنه موجّه إلى الحملة الخطأ. والنقل إجراء مالي، فيوصي النظام ويعتمد الإنسان."],
    causes: [
      ["Budget allocated by channel, not by verified return", "התקציב מוקצה לפי ערוץ ולא לפי תשואה מאומתת", "الميزانية موزّعة حسب القناة لا حسب مردود مُتحقَّق"],
      ["No pacing rule tied to return thresholds", "אין כלל Pacing שקשור לספי תשואה", "لا قاعدة وتيرة مرتبطة بحدود المردود"],
      ["Seasonal or regional demand shift", "שינוי ביקוש עונתי או אזורי", "تحوّل موسمي أو إقليمي في الطلب"]
    ],
    corr: ["Recommended: move budget from the low-return campaign to the capped one and hold total spend flat. Requires an authorised approval.",
      "מומלץ: להעביר תקציב מהקמפיין בתשואה נמוכה לזה שמוגבל, ולשמור על הוצאה כוללת זהה. מחייב אישור מורשה.",
      "الموصى به: نقل ميزانية من الحملة منخفضة المردود إلى المقيّدة مع تثبيت الإنفاق الكلي. يتطلب موافقة مُصرَّحة."],
    prev: ["Weekly allocation review against verified return, with an automatic recommendation when a campaign is capped above target.",
      "סקירת הקצאה שבועית מול תשואה מאומתת, עם המלצה אוטומטית כשקמפיין מוגבל מעל היעד.",
      "مراجعة تخصيص أسبوعية مقابل مردود مُتحقَّق، مع توصية آلية عند تقييد حملة فوق الهدف."],
    ver: ["Blended return above target within 14 days at the same total spend.", "תשואה משוקללת מעל היעד בתוך 14 יום באותה הוצאה כוללת.", "مردود مركّب فوق الهدف خلال 14 يوماً بنفس الإنفاق."]
  },
  utmMissing: {
    dept: "it", area: "tracking", train: "tracking",
    t: ["{p}% of leads carry no UTM — attribution is unreliable", "ל-{p}% מהלידים אין UTM — הייחוס לא אמין", "{p}% من العملاء بلا UTM — النسب غير موثوق"],
    why: ["Budget decisions made on partial attribution move money away from campaigns that actually produce revenue. While this is open, automatic budget recommendations stay blocked.",
      "החלטות תקציב על בסיס ייחוס חלקי מזיזות כסף מקמפיינים שדווקא מייצרים הכנסה. כל עוד זה פתוח, המלצות תקציב אוטומטיות חסומות.",
      "قرارات الميزانية على نسب جزئية تنقل المال بعيداً عن حملات تُنتج إيراداً. وطالما هذا مفتوح، تبقى توصيات الميزانية الآلية محجوبة."],
    causes: [
      ["Click parameters not persisted before an outbound redirect", "פרמטרי הקליק לא נשמרים לפני הפניה חוצה", "معطيات النقرة لا تُحفظ قبل التحويل الخارجي"],
      ["Messaging channels drop query parameters", "ערוצי הודעות מאבדים פרמטרים", "قنوات المراسلة تُسقط المعطيات"],
      ["Offline sales imported without identifiers", "מכירות Offline מיובאות ללא מזהים", "المبيعات دون اتصال تُستورد بلا معرّفات"]
    ],
    corr: ["Persist click IDs in first-party storage on landing, append them to message and call links, and re-import the period's offline sales with identifiers.",
      "לשמור Click ID ב-Storage צד-ראשון בכניסה לדף, להצמיד אותו לקישורי הודעות וטלפון, ולייבא מחדש את מכירות ה-Offline של התקופה עם מזהים.",
      "حفظ معرّفات النقرة في تخزين الطرف الأول عند الهبوط، وإلحاقها بروابط الرسائل والاتصال، وإعادة استيراد مبيعات الفترة دون اتصال مع المعرّفات."],
    prev: ["Nightly synthetic test that submits a tagged lead through every channel and fails loudly if the UTM does not arrive.",
      "בדיקה סינתטית לילית ששולחת ליד מתויג בכל ערוץ ונכשלת בקול אם ה-UTM לא מגיע.",
      "اختبار اصطناعي ليلي يرسل عميلاً موسوماً في كل قناة ويفشل بصوت عالٍ إن لم يصل UTM."],
    ver: ["Missing-UTM share under 5% for 7 days across all channels.", "שיעור ה-UTM החסר מתחת ל-5% במשך 7 ימים בכל הערוצים.", "نسبة UTM المفقود أقل من 5% لسبعة أيام في كل القنوات."]
  },
  unassigned: {
    dept: "sales", area: "crm", train: "leadmgmt",
    t: ["{n} leads have no owner", "{n} לידים ללא בעלים", "{n} عميلاً بلا مالك"],
    why: ["A lead with no owner is a lead nobody is accountable for. It will not appear in anyone's queue and will age out silently.",
      "ליד ללא בעלים הוא ליד שאף אחד לא אחראי עליו. הוא לא יופיע בתור של אף אחד ויתיישן בשקט.",
      "العميل بلا مالك عميل لا يُحاسب عليه أحد. لن يظهر في قائمة أحد وسيتقادم بصمت."],
    causes: [
      ["Assignment rule has no fallback owner", "לכלל השיוך אין בעלים ברירת מחדל", "قاعدة الإسناد بلا مالك احتياطي"],
      ["Rep deactivated without reassigning their queue", "נציג הושבת בלי לשייך מחדש את התור שלו", "تعطيل مندوب دون إعادة إسناد قائمته"],
      ["Leads created outside the normal intake path", "לידים שנוצרו מחוץ למסלול הקליטה הרגיל", "عملاء أُنشئوا خارج مسار الاستقبال المعتاد"]
    ],
    corr: ["Assign all ownerless leads now and contact any that are older than the SLA.", "לשייך מיד את כל הלידים ללא בעלים וליצור קשר עם כל מי שמעבר ל-SLA.", "إسناد كل العملاء بلا مالك الآن والتواصل مع كل من تجاوز SLA."],
    prev: ["Set a fallback owner on the assignment rule and alert on any lead unassigned for 10 minutes.", "להגדיר בעלים ברירת מחדל בכלל השיוך ולהתריע על ליד ללא שיוך 10 דקות.", "تعيين مالك احتياطي في قاعدة الإسناد والتنبيه على أي عميل بلا إسناد 10 دقائق."],
    ver: ["Zero ownerless leads for 7 days.", "אפס לידים ללא בעלים במשך 7 ימים.", "صفر عملاء بلا مالك لسبعة أيام."]
  },
  lostReason: {
    dept: "sales", area: "crm", train: "leadmgmt",
    t: ["{p}% of lost leads have no lost reason", "ל-{p}% מהלידים שאבדו אין סיבת אובדן", "{p}% من العملاء المفقودين بلا سبب خسارة"],
    why: ["Without lost reasons there is no way to tell a pricing problem from a targeting problem from a service problem. Every improvement decision after this point is a guess.",
      "בלי סיבות אובדן אין דרך להבדיל בין בעיית מחיר, בעיית טירגוט ובעיית שירות. כל החלטת שיפור מכאן היא ניחוש.",
      "بدون أسباب الخسارة لا سبيل للتمييز بين مشكلة سعر ومشكلة استهداف ومشكلة خدمة. وكل قرار تحسين بعد ذلك تخمين."],
    causes: [
      ["Field not mandatory on the lost status", "השדה אינו חובה בסטטוס אבוד", "الحقل غير إلزامي في حالة الخسارة"],
      ["Reason list too long or not matching reality", "רשימת הסיבות ארוכה מדי או לא תואמת למציאות", "قائمة الأسباب طويلة جداً أو لا تطابق الواقع"],
      ["No manager review of closed-lost records", "אין סקירת מנהל לרשומות שנסגרו כאבודות", "لا مراجعة مديرية لسجلات الخسارة"]
    ],
    corr: ["Make the field mandatory, and backfill the period's lost leads in a single review session.", "להפוך את השדה לחובה, ולהשלים את הלידים שאבדו בתקופה בסשן סקירה אחד.", "جعل الحقل إلزامياً، واستكمال العملاء المفقودين في الفترة بجلسة مراجعة واحدة."],
    prev: ["Block the lost status without a reason, and review the reason mix weekly.", "לחסום סטטוס אבוד ללא סיבה, ולסקור את תמהיל הסיבות שבועית.", "حجب حالة الخسارة دون سبب، ومراجعة توزيع الأسباب أسبوعياً."],
    ver: ["Lost-reason coverage above 95% for two weeks.", "כיסוי סיבות אובדן מעל 95% במשך שבועיים.", "تغطية أسباب الخسارة فوق 95% لأسبوعين."]
  },
  duplicates: {
    dept: "it", area: "crm", train: "leadmgmt",
    t: ["{n} duplicate leads in the period", "{n} לידים כפולים בתקופה", "{n} عميلاً مكرّراً في الفترة"],
    why: ["Duplicates inflate lead counts, deflate conversion rates and get the same person called twice by two reps — which costs trust as well as money.",
      "כפילויות מנפחות את מספר הלידים, מדללות את יחסי ההמרה, וגורמות לאותו אדם לקבל שתי שיחות משני נציגים — מה שעולה באמון ולא רק בכסף.",
      "التكرارات تضخّم عدد العملاء وتخفض معدّلات التحويل وتجعل الشخص ذاته يتلقّى مكالمتين من مندوبين — وهذا يكلّف الثقة لا المال فقط."],
    causes: [
      ["No dedup rule on phone or email at intake", "אין כלל דה-דופליקציה על טלפון או אימייל בקליטה", "لا قاعدة إزالة تكرار على الهاتف أو البريد عند الاستقبال"],
      ["The same person submitting through two channels", "אותו אדם ממלא טופס בשני ערוצים", "الشخص ذاته يرسل عبر قناتين"],
      ["Retry logic writing a record twice", "לוגיקת Retry שכותבת רשומה פעמיים", "منطق إعادة المحاولة يكتب السجل مرتين"]
    ],
    corr: ["Merge the duplicates, keeping the earliest timestamp and the richer record.", "למזג את הכפילויות, לשמור את חתימת הזמן המוקדמת והרשומה העשירה יותר.", "دمج التكرارات مع الإبقاء على أقدم طابع زمني والسجل الأغنى."],
    prev: ["Dedup on normalised phone and email at intake, and make retries idempotent.", "דה-דופליקציה על טלפון ואימייל מנורמלים בקליטה, ולהפוך Retry לאידמפוטנטי.", "إزالة التكرار على هاتف وبريد مُوحَّدين عند الاستقبال، وجعل إعادة المحاولة عديمة الأثر."],
    ver: ["Duplicate rate under 1% for two weeks.", "שיעור הכפילויות מתחת ל-1% במשך שבועיים.", "نسبة التكرار أقل من 1% لأسبوعين."]
  },
  reviewsSla: {
    dept: "service", area: "service", train: "reviews",
    t: ["{n} negative reviews unanswered beyond the SLA", "{n} ביקורות שליליות ללא מענה מעבר ל-SLA", "{n} مراجعة سلبية بلا ردّ بعد SLA"],
    why: ["Reviews are the last stage of the funnel and the first thing the next buyer sees. An unanswered complaint keeps costing money long after the operational cause behind it is fixed.",
      "ביקורות הן השלב האחרון במשפך והדבר הראשון שהקונה הבא רואה. תלונה ללא מענה ממשיכה לעלות כסף זמן רב אחרי שהסיבה התפעולית נפתרה.",
      "المراجعات هي المرحلة الأخيرة في المسار وأول ما يراه المشتري التالي. والشكوى بلا ردّ تكلّف مالاً بعد إصلاح سببها التشغيلي بوقت طويل."],
    causes: [
      ["No owner assigned to review response", "אין אחראי מוגדר למענה לביקורות", "لا مسؤول محدّد للردّ على المراجعات"],
      ["Complaints not linked to the operational incident", "התלונות לא מקושרות לאירוע התפעולי", "الشكاوى غير مرتبطة بالحادث التشغيلي"],
      ["A genuine service failure behind the sentiment", "כשל שירות אמיתי מאחורי הסנטימנט", "خلل خدمة حقيقي وراء المشاعر"]
    ],
    corr: ["Assign an owner, answer all of them with the approved template inside 24 hours, and close the loop personally with anyone still waiting.",
      "להגדיר אחראי, להשיב לכולן בתבנית המאושרת בתוך 24 שעות, ולסגור מעגל אישית עם מי שעדיין ממתין.",
      "تعيين مسؤول، والردّ على جميعها بالقالب المعتمد خلال 24 ساعة، وإغلاق الحلقة شخصياً مع من ينتظر."],
    prev: ["Route every new review into the issue queue with a 24-hour SLA, classified by root cause rather than sentiment.",
      "לנתב כל ביקורת חדשה לתור הבעיות עם SLA של 24 שעות, בסיווג לפי שורש הבעיה ולא סנטימנט.",
      "توجيه كل مراجعة جديدة إلى قائمة المشكلات بـSLA 24 ساعة، مصنّفة حسب السبب الجذري لا المشاعر."],
    ver: ["100% response inside SLA for 30 days.", "100% מענה בתוך ה-SLA במשך 30 יום.", "ردّ 100% داخل SLA لثلاثين يوماً."]
  },
  siteHealth: {
    dept: "it", area: "tracking", train: "tracking",
    t: ["{n} synthetic checks are failing on the site", "{n} בדיקות סינתטיות נכשלות באתר", "{n} اختبارات اصطناعية تفشل في الموقع"],
    why: ["A broken form or a slow mobile page fails silently: the ad spend keeps running while the leads never arrive. This is the cheapest failure to fix and the most expensive to miss.",
      "טופס שבור או דף מובייל איטי נכשלים בשקט: הוצאת הפרסום ממשיכה והלידים לא מגיעים. זה הכשל הזול ביותר לתקן והיקר ביותר לפספס.",
      "نموذج معطّل أو صفحة موبايل بطيئة تفشل بصمت: يستمر الإنفاق الإعلاني ولا يصل العملاء. أرخص خلل إصلاحاً وأغلاه تفويتاً."],
    causes: [
      ["Form endpoint or validation error", "שגיאה בנקודת הקצה או בוואלידציה של הטופס", "خطأ في نقطة نهاية النموذج أو التحقق"],
      ["Mobile performance regression after a change", "רגרסיה בביצועי מובייל אחרי שינוי", "تراجع أداء الموبايل بعد تغيير"],
      ["Tag or event firing broken", "שבירה בהפעלת Tag או Event", "تعطّل إطلاق وسم أو حدث"]
    ],
    corr: ["Fix the failing check, submit a live test lead through every channel, and confirm it lands in the CRM with its source.",
      "לתקן את הבדיקה שנכשלת, לשלוח ליד בדיקה אמיתי בכל ערוץ, ולאמת שהוא נקלט ב-CRM עם המקור.",
      "إصلاح الفحص الفاشل، وإرسال عميل اختبار حقيقي في كل قناة، والتأكد من وصوله إلى CRM مع مصدره."],
    prev: ["Run the synthetic suite every 15 minutes and page the owner on two consecutive failures.",
      "להריץ את סוויטת הבדיקות כל 15 דקות ולהתריע לאחראי על שני כשלים רצופים.",
      "تشغيل حزمة الفحوصات كل 15 دقيقة وتنبيه المسؤول على عطلين متتاليين."],
    ver: ["All checks passing for 48 hours.", "כל הבדיקות עוברות במשך 48 שעות.", "نجاح كل الفحوصات لمدة 48 ساعة."]
  }
};

/* ---------- diagnosis ---------- */
window.MKT_DX = {
  ask: ["Ask about your business", "שאל על העסק שלך", "اسأل عن عملك"],
  askPh: ["e.g. why did sales drop this month?", "לדוגמה: למה המכירות ירדו החודש?", "مثال: لماذا هبطت المبيعات هذا الشهر؟"],
  run: ["Analyse", "נתח", "حلّل"],
  presets: [
    { k: "salesDown", q: ["Why did sales drop?", "למה המכירות ירדו?", "لماذا هبطت المبيعات؟"] },
    { k: "cplUp", q: ["Why did the cost per lead rise?", "למה עלות הליד עלתה?", "لماذا ارتفعت تكلفة العميل؟"] },
    { k: "notClosing", q: ["Why aren't the leads closing?", "למה הלידים לא נסגרים?", "لماذا لا تُغلق الصفقات؟"] },
    { k: "whose", q: ["Is the problem marketing or sales?", "האם הבעיה בשיווק או במכירות?", "هل المشكلة في التسويق أم المبيعات؟"] },
    { k: "training", q: ["Which employee needs training?", "איזה עובד צריך הדרכה?", "أي موظف يحتاج تدريباً؟"] },
    { k: "market", q: ["Which country performs best?", "באיזו מדינה הקמפיין עובד הכי טוב?", "في أي دولة تعمل الحملة أفضل؟"] },
    { k: "week", q: ["What should we improve this week?", "מה לשפר השבוע?", "ما الذي نحسّنه هذا الأسبوع؟"] },
    { k: "method", q: ["Are we implementing the DriftX method?", "האם אנחנו מיישמים את שיטת DriftX?", "هل نطبّق منهج DriftX؟"] }
  ],
  conclusion: ["Conclusion", "מסקנה", "الاستنتاج"],
  support: ["Supporting data", "נתונים תומכים", "بيانات مساندة"],
  split: ["Responsibility split", "חלוקת אחריות", "توزيع المسؤولية"],
  splitNote: ["An estimate from measured deviations per stage — not an absolute fact.", "אומדן מתוך חריגות שנמדדו בכל שלב — לא עובדה מוחלטת.", "تقدير من انحرافات مقيسة لكل مرحلة — لا حقيقة مطلقة."],
  actions: ["Recommended actions", "הפעולות המומלצות", "الإجراءات الموصى بها"],
  sources: ["Data sources", "מקורות הנתונים", "مصادر البيانات"],
  createTasks: ["Turn these into tasks", "הפוך למשימות", "حوّلها إلى مهام"],
  tasksMade: ["{n} tasks added to the action plan", "{n} משימות נוספו לתוכנית הפעולה", "أُضيفت {n} مهمة إلى خطة العمل"],
  noData: ["There is not enough connected data to answer that yet.", "אין מספיק נתונים מחוברים כדי לענות על זה.", "لا توجد بيانات موصولة كافية للإجابة بعد."],
  external: ["External conditions", "תנאים חיצוניים", "ظروف خارجية"]
};

/* ---------- T() ---------- */
(function () {
  var IDX = { en: 0, he: 1, ar: 2 };
  window.MKT_LANG = function () {
    var l = document.documentElement.lang;
    return IDX[l] == null ? "en" : l;
  };
  window.MKT_I = function () { return IDX[window.MKT_LANG()] || 0; };
  window.MKT_P = function (arr) {
    if (arr == null) return "";
    if (typeof arr === "string") return arr;
    return arr[window.MKT_I()] != null ? arr[window.MKT_I()] : arr[0];
  };
  window.T = function (key, vars) {
    var row = window.MKT_STR[key];
    var s = row ? window.MKT_P(row) : key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        s = s.split("{" + k + "}").join(vars[k]);
      });
    }
    return s;
  };
  window.TP = function (arr, vars) {
    var s = window.MKT_P(arr);
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split("{" + k + "}").join(vars[k]); });
    return s;
  };
})();
