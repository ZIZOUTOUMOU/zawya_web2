# Prompt 10c — i18n: Sewing + Activities + Association + Contact

## Error Handling
- If any operation fails, log it, inform the user, and continue

---

I'm working on D:\zawiya-full.

## Step 0 — Update translations.js first

Read `frontend-react/src/translations.js`. Add these sections to BOTH `ar` and `en` objects. Insert right before the `hero:` block.

For `ar`:
```js
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
sewing: {
  heroSubtitle: 'Authentic Crafts — Passed Down Through Generations',
  heroDesc: 'We preserve traditional sewing and embroidery arts and teach them to new generations.',
  heroBadge: 'Handicrafts',
  headingAbout: 'About the Section',
  para1: 'Add a description of the sewing section — its history, goals, and what it offers.',
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
  heroDesc: 'Al-Zawiya Cultural and Educational Association — working for an educated society.',
  heroBadge: 'Board of Directors',
  headingAbout: 'About the Association',
  para1: 'Add introductory text about the association — founding date, goals, and legal registration.',
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
  goal1Text: 'Supporting education and providing learning opportunities for youth.',
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

## Step 1 — Read + update SewingPage.jsx

Read `frontend-react/src/pages/SewingPage.jsx` then update:
- Import `{ useT }` from `../../context/LanguageContext`
- `const t = useT()` at component top
- WORKSHOPS array: Replace static array with a function or inline rendering using t()
- Replace ALL strings with `t('sewing.xxx')`
- Remove `dir="rtl"`

## Step 2 — Read + update ActivitiesPage.jsx

Read, then update:
- Import useT, const t = useT()
- Replace 'الكل' filter: t('activities.filterAll')
- Replace all strings with t('activities.xxx')
- Keep ACTIVITIES data array as-is (sample data)
- Remove dir="rtl"

## Step 3 — Read + update AssociationPage.jsx

Read, then update:
- Import useT, const t = useT()
- Replace TEAM array roles with t() calls
- Replace GOALS array with t() calls
- Replace all strings with t('association.xxx')
- Remove dir="rtl"

## Step 4 — Read + update ContactPage.jsx

Read, then update:
- Import useT, const t = useT()
- Replace ALL strings with t('contact.xxx')
- Subject options: t('contact.subjectGeneral'), t('contact.subjectQuran'), etc.
- Remove dir="rtl"

## Step 5 — Build

Run: `cd frontend-react && npm run build`
Fix any errors.
