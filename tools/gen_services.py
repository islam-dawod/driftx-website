# -*- coding: utf-8 -*-
"""Generate DriftX SEO service pages (EN/HE/AR) into /<slug>/index.html.
Run from repo root:  python tools/gen_services.py
Pages reuse css/styles.css + js/i18n.js + js/app.js (with PAGE_I18N overrides)."""
import os, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Shared page copy (nav/footer come from js/i18n.js; these are page-frame extras)
SHARED = {
    "en": {
        "sp.look": "What we look at", "sp.get": "What you get",
        "sp.how": "How we work", "sp.related": "Related services",
        "sp.ctaTitle": "Let's talk about your business.",
        "sp.ctaText": "Tell us where you are and what's slowing you down. We'll tell you what we'd look at first.",
        "sp.ctaBtn": "Start the conversation", "sp.all": "All of DriftX",
        "sp.s1t": "Analyze", "sp.s1d": "We learn the business and find where value leaks.",
        "sp.s2t": "Build", "sp.s2d": "We design and implement the system around your workflow.",
        "sp.s3t": "Improve", "sp.s3d": "We train the team, measure results and keep optimizing.",
    },
    "he": {
        "sp.look": "מה אנחנו בודקים", "sp.get": "מה מקבלים",
        "sp.how": "איך אנחנו עובדים", "sp.related": "שירותים קשורים",
        "sp.ctaTitle": "בוא נדבר על העסק שלך.",
        "sp.ctaText": "ספר לנו איפה אתה נמצא ומה מעכב אותך. נגיד לך מה היינו בודקים קודם.",
        "sp.ctaBtn": "בוא נתחיל שיחה", "sp.all": "כל DriftX",
        "sp.s1t": "ניתוח", "sp.s1d": "לומדים את העסק ומאתרים איפה נוזל הערך.",
        "sp.s2t": "בנייה", "sp.s2d": "מעצבים ומטמיעים את המערכת סביב אופן העבודה שלך.",
        "sp.s3t": "שיפור", "sp.s3d": "מדריכים את הצוות, מודדים תוצאות וממשיכים למטב.",
    },
    "ar": {
        "sp.look": "ما الذي نفحصه", "sp.get": "ما الذي تحصل عليه",
        "sp.how": "كيف نعمل", "sp.related": "خدمات ذات صلة",
        "sp.ctaTitle": "لنتحدّث عن عملك.",
        "sp.ctaText": "أخبرنا أين أنت وما الذي يبطئك. سنخبرك بما سننظر إليه أولاً.",
        "sp.ctaBtn": "لنبدأ الحوار", "sp.all": "كل DriftX",
        "sp.s1t": "التحليل", "sp.s1d": "نفهم العمل ونكتشف أين يتسرّب منه الإمكان.",
        "sp.s2t": "البناء", "sp.s2d": "نصمّم وننفّذ النظام حول طريقة عملك.",
        "sp.s3t": "التحسين", "sp.s3d": "ندرّب الفريق ونقيس النتائج ونواصل التحسين.",
    },
}

