/* Axion Bangladesh — site behaviour */

// Where the "Send inquiry" form addresses its email.
// Leave empty until a confirmed business email exists; the visitor's mail app
// will then open with the subject and body filled in and the "To" field blank.
const INQUIRY_EMAIL = '';

// Relative path from this page back to the site root ("./" or "../"), set on <html> by build.py.
const ROOT = document.documentElement.dataset.root || './';

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

  'hero.eyebrow': 'বাংলাদেশের জন্য সেলুন সরঞ্জাম',
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
  'team.coo': 'সহ-প্রতিষ্ঠাতা ও সিওও',
  'team.cmo': 'সহ-প্রতিষ্ঠাতা ও সিএমও',
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

  'advisor.find': 'আমার সেটআপ খুঁজুন',
  'list.add': 'তালিকায় যোগ করুন',
  'list.added': 'যোগ হয়েছে',
  'list.title': 'আপনার সরঞ্জাম তালিকা',
  'list.send': 'এগুলোর কোটেশন চান',
  'list.clear': 'তালিকা মুছুন',
  'list.remove': 'তালিকা থেকে সরান',
  'list.addedMsg': '{name} তালিকায় যোগ হয়েছে।',
  'list.removedMsg': '{name} তালিকা থেকে সরানো হয়েছে।',
  'list.cleared': 'তালিকা খালি করা হয়েছে।',

  'finder.title': 'আপনার সেটআপ খুঁজুন',
  'finder.intro': 'তিনটি ছোট প্রশ্ন। উত্তর দিলেই পাবেন একটি প্রাথমিক সরঞ্জাম তালিকা, যা আমাদের টিমকে পাঠাতে পারবেন।',
  'finder.q1': 'আপনি কী পরিকল্পনা করছেন?',
  'finder.g1': 'নতুন সেলুন খুলছি',
  'finder.g2': 'ফেসিয়াল ট্রিটমেন্ট যোগ করছি',
  'finder.g3': 'হেয়ার স্টেশন আপগ্রেড করছি',
  'finder.g4': 'পুনঃবিক্রয়ের জন্য কিনছি',
  'finder.q2': 'আপনি কোন কোন সেবা দেবেন?',
  'finder.q2hint': 'প্রযোজ্য সবগুলো বেছে নিন।',
  'finder.s1': 'অ্যাডভান্সড ফেসিয়াল',
  'finder.s2': 'স্কিন প্রেপ ও স্টিমিং',
  'finder.s3': 'ব্লো-ড্রাই ও ফিনিশিং',
  'finder.s4': 'স্ট্রেইটনিং ও স্টাইলিং',
  'finder.s5': 'ট্রিটমেন্ট রুমের প্রয়োজনীয় সামগ্রী',
  'finder.q3': 'কাজের চাপ কেমন হবে?',
  'finder.q3hint': 'এতে আমাদের টিম সঠিক ফরম্যাট ও পরিমাণ সাজেস্ট করতে পারবে।',
  'finder.w1': 'সবে শুরু করছি',
  'finder.w1d': 'দিনে অল্প কয়েকজন ক্লায়েন্ট',
  'finder.w2': 'নিয়মিত বুকিং',
  'finder.w2d': 'দিনের বেশিরভাগ সময় বুকড',
  'finder.w3': 'ব্যস্ত, একাধিক স্টেশন',
  'finder.w3d': 'সারাদিন একসাথে কয়েকজন ক্লায়েন্ট',
  'finder.result': 'আপনার প্রাথমিক তালিকা',
  'finder.resultNote': 'কনফিগারেশন, পরিমাণ ও প্রাপ্যতা আমাদের টিম নিশ্চিত করবে।',
  'finder.addN': '{n}টি তালিকায় যোগ করুন',
  'finder.back': 'পেছনে',
  'finder.next': 'পরবর্তী',
  'finder.see': 'তালিকা দেখুন',
  'finder.restart': 'আবার শুরু করুন',

  'nudge.text': 'সেলুনের পরিকল্পনা করছেন? তিনটি প্রশ্নের উত্তর দিন, পেয়ে যান একটি প্রাথমিক সরঞ্জাম তালিকা।',

  'crumb.home': 'হোম',
  'next.label': 'এরপর',
  'explore.eyebrow': 'অ্যাক্সিয়ন ঘুরে দেখুন',
  'explore.title': 'পরবর্তী স্টেশনের পরিকল্পনায়<br> যা কিছু দরকার।',
  'explore.lead': 'সরঞ্জাম দিয়ে শুরু করুন, সেটআপগুলো কীভাবে সাজানো হয় দেখুন, অথবা পাইকারি অর্ডার কীভাবে কাজ করে জেনে নিন।',
  'explore.1d': 'ফেসিয়াল সিস্টেম, স্টিমার, হেয়ার টুলস ও সেলুন মেশিনারি।',
  'explore.2d': 'ফেসিয়াল স্টুডিও, ট্রিটমেন্ট রুম ও স্টাইলিং স্টেশনের সেটআপ।',
  'explore.3d': 'চাহিদা থেকে সরবরাহ পর্যন্ত চারটি স্পষ্ট ধাপ।',
  'explore.4d': 'সরঞ্জামের পেছনের মানুষ ও ভাবনা।',
  'cta.title': 'কোথা থেকে শুরু করবেন বুঝতে পারছেন না?',
  'cta.text': 'প্রাথমিক সরঞ্জাম তালিকার জন্য তিনটি প্রশ্নের উত্তর দিন, অথবা আপনার চাহিদা সরাসরি আমাদের টিমকে পাঠান।',
  'co.team': 'টিমের সাথে পরিচিত হোন',
  'legal.privacyLead': 'এই পেজটি গোপনীয়তা নীতির জন্য প্রস্তুত। চালুর আগে নিশ্চিত নীতিমালা যোগ করুন।',
  'cta.help': 'বেছে নিতে সাহায্য করুন',
  'hero.browseAll': 'অথবা সব সরঞ্জাম দেখুন',
  'show.title': 'শোরুমে ঘুরে দেখুন।',
  'show.lead': 'ফেসিয়াল সিস্টেম, স্টিমার ও স্টাইলিং টুলস—একটির পর একটি। যেকোনোটি খুলে বিস্তারিত দেখুন, অথবা দেখতে দেখতেই তালিকায় যোগ করুন।',
  'show.open': 'বিস্তারিত দেখুন',
  'qv.goodFor': 'যেসব সেবার জন্য',
  'qv.pairs': 'যার সাথে ভালো মানায়',
  'qv.ask': 'এটি সম্পর্কে জানতে চান',
  'brief.jump': 'আপনার ব্রিফ তৈরি করুন',
  'buyer.ready': 'যা হাতে রাখলে ভালো',
  'buyer.newText': 'যে ট্রিটমেন্টগুলো দিতে চান সেখান থেকে শুরু করুন। আমরা একেকটি স্টেশন ধরে তালিকা সাজাই, যাতে প্রথম অর্ডারে রুমের যা দরকার ঠিক সেটুকুই থাকে।',
  'buyer.new1': 'যে ট্রিটমেন্টগুলো দিতে চান',
  'buyer.new2': 'রুমের মাপ ও কয়টি স্টেশন',
  'buyer.new3': 'পুরো সেটআপের বাজেট',
  'buyer.refreshText': 'এখন কী ব্যবহার করছেন এবং কোথায় টিমের সময় নষ্ট হয় জানান। আপনার সেলুনের চলমান পদ্ধতির সাথে নতুন কনফিগারেশন মিলিয়ে দেখি।',
  'buyer.refresh1': 'যে সরঞ্জাম বদলাতে চান',
  'buyer.refresh2': 'দিনে কতজন ক্লায়েন্ট সেবা পান',
  'buyer.refresh3': 'জায়গা বা বৈদ্যুতিক কোনো সীমাবদ্ধতা',
  'buyer.resellText': 'কোন ক্যাটাগরি ও কত পরিমাণ রাখতে চান জানান। সরবরাহ সমন্বয়ের আগে আমরা কনফিগারেশন ও বাণিজ্যিক শর্ত নিশ্চিত করি।',
  'buyer.resell1': 'ক্যাটাগরি ও পরিমাণ',
  'buyer.resell2': 'যে শহরে ডেলিভারি দরকার',
  'buyer.resell3': 'কবে স্টক দরকার',
  'journey.title': 'চারটি ধাপ, কোনো অনুমান নয়।',
  'journey.lead': 'পরের ধাপে কী হবে এবং আপনার কাছ থেকে কী লাগবে—সবসময় জানবেন।',
  'brief.title': 'এক মিনিটে আপনার ব্রিফ তৈরি করুন।',
  'brief.lead': 'যা প্রযোজ্য বেছে নিন। আমরা সেটিকে একটি বার্তায় সাজিয়ে দেব, যা সরাসরি আমাদের টিমকে পাঠাতে পারবেন।',
  'brief.q1': 'অর্ডারের ধরন',
  'brief.q2': 'সরঞ্জাম',
  'brief.q3': 'পরিমাণ',
  'brief.q4': 'সময়',
  'brief.q5': 'ডেলিভারির শহর',
  'brief.cityPh': 'যেমন: ঢাকা, চট্টগ্রাম',
  'brief.qty1': '১টি',
  'brief.qty2': '২–৫টি',
  'brief.qty3': '৬–২০টি',
  'brief.qty4': '২০টির বেশি',
  'brief.t1': 'এই মাসে',
  'brief.t2': '১–৩ মাসের মধ্যে',
  'brief.t3': 'শুধু খোঁজ নিচ্ছি',
  'brief.preview': 'আপনার ব্রিফ',
  'brief.empty': 'কয়েকটি অপশন বেছে নিন, এখানে আপনার ব্রিফ দেখা যাবে।',
  'brief.send': 'এই ব্রিফ পাঠান',
  'brief.note': 'এতে কোটেশন ফর্মটি সব তথ্যসহ খুলবে। সেখানে চাইলে পরিবর্তন করতে পারবেন।',
  'legal.termsLead': 'এই পেজটি ব্যবসায়িক শর্তাবলির জন্য প্রস্তুত। চালুর আগে নিশ্চিত শর্তাবলি যোগ করুন।',
};

