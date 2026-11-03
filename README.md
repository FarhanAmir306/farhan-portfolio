# Creative Portfolio v4 (React + Framer Motion + Admin + Supabase)

## চালানো
```
npm install
npm run dev
```
সাইট: http://localhost:5173 | অ্যাডমিন: http://localhost:5173/admin
`.env` ফাইলে `ADMIN_PASSWORD`, `SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` থাকতে হবে (`.env.example` দেখুন)।
Supabase-এ নতুন করে কিছু চালাতে হবে না। আগের `setup.sql` যথেষ্ট।

## অ্যাডমিন থেকে যা যা এডিট করা যায়
- **Projects:** নতুন যোগ, এডিট (টাইটেল, ক্যাটাগরি, বছর, বিবরণ, ছবি বদলানো/মুছা, YouTube লিংক), ডিলিট।
- **Hero:** নাম, দুই লাইনের হেডলাইন, ইন্ট্রো টেক্সট, অ্যাভেইলেবিলিটি ব্যাজ, বাটনের লেখা, পোর্ট্রেট ছবি।
- **Showreel:** লেবেল, টাইটেল, YouTube/Vimeo লিংক, থাম্বনেইল ছবি, সময়।
- **Works heading, About:** হেডলাইন, পরিচিতি, বায়ো, ফিলোসফি, স্টোরিটেলিং।
- **Services / Process / Software:** যোগ, মুছা, ওপরে-নিচে সরানো, লেখা বদলানো।
- **Contact & links:** ইমেইল, WhatsApp, Instagram, Behance, LinkedIn, ফর্ম এন্ডপয়েন্ট।
- **Footer & SEO:** ফুটার ট্যাগলাইন, ব্রাউজার ট্যাব ও Google-এর টাইটেল/বিবরণ।

প্রজেক্ট ট্যাবের বাইরে যেকোনো ট্যাবে বদল করে নিচের **Save changes** চাপতে হবে। সেভ করলে লাইভ সাইটে (রিফ্রেশ করে) দেখা যাবে। ছবি আপলোডের পর Save চাপতে ভুলবেন না।

সব লেখা Supabase-এ স্থায়ীভাবে থাকে (`site-content.json` ফাইলে, `portfolio` বাকেটে)। কোনো ফিল্ড খালি রাখলে সেটা খালিই দেখাবে। আবার ডিফল্ট চাইলে `src/data.js`-এর লেখা দেখুন।

## ডিপ্লয়
Render: Build `npm install && npm run build` | Start `npm start` | Environment-এ চারটি ভেরিয়েবল দিন।
ফ্রি Render সার্ভার কিছুক্ষণ পর ঘুমিয়ে যায়, ক্লায়েন্টকে লিংক পাঠানোর আগে একবার খুলে জাগিয়ে নিন।
