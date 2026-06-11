# Prompt 10b — i18n: About + QuranSchool + Manuscripts + Sewing + Activities + Association + Contact

## Error Handling
- If any operation fails, log it, inform the user, and continue
- Never stop mid-task

---

I'm working on D:\zawiya-full.

## Step 0 — First, read and update translations.js

Read `frontend-react/src/translations.js`.

Add these new sections to BOTH `ar` and `en` objects (insert before the `hero:` block):

For `ar`:
```js
about: {
  heroSubtitle: 'إرث علمي وروحاني عريق',
  heroDesc: 'تأسست الزاوية لتكون منارةً للعلم والثقافة والتراث الإسلامي في المنطقة.',
  heroBadge: 'نبذة تاريخية',
  headingWho: 'من نحن',
  intro1: 'أضف هنا نصاً تعريفياً بالزاوية — تاريخها، تأسيسها، وأهدافها.',
  intro2: 'يمكنك الكتابة بالعربية الفصحى أو الدارجة حسب ما يناسبك.',
  intro3: 'يمكن أن تتضمن هذه الفقرة معلومات عن المؤسس والموقع الجغرافي والتطور التاريخي عبر الأجيال.',
  imgCaption: 'صورة الزاوية من الخارج',
  imgHint: 'ضع صورتك هنا',
  valuesHeading: 'قيمنا ومبادئنا',
  value1Title: 'العلم والمعرفة',
  value1Text: 'نؤمن بأن طلب العلم فريضة ورسالة مستمرة.',
  value2Title: 'الروحانية والتقوى',
  value2Text: 'نسعى إلى تقوية الرابط الروحي بالله تعالى.',
  value3Title: 'خدمة المجتمع',
  value3Text: 'نهدف إلى بناء مجتمع متماسك ومتعلم.',
  value4Title: 'صون التراث',
  value4Text: 'نحافظ على الموروث الحضاري والعلمي الإسلامي.',
  historyHeading: 'لمحة تاريخية',
  timeline1Year: 'التأسيس',
  timeline1Text: 'أضف هنا سنة التأسيس والظروف المحيطة بها.',
  timeline2Year: 'التطور',
  timeline2Text: 'أضف هنا مراحل نمو الزاوية وتوسعها عبر السنين.',
  timeline3Year: 'الحاضر',
  timeline3Text: 'أضف هنا الوضع الراهن والمشاريع الجارية.',
  galleryHeading: 'من صور الزاوية',
  galleryAlt: 'صورة {i}',
},
quranSchool: {
  heroSubtitle: 'تعليم كتاب الله — القرآن الكريم نور القلوب',
  heroDesc: 'نحن مدرسة متخصصة في تحفيظ القرآن الكريم وتعليم علوم التجويد والتلاوة.',
  heroBadge: 'قرآن وتجويد',
  headingAbout: 'عن المدرسة',
  para1: 'أضف هنا وصفاً للمدرسة القرآنية — تاريخها، منهجها التعليمي، وعدد الطلاب الملتحقين بها.',
  para2: 'يمكنك ذكر أسماء المعلمين والمشايخ المؤهلين الذين يشرفون على التعليم في المدرسة.',
  registerBtn: 'التسجيل الآن',
  imgCaption: 'صورة من المدرسة',
  imgHint: 'ضع صورتك هنا',
  statStudents: 'طالب وطالبة',
  statTeachers: 'أستاذاً مؤهلاً',
  statGraduates: 'خريجاً هذا العام',
  programsHeading: 'برامجنا التعليمية',
  programsSubtitle: 'نقدم مجموعة متنوعة من البرامج لمختلف الأعمار والمستويات',
  galleryHeading: 'من أجواء المدرسة',
  galleryAlt: 'صورة {i}',
  // Program names and details
  prog1Title: 'تحفيظ القرآن الكريم',
  prog1Text: 'برنامج متكامل لحفظ كتاب الله للأطفال والكبار بأساليب تربوية حديثة.',
  prog1Badge: 'جميع الأعمار',
  prog2Title: 'تعليم التجويد',
  prog2Text: 'دروس في أحكام التجويد والتلاوة الصحيحة وفق روايات متعددة.',
  prog2Badge: 'مستويات مختلفة',
  prog3Title: 'تفسير القرآن',
  prog3Text: 'حلقات دراسية في تفسير الآيات وفهم معانيها وأسباب نزولها.',
  prog3Badge: 'للبالغين',
  prog4Title: 'برامج الأطفال',
  prog4Text: 'قسم خاص للأطفال بأساليب تعليمية مشوّقة تجمع بين الحفظ واللعب.',
  prog4Badge: '٤–١٢ سنة',
  prog5Title: 'حلقات رمضانية',
  prog5Text: 'برامج مكثفة خلال شهر رمضان المبارك لختم القرآن والمراجعة.',
  prog5Badge: 'موسمي',
  prog6Title: 'مسابقات التحفيظ',
  prog6Text: 'مشاركة في المسابقات المحلية والوطنية في تلاوة وتحفيظ القرآن.',
  prog6Badge: 'سنوي',
},
manuscripts: {
  heroSubtitle: 'كنوز الإرث الإسلامي والعلمي',
  heroDesc: 'مجموعة نادرة ومتنوعة من المخطوطات التي تعكس ثراء الحضارة الإسلامية.',
  heroBadge: 'تراث نادر',
  heading: 'مجموعتنا المخطوطاتية',
  para1: 'أضف هنا وصفاً لمجموعة المخطوطات المحفوظة في الزاوية — عددها، مجالاتها، وكيفية حفظها وصونها.',
  para2: 'يمكنك ذكر أبرز المخطوطات وقيمتها التاريخية والعلمية.',
  imgCaption: 'صورة المجموعة',
  filterAll: 'الكل',
  infoHeading: 'إضافة مخطوطة جديدة',
  infoText: 'لإضافة مخطوطات حقيقية إلى هذه المجموعة، يمكنك إما تعديل مصفوفة MANUSCRIPTS في ملف ManuscriptsPage.jsx أو ربطها بقاعدة بيانات.',
  labelDate: 'التاريخ',
  labelSubject: 'الموضوع',
  lightboxAlt: 'صورة المخطوطة الكاملة',
},
sewing: {
  heroSubtitle: 'الحرف الأصيلة — توارث عبر الأجيال',
  heroDesc: 'نحافظ على فنون الخياطة والتطريز التقليدي ونعلّمها للأجيال الجديدة.',
  heroBadge: 'حرف يدوية',
  headingAbout: 'عن القسم',
  para1: 'أضف هنا وصفاً لقسم الخياطة — تاريخه، أهدافه، وما يقدمه للمجتمع.',
  para2: 'يمكنك ذكر عدد المتدربات والمدربات المتخصصات في القسم.',
  registerBtn: 'التسجيل في ورشة',
  infoBtn: 'للمزيد من المعلومات',
  imgCaption: 'صورة من الورشة',
  workshopsHeading: 'ورشاتنا التدريبية',
  galleryHeading: 'من إبداعات المتدربات',
  galleryAlt: 'عمل {i}',
},
activities: {
  heroSubtitle: 'فعاليات وبرامج لكل المجتمع',
  heroDesc: 'نظّم الزاوية طوال العام فعاليات ثقافية وتعليمية ودينية واجتماعية متنوعة.',
  heroBadge: 'فعاليات وأنشطة',
  filterAll: 'الكل',
  empty: 'لا توجد فعاليات في هذا التصنيف حالياً.',
  infoHeading: 'إضافة فعاليات جديدة',
  infoText: 'لتعديل الفعاليات، يمكنك تعديل مصفوفة ACTIVITIES في ملف ActivitiesPage.jsx.',
},
association: {
  heroSubtitle: 'منظمتنا وهيكلنا التنظيمي',
  heroDesc: 'جمعية الزاوية الثقافية والتعليمية — نعمل من أجل مجتمع متعلم ومتحضر.',
  heroBadge: 'الهيئة الإدارية',
  headingAbout: 'عن الجمعية',
  para1: 'أضف هنا نصاً تعريفياً بالجمعية — تاريخ تأسيسها، أهدافها، ورقم تسجيلها القانوني.',
  para2: 'يمكنك ذكر الشركاء والداعمين والإنجازات التي حققتها الجمعية منذ تأسيسها.',
  imgCaption: 'صورة الجمعية',
  goalsHeading: 'أهدافنا',
  legalHeading: 'المعلومات القانونية',
  regNumber: 'رقم السجل',
  regPlaceholder: 'أضف الرقم هنا',
  foundingDate: 'تاريخ التأسيس',
  datePlaceholder: 'أضف التاريخ هنا',
  province: 'الولاية',
  provinceValue: 'ورقلة، الجزائر',
  teamHeading: 'أعضاء مجلس الإدارة',
  teamSubtitle: 'الفريق المسيّر لجمعية الزاوية',
  teamNamePlaceholder: 'أضف الاسم هنا',
  teamRole1: 'رئيس الجمعية',
  teamRole2: 'نائب الرئيس',
  teamRole3: 'الأمين العام',
  teamRole4: 'أمين المال',
  teamRole5: 'عضو المجلس',
  goal1Title: 'نشر العلم',
  goal1Text: 'دعم التعليم وتوفير الفرص التعليمية لأبناء المنطقة.',
  goal2Title: 'صون التراث',
  goal2Text: 'الحفاظ على الموروث الثقافي والحضاري الإسلامي.',
  goal3Title: 'التماسك الاجتماعي',
  goal3Text: 'تعزيز الروابط الاجتماعية وتقديم الدعم المجتمعي.',
  goal4Title: 'التنمية المستدامة',
  goal4Text: 'دعم مشاريع التنمية المستدامة في المنطقة.',
},
contact: {
  heroSubtitle: 'نحن هنا للإجابة على استفساراتك',
  heroDesc: 'يسعدنا سماع منك. تواصل معنا للاستفسار أو الانضمام أو أي طلب آخر.',
  heroBadge: 'تواصل',
  heading: 'معلومات التواصل',
  emailTitle: 'البريد الإلكتروني',
  emailNote: 'نرد خلال ٢٤ ساعة',
  phoneTitle: 'الهاتف',
  phoneNote: 'من الأحد إلى الخميس، ٨ص–٤م',
  addressTitle: 'العنوان',
  addressValue: 'ورقلة، الجزائر',
  addressNote: 'أضف هنا العنوان التفصيلي للزاوية',
  hoursTitle: 'أوقات الدوام',
  hoursDays: 'الأحد – الخميس',
  hoursTime: '٨:٠٠ صباحاً – ٥:٠٠ مساءً',
  mapCaption: 'خريطة الموقع',
  mapHint: 'أضف رابط خرائط جوجل هنا',
  successHeading: 'تم الإرسال بنجاح!',
  successMsg: 'شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.',
  successBtn: 'إرسال رسالة أخرى',
  formHeading: 'أرسل لنا رسالة',
  formName: 'الاسم الكامل *',
  namePlaceholder: 'اسمك الكامل',
  formPhone: 'رقم الهاتف',
  formEmail: 'البريد الإلكتروني *',
  formSubject: 'موضوع الرسالة *',
  subjectPlaceholder: 'اختر موضوعاً…',
  subjectGeneral: 'الاستفسار العام',
  subjectQuran: 'التسجيل في المدرسة القرآنية',
  subjectSewing: 'التسجيل في ورشات الخياطة',
  subjectMss: 'المخطوطات والتراث',
  subjectJoin: 'الانضمام للجمعية',
  subjectDonate: 'التبرع والدعم',
  subjectOther: 'أخرى',
  formMessage: 'رسالتك *',
  messagePlaceholder: 'اكتب رسالتك هنا…',
  sendingText: 'جارٍ الإرسال…',
  submitText: 'إرسال الرسالة ✉️',
  privacy: 'لن نشارك معلوماتك مع أي طرف ثالث.',
},
```