# Per-service content. Each field is {en, he, ar}. bullets = list of {en,he,ar}.
SERVICES = [
    {
        "slug": "sales-consulting", "cat": {"en": "Sales", "he": "מכירות", "ar": "المبيعات"},
        "title": {"en": "Sales Consulting", "he": "ייעוץ מכירות", "ar": "استشارات المبيعات"},
        "tag": {"en": "Turn interest into revenue.", "he": "להפוך התעניינות להכנסה.", "ar": "حوّل الاهتمام إلى إيراد."},
        "intro": {"en": "We examine your entire sales motion — from the first response to the closed deal — and rebuild the parts that leak revenue.",
                  "he": "אנחנו בוחנים את כל תהליך המכירה שלך — מהתגובה הראשונה ועד סגירת העסקה — ובונים מחדש את החלקים שמאבדים הכנסה.",
                  "ar": "نفحص عملية مبيعاتك كاملة — من أول استجابة حتى إتمام الصفقة — ونعيد بناء الأجزاء التي تُهدر الإيراد."},
        "bullets": [
            {"en": "Existing sales process & response speed", "he": "תהליך המכירה הקיים ומהירות התגובה", "ar": "عملية المبيعات الحالية وسرعة الاستجابة"},
            {"en": "Lead handling & needs discovery", "he": "טיפול בלידים ואיתור צרכים", "ar": "التعامل مع العملاء واكتشاف الاحتياج"},
            {"en": "Objection handling & closing", "he": "טיפול בהתנגדויות וסגירה", "ar": "معالجة الاعتراضات والإغلاق"},
            {"en": "Follow-up & customer retention", "he": "Follow-up ושימור לקוחות", "ar": "المتابعة والاحتفاظ بالعملاء"},
            {"en": "A tailored plan your team can actually run", "he": "תוכנית מותאמת שהצוות באמת יכול ליישם", "ar": "خطة مخصّصة يستطيع فريقك تنفيذها فعلاً"},
        ],
        "related": ["sales-training", "sales-center", "crm-development"],
    },
    {
        "slug": "sales-training", "cat": {"en": "Sales", "he": "מכירות", "ar": "المبيعات"},
        "title": {"en": "Sales Training", "he": "הדרכת מכירות", "ar": "تدريب المبيعات"},
        "tag": {"en": "Teach your team to close.", "he": "ללמד את הצוות לסגור.", "ar": "درّب فريقك على الإغلاق."},
        "intro": {"en": "Structured training that takes your people from interest to closing — skill by skill, with real scripts and practice.",
                  "he": "הדרכה מובנית שלוקחת את האנשים שלך מהתעניינות ועד סגירה — מיומנות אחר מיומנות, עם תסריטים ותרגול אמיתי.",
                  "ar": "تدريب منظّم ينقل فريقك من الاهتمام إلى الإغلاق — مهارة تلو الأخرى، بسكربتات وتطبيق عملي."},
        "bullets": [
            {"en": "Trust building & opening conversations", "he": "יצירת אמון ופתיחת שיחות", "ar": "بناء الثقة وفتح المحادثات"},
            {"en": "Asking the right questions & discovery", "he": "שאלת השאלות הנכונות ואיתור צרכים", "ar": "طرح الأسئلة الصحيحة واكتشاف الاحتياج"},
            {"en": "Presenting value & managing price", "he": "הצגת ערך וניהול מחיר", "ar": "عرض القيمة وإدارة السعر"},
            {"en": "Objections, urgency & closing", "he": "התנגדויות, דחיפות וסגירה", "ar": "الاعتراضات والإلحاح والإغلاق"},
            {"en": "Follow-up, upselling & retention", "he": "Follow-up, Upselling ושימור", "ar": "المتابعة والبيع الإضافي والاحتفاظ"},
        ],
        "related": ["sales-consulting", "sales-center", "ai-solutions"],
    },
    {
        "slug": "sales-center", "cat": {"en": "Sales", "he": "מכירות", "ar": "المبيعات"},
        "title": {"en": "Sales Centers", "he": "מוקדי מכירות", "ar": "مراكز المبيعات"},
        "tag": {"en": "Build a sales floor from zero.", "he": "לבנות מערך מכירות מאפס.", "ar": "ابنِ مركز مبيعات من الصفر."},
        "intro": {"en": "We build sales operations from the ground up — structure, roles, CRM, scripts, KPIs and reporting. You get sales infrastructure, not just people.",
                  "he": "אנחנו בונים מערך מכירות מהיסוד — מבנה, תפקידים, CRM, תסריטים, KPIs ודיווח. מקבלים תשתית מכירות, לא רק עובדים.",
                  "ar": "نبني عمليات المبيعات من الأساس — الهيكل، الأدوار، CRM، السكربتات، مؤشرات الأداء والتقارير. تحصل على بنية مبيعات لا مجرّد موظفين."},
        "bullets": [
            {"en": "Center structure, roles & lead distribution", "he": "מבנה מוקד, תפקידים וחלוקת לידים", "ar": "هيكل المركز والأدوار وتوزيع العملاء"},
            {"en": "CRM, scripts & sales pipeline", "he": "CRM, תסריטים ו-Pipeline", "ar": "CRM والسكربتات وخط أنابيب المبيعات"},
            {"en": "KPIs, targets & quality control", "he": "KPIs, יעדים ובקרת איכות", "ar": "مؤشرات الأداء والأهداف وضبط الجودة"},
            {"en": "Management dashboard & reporting", "he": "דשבורד ניהולי ודיווח", "ar": "لوحة تحكم إدارية وتقارير"},
            {"en": "AI performance analysis", "he": "ניתוח ביצועים מבוסס AI", "ar": "تحليل الأداء بالذكاء الاصطناعي"},
        ],
        "related": ["sales-consulting", "sales-training", "crm-development"],
    },
    {
        "slug": "marketing", "cat": {"en": "Marketing", "he": "שיווק", "ar": "التسويق"},
        "title": {"en": "Marketing", "he": "שיווק", "ar": "التسويق"},
        "tag": {"en": "The right leads, not just more.", "he": "הלידים הנכונים, לא רק יותר.", "ar": "العملاء المناسبون، لا مجرّد المزيد."},
        "intro": {"en": "Before any campaign we learn the customer, the competitors and what actually makes people buy — then connect marketing to sales and revenue.",
                  "he": "לפני כל קמפיין אנחנו לומדים את הלקוח, המתחרים ומה באמת גורם לקנות — ואז מחברים שיווק למכירות ולהכנסה.",
                  "ar": "قبل أي حملة نتعرّف على العميل والمنافسين وما الذي يدفع الناس للشراء فعلاً — ثم نربط التسويق بالمبيعات والإيراد."},
        "bullets": [
            {"en": "Market & competitor analysis", "he": "ניתוח שוק ומתחרים", "ar": "تحليل السوق والمنافسين"},
            {"en": "Customer & offer analysis", "he": "ניתוח לקוח והצעה", "ar": "تحليل العميل والعرض"},
            {"en": "Audience & channel strategy", "he": "אסטרטגיית קהל וערוצים", "ar": "استراتيجية الجمهور والقنوات"},
            {"en": "Creative that converts", "he": "קריאייטיב שממיר", "ar": "محتوى إبداعي يحوّل"},
            {"en": "Lead-quality & conversion analysis", "he": "ניתוח איכות לידים והמרה", "ar": "تحليل جودة العملاء والتحويل"},
        ],
        "related": ["sales-consulting", "ai-solutions", "web-development"],
    },
    {
        "slug": "business-consulting", "cat": {"en": "Business", "he": "עסקים", "ar": "الأعمال"},
        "title": {"en": "Business Consulting", "he": "ייעוץ עסקי", "ar": "استشارات الأعمال"},
        "tag": {"en": "Fix what's actually broken.", "he": "לתקן את מה שבאמת שבור.", "ar": "أصلِح ما تعطّل فعلاً."},
        "intro": {"en": "You can't fix everything with advertising. We look at pricing, people, process and product — then build a plan and stay through implementation.",
                  "he": "אי אפשר לתקן הכול עם פרסום. אנחנו בודקים תמחור, אנשים, תהליך ומוצר — ואז בונים תוכנית ומלווים עד היישום.",
                  "ar": "لا يمكن إصلاح كل شيء بالإعلانات. ننظر في التسعير والأشخاص والعملية والمنتج — ثم نبني خطة ونرافقك حتى التنفيذ."},
        "bullets": [
            {"en": "Pricing & offer structure", "he": "תמחור ומבנה הצעה", "ar": "التسعير وبنية العرض"},
            {"en": "People, roles & management", "he": "אנשים, תפקידים וניהול", "ar": "الأشخاص والأدوار والإدارة"},
            {"en": "Process & workflow", "he": "תהליך וזרימת עבודה", "ar": "العملية وسير العمل"},
            {"en": "Decision-making & data", "he": "קבלת החלטות ונתונים", "ar": "اتخاذ القرار والبيانات"},
            {"en": "A plan we implement with you — not a PDF", "he": "תוכנית שאנחנו מיישמים איתך — לא PDF", "ar": "خطة ننفّذها معك — لا ملف PDF"},
        ],
        "related": ["marketing", "sales-consulting", "business-automation"],
    },
    {
        "slug": "web-development", "cat": {"en": "Technology", "he": "טכנולוגיה", "ar": "التقنية"},
        "title": {"en": "Web Development", "he": "פיתוח אתרים", "ar": "تطوير المواقع"},
        "tag": {"en": "Sites that sell, not just shine.", "he": "אתרים שמוכרים, לא רק יפים.", "ar": "مواقع تبيع، لا تلمع فقط."},
        "intro": {"en": "High-end digital experiences where design, UX, technology, marketing, data and AI meet — built to convert on every device.",
                  "he": "חוויות דיגיטליות ברמה גבוהה שבהן נפגשים עיצוב, UX, טכנולוגיה, שיווק, נתונים ו-AI — בנויות להמרה בכל מכשיר.",
                  "ar": "تجارب رقمية راقية يلتقي فيها التصميم وتجربة المستخدم والتقنية والتسويق والبيانات والذكاء الاصطناعي — مبنية للتحويل على كل جهاز."},
        "bullets": [
            {"en": "Design + UX across desktop, tablet & mobile", "he": "עיצוב + UX בדסקטופ, טאבלט ומובייל", "ar": "التصميم وتجربة المستخدم عبر الحاسوب والجهاز اللوحي والجوال"},
            {"en": "Fast, modern, conversion-focused build", "he": "בנייה מהירה, מודרנית וממוקדת המרה", "ar": "بناء سريع وحديث يركّز على التحويل"},
            {"en": "SEO & performance (Core Web Vitals)", "he": "SEO וביצועים (Core Web Vitals)", "ar": "تحسين محركات البحث والأداء (Core Web Vitals)"},
            {"en": "Analytics & tracking built in", "he": "אנליטיקס ומדידה מובנים", "ar": "تحليلات وتتبّع مدمجة"},
            {"en": "AI woven into the experience", "he": "AI משולב בחוויה", "ar": "ذكاء اصطناعي مدمج في التجربة"},
        ],
        "related": ["marketing", "crm-development", "custom-software"],
    },
    {
        "slug": "crm-development", "cat": {"en": "Technology", "he": "טכנולוגיה", "ar": "التقنية"},
        "title": {"en": "CRM Development", "he": "פיתוח CRM", "ar": "تطوير CRM"},
        "tag": {"en": "A CRM shaped around your workflow.", "he": "CRM שנבנה סביב העבודה שלך.", "ar": "نظام CRM مبني حول طريقة عملك."},
        "intro": {"en": "Custom CRM and lead-management systems built around how your business actually works — with automation and AI where it counts.",
                  "he": "מערכות CRM וניהול לידים מותאמות שנבנות סביב איך שהעסק שלך באמת עובד — עם אוטומציה ו-AI היכן שזה חשוב.",
                  "ar": "أنظمة CRM وإدارة عملاء مخصّصة مبنية حول طريقة عمل شركتك فعلاً — مع أتمتة وذكاء اصطناعي حيث يهمّ."},
        "bullets": [
            {"en": "Lead capture, routing & prioritization", "he": "לכידת לידים, ניתוב ותעדוף", "ar": "التقاط العملاء وتوجيههم وترتيب أولوياتهم"},
            {"en": "Pipeline, stages & automation", "he": "Pipeline, שלבים ואוטומציה", "ar": "خط الأنابيب والمراحل والأتمتة"},
            {"en": "Dashboards & reporting", "he": "דשבורדים ודיווח", "ar": "لوحات التحكم والتقارير"},
            {"en": "Integrations with your existing tools", "he": "אינטגרציות עם הכלים הקיימים", "ar": "تكامل مع أدواتك الحالية"},
            {"en": "AI scoring & call analysis", "he": "ניקוד AI וניתוח שיחות", "ar": "تقييم بالذكاء الاصطناعي وتحليل المكالمات"},
        ],
        "related": ["sales-center", "custom-software", "business-automation"],
    },
    {
        "slug": "custom-software", "cat": {"en": "Technology", "he": "טכנולוגיה", "ar": "التقنية"},
        "title": {"en": "Custom Software", "he": "תוכנה בהתאמה אישית", "ar": "برمجيات مخصّصة"},
        "tag": {"en": "Software that fits how you work.", "he": "תוכנה שמתאימה לאיך שאתה עובד.", "ar": "برمجيات تناسب طريقة عملك."},
        "intro": {"en": "Dashboards, portals, internal tools and mobile & store apps — connected by APIs to the software you already use.",
                  "he": "דשבורדים, פורטלים, כלים פנימיים ואפליקציות מובייל וחנות — מחוברים ב-API לתוכנות שכבר יש לך.",
                  "ar": "لوحات تحكم وبوّابات وأدوات داخلية وتطبيقات جوّال ومتاجر — مترابطة عبر واجهات API مع البرمجيات التي تستخدمها."},
        "bullets": [
            {"en": "Custom dashboards & customer portals", "he": "דשבורדים ופורטלים ללקוחות", "ar": "لوحات تحكم وبوّابات عملاء"},
            {"en": "Internal & operations systems", "he": "מערכות פנים-ארגוניות ותפעול", "ar": "أنظمة داخلية وتشغيلية"},
            {"en": "Mobile & store applications", "he": "אפליקציות מובייל וחנות", "ar": "تطبيقات جوّال ومتاجر"},
            {"en": "API & existing-software integrations", "he": "אינטגרציות API ותוכנות קיימות", "ar": "تكامل واجهات API والبرمجيات الحالية"},
            {"en": "Built to scale with the business", "he": "בנוי לגדול עם העסק", "ar": "مبني لينمو مع العمل"},
        ],
        "related": ["crm-development", "web-development", "ai-solutions"],
    },
    {
        "slug": "ai-solutions", "cat": {"en": "AI", "he": "AI", "ar": "الذكاء الاصطناعي"},
        "title": {"en": "AI Solutions", "he": "פתרונות AI", "ar": "حلول الذكاء الاصطناعي"},
        "tag": {"en": "AI inside your business.", "he": "AI בתוך העסק שלך.", "ar": "الذكاء الاصطناعي داخل عملك."},
        "intro": {"en": "AI isn't just for writing text. We make it part of your infrastructure — analyzing, qualifying, supporting and deciding faster.",
                  "he": "AI הוא לא רק לכתיבת טקסט. אנחנו הופכים אותו לחלק מהתשתית — מנתח, מכשיר לידים, תומך ומחליט מהר יותר.",
                  "ar": "الذكاء الاصطناعي ليس لكتابة النصوص فقط. نجعله جزءاً من بنيتك — يحلّل ويؤهّل ويدعم ويقرّر أسرع."},
        "bullets": [
            {"en": "AI sales & call analysis", "he": "ניתוח מכירות ושיחות ב-AI", "ar": "تحليل المبيعات والمكالمات بالذكاء الاصطناعي"},
            {"en": "AI lead qualification", "he": "הכשרת לידים ב-AI", "ar": "تأهيل العملاء بالذكاء الاصطناعي"},
            {"en": "AI customer support & assistance", "he": "תמיכה וסיוע ללקוח ב-AI", "ar": "دعم ومساعدة العملاء بالذكاء الاصطناعي"},
            {"en": "AI reporting & business intelligence", "he": "דיווח ו-BI ב-AI", "ar": "تقارير وذكاء أعمال بالذكاء الاصطناعي"},
            {"en": "AI knowledge base & content systems", "he": "מאגר ידע ומערכות תוכן ב-AI", "ar": "قاعدة معرفة وأنظمة محتوى بالذكاء الاصطناعي"},
        ],
        "related": ["business-automation", "crm-development", "marketing"],
    },
    {
        "slug": "business-automation", "cat": {"en": "AI", "he": "AI", "ar": "الذكاء الاصطناعي"},
        "title": {"en": "Business Automation", "he": "אוטומציה עסקית", "ar": "أتمتة الأعمال"},
        "tag": {"en": "Stop doing what a machine can do.", "he": "להפסיק לעשות מה שמכונה יכולה.", "ar": "توقّف عن فعل ما تفعله الآلة."},
        "intro": {"en": "We find the repetitive work and turn it into automated flows — a lead comes in, gets classified, assigned, followed up and analyzed, automatically.",
                  "he": "אנחנו מאתרים את העבודה החוזרת והופכים אותה לזרימות אוטומטיות — ליד נכנס, מסווג, מוקצה, מקבל Follow-up ומנותח, אוטומטית.",
                  "ar": "نكتشف العمل المتكرّر ونحوّله إلى تدفّقات آلية — عميل يدخل، يُصنّف، يُوزّع، تُنشأ له متابعة ويُحلّل، تلقائياً."},
        "bullets": [
            {"en": "Map repetitive, manual tasks", "he": "מיפוי משימות ידניות חוזרות", "ar": "رسم المهام اليدوية المتكرّرة"},
            {"en": "Automate lead intake & routing", "he": "אוטומציה של קליטת לידים וניתוב", "ar": "أتمتة استقبال العملاء وتوجيههم"},
            {"en": "Trigger follow-ups & notifications", "he": "הפעלת Follow-up והתראות", "ar": "إطلاق المتابعات والإشعارات"},
            {"en": "Connect the tools you already use", "he": "חיבור הכלים שכבר יש לך", "ar": "ربط الأدوات التي تستخدمها"},
            {"en": "AI analyzes results & suggests next steps", "he": "AI מנתח תוצאות ומציע צעדים", "ar": "الذكاء الاصطناعي يحلّل النتائج ويقترح الخطوات"},
        ],
        "related": ["ai-solutions", "crm-development", "business-consulting"],
    },
]