// Strings only used from script; English values live here rather than in the HTML.
// Names the script shows on any page (equipment list, finder, page transitions), so they
// don't depend on which page happens to contain them.
const EN_EXTRA = {
  'crumb.home': 'Home',
  'cat.1t': 'HydraFacial systems',
  'cat.2t': 'Facial steamers',
  'cat.3t': 'Hair dryers',
  'cat.4t': 'Hair straighteners',
  'cat.5t': 'Salon machinery',
  'feat.1t': 'Multi-function facial platform',
  'feat.2t': 'Steamer &amp; magnifying lamp set',
  'feat.3t': 'Professional heat styling kit',
  'cat.1d': 'Multi-function cleansing, infusion and hydration systems for advanced facial-service menus.',
  'cat.2d': 'Professional steam delivery for cleansing and treatment prep.',
  'cat.3d': 'Handheld and standing formats for efficient salon workflows.',
  'cat.4d': 'Professional plates and precise heat control for consistent styling.',
  'cat.5d': 'Supporting machinery and accessories for treatment rooms.',
  'cat.1tag': 'Facial technology',
  'cat.2tag': 'Skin preparation',
  'cat.3tag': 'Drying &amp; finish',
  'cat.4tag': 'Styling tools',
  'cat.5tag': 'Complete setup',
  'feat.1d': 'A configurable system for cleansing, hydration and serum-assisted facial services.',
  'feat.2d': 'A practical pairing for skin analysis, cleansing preparation and close treatment work.',
  'feat.3d': 'Core drying and straightening tools for reliable day-to-day salon service.',
  'feat.1tag': 'Facial studio',
  'feat.2tag': 'Treatment room',
  'feat.3tag': 'Styling station',
  'feat.1c1': 'Touchscreen control',
  'feat.1c2': 'Organized handpieces',
  'feat.1c3': 'Mobile base',
  'feat.2c1': 'Adjustable arm',
  'feat.2c2': 'Stable wheeled base',
  'feat.2c3': 'Clinic-ready finish',
  'feat.3c1': 'Salon-duty formats',
  'feat.3c2': 'Controlled styling',
  'feat.3c3': 'Ergonomic handling',
  'form.invalid': 'Please fill in all fields.',
  'form.opened': 'Your inquiry has opened in your email app. Press “Send” to submit it.',
  'list.remove': 'Remove from list',
  'list.addedMsg': '{name} added to your list.',
  'list.removedMsg': '{name} removed from your list.',
  'list.cleared': 'Your list is now empty.',
  'finder.addN': 'Add {n} to my list',
  'finder.see': 'See my list',
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
// English strings by key, for text the script builds itself (list items, finder results).
const EN = {};
textNodes.forEach((el) => { if (!(el.dataset.i18n in EN)) EN[el.dataset.i18n] = el.dataset.en; });
placeholderNodes.forEach((el) => { el.dataset.enPh = el.placeholder; });

function t(key) {
  if (currentLang === 'bn' && BN[key]) return BN[key];
  return EN_EXTRA[key] || EN[key] || key;
}

function setLang(lang) {
  currentLang = lang === 'bn' ? 'bn' : 'en';
  // motion.js listens for these to restore split text before it is replaced, then re-measure.
  document.dispatchEvent(new CustomEvent('axion:beforelang'));
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
  document.dispatchEvent(new CustomEvent('axion:lang', { detail: { lang: currentLang } }));
}

document.querySelectorAll('.lang__btn').forEach((btn) => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

// ?lang=bn in the URL wins over the remembered choice, so links can share a language.
let savedLang = new URLSearchParams(location.search).get('lang');
if (!savedLang) {
  try { savedLang = localStorage.getItem(LANG_KEY) || 'en'; } catch (e) { savedLang = 'en'; }
}
if (savedLang !== 'en') setLang(savedLang);

/* ------------------------------------------------------------------ */
/* Mobile menu                                                         */
/* ------------------------------------------------------------------ */

const menuToggle = document.querySelector('.header__toggle');
const mobileMenu = document.getElementById('mobile-menu');
const menuClose = mobileMenu.querySelector('.mobile-menu__close');

// `menu-open` on <html> shows the panel and locks page scroll. motion.js listens for
// `axion:menu` to animate it; without motion the CSS shows and hides it instantly.
function setMenu(open) {
  if (open === document.documentElement.classList.contains('menu-open')) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.documentElement.classList.toggle('menu-open', open);
  document.dispatchEvent(new CustomEvent('axion:menu', { detail: { open } }));
  if (open) menuClose.focus({ preventScroll: true });
  else if (mobileMenu.contains(document.activeElement)) menuToggle.focus({ preventScroll: true });
}

menuToggle.addEventListener('click', () => setMenu(true));
menuClose.addEventListener('click', () => setMenu(false));
mobileMenu.addEventListener('click', (e) => {
  if (e.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setMenu(false);
});

// Keep keyboard focus inside the open menu.
mobileMenu.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  const items = mobileMenu.querySelectorAll('a[href], button');
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});
window.matchMedia('(min-width: 1181px)').addEventListener('change', (e) => {
  if (e.matches) setMenu(false);
});

/* ------------------------------------------------------------------ */
/* Inquiry form → email draft                                          */
/* ------------------------------------------------------------------ */

const form = document.getElementById('quote-form');

if (form) {
  const statusEl = form.querySelector('.quote__status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields = [...form.querySelectorAll('[required]')];
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
}

/* ------------------------------------------------------------------ */
/* Equipment list (collected while browsing, remembered on this device) */
/* ------------------------------------------------------------------ */

// Everything that can go on the list or open in the quick view. Text is translation keys;
// images are relative to this page. `services` are the finder's service groups (what it suits),
// `related` is what the quick view suggests next.
const CATALOG = {
  hydrafacial: {
    key: 'cat.1t', desc: 'cat.1d', tag: 'cat.1tag', img: `${ROOT}assets/categories/Product%20image.png`,
    services: ['facials'], related: ['facial-platform', 'steamer-lamp', 'steamer'],
  },
  steamer: {
    key: 'cat.2t', desc: 'cat.2d', tag: 'cat.2tag', img: `${ROOT}assets/categories/Product%20image%20(2).png`,
    services: ['skin'], related: ['steamer-lamp', 'hydrafacial', 'machinery'],
  },
  dryer: {
    key: 'cat.3t', desc: 'cat.3d', tag: 'cat.3tag', img: `${ROOT}assets/categories/Product%20image%20(3).png`,
    services: ['drying'], related: ['straightener', 'styling-kit'],
  },
  straightener: {
    key: 'cat.4t', desc: 'cat.4d', tag: 'cat.4tag', img: `${ROOT}assets/categories/Product%20image%20(1).png`,
    services: ['styling'], related: ['dryer', 'styling-kit'],
  },
  machinery: {
    key: 'cat.5t', desc: 'cat.5d', tag: 'cat.5tag', img: `${ROOT}assets/categories/Product%20image%20(4).png`,
    services: ['room'], related: ['steamer', 'steamer-lamp', 'hydrafacial'],
  },
  'facial-platform': {
    key: 'feat.1t', desc: 'feat.1d', tag: 'feat.1tag', img: `${ROOT}assets/featured/Product%20image.png`,
    chips: ['feat.1c1', 'feat.1c2', 'feat.1c3'], services: ['facials'], related: ['hydrafacial', 'steamer-lamp', 'machinery'],
  },
  'steamer-lamp': {
    key: 'feat.2t', desc: 'feat.2d', tag: 'feat.2tag', img: `${ROOT}assets/featured/Product%20image%20(1).png`,
    chips: ['feat.2c1', 'feat.2c2', 'feat.2c3'], services: ['skin'], related: ['steamer', 'facial-platform', 'machinery'],
  },
  'styling-kit': {
    key: 'feat.3t', desc: 'feat.3d', tag: 'feat.3tag', img: `${ROOT}assets/featured/Product%20image%20(2).png`,
    chips: ['feat.3c1', 'feat.3c2', 'feat.3c3'], services: ['drying', 'styling'], related: ['dryer', 'straightener'],
  },
};
// The finder's labels for each service group (the finder is on every page).
const SERVICE_LABELS = { facials: 'finder.s1', skin: 'finder.s2', drying: 'finder.s3', styling: 'finder.s4', room: 'finder.s5' };
const LIST_KEY = 'axion-list';

const shortlist = document.querySelector('.shortlist');
const dock = shortlist.querySelector('.shortlist__dock');
const listPanel = shortlist.querySelector('.shortlist__panel');
const listStatus = document.querySelector('[data-list-status]');
// Translations are stored as HTML (entities, <br>); `plain` gives readable text and `esc` makes text safe to put back into markup.
const decoder = document.createElement('template');
const plain = (key) => { decoder.innerHTML = t(key); return decoder.content.textContent; };
const esc = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const itemName = (id) => plain(CATALOG[id].key);

let list = [];
try { list = JSON.parse(localStorage.getItem(LIST_KEY)) || []; } catch (e) { list = []; }
list = list.filter((id) => Object.hasOwn(CATALOG, id));

function announce(message) {
  listStatus.textContent = message;
}

function syncAddButtons() {
  document.querySelectorAll('[data-add]').forEach((btn) => {
    const id = btn.dataset.add;
    btn.setAttribute('aria-pressed', String(list.includes(id)));
    btn.setAttribute('aria-label', `${plain('list.add')}: ${itemName(id)}`);
  });
}

function renderList() {
  try { localStorage.setItem(LIST_KEY, JSON.stringify(list)); } catch (e) { /* storage unavailable */ }

  syncAddButtons();

  shortlist.hidden = list.length === 0;
  if (!list.length) setListPanel(false);
  shortlist.querySelector('.shortlist__count').textContent = list.length;
  shortlist.querySelector('.shortlist__thumbs').innerHTML = list.slice(-3)
    .map((id) => `<img src="${CATALOG[id].img}" alt="">`).join('');
  shortlist.querySelector('.shortlist__items').innerHTML = list.map((id) => `
    <li>
      <img src="${CATALOG[id].img}" alt="">
      <span>${esc(itemName(id))}</span>
      <button type="button" class="shortlist__remove" data-remove="${id}" aria-label="${esc(`${plain('list.remove')}: ${itemName(id)}`)}">
        <svg class="icon"><use href="#i-x"/></svg>
      </button>
    </li>`).join('');
}

// `from` is the element the item came from, so motion.js can fly its photo into the dock.
function setInList(id, on, from) {
  if (on === list.includes(id)) return;
  list = on ? [...list, id] : list.filter((x) => x !== id);
  renderList();
  announce(t(on ? 'list.addedMsg' : 'list.removedMsg').replace('{name}', itemName(id)));
  document.dispatchEvent(new CustomEvent('axion:list', { detail: { id, added: on, from } }));
}

function setListPanel(open) {
  listPanel.hidden = !open;
  dock.setAttribute('aria-expanded', String(open));
}

document.addEventListener('click', (e) => {
  const add = e.target.closest('[data-add]');
  if (add) setInList(add.dataset.add, !list.includes(add.dataset.add), add);
});
dock.addEventListener('click', () => setListPanel(listPanel.hidden));
shortlist.addEventListener('click', (e) => {
  const remove = e.target.closest('[data-remove]');
  if (remove) setInList(remove.dataset.remove, false);
  if (e.target.closest('[data-list-clear]')) {
    list = [];
    renderList();
    announce(t('list.cleared'));
    dock.focus();
  }
  if (e.target.closest('[data-list-send]')) {
    setListPanel(false);
    goToQuote(list.map(itemName).join(', '));
  }
});
// composedPath, because a remove button is already gone from the DOM by the time this runs.
document.addEventListener('click', (e) => {
  if (!listPanel.hidden && !e.composedPath().includes(shortlist)) setListPanel(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !listPanel.hidden) {
    setListPanel(false);
    dock.focus();
  }
});

const PREFILL_KEY = 'axion-prefill';

// Fill the quote form's equipment field and bring the form into view. On other pages,
// carry the text over to the contact page, which fills it in on arrival.
function goToQuote(equipment) {
  if (!form) {
    try { sessionStorage.setItem(PREFILL_KEY, equipment); } catch (e) { /* storage unavailable */ }
    const url = `${ROOT}contact/`;
    // motion.js plays the page transition when it is running.
    if (document.dispatchEvent(new CustomEvent('axion:navigate', { detail: { url }, cancelable: true }))) location.href = url;
    return;
  }
  const field = form.querySelector('[name="equipment"]');
  field.value = equipment;
  field.removeAttribute('aria-invalid');
  const target = document.getElementById('inquiry');
  // motion.js takes over the scroll when smooth scrolling is running.
  if (document.dispatchEvent(new CustomEvent('axion:goto', { detail: { target }, cancelable: true }))) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
  const firstEmpty = [...form.querySelectorAll('[required]')].find((input) => !input.value.trim());
  (firstEmpty || field).focus({ preventScroll: true });
}

/* ------------------------------------------------------------------ */
/* Setup finder                                                        */
/* ------------------------------------------------------------------ */

// Which list items each service points to, and which services a goal starts with.
const SERVICE_ITEMS = {
  facials: ['hydrafacial', 'facial-platform'],
  skin: ['steamer', 'steamer-lamp'],
  drying: ['dryer'],
  styling: ['straightener', 'styling-kit'],
  room: ['machinery'],
};
const GOAL_SERVICES = {
  new: ['facials', 'skin', 'room'],
  facial: ['facials', 'skin'],
  hair: ['drying', 'styling'],
  resell: [],
};
const FINDER_KEY = 'axion-finder-seen';

const finder = document.getElementById('finder');
const finderForm = finder.querySelector('.finder__form');
const steps = [...finder.querySelectorAll('.finder__step')];
const picksEl = finder.querySelector('.finder__picks');
const nextBtn = finder.querySelector('[data-finder-next]');
let step = 1;
let picks = [];

const checked = (name) => [...finderForm.querySelectorAll(`[name="${name}"]:checked`)].map((input) => input.value);
const optionLabel = (input) => input.closest('label').querySelector('.opt__label').textContent;
const checkedLabel = (name) => {
  const input = finderForm.querySelector(`[name="${name}"]:checked`);
  return input ? optionLabel(input) : '';
};

function stepReady() {
  if (step === 1) return checked('goal').length > 0;
  if (step === 2) return checked('services').length > 0;
  if (step === 3) return checked('load').length > 0;
  return true;
}

function renderPicks() {
  const services = checked('services');
  picks = [];
  services.forEach((service) => SERVICE_ITEMS[service].forEach((id) => {
    if (!picks.some((p) => p.id === id)) picks.push({ id, service });
  }));
  const serviceLabel = (service) => optionLabel(finderForm.querySelector(`[name="services"][value="${service}"]`));
  finder.querySelector('.finder__summary').textContent = [checkedLabel('goal'), checkedLabel('load')].filter(Boolean).join(', ');
  picksEl.innerHTML = picks.map(({ id, service }) => `
    <li>
      <label class="pick">
        <input type="checkbox" value="${id}" checked>
        <img src="${CATALOG[id].img}" alt="">
        <span class="pick__text"><span class="pick__name">${esc(itemName(id))}</span><span class="pick__why">${esc(serviceLabel(service))}</span></span>
        <span class="pick__tick"><svg class="icon"><use href="#i-check"/></svg></span>
      </label>
    </li>`).join('');
  updateAddLabel();
}

function chosenPicks() {
  return [...picksEl.querySelectorAll('input:checked')].map((input) => input.value);
}

function updateAddLabel() {
  const n = chosenPicks().length;
  finder.querySelector('.finder__add-label').textContent = t('finder.addN').replace('{n}', n);
  finder.querySelector('[data-finder-add]').disabled = n === 0;
  finder.querySelector('[data-finder-send]').disabled = n === 0;
}

function showStep(next) {
  const dir = next >= step ? 1 : -1;
  step = next;
  if (step === 4) renderPicks();
  steps.forEach((el) => { el.hidden = Number(el.dataset.step) !== step; });
  const result = step === 4;
  finder.querySelector('.finder__num').textContent = Math.min(step, 3);
  finder.querySelector('.finder__count').hidden = result;
  finder.style.setProperty('--finder-progress', String(step / 4));
  finder.querySelector('[data-finder-back]').hidden = step === 1 || result;
  finder.querySelector('[data-finder-restart]').hidden = !result;
  nextBtn.hidden = result;
  nextBtn.disabled = !stepReady();
  finder.querySelector('.finder__next-label').textContent = t(step === 3 ? 'finder.see' : 'finder.next');
  finder.querySelector('[data-finder-add]').hidden = !result;
  finder.querySelector('[data-finder-send]').hidden = !result;
  document.dispatchEvent(new CustomEvent('axion:finderstep', { detail: { step, dir, el: steps[step - 1] } }));
}

// With a goal (from the home page's "What are you planning?"), the first question is already answered.
function openFinder(goal) {
  hideNudge(true);
  if (finder.open) return;
  finderForm.reset();
  const goalInput = goal && finderForm.querySelector(`[name="goal"][value="${goal}"]`);
  if (goalInput) {
    goalInput.checked = true;
    finderForm.querySelectorAll('[name="services"]').forEach((input) => { input.checked = GOAL_SERVICES[goal].includes(input.value); });
    showStep(2);
  } else {
    showStep(1);
  }
  finder.showModal();
  document.documentElement.classList.add('finder-open');
  document.dispatchEvent(new CustomEvent('axion:finder', { detail: { open: true } }));
}

// motion.js may cancel this event to animate the panel out, then closes the dialog itself.
function closeFinder() {
  if (!finder.open) return;
  if (document.dispatchEvent(new CustomEvent('axion:finderclose', { cancelable: true }))) finder.close();
}

finder.addEventListener('close', () => {
  document.documentElement.classList.remove('finder-open');
  document.dispatchEvent(new CustomEvent('axion:finder', { detail: { open: false } }));
});
finder.addEventListener('cancel', (e) => {
  e.preventDefault();
  closeFinder();
});
// A click on the dimmed area around the panel closes it.
finder.addEventListener('click', (e) => {
  if (e.target === finder) closeFinder();
});

document.addEventListener('click', (e) => {
  if (e.target.closest('[data-finder-open]')) openFinder();
  const goal = e.target.closest('[data-finder-goal]');
  if (goal) openFinder(goal.dataset.finderGoal);
});
finder.querySelector('[data-finder-close]').addEventListener('click', closeFinder);
finder.querySelector('[data-finder-back]').addEventListener('click', () => showStep(step - 1));
finder.querySelector('[data-finder-restart]').addEventListener('click', () => {
  finderForm.reset();
  showStep(1);
});
nextBtn.addEventListener('click', () => { if (stepReady()) showStep(step + 1); });

finderForm.addEventListener('change', (e) => {
  // A goal pre-selects the services that usually go with it.
  if (e.target.name === 'goal') {
    const preset = GOAL_SERVICES[e.target.value];
    finderForm.querySelectorAll('[name="services"]').forEach((input) => { input.checked = preset.includes(input.value); });
  }
  if (e.target.closest('.finder__picks')) updateAddLabel();
  nextBtn.disabled = !stepReady();
});
// Tapping an answer moves on by itself; keyboard users keep control and press Next.
finderForm.addEventListener('pointerup', (e) => {
  const input = e.target.closest('label')?.querySelector('input[type="radio"]');
  if (!input) return;
  setTimeout(() => { if (input.checked && stepReady() && step < 4) showStep(step + 1); }, 380);
});

finder.querySelector('[data-finder-add]').addEventListener('click', () => {
  chosenPicks().forEach((id) => setInList(id, true));
  closeFinder();
});
finder.querySelector('[data-finder-send]').addEventListener('click', () => {
  const chosen = chosenPicks();
  chosen.forEach((id) => setInList(id, true));
  const context = [checkedLabel('goal'), checkedLabel('load')].filter(Boolean).join(', ');
  // The page behind a modal dialog is inert, so move on once it has closed.
  finder.addEventListener('close', () => goToQuote(`${chosen.map(itemName).join(', ')} (${context})`), { once: true });
  closeFinder();
});

/* ------------------------------------------------------------------ */
/* Nudge toward the finder, once per visit                             */
/* ------------------------------------------------------------------ */

const nudge = document.querySelector('.nudge');
let nudgeSeen = false;
try { nudgeSeen = sessionStorage.getItem(FINDER_KEY) === '1'; } catch (e) { /* storage unavailable */ }

function hideNudge(remember) {
  nudge.hidden = true;
  if (!remember) return;
  nudgeSeen = true;
  try { sessionStorage.setItem(FINDER_KEY, '1'); } catch (e) { /* storage unavailable */ }
}

nudge.querySelector('.nudge__close').addEventListener('click', () => hideNudge(true));

// Offer it when the visitor reaches a product grid (marked data-nudge) with nothing on their list yet.
const nudgeTriggers = document.querySelectorAll('[data-nudge]');
if ('IntersectionObserver' in window && nudgeTriggers.length) {
  const watch = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    watch.disconnect();
    setTimeout(() => {
      if (nudgeSeen || list.length || finder.open || document.documentElement.classList.contains('menu-open')) return;
      nudge.hidden = false;
      // Counted as seen once shown, so it doesn't follow the visitor from page to page.
      try { sessionStorage.setItem(FINDER_KEY, '1'); } catch (e) { /* storage unavailable */ }
    }, 700);
  }, { threshold: 0.25 });
  nudgeTriggers.forEach((el) => watch.observe(el));
}
// Hide it again once the visitor reaches the quote form.
const inquirySection = document.getElementById('inquiry');
if ('IntersectionObserver' in window && inquirySection) {
  new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) hideNudge(false);
  }).observe(inquirySection);
}