For `en`:
```js
about: {
  heroSubtitle: 'A Legacy of Science and Spirituality',
  heroDesc: 'Al-Zawiya was established as a beacon of knowledge, culture, and Islamic heritage in the region.',
  heroBadge: 'Historical Overview',
  headingWho: 'About Us',
  intro1: 'Add introductory text about Al-Zawiya — its history, founding, and goals.',
  intro2: 'You can write in classical or colloquial Arabic as appropriate.',
  intro3: 'This paragraph can include information about the founder, location, and historical development through generations.',
  imgCaption: 'Exterior view of Al-Zawiya',
  imgHint: 'Place your image here',
  valuesHeading: 'Our Values',
  value1Title: 'Knowledge',
  value1Text: 'We believe that seeking knowledge is a duty and a continuous mission.',
  value2Title: 'Spirituality',
  value2Text: 'We strive to strengthen the spiritual connection with God.',
  value3Title: 'Community Service',
  value3Text: 'We aim to build a cohesive and educated community.',
  value4Title: 'Heritage Preservation',
  value4Text: 'We preserve Islamic cultural and scientific heritage.',
  historyHeading: 'Historical Timeline',
  timeline1Year: 'Founding',
  timeline1Text: 'Add the founding year and surrounding circumstances.',
  timeline2Year: 'Development',
  timeline2Text: 'Add the stages of growth and expansion over the years.',
  timeline3Year: 'Present',
  timeline3Text: 'Add the current status and ongoing projects.',
  galleryHeading: 'Gallery',
  galleryAlt: 'Image {i}',
},
quranSchool: {
  heroSubtitle: 'Teaching the Book of God — The Quran, Light of Hearts',
  heroDesc: 'We are a school specialized in Quran memorization and the science of Tajweed and recitation.',
  heroBadge: 'Quran & Tajweed',
  headingAbout: 'About the School',
  para1: 'Add a description of the Quran school — its history, educational curriculum, and enrolled students.',
  para2: 'You can mention qualified teachers and sheikhs who supervise education at the school.',
  registerBtn: 'Register Now',
  imgCaption: 'School Image',
  imgHint: 'Place your image here',
  statStudents: 'Students',
  statTeachers: 'Qualified Teachers',
  statGraduates: 'Graduates This Year',
  programsHeading: 'Our Programs',
  programsSubtitle: 'We offer a variety of programs for all ages and levels',
  galleryHeading: 'School Photos',
  galleryAlt: 'Image {i}',
  prog1Title: 'Quran Memorization',
  prog1Text: 'A comprehensive program for memorizing the Book of God for children and adults using modern educational methods.',
  prog1Badge: 'All Ages',
  prog2Title: 'Tajweed',
  prog2Text: 'Lessons in the rules of Tajweed and proper recitation according to multiple narrations.',
  prog2Badge: 'Multiple Levels',
  prog3Title: 'Quran Interpretation',
  prog3Text: 'Study circles in interpreting verses and understanding their meanings and reasons for revelation.',
  prog3Badge: 'Adults',
  prog4Title: 'Children\'s Programs',
  prog4Text: 'A special section for children with engaging educational methods combining memorization and play.',
  prog4Badge: 'Ages 4–12',
  prog5Title: 'Ramadan Circles',
  prog5Text: 'Intensive programs during the holy month of Ramadan for completing and reviewing the Quran.',
  prog5Badge: 'Seasonal',
  prog6Title: 'Memorization Competitions',
  prog6Text: 'Participation in local and national competitions in Quran recitation and memorization.',
  prog6Badge: 'Annual',
},
manuscripts: {
  heroSubtitle: 'Treasures of Islamic and Scientific Heritage',
  heroDesc: 'A rare and diverse collection of manuscripts reflecting the richness of Islamic civilization.',
  heroBadge: 'Rare Heritage',
  heading: 'Our Manuscript Collection',
  para1: 'Add a description of the manuscript collection preserved at Al-Zawiya — its size, fields, and preservation methods.',
  para2: 'You can mention the most notable manuscripts and their historical and scientific value.',
  imgCaption: 'Collection Image',
  filterAll: 'All',
  infoHeading: 'Add New Manuscripts',
  infoText: 'To add real manuscripts to this collection, edit the MANUSCRIPTS array in ManuscriptsPage.jsx or connect to a database.',
  labelDate: 'Date',
  labelSubject: 'Subject',
  lightboxAlt: 'Full manuscript image',
},
sewing: {
  heroSubtitle: 'Authentic Crafts — Passed Down Through Generations',
  heroDesc: 'We preserve traditional sewing and embroidery arts and teach them to new generations.',
  heroBadge: 'Handicrafts',
  headingAbout: 'About the Section',
  para1: 'Add a description of the sewing section — its history, goals, and what it offers the community.',
  para2: 'You can mention the number of trainees and specialized trainers.',
  registerBtn: 'Register for a Workshop',
  infoBtn: 'More Information',
  imgCaption: 'Workshop Image',
  workshopsHeading: 'Our Workshops',
  galleryHeading: 'Trainee Creations',
  galleryAlt: 'Work {i}',
},
activities: {
  heroSubtitle: 'Events and Programs for Everyone',
  heroDesc: 'Al-Zawiya organizes cultural, educational, religious, and social events throughout the year.',
  heroBadge: 'Events & Activities',
  filterAll: 'All',
  empty: 'No events in this category currently.',
  infoHeading: 'Add New Events',
  infoText: 'To modify events, edit the ACTIVITIES array in ActivitiesPage.jsx.',
},
association: {
  heroSubtitle: 'Our Organization and Structure',
  heroDesc: 'Al-Zawiya Cultural and Educational Association — working for an educated and civilized society.',
  heroBadge: 'Board of Directors',
  headingAbout: 'About the Association',
  para1: 'Add introductory text about the association — founding date, goals, and legal registration number.',
  para2: 'You can mention partners, supporters, and achievements since establishment.',
  imgCaption: 'Association Image',
  goalsHeading: 'Our Goals',
  legalHeading: 'Legal Information',
  regNumber: 'Registration No.',
  regPlaceholder: 'Add number here',
  foundingDate: 'Founding Date',
  datePlaceholder: 'Add date here',
  province: 'Province',
  provinceValue: 'Ouargla, Algeria',
  teamHeading: 'Board Members',
  teamSubtitle: 'The managing team of Al-Zawiya Association',
  teamNamePlaceholder: 'Add name here',
  teamRole1: 'President',
  teamRole2: 'Vice President',
  teamRole3: 'Secretary General',
  teamRole4: 'Treasurer',
  teamRole5: 'Board Member',
  goal1Title: 'Knowledge Dissemination',
  goal1Text: 'Supporting education and providing learning opportunities for the region\'s youth.',
  goal2Title: 'Heritage Preservation',
  goal2Text: 'Preserving Islamic cultural and civilizational heritage.',
  goal3Title: 'Social Cohesion',
  goal3Text: 'Strengthening social bonds and providing community support.',
  goal4Title: 'Sustainable Development',
  goal4Text: 'Supporting sustainable development projects in the region.',
},
contact: {
  heroSubtitle: 'We Are Here to Answer Your Questions',
  heroDesc: 'We are happy to hear from you. Contact us for inquiries, registration, or any other request.',
  heroBadge: 'Contact',
  heading: 'Contact Information',
  emailTitle: 'Email',
  emailNote: 'We respond within 24 hours',
  phoneTitle: 'Phone',
  phoneNote: 'Sunday to Thursday, 8am–4pm',
  addressTitle: 'Address',
  addressValue: 'Ouargla, Algeria',
  addressNote: 'Add the detailed address of Al-Zawiya here',
  hoursTitle: 'Working Hours',
  hoursDays: 'Sunday – Thursday',
  hoursTime: '8:00 AM – 5:00 PM',
  mapCaption: 'Site Map',
  mapHint: 'Add Google Maps link here',
  successHeading: 'Sent Successfully!',
  successMsg: 'Thank you for contacting us. We will get back to you as soon as possible.',
  successBtn: 'Send Another Message',
  formHeading: 'Send Us a Message',
  formName: 'Full Name *',
  namePlaceholder: 'Your full name',
  formPhone: 'Phone Number',
  formEmail: 'Email *',
  formSubject: 'Subject *',
  subjectPlaceholder: 'Choose a subject…',
  subjectGeneral: 'General Inquiry',
  subjectQuran: 'Quran School Registration',
  subjectSewing: 'Sewing Workshop Registration',
  subjectMss: 'Manuscripts & Heritage',
  subjectJoin: 'Join the Association',
  subjectDonate: 'Donations & Support',
  subjectOther: 'Other',
  formMessage: 'Your Message *',
  messagePlaceholder: 'Write your message here…',
  sendingText: 'Sending…',
  submitText: 'Send Message ✉️',
  privacy: 'We will not share your information with any third party.',
},
```