SLUG_TITLE = {s["slug"]: s["title"] for s in SERVICES}

def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

NAV = '''  <header class="nav" id="nav">
    <div class="nav__inner">
      <a href="../" class="logo" aria-label="DriftX home">
        <img class="logo__img" src="../assets/brand/logo-mark.png" alt="DriftX" width="171" height="49">
      </a>
      <nav class="nav__links" aria-label="Primary">
        <a href="../#what" data-i18n="nav.what">What We Do</a>
        <a href="../#solutions" data-i18n="nav.solutions">Solutions</a>
        <a href="../#ai" data-i18n="nav.ai">AI</a>
        <a href="../#work" data-i18n="nav.work">Work</a>
        <a href="../#about" data-i18n="nav.about">About</a>
        <a href="../#insights" data-i18n="nav.insights">Insights</a>
        <a href="../#contact" data-i18n="nav.contact">Contact</a>
      </nav>
      <div class="nav__right">
        <div class="lang" role="group" aria-label="Language">
          <button data-lang="en" class="active">EN</button>
          <button data-lang="he">עב</button>
          <button data-lang="ar">ع</button>
        </div>
        <a href="../#contact" class="btn-talk" data-magnetic data-i18n="nav.talk">Let's Talk</a>
        <button class="menu-toggle" id="menuToggle" aria-label="Open menu" aria-expanded="false">
          <span data-i18n="nav.menu">Menu</span><span class="bars"><span></span><span></span></span>
        </button>
      </div>
    </div>
  </header>
  <div class="fsnav" id="fsnav" aria-hidden="true">
    <button class="fsnav__close" id="fsnavClose" aria-label="Close menu">&times;</button>
    <nav class="fsnav__list" aria-label="Full screen">
      <a href="../#what" style="--i:0"><span data-i18n="nav.what">What We Do</span></a>
      <a href="../#solutions" style="--i:1"><span data-i18n="nav.solutions">Solutions</span></a>
      <a href="../#ai" style="--i:2">AI <span class="fsnav__x">×</span> Automation</a>
      <a href="../#work" style="--i:3"><span data-i18n="nav.work">Work</span></a>
      <a href="../#about" style="--i:4"><span data-i18n="nav.about">About</span></a>
      <a href="../#insights" style="--i:5"><span data-i18n="nav.insights">Insights</span></a>
      <a href="../#contact" style="--i:6"><span data-i18n="nav.contact">Contact</span></a>
    </nav>
    <div class="fsnav__meta">Sales <span class="x-mark">×</span> Marketing <span class="x-mark">×</span> Business <span class="x-mark">×</span> Technology <span class="x-mark">×</span> AI</div>
  </div>
'''