/* ------------------------------------------------------------------ */
/* Product quick view                                                  */
/* ------------------------------------------------------------------ */

const qv = document.getElementById('quickview');
const qvAdd = qv.querySelector('.qv__add');
let qvId = null;

function renderQuickView(id) {
  const item = CATALOG[id];
  qvId = id;
  qv.querySelector('.qv__img').src = item.img;
  qv.querySelector('.qv__tag').textContent = plain(item.tag);
  qv.querySelector('.qv__title').textContent = itemName(id);
  qv.querySelector('.qv__desc').textContent = plain(item.desc);
  const chipsEl = qv.querySelector('.qv__chips');
  chipsEl.hidden = !item.chips;
  chipsEl.innerHTML = (item.chips || []).map((k) => `<li>${esc(plain(k))}</li>`).join('');
  qv.querySelector('.qv__services').innerHTML = item.services
    .map((service) => `<li><svg class="icon"><use href="#i-check"/></svg>${esc(plain(SERVICE_LABELS[service]))}</li>`).join('');
  qv.querySelector('.qv__related').innerHTML = item.related.map((rid) => `
    <li><button type="button" class="qv__rel" data-qv="${rid}">
      <img src="${CATALOG[rid].img}" alt="">
      <span>${esc(itemName(rid))}</span>
      <svg class="icon"><use href="#i-arrow-right"/></svg>
    </button></li>`).join('');
  qvAdd.dataset.add = id;
  qv.querySelector('.qv__ask').href = `${ROOT}contact/?equipment=${id}`;
  syncAddButtons();
}