## Step 1 — Now read ALL 7 files

Read all these files in full:
- frontend-react/src/pages/AboutPage.jsx
- frontend-react/src/pages/QuranSchoolPage.jsx
- frontend-react/src/pages/ManuscriptsPage.jsx
- frontend-react/src/pages/SewingPage.jsx
- frontend-react/src/pages/ActivitiesPage.jsx
- frontend-react/src/pages/AssociationPage.jsx
- frontend-react/src/pages/ContactPage.jsx

## Step 2 — Update each file

For EACH file:
1. Import `useT` from `../../context/LanguageContext`
2. Add `const t = useT()` at the top of the main component
3. Replace EVERY hardcoded Arabic string with the matching `t('pageName.key')` call
4. Replace static data arrays (PROGRAMS, WORKSHOPS, etc.) with functions or inline rendering using t()
5. Remove any `dir="rtl"` from JSX

### Specific instructions per file:

**AboutPage.jsx:**
- SectionHero props: `t('site.name')` for title, `t('about.heroSubtitle')`, `t('about.heroDesc')`, `t('about.heroBadge')`
- headingWho: `t('about.headingWho')`
- Intro paragraphs: `t('about.intro1')`, `t('about.intro2')`, `t('about.intro3')`
- Img caption: `t('about.imgCaption')`, hint: `t('about.imgHint')`
- Values heading: `t('about.valuesHeading')`
- ValueCards content: use `t('about.value1Title')`, `t('about.value1Text')`, etc.
- History heading: `t('about.historyHeading')`
- Timeline items: `t('about.timeline1Year')`, `t('about.timeline1Text')`, etc.
- Gallery heading: `t('about.galleryHeading')`
- Gallery alt: `t('about.galleryAlt', { i })`