FOOTER = '''  <footer class="footer">
    <div class="container">
      <div class="footer__brand" aria-hidden="true">DriftX</div>
      <div class="footer__grid">
        <div>
          <p class="footer__tag" data-i18n="footer.tag">Sales × Marketing × Business × Technology × AI</p>
          <p class="muted" style="margin-top:12px" data-i18n="footer.sub">Built for businesses that want to evolve.</p>
        </div>
        <div>
          <h5 data-i18n="footer.services">What We Do</h5>
          <a href="../sales-consulting/">Sales Consulting</a>
          <a href="../marketing/">Marketing</a>
          <a href="../business-consulting/">Business Consulting</a>
          <a href="../web-development/">Web Development</a>
          <a href="../ai-solutions/">AI &amp; Automation</a>
        </div>
        <div>
          <h5 data-i18n="footer.company">Company</h5>
          <a href="../#work">Work</a><a href="../#about">About</a><a href="../#scan">Business Scan</a><a href="../#contact">Contact</a>
        </div>
        <div>
          <h5 data-i18n="footer.reach">Reach Us</h5>
          <a href="mailto:hello@driftx.co">hello@driftx.co</a>
          <a href="../#contact" data-i18n="footer.start">Start the conversation</a>
        </div>
      </div>
      <div class="footer__bottom">
        <span>© <span id="year"></span> DriftX. <span data-i18n="footer.rights">All rights reserved.</span></span>
        <span class="footer__tag">Business, Evolved.</span>
      </div>
    </div>
  </footer>
'''

