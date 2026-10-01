/* Axion Bangladesh — site behaviour */

// Where the "Send inquiry" form addresses its email.
// Leave empty until a confirmed business email exists; the visitor's mail app
// will then open with the subject and body filled in and the "To" field blank.
const INQUIRY_EMAIL = '';

/* ------------------------------------------------------------------ */
/* Translations (English is read from the HTML itself)                 */
/* ------------------------------------------------------------------ */

const BN = {
  'topbar.note': 'বাংলাদেশজুড়ে পেশাদার সেলুন সরঞ্জাম সোর্সিং ও পাইকারি সহায়তা',
  'topbar.consult': 'পাইকারি পরামর্শ',

  'nav.equipment': 'সরঞ্জাম',
  'nav.solutions': 'সমাধান',
  'nav.wholesale': 'পাইকারি',
  'nav.about': 'আমাদের সম্পর্কে',
  'nav.contact': 'যোগাযোগ',
  'cta.browse': 'সরঞ্জাম দেখুন',
  'cta.quote': 'কোটেশন চান',

  'hero.eyebrow': 'সেলুন সরঞ্জাম · বাংলাদেশ',
  'hero.title': 'উন্নত সেবার জন্য<br> বিউটি ব্যবসাকে<br> সজ্জিত করুন।',
  'hero.text': 'অ্যাক্সিয়ন বাংলাদেশ পেশাদার ফেসিয়াল, হেয়ার ও সেলুন মেশিনারি আমদানি ও সরবরাহ করে—বিবেচিত পণ্য নির্বাচন, স্পষ্ট সরঞ্জাম নির্দেশনা এবং পাইকারি অর্ডার সহায়তাসহ।',
  'hero.explore': 'সরঞ্জাম দেখুন',
  'hero.plan': 'পাইকারি অর্ডারের পরিকল্পনা',
  'hero.point1': 'স্পেসিফিকেশন-ভিত্তিক নির্বাচন',
  'hero.point2': 'ব্যবসায়িক জিজ্ঞাসা সহায়তা',
  'hero.badge': 'পাইকারি সরবরাহ',
  'hero.cardTitle': 'বাছাইকৃত সরঞ্জাম',
  'hero.cardText': 'আধুনিক সেলুন কার্যপ্রবাহের জন্য',

  'values.1t': 'পেশাদার মানের সংগ্রহ',
  'values.1d': 'সেলুন ও বিউটি পার্লারের ব্যবহারের জন্য নির্বাচিত',
  'values.2t': 'পাইকারি-প্রস্তুত সরবরাহ',
  'values.2d': 'ব্যবসা ও রিসেলারদের জন্য বাস্তবসম্মত অর্ডার',
  'values.3t': 'সরঞ্জাম নির্দেশনা',
  'values.3d': 'সিদ্ধান্তের আগে স্পষ্ট স্পেসিফিকেশন',
  'values.4t': 'বাংলাদেশ-কেন্দ্রিক',
  'values.4d': 'স্থানীয় জিজ্ঞাসা ও সরবরাহ সমন্বয়',

  'cat.eyebrow': 'সরঞ্জামের ক্যাটাগরি',
  'cat.title': 'প্রতিটি ট্রিটমেন্ট স্টেশনের জন্য<br> একটি বিবেচিত সংগ্রহ।',
  'cat.lead': 'ফেসিয়াল কেয়ার, হেয়ার স্টাইলিং এবং সম্পূর্ণ সেলুন সেটআপের মূল সরঞ্জাম দেখুন। পণ্যের বিস্তারিত ও পাইকারি প্রাপ্যতা আমাদের টিমের সাথে নিশ্চিত করা যাবে।',
  'cat.cta': 'সম্পূর্ণ সংগ্রহ দেখুন',
  'cat.1tag': 'ফেসিয়াল প্রযুক্তি',
  'cat.1t': 'হাইড্রাফেসিয়াল সিস্টেম',
  'cat.1d': 'উন্নত ফেসিয়াল সেবার জন্য মাল্টি-ফাংশন ক্লিনজিং, ইনফিউশন ও হাইড্রেশন সিস্টেম।',
  'cat.2tag': 'ত্বক প্রস্তুতি',
  'cat.2t': 'ফেসিয়াল স্টিমার',
  'cat.2d': 'ক্লিনজিং ও ট্রিটমেন্ট প্রস্তুতির জন্য পেশাদার স্টিম।',
  'cat.3tag': 'ড্রাইং ও ফিনিশ',
  'cat.3t': 'হেয়ার ড্রায়ার',
  'cat.3d': 'দক্ষ সেলুন কাজের জন্য হ্যান্ডহেল্ড ও স্ট্যান্ডিং ফরম্যাট।',
  'cat.4tag': 'স্টাইলিং টুলস',
  'cat.4t': 'হেয়ার স্ট্রেইটনার',
  'cat.4d': 'ধারাবাহিক স্টাইলিংয়ের জন্য পেশাদার প্লেট ও নিখুঁত তাপ নিয়ন্ত্রণ।',
  'cat.5tag': 'সম্পূর্ণ সেটআপ',
  'cat.5t': 'সেলুন মেশিনারি',
  'cat.5d': 'ট্রিটমেন্ট রুমের জন্য সহায়ক মেশিনারি ও আনুষঙ্গিক সামগ্রী।',

  'advisor.title': 'আপনার সার্ভিস মেনুর জন্য কোনটি উপযুক্ত, নিশ্চিত নন?',
  'advisor.text': 'আপনার পরিকল্পিত ট্রিটমেন্ট, বাজেট ও প্রত্যাশিত ব্যবহার জানান—আমরা সরঞ্জামের সংক্ষিপ্ত তালিকা তৈরিতে সাহায্য করব।',
  'advisor.cta': 'সরঞ্জাম পরামর্শকের সাথে কথা বলুন →',

  'feat.eyebrow': 'বিশেষ সমাধান',
  'feat.title': 'কার্যপ্রবাহ অনুযায়ী বাছাই করা<br> পেশাদার প্রয়োজনীয় সামগ্রী।',
  'feat.lead': 'ফেসিয়াল কেয়ার ও হেয়ার স্টাইলিংয়ের প্রতিনিধিত্বমূলক সমাধান। বর্তমান কনফিগারেশন, স্পেসিফিকেশন ও পাইকারি প্রাপ্যতা জানতে যোগাযোগ করুন।',
  'feat.cta': 'সরঞ্জামের তালিকা তৈরি করুন',
  'feat.1tag': 'ফেসিয়াল স্টুডিও',
  'feat.1t': 'মাল্টি-ফাংশন ফেসিয়াল প্ল্যাটফর্ম',
  'feat.1d': 'ক্লিনজিং, হাইড্রেশন ও সিরাম-সহায়ক ফেসিয়াল সেবার জন্য কনফিগারযোগ্য সিস্টেম।',
  'feat.1c1': 'টাচস্ক্রিন নিয়ন্ত্রণ',
  'feat.1c2': 'সুবিন্যস্ত হ্যান্ডপিস',
  'feat.1c3': 'চলমান বেস',
  'feat.2tag': 'ট্রিটমেন্ট রুম',
  'feat.2t': 'স্টিমার ও ম্যাগনিফাইং ল্যাম্প সেট',
  'feat.2d': 'ত্বক বিশ্লেষণ, ক্লিনজিং প্রস্তুতি ও সূক্ষ্ম ট্রিটমেন্টের জন্য বাস্তবসম্মত জুটি।',
  'feat.2c1': 'সমন্বয়যোগ্য আর্ম',
  'feat.2c2': 'স্থিতিশীল চাকাযুক্ত বেস',
  'feat.2c3': 'ক্লিনিক-উপযোগী ফিনিশ',
  'feat.3tag': 'স্টাইলিং স্টেশন',
  'feat.3t': 'পেশাদার হিট স্টাইলিং কিট',
  'feat.3d': 'প্রতিদিনের নির্ভরযোগ্য সেলুন সেবার জন্য মূল ড্রাইং ও স্ট্রেইটনিং টুলস।',
  'feat.3c1': 'সেলুন-উপযোগী ফরম্যাট',
  'feat.3c2': 'নিয়ন্ত্রিত স্টাইলিং',
  'feat.3c3': 'আরামদায়ক ব্যবহার',
  'feat.inquiry': 'পাইকারি জিজ্ঞাসা',
  'feat.details': 'বিস্তারিত জানুন',

  'qa.noteLabel': 'অর্ডারের আগে',
  'qa.note': 'উপযুক্ততা, বৈদ্যুতিক চাহিদা, অন্তর্ভুক্ত আনুষঙ্গিক সামগ্রী ও দৈনিক কাজের চাপ নিশ্চিত করুন।',
  'qa.eyebrow': 'মান নিশ্চিতকরণ',
  'qa.title': 'কম অনুমান। আরও ভালো<br> সরঞ্জাম সিদ্ধান্ত।',
  'qa.lead': 'পেশাদার সরঞ্জাম বাহ্যিক চেহারা নয়, সেবার চাহিদা অনুযায়ী বেছে নেওয়া উচিত। অর্ডার এগোনোর আগে আমরা পণ্য নিয়ে আলোচনাকে সুনির্দিষ্ট করি।',
  'qa.1t': 'স্পেসিফিকেশনের স্পষ্টতা',
  'qa.1d': 'আপনার পরিকল্পিত সেবার সাথে ফাংশন, সক্ষমতা, নিয়ন্ত্রণ ও অন্তর্ভুক্ত উপাদান মিলিয়ে দেখুন।',
  'qa.2t': 'ব্যবহার অনুযায়ী মিল',
  'qa.2d': 'ট্রিটমেন্টের পরিমাণ, টিমের কার্যপ্রবাহ ও উপলব্ধ জায়গার সাথে সরঞ্জামের ফরম্যাট মেলান।',
  'qa.3t': 'অর্ডার নিশ্চিতকরণ',
  'qa.3d': 'সরবরাহ সমন্বয়ের আগে চাওয়া কনফিগারেশন ও বাণিজ্যিক শর্ত স্পষ্ট করুন।',
  'qa.cta': 'মান যাচাই সম্পর্কে জানুন',

  'proc.eyebrow': 'সোর্সিং ও পাইকারি',
  'proc.title': 'চাহিদা থেকে সরবরাহ পর্যন্ত একটি স্পষ্ট পথ।',
  'proc.lead': 'নতুন ট্রিটমেন্ট রুম খোলা, সেলুন সংস্কার বা পুনঃবিক্রয়ের জন্য কেনা—প্রক্রিয়া শুরু হয় একটি বাস্তবসম্মত সরঞ্জাম ব্রিফ দিয়ে।',
  'proc.1t': 'আপনার চাহিদা জানান',
  'proc.1d': 'সরঞ্জামের ধরন, সেবার পরিকল্পনা, পরিমাণ ও পছন্দের বাজেট জানান।',
  'proc.2t': 'সংক্ষিপ্ত তালিকা পর্যালোচনা',
  'proc.2d': 'উপযুক্ত কনফিগারেশন, ফাংশন ও অর্ডার বিবেচনা তুলনা করুন।',
  'proc.3t': 'অর্ডার নিশ্চিত করুন',
  'proc.3d': 'পণ্য, আনুষঙ্গিক সামগ্রী, পরিমাণ ও বাণিজ্যিক বিবরণে একমত হন।',
  'proc.4t': 'সরবরাহ সমন্বয়',
  'proc.4d': 'সোর্সিং ও পাইকারি সরবরাহের পরবর্তী ধাপ অ্যাক্সিয়ন পরিচালনা করে।',
  'proc.cta': 'পাইকারি জিজ্ঞাসা শুরু করুন',

  'co.eyebrow': 'আমাদের প্রতিষ্ঠান',
  'co.title': 'সৌন্দর্যের পেছনের<br> ব্যবসার জন্য তৈরি।',
  'co.lead': 'অ্যাক্সিয়ন বাংলাদেশ সেই সরঞ্জাম সিদ্ধান্তগুলোতে মনোযোগ দেয়, যা প্রতিদিনের সেলুন ও বিউটি পার্লার সেবাকে গড়ে তোলে।',
  'co.text': 'আমাদের ভূমিকা হলো পেশাদার ক্রেতাদের প্রাসঙ্গিক মেশিনারি, স্পষ্ট পণ্য তথ্য এবং আরও সুসংগঠিত পাইকারি আলোচনার সাথে যুক্ত করা। একটি ফেসিয়াল স্টেশন থেকে বৃহত্তর সেলুন সেটআপ পর্যন্ত—আমরা শুরু করি সরঞ্জামটি আসলে কীভাবে ব্যবহৃত হবে তা দিয়ে।',
  'co.tag1': 'সুনির্দিষ্ট পণ্য নির্দেশনা',
  'co.tag2': 'পেশাদার ব্যবহারে মনোযোগ',
  'co.tag3': 'দ্রুত পাইকারি সহায়তা',
  'co.cta': 'অ্যাক্সিয়ন সম্পর্কে জানুন',
  'co.badgeLabel': 'সেবাকে কেন্দ্র করে নকশা',
  'co.badge': 'সরঞ্জাম মানানসই হওয়া উচিত রুম, টিম ও ট্রিটমেন্টের সাথে—উল্টোটা নয়।',

  'team.eyebrow': 'নেতৃত্ব',
  'team.title': 'প্রতিটি খুঁটিনাটির প্রতি দায়বদ্ধ একটি টিম।',
  'team.lead': 'অ্যাক্সিয়ন বাংলাদেশের পণ্য দিকনির্দেশনা, সরবরাহকারী সম্পর্ক ও পাইকারি অভিজ্ঞতা গড়ে তোলা মানুষদের সাথে পরিচিত হোন।',
  'team.note': 'সম্পাদনযোগ্য প্রোফাইল প্লেসহোল্ডার',
  'team.founder': 'প্রতিষ্ঠাতা',
  'team.cofounder': 'সহ-প্রতিষ্ঠাতা',
  'team.add': 'অনুমোদিত ছবি যোগ করুন',
  'team.name': '[পূর্ণ নাম]',
  'team.1d': 'ভিশন, সরবরাহকারী সম্পর্ক ও ব্যবসায়িক দিকনির্দেশনা',
  'team.2d': 'বাণিজ্যিক কার্যক্রম ও পাইকারি অংশীদারিত্ব',
  'team.3d': 'পণ্য পোর্টফোলিও ও গ্রাহক অভিজ্ঞতা',

  'inq.eyebrow': 'পাইকারি জিজ্ঞাসা',
  'inq.title': 'আপনার ব্যবসার পরবর্তী<br> প্রয়োজন আমাদের জানান।',
  'inq.lead': 'আপনি যে সরঞ্জামের ধরন, উদ্দেশ্যমূলক ব্যবহার ও পরিমাণ বিবেচনা করছেন তা পাঠান। এরপর অ্যাক্সিয়ন বাংলাদেশ আরও কার্যকর পণ্য ও সোর্সিং আলোচনা সাজাতে পারবে।',
  'inq.type1': 'নতুন সেলুন সেটআপ',
  'inq.type2': 'সরঞ্জাম হালনাগাদ',
  'inq.type3': 'রিসেলার অর্ডার',

  'form.title': 'পাইকারি কোটেশন অনুরোধ',
  'form.sub': 'মূল তথ্য দিয়ে শুরু করুন। বিস্তারিত জানতে আমরা যোগাযোগ করব।',
  'form.business': 'ব্যবসার নাম',
  'form.businessPh': 'আপনার সেলুন বা প্রতিষ্ঠান',
  'form.contact': 'যোগাযোগকারী ব্যক্তি',
  'form.contactPh': 'পূর্ণ নাম',
  'form.equipment': 'প্রয়োজনীয় সরঞ্জাম',
  'form.equipmentPh': 'যেমন: ফেসিয়াল সিস্টেম, স্টিমার, হেয়ার টুলস',
  'form.preferred': 'পছন্দের যোগাযোগ মাধ্যম',
  'form.preferredPh': 'ফোন, হোয়াটসঅ্যাপ বা ইমেইল',
  'form.privacy': 'শুধু ব্যবসায়িক জিজ্ঞাসার জন্য প্রয়োজনীয় তথ্য দিন।',
  'form.send': 'জিজ্ঞাসা পাঠান',
  'form.invalid': 'অনুগ্রহ করে সবগুলো ঘর পূরণ করুন।',
  'form.opened': 'আপনার ইমেইল অ্যাপে জিজ্ঞাসাটি খোলা হয়েছে। পাঠাতে “Send” চাপুন।',

  'ct.phoneLabel': 'ব্যবসায়িক ফোন',
  'ct.phone': 'নিশ্চিত ফোন নম্বর যোগ করুন',
  'ct.emailLabel': 'পাইকারি ইমেইল',
  'ct.email': 'নিশ্চিত ব্যবসায়িক ইমেইল যোগ করুন',
  'ct.officeLabel': 'অফিস বা শোরুম',
  'ct.office': 'নিশ্চিত বাংলাদেশ ঠিকানা যোগ করুন',

  'ft.about': 'বাংলাদেশে পেশাদার সেলুন, বিউটি পার্লার ও কসমেটিক সরঞ্জামের আমদানিকারক ও পাইকারি সরবরাহকারী।',
  'ft.equipment': 'সরঞ্জাম',
  'ft.dryers': 'পেশাদার হেয়ার ড্রায়ার',
  'ft.business': 'ব্যবসার জন্য',
  'ft.sourcing': 'সোর্সিং প্রক্রিয়া',
  'ft.quality': 'মানের দৃষ্টিভঙ্গি',
  'ft.company': 'প্রতিষ্ঠান',
  'ft.aboutAxion': 'অ্যাক্সিয়ন সম্পর্কে',
  'ft.privacy': 'গোপনীয়তা',
  'ft.terms': 'শর্তাবলি',
  'ft.talk': 'অ্যাক্সিয়নের সাথে কথা বলুন',
  'ft.phoneLabel': 'ফোন / হোয়াটসঅ্যাপ',
  'ft.phone': 'নিশ্চিত নম্বর যোগ করুন',
  'ft.emailLabel': 'ইমেইল',
  'ft.email': 'নিশ্চিত ঠিকানা যোগ করুন',
  'ft.copy': '© অ্যাক্সিয়ন বাংলাদেশ। সর্বস্বত্ব সংরক্ষিত।',
  'ft.tagline': 'সৌন্দর্য ব্যবসার জন্য পেশাদার সরঞ্জাম।',
  'ft.top': 'উপরে ফিরুন',
};