**QuranSchoolPage.jsx:**
- Replace PROGRAMS array with inline rendering or translated getter
- SectionHero: use t('quranSchool.xxx') keys
- All hardcoded strings replaced with t('quranSchool.xxx')
- Stats: `t('quranSchool.statStudents')`, `t('quranSchool.statTeachers')`, `t('quranSchool.statGraduates')`
- Program names/details: `t('quranSchool.prog1Title')`, `t('quranSchool.prog1Text')`, `t('quranSchool.prog1Badge')`, etc.

**ManuscriptsPage.jsx:**
- MANUSCRIPTS array data: keep as-is (these are sample data, not UI labels), but translate UI strings
- SectionHero: use t('manuscripts.xxx')
- Filter label 'الكل': `t('manuscripts.filterAll')`
- Info heading/text: `t('manuscripts.infoHeading')`, `t('manuscripts.infoText')`
- Lightbox labels: `t('manuscripts.labelDate')`, `t('manuscripts.labelSubject')`

**SewingPage.jsx:**
- WORKSHOPS array: keep data as-is but translate UI labels
- SectionHero: t('sewing.xxx')
- All strings → t('sewing.xxx')

**ActivitiesPage.jsx:**
- ACTIVITIES array: keep data as-is but translate UI labels
- Filter 'الكل': `t('activities.filterAll')`
- Empty state: `t('activities.empty')`
- Info heading/text: t('activities.xxx')

**AssociationPage.jsx:**
- TEAM array: use t() for role labels
- GOALS array: use t() for title/text
- SectionHero: t('association.xxx')
- All strings → t('association.xxx')

**ContactPage.jsx:**
- SectionHero: t('contact.xxx')
- ContactInfoItem labels: t('contact.emailTitle'), t('contact.phoneTitle'), etc.
- Form labels/placeholders/options: t('contact.xxx')
- Success/error states: t('contact.xxx')

## Step 3 — Build

Run: `cd frontend-react && npm run build`
Fix any errors.