def build_page(svc):
    page_i18n = {}
    for lang in ("en", "he", "ar"):
        d = dict(SHARED[lang])
        d["p.cat"] = svc["cat"][lang]
        d["p.title"] = svc["title"][lang]
        d["p.tag"] = svc["tag"][lang]
        d["p.intro"] = svc["intro"][lang]
        for i, b in enumerate(svc["bullets"]):
            d["p.b%d" % i] = b[lang]
        page_i18n[lang] = d

    bullets_html = "\n".join(
        '              <li data-i18n="p.b%d">%s</li>' % (i, esc(b["en"])) for i, b in enumerate(svc["bullets"])
    )
    related_html = "\n".join(
        '            <a class="card reveal" href="../%s/"><h4>%s</h4><p class="muted" style="margin-top:10px" data-i18n="sp.related">Related services</p></a>'
        % (r, esc(SLUG_TITLE[r]["en"])) for r in svc["related"]
    )
    title_full = "%s — DriftX" % svc["title"]["en"]
    desc = svc["intro"]["en"]

    html = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>%(title_full)s</title>
  <meta name="description" content="%(desc)s">
  <meta name="theme-color" content="#070A14">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="canonical" href="https://driftx.co/%(slug)s/">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap">
  <link rel="stylesheet" href="../css/styles.css">
