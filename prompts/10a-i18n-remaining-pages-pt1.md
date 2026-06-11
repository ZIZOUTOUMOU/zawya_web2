# Prompt 10a — i18n: HomePage + Footer + translations

## Error Handling
- If any operation fails, log it, inform the user, and continue
- Never stop mid-task

---

I'm working on D:\zawiya-full. Read these files first:
- frontend-react/src/translations.js
- frontend-react/src/pages/HomePage.jsx
- frontend-react/src/components/Footer.jsx
- frontend-react/src/components/Layout.jsx

## Step 1 — Update translations.js

Add the following new sections to both `ar` and `en` objects in `frontend-react/src/translations.js`.

Insert before `hero:` block (add new top-level sections):

For `ar`:
```js
footer: {
  brandName: 'الزاوية',
  brandSubtitle: 'المركز الثقافي والتعليمي',
  tagline: 'مساحة للعلم والثقافة والتراث الإسلامي',
  sections: 'أقسام الموقع',
  contact: 'التواصل',
  address: '📍 ورقلة، الجزائر',
  sources: 'مصادر المكتبة',
  copyright: '© {year} الزاوية — المركز الثقافي والتعليمي. جميع الحقوق محفوظة.',
  admin: 'لوحة التحكم',
},
home: {
  eyebrow: 'مرحباً بكم في',
  heroAccent: 'المركز الثقافي والتعليمي',
  heroLede: 'مساحة للعلم والثقافة والتراث الإسلامي — من تحفيظ القرآن الكريم إلى المخطوطات النادرة والأنشطة المجتمعية المتنوعة.',
  ctaAbout: 'تعرّف علينا',
  ctaLibrary: 'المكتبة الرقمية',
  placeholderImg: 'صورة الزاوية',
  placeholderHint: 'ضع صورتك هنا',
  statBooks: 'كتاب في المكتبة',
  statCategories: 'تصنيف معرفي',
  statAuthors: 'مؤلف ومفكر',
  statActivities: 'نشاط سنوياً',
  statActivitiesNum: '٢٥+',
  sectionsTitle: 'أقسام الزاوية',
  sectionsSubtitle: 'اكتشف كل ما تقدمه الزاوية من خدمات وأنشطة',
  ornamentText: 'من كنوز المكتبة الرقمية',
  recentTitle: 'آخر إضافات المكتبة',
  viewAll: 'عرض الكل ←',
  emptyBooks: 'لا توجد كتب حتى الآن. أضف كتباً من لوحة التحكم.',
  ctaBannerHeading: 'انضم إلى عائلة الزاوية',
  ctaBannerDesc: 'نرحب بجميع الراغبين في التعلم والمشاركة في أنشطتنا الثقافية والتعليمية.',
  ctaBannerContact: 'تواصل معنا',
  ctaBannerAbout: 'تعرّف على الجمعية',
  coverAlt: 'غلاف {title}',
  // Section names for the home page grid
  sectionAbout: 'التعريف بالزاوية',
  sectionAboutSub: 'نبذة تاريخية وتعريفية',
  sectionAboutDesc: 'تعرّف على تاريخ الزاوية وإرثها العلمي والروحاني العريق في المنطقة.',
  sectionQuran: 'المدرسة القرآنية',
  sectionQuranSub: 'تعليم كتاب الله',
  sectionQuranDesc: 'برامج تحفيظ القرآن الكريم وتعليم التجويد لجميع الأعمار.',
  sectionMss: 'المخطوطات',
  sectionMssSub: 'كنوز الإرث الإسلامي',
  sectionMssDesc: 'مجموعة نادرة من المخطوطات العلمية والأدبية والدينية القيّمة.',
  sectionSewing: 'قسم الخياطة',
  sectionSewingSub: 'الحرف والمهارات اليدوية',
  sectionSewingDesc: 'ورشات تعليمية في الخياطة والتطريز والفنون النسيجية التقليدية.',
  sectionActivities: 'أنشطة مختلفة',
  sectionActivitiesSub: 'فعاليات وبرامج متنوعة',
  sectionActivitiesDesc: 'برامج ثقافية وترفيهية وتعليمية للمجتمع طوال العام.',
  sectionAssociation: 'الجمعية',
  sectionAssociationSub: 'منظمتنا وهيكلنا',
  sectionAssociationDesc: 'تعرّف على جمعية الزاوية وأهدافها ومشاريعها المجتمعية.',
  sectionLibrary: 'المكتبة الرقمية',
  sectionLibrarySub: 'آلاف الكتب في متناولك',
  sectionLibraryDesc: 'مكتبة رقمية تضم كتباً في المجال العام مع معاينة الصفحات.',
  sectionContact: 'التواصل معنا',
  sectionContactSub: 'نحن هنا للمساعدة',
  sectionContactDesc: 'تواصل معنا لأي استفسار أو للانضمام إلى أنشطة الزاوية.',
},
```