// Strings only used from script; English values live here rather than in the HTML.
const EN_EXTRA = {
  'form.invalid': 'Please fill in all fields.',
  'form.opened': 'Your inquiry has opened in your email app. Press “Send” to submit it.',
};

/* ------------------------------------------------------------------ */
/* Language switching                                                  */
/* ------------------------------------------------------------------ */

const LANG_KEY = 'axion-lang';
const textNodes = document.querySelectorAll('[data-i18n]');
const placeholderNodes = document.querySelectorAll('[data-i18n-ph]');
let currentLang = 'en';

// Snapshot the English markup once so switching back is lossless.
textNodes.forEach((el) => { el.dataset.en = el.innerHTML; });
placeholderNodes.forEach((el) => { el.dataset.enPh = el.placeholder; });

function t(key) {
  if (currentLang === 'bn' && BN[key]) return BN[key];
  return EN_EXTRA[key] || key;
}

function setLang(lang) {
  currentLang = lang === 'bn' ? 'bn' : 'en';
  document.documentElement.lang = currentLang;

  textNodes.forEach((el) => {
    const bn = BN[el.dataset.i18n];
    el.innerHTML = currentLang === 'bn' && bn ? bn : el.dataset.en;
  });
  placeholderNodes.forEach((el) => {
    const bn = BN[el.dataset.i18nPh];
    el.placeholder = currentLang === 'bn' && bn ? bn : el.dataset.enPh;
  });
  document.querySelectorAll('.lang__btn').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.lang === currentLang));
  });

  try { localStorage.setItem(LANG_KEY, currentLang); } catch (e) { /* storage unavailable */ }
}