</head>
<body>
  <div class="mesh" aria-hidden="true"><div class="blob-3"></div><div class="grain"></div></div>
  <div class="cursor-dot" aria-hidden="true"></div>
  <div class="cursor-ring" aria-hidden="true"><span class="cursor-label"></span></div>
%(nav)s
  <main id="top">
    <section class="section" style="padding-top:150px">
      <div class="container">
        <a href="../" class="eyebrow reveal" data-i18n="sp.all" style="color:var(--ink-3)">All of DriftX</a>
        <div class="eyebrow reveal" data-i18n="p.cat">%(cat)s</div>
        <h1 class="h-display reveal" data-delay="1" data-i18n="p.title">%(title)s</h1>
        <p class="hero__sub reveal" data-delay="2" style="margin-top:14px"><span class="gradient-text" data-i18n="p.tag">%(tag)s</span></p>
        <p class="lead reveal" data-delay="3" style="margin-top:20px" data-i18n="p.intro">%(intro)s</p>
        <div class="btn-row reveal" data-delay="4" style="margin-top:30px">
          <a href="../#contact" class="btn btn--primary" data-cursor="Let's Talk" data-i18n="sp.ctaBtn">Start the conversation</a>
          <a href="../#scan" class="btn btn--ghost" data-cursor="Scan">AI Business Scan</a>
        </div>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="feature">
          <div class="feature__body">
            <div class="eyebrow reveal" data-i18n="sp.look">What we look at</div>
            <ul class="chk reveal" data-delay="1" style="margin-top:18px">
