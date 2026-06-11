# Prompt 10b — i18n: AboutPage + QuranSchoolPage + ManuscriptsPage

## Error Handling
- If any operation fails, log it, inform the user, and continue

---

I'm working on D:\zawiya-full.

## Step 0 — Update translations.js first

Read `frontend-react/src/translations.js`. Add these sections to BOTH `ar` and `en` objects. Insert each right before the `hero:` block.

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
  infoText: 'لإضافة مخطوطات حقيقية إلى هذه المجموعة، يمكنك إما تعديل مصفوفة MANUSCRIPTS أو ربطها بقاعدة بيانات.',
  labelDate: 'التاريخ',
  labelSubject: 'الموضوع',
  lightboxAlt: 'صورة المخطوطة الكاملة',
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
  intro3: 'This paragraph can include information about the founder, location, and historical development.',
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
  para2: 'You can mention qualified teachers who supervise education at the school.',
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
  prog1Text: 'A comprehensive program for memorizing the Book of God for children and adults.',
  prog1Badge: 'All Ages',
  prog2Title: 'Tajweed',
  prog2Text: 'Lessons in the rules of Tajweed and proper recitation according to multiple narrations.',
  prog2Badge: 'Multiple Levels',
  prog3Title: 'Quran Interpretation',
  prog3Text: 'Study circles in interpreting verses and understanding their meanings.',
  prog3Badge: 'Adults',
  prog4Title: "Children's Programs",
  prog4Text: 'A special section for children with engaging methods combining memorization and play.',
  prog4Badge: 'Ages 4–12',
  prog5Title: 'Ramadan Circles',
  prog5Text: 'Intensive programs during Ramadan for completing and reviewing the Quran.',
  prog5Badge: 'Seasonal',
  prog6Title: 'Memorization Competitions',
  prog6Text: 'Participation in local and national competitions in Quran recitation.',
  prog6Badge: 'Annual',
},
manuscripts: {
  heroSubtitle: 'Treasures of Islamic and Scientific Heritage',
  heroDesc: 'A rare and diverse collection of manuscripts reflecting the richness of Islamic civilization.',
  heroBadge: 'Rare Heritage',
  heading: 'Our Manuscript Collection',
  para1: 'Add a description of the manuscript collection — its size, fields, and preservation methods.',
  para2: 'You can mention the most notable manuscripts and their historical value.',
  imgCaption: 'Collection Image',
  filterAll: 'All',
  infoHeading: 'Add New Manuscripts',
  infoText: 'To add real manuscripts, edit the MANUSCRIPTS array in ManuscriptsPage.jsx or connect to a database.',
  labelDate: 'Date',
  labelSubject: 'Subject',
  lightboxAlt: 'Full manuscript image',
},
```

## Step 1 — Read + update AboutPage.jsx

Read `frontend-react/src/pages/AboutPage.jsx` then update:
- Import `useT` from `../../context/LanguageContext`
- `const t = useT()` at top
- Replace ALL hardcoded Arabic with `t('about.xxx')`:
  - SectionHero: `t('site.name')` for title, `t('about.heroSubtitle')`, `t('about.heroDesc')`, `t('about.heroBadge')`
  - Headings: `t('about.headingWho')`, `t('about.valuesHeading')`, `t('about.historyHeading')`, `t('about.galleryHeading')`
  - Intro paragraphs: `t('about.intro1')`, `t('about.intro2')`, `t('about.intro3')`
  - Image: `t('about.imgCaption')`, `t('about.imgHint')`
  - ValueCards: use t('about.valueXTitle'), t('about.valueXText') for 1-4
  - Timeline: use t('about.timelineXYear'), t('about.timelineXText') for 1-3
  - Gallery alt: `t('about.galleryAlt', { i })`
- Remove `dir="rtl"`

## Step 2 — Read + update QuranSchoolPage.jsx

Read, then update:
- Import useT, add const t = useT()
- Replace PROGRAMS array → inline rendering or getPrograms(t) function
- Replace all strings with t('quranSchool.xxx')
- Remove dir="rtl"

## Step 3 — Read + update ManuscriptsPage.jsx

Read, then update:
- Import useT, add const t = useT()
- Replace 'الكل' filter with t('manuscripts.filterAll')
- Replace all UI strings with t('manuscripts.xxx')
- Keep MANUSCRIPTS data array as-is (sample data)
- Remove dir="rtl"

## Step 4 — Build

Run: `cd frontend-react && npm run build`
Fix any errors.