document.querySelectorAll('.lang__btn').forEach((btn) => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

let savedLang = 'en';
try { savedLang = localStorage.getItem(LANG_KEY) || 'en'; } catch (e) { /* storage unavailable */ }
if (savedLang !== 'en') setLang(savedLang);

/* ------------------------------------------------------------------ */
/* Mobile menu                                                         */
/* ------------------------------------------------------------------ */

const menuToggle = document.querySelector('.header__toggle');
const mobileMenu = document.getElementById('mobile-menu');

function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileMenu.hidden = !open;
}

menuToggle.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});
mobileMenu.addEventListener('click', (e) => {
  if (e.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setMenu(false);
});
window.matchMedia('(min-width: 1181px)').addEventListener('change', (e) => {
  if (e.matches) setMenu(false);
});

/* ------------------------------------------------------------------ */
/* Inquiry form → email draft                                          */
/* ------------------------------------------------------------------ */

const form = document.getElementById('quote-form');
const statusEl = form.querySelector('.quote__status');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const fields = [...form.querySelectorAll('input[required]')];
  let firstInvalid = null;
  fields.forEach((input) => {
    const empty = !input.value.trim();
    input.setAttribute('aria-invalid', String(empty));
    if (empty && !firstInvalid) firstInvalid = input;
  });
  if (firstInvalid) {
    statusEl.textContent = t('form.invalid');
    firstInvalid.focus();
    return;
  }

  const data = Object.fromEntries(new FormData(form));
  const subject = `Wholesale quote request — ${data.business.trim()}`;
  const body = [
    `Business name: ${data.business.trim()}`,
    `Contact person: ${data.contact.trim()}`,
    `Equipment needed: ${data.equipment.trim()}`,
    `Preferred contact: ${data.preferred.trim()}`,
  ].join('\n');

  window.location.href =
    `mailto:${INQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  statusEl.textContent = t('form.opened');
});

form.addEventListener('input', (e) => {
  if (e.target.value.trim()) e.target.removeAttribute('aria-invalid');
});