%(bullets)s
            </ul>
          </div>
          <div class="feature__media reveal" data-delay="1">
            <div class="panel">
              <div class="eyebrow" data-i18n="sp.how">How we work</div>
              <div class="process" style="grid-template-columns:1fr;margin-top:18px">
                <div class="step"><div class="num">01</div><h4 data-i18n="sp.s1t">Analyze</h4><p data-i18n="sp.s1d">We learn the business and find where value leaks.</p></div>
                <div class="step"><div class="num">02</div><h4 data-i18n="sp.s2t">Build</h4><p data-i18n="sp.s2d">We design and implement the system around your workflow.</p></div>
                <div class="step"><div class="num">03</div><h4 data-i18n="sp.s3t">Improve</h4><p data-i18n="sp.s3d">We train the team, measure results and keep optimizing.</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="eyebrow reveal" data-i18n="sp.related">Related services</div>
        <div class="grid-cards" style="margin-top:20px">
%(related)s
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container container--narrow" style="text-align:center">
        <h2 class="h1 reveal gradient-text" data-i18n="sp.ctaTitle">Let's talk about your business.</h2>
        <p class="lead reveal" data-delay="1" style="margin:18px auto 28px" data-i18n="sp.ctaText">Tell us where you are and what's slowing you down.</p>
        <div class="btn-row reveal" data-delay="2" style="justify-content:center">
          <a href="../#contact" class="btn btn--primary" data-cursor="Let's Talk" data-i18n="sp.ctaBtn">Start the conversation</a>
        </div>
      </div>
    </section>
  </main>
%(footer)s
  <script>window.PAGE_I18N = %(page_i18n)s;</script>
  <script src="../js/i18n.js"></script>
  <script src="../js/app.js"></script>
</body>
</html>
''' % {
        "title_full": esc(title_full), "desc": esc(desc), "slug": svc["slug"],
        "nav": NAV, "footer": FOOTER,
        "cat": esc(svc["cat"]["en"]), "title": esc(svc["title"]["en"]),
        "tag": esc(svc["tag"]["en"]), "intro": esc(svc["intro"]["en"]),
        "bullets": bullets_html, "related": related_html,
        "page_i18n": json.dumps(page_i18n, ensure_ascii=False),
    }
    return html

def main():
    for svc in SERVICES:
        d = os.path.join(ROOT, svc["slug"])
        os.makedirs(d, exist_ok=True)
        with open(os.path.join(d, "index.html"), "w", encoding="utf-8") as f:
            f.write(build_page(svc))
        print("generated", svc["slug"] + "/index.html")
    print("done:", len(SERVICES), "service pages")

if __name__ == "__main__":
    main()