For `en`:
```js
footer: {
  brandName: 'Al-Zawiya',
  brandSubtitle: 'Cultural and Educational Center',
  tagline: 'A space for knowledge, culture, and Islamic heritage',
  sections: 'Site Sections',
  contact: 'Contact',
  address: '📍 Ouargla, Algeria',
  sources: 'Library Resources',
  copyright: '© {year} Al-Zawiya — Cultural and Educational Center. All rights reserved.',
  admin: 'Admin Panel',
},
home: {
  eyebrow: 'Welcome to',
  heroAccent: 'Cultural and Educational Center',
  heroLede: 'A space for knowledge, culture, and Islamic heritage — from Quran memorization to rare manuscripts and diverse community activities.',
  ctaAbout: 'Learn About Us',
  ctaLibrary: 'Digital Library',
  placeholderImg: 'Image of Al-Zawiya',
  placeholderHint: 'Place your image here',
  statBooks: 'Books in Library',
  statCategories: 'Knowledge Categories',
  statAuthors: 'Authors & Thinkers',
  statActivities: 'Annual Activities',
  statActivitiesNum: '25+',
  sectionsTitle: 'Our Sections',
  sectionsSubtitle: 'Discover everything Al-Zawiya offers in services and activities',
  ornamentText: 'From the Library Collection',
  recentTitle: 'Recently Added',
  viewAll: 'View All →',
  emptyBooks: 'No books yet. Add books from the admin panel.',
  ctaBannerHeading: 'Join the Al-Zawiya Family',
  ctaBannerDesc: 'We welcome all who wish to learn and participate in our cultural and educational activities.',
  ctaBannerContact: 'Contact Us',
  ctaBannerAbout: 'About the Association',
  coverAlt: 'Cover of {title}',
  sectionAbout: 'About Al-Zawiya',
  sectionAboutSub: 'Historical Overview',
  sectionAboutDesc: 'Learn about the history of Al-Zawiya and its rich scientific and spiritual heritage.',
  sectionQuran: 'Quran School',
  sectionQuranSub: 'Teaching the Book of God',
  sectionQuranDesc: 'Quran memorization and Tajweed programs for all ages.',
  sectionMss: 'Manuscripts',
  sectionMssSub: 'Islamic Heritage Treasures',
  sectionMssDesc: 'A rare collection of valuable scientific, literary, and religious manuscripts.',
  sectionSewing: 'Sewing Section',
  sectionSewingSub: 'Traditional Crafts',
  sectionSewingDesc: 'Workshops in sewing, embroidery, and traditional textile arts.',
  sectionActivities: 'Activities',
  sectionActivitiesSub: 'Various Events',
  sectionActivitiesDesc: 'Cultural, recreational, and educational programs throughout the year.',
  sectionAssociation: 'Association',
  sectionAssociationSub: 'Our Organization',
  sectionAssociationDesc: 'Learn about the Al-Zawiya Association, its goals, and community projects.',
  sectionLibrary: 'Digital Library',
  sectionLibrarySub: 'Thousands of Books',
  sectionLibraryDesc: 'A digital library featuring public domain books with page previews.',
  sectionContact: 'Contact Us',
  sectionContactSub: 'We Are Here to Help',
  sectionContactDesc: 'Contact us for inquiries or to join Al-Zawiya activities.',
},
```

## Step 2 — Update HomePage.jsx

Import useT:
```jsx
import { useT } from '../../context/LanguageContext'
```

Add at top of component:
```jsx
const t = useT()
```

Replace ALL of these with t('home.xxx') calls:

- SECTIONS array → convert to inline rendering or a function that returns t() values
  Replace the SECTIONS array entirely. Instead of a static array, either:
  a) Create a getSections(t) function that returns translated section objects, OR
  b) Render the section cards inline with individual t() calls

  Best approach: remove the SECTIONS array, render the 8 section cards inline:
```jsx
// Section 1 — About
<SectionCard
  icon="🏛️"
  title={t('home.sectionAbout')}
  subtitle={t('home.sectionAboutSub')}
  description={t('home.sectionAboutDesc')}
  linkTo="/about"
/>
// ... repeat for all 8 sections using t('home.sectionXxx') keys
```

- Eyebrow text: `t('home.eyebrow')`
- Hero accent span: `t('home.heroAccent')`
- Hero lede paragraph: `t('home.heroLede')`
- CTA button: `t('home.ctaAbout')`
- CTA outline button: `t('home.ctaLibrary')`
- Placeholder img text: `t('home.placeholderImg')`
- Placeholder hint: `t('home.placeholderHint')`
- StatCards:
  - Books: `t('home.statBooks')`
  - Categories: `t('home.statCategories')`
  - Authors: `t('home.statAuthors')`
  - Activities value: `t('home.statActivitiesNum')`, label: `t('home.statActivities')`
- Sections heading: `t('home.sectionsTitle')`
- Sections subtitle: `t('home.sectionsSubtitle')`
- Ornament text: `t('home.ornamentText')`
- Recent title: `t('home.recentTitle')`
- View all link: `t('home.viewAll')`
- Empty books: `t('home.emptyBooks')`
- CTA banner heading: `t('home.ctaBannerHeading')`
- CTA banner desc: `t('home.ctaBannerDesc')`
- CTA contact button: `t('home.ctaBannerContact')`
- CTA about button: `t('home.ctaBannerAbout')`
- Book cover alt: `t('home.coverAlt', { title: book.title })`

Remove `dir="rtl"` from JSX.

## Step 3 — Update Footer.jsx

Import useT:
```jsx
import { useT } from '../context/LanguageContext'
```

Add at component top:
```jsx
const t = useT()
```

Replace ALL hardcoded Arabic strings:

- Brand name: `t('footer.brandName')`
- Brand subtitle: `t('footer.brandSubtitle')`
- Tagline: `t('footer.tagline')`
- Column headings: `t('footer.sections')`, `t('footer.contact')`, `t('footer.sources')`
- Section link labels: `t('nav.about')`, `t('nav.quranSchool')`, `t('nav.manuscripts')`, `t('nav.sewing')`, `t('nav.activities')`, `t('nav.association')`, `t('nav.library')` (reuse from nav)
- Address: `t('footer.address')`
- Copyright: `t('footer.copyright', { year })` where year is `new Date().getFullYear()`
- Admin link: `t('footer.admin')`

Remove any hardcoded `dir="rtl"`.

## Step 4 — Verify

Run: `cd frontend-react && npm run build`

Fix any errors. Common issues:
- Missing commas in translations.js
- Key name mismatches
- Import errors