// Opening another product while the panel is up swaps its contents (motion.js animates either way).
function openQuickView(id) {
  if (!Object.hasOwn(CATALOG, id)) return;
  const swapping = qv.open;
  renderQuickView(id);
  if (swapping) {
    qv.querySelector('.qv__panel').scrollTop = 0;
    document.dispatchEvent(new CustomEvent('axion:qvswap'));
    return;
  }
  qv.showModal();
  document.documentElement.classList.add('qv-open');
  document.dispatchEvent(new CustomEvent('axion:qv', { detail: { open: true } }));
}

function closeQuickView() {
  if (!qv.open) return;
  if (document.dispatchEvent(new CustomEvent('axion:qvclose', { cancelable: true }))) qv.close();
}

// Product cards keep their link to the contact page for visitors without scripts.
document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-qv]');
  if (!trigger || e.metaKey || e.ctrlKey || e.shiftKey) return;
  e.preventDefault();
  openQuickView(trigger.dataset.qv);
});
qv.addEventListener('close', () => {
  document.documentElement.classList.remove('qv-open');
  document.dispatchEvent(new CustomEvent('axion:qv', { detail: { open: false } }));
});
qv.addEventListener('cancel', (e) => {
  e.preventDefault();
  closeQuickView();
});
qv.addEventListener('click', (e) => {
  if (e.target === qv) closeQuickView();
});
qv.querySelector('[data-qv-close]').addEventListener('click', closeQuickView);
// Leaving for the contact page: drop the panel first so the page transition can be seen.
qv.querySelector('.qv__ask').addEventListener('click', () => qv.close());

/* ------------------------------------------------------------------ */
/* Showroom position (when it scrolls natively, on touch screens)      */
/* ------------------------------------------------------------------ */

const showroom = document.querySelector('.showroom');
if (showroom) {
  const viewport = showroom.querySelector('.showroom__viewport');
  const slides = [...showroom.querySelectorAll('.showroom__slide')];
  viewport.addEventListener('scroll', () => {
    const max = viewport.scrollWidth - viewport.clientWidth;
    const progress = max > 0 ? viewport.scrollLeft / max : 0;
    showroom.querySelector('.showroom__index').textContent = Math.round(progress * (slides.length - 1)) + 1;
    showroom.style.setProperty('--progress', progress.toFixed(3));
  }, { passive: true });
}

/* ------------------------------------------------------------------ */
/* Wholesale: kind-of-order tabs and the brief builder                 */
/* ------------------------------------------------------------------ */

const briefForm = document.querySelector('.brief__form');

function updateBrief() {
  if (!briefForm) return;
  const lines = [...briefForm.querySelectorAll('fieldset')].map((group) => {
    const values = [...group.querySelectorAll('input:checked')].map((input) => input.closest('label').textContent.trim());
    return values.length ? [group.querySelector('legend').textContent.trim(), values.join(', ')] : null;
  }).filter(Boolean);
  const city = briefForm.querySelector('[name="city"]');
  if (city.value.trim()) lines.push([city.closest('label').querySelector('span').textContent.trim(), city.value.trim()]);

  document.querySelector('.brief__lines').innerHTML = lines
    .map(([label, value]) => `<div class="brief__line"><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('');
  document.querySelector('.brief__empty').hidden = lines.length > 0;
  document.querySelector('[data-brief-send]').disabled = lines.length === 0;
  return lines;
}

if (briefForm) {
  briefForm.addEventListener('input', updateBrief);
  briefForm.addEventListener('submit', (e) => e.preventDefault());
  document.querySelector('[data-brief-send]').addEventListener('click', () => {
    goToQuote(updateBrief().map(([label, value]) => `${label}: ${value}`).join('\n'));
  });
}

const buyer = document.querySelector('[data-buyer]');
if (buyer) {
  const tabs = [...buyer.querySelectorAll('[role="tab"]')];
  const selectTab = (tab, focus) => {
    tabs.forEach((other) => {
      const on = other === tab;
      other.setAttribute('aria-selected', String(on));
      other.tabIndex = on ? 0 : -1;
      document.getElementById(other.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
    // The brief below starts from the same kind of order.
    const match = briefForm?.querySelector(`[name="buyer"][value="${tab.dataset.value}"]`);
    if (match) {
      match.checked = true;
      updateBrief();
    }
    document.dispatchEvent(new CustomEvent('axion:tab', { detail: { panel: document.getElementById(tab.getAttribute('aria-controls')) } }));
  };
  tabs.forEach((tab) => tab.addEventListener('click', () => selectTab(tab)));
  buyer.querySelector('[role="tablist"]').addEventListener('keydown', (e) => {
    const i = tabs.indexOf(document.activeElement);
    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
    if (i < 0 || next === undefined) return;
    e.preventDefault();
    selectTab(tabs[(next + tabs.length) % tabs.length], true);
  });
}

// Text built by the script follows the language switch.
document.addEventListener('axion:lang', () => {
  renderList();
  if (qv.open) renderQuickView(qvId);
  updateBrief();
  if (step === 4) renderPicks();
  finder.querySelector('.finder__next-label').textContent = t(step === 3 ? 'finder.see' : 'finder.next');
});

renderList();

// On the contact page, fill "Equipment needed" from the list or finder (carried over from
// another page) or from a product link such as contact/?equipment=hydrafacial.
if (form) {
  let prefill = '';
  try {
    prefill = sessionStorage.getItem(PREFILL_KEY) || '';
    sessionStorage.removeItem(PREFILL_KEY);
  } catch (e) { /* storage unavailable */ }
  const linked = new URLSearchParams(location.search).get('equipment');
  if (!prefill && Object.hasOwn(CATALOG, linked || '')) prefill = itemName(linked);
  if (prefill) form.querySelector('[name="equipment"]').value = prefill;
}
