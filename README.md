# Tahaffuz-E-Iman Library

Deobandiyon ke sawalaat ka Quran o Hadees ki roshni mein mudallal jawab dene wali
Q&A library. Har jawab ke sath kitab ka screenshot, PDF, audio clip, YouTube
video ya Instagram reel — sab sirf **URL daal kar** joda ja sakta hai.

## Features

- **Home page**: Hero + Search bar + paginated question cards (9 per page)
- **Question page** (`/question/[slug]`): poora sawal → jawab → references
  (image/PDF/audio/YouTube/Instagram, auto-embed) → milte julte sawalaat
- **Admin panel** (`/admin/login`, `/admin/dashboard`): login, sawal
  add/edit/delete, references add/remove — sab URL-based, koi file upload
  nahi chahiye
- Stack: **Next.js 14 (App Router)** + **Tailwind CSS** + **Supabase**
  (Postgres database + Auth for admin login)

---

## 1. Supabase Setup (Database + Admin Login)

1. [supabase.com](https://supabase.com) par free account banayein, naya
   project create karein.
2. Project ke andar **SQL Editor** kholein, `supabase/schema.sql` file ka
   pura content paste karke **Run** karein. Isse `questions` aur
   `question_references` tables + security rules ban jayenge.
3. **Authentication → Users** mein jayein aur apne liye ek admin user
   banayein ("Add user" → email + password, "Auto confirm" ON rakhein).
   Yehi email/password aap `/admin/login` par use karenge.
4. **Project Settings → API** mein jayein, wahan se copy karein:
   - `Project URL` → yeh `NEXT_PUBLIC_SUPABASE_URL` hai
   - `anon public` key → yeh `NEXT_PUBLIC_SUPABASE_ANON_KEY` hai

## 2. Local Setup (optional, testing ke liye)

```bash
npm install
cp .env.example .env.local
# .env.local kholkar apni Supabase URL/key daalein
npm run dev
```

Browser mein `http://localhost:3000` kholein.

## 3. GitHub par Push Karein

```bash
git init
git add .
git commit -m "Tahaffuz-E-Iman Library — initial commit"
git branch -M main
git remote add origin https://github.com/<aapka-username>/tahaffuz-e-iman-library.git
git push -u origin main
```

> `.env.local` file `.gitignore` mein hai, isliye woh GitHub par nahi jayegi —
> yeh sahi hai, kyunki secrets kabhi bhi public repo mein nahi hone chahiye.

## 4. Deploy (Vercel — free, GitHub se seedha connect)

Chunki is website mein admin login + database hai, isay pure static GitHub
Pages par host nahi kiya ja sakta — GitHub Pages sirf static files serve
karta hai. Sabse aasan aur free tareeqa hai **Vercel**, jo seedha aapke
GitHub repo se deploy karta hai:

1. [vercel.com](https://vercel.com) par GitHub account se sign in karein.
2. "Add New → Project" → apni `tahaffuz-e-iman-library` repo select karein.
3. Framework Preset apne aap "Next.js" detect ho jayega.
4. **Environment Variables** mein yeh do daalein:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. **Deploy** dabayein. 2 minute mein aapki website live ho jayegi
   (`https://tahaffuz-e-iman-library.vercel.app`).
6. Aage se jab bhi aap `git push` karenge, Vercel khud-ba-khud naya
   deployment bana dega.

Baad mein aap Vercel project settings se apna khud ka domain
(jaise `tahaffuz-e-iman-library.com`) bhi jod sakte hain.

## 5. Admin Panel Use Karna

1. `/admin/login` par jayein, Supabase mein banaya hua email/password
   daalein.
2. Dashboard mein **"+ Naya Sawal Jodein"** dabayein.
3. Sawal, jawab, category aur slug (URL — English mein) bharein.
4. Neeche **"+ Reference Jodein"** se jitne chahein references jod sakte
   hain — sirf dropdown se type (Image / PDF / Audio / YouTube / Instagram /
   Video / Link) chunein aur URL paste karein. Website khud sahi tarah
   dikhayegi:
   - **Image** → screenshot seedha page par dikhega
   - **PDF** → viewer ke andar khul jayega
   - **Audio** → play button ke sath player dikhega
   - **YouTube** → video embed ho kar seedha play ho sakega
   - **Instagram** → reel embed ho jayegi
   - **Link** → seedha clickable link ban jayega
5. "Website par Publish karein" checkbox se draft/live control karein.
6. Save karte hi sawal turant home page par dikhne lagega.

## Project Structure

```
app/
  page.js                         → Home (hero + search + list)
  question/[slug]/page.js         → Question detail page
  admin/login/page.js             → Admin login
  admin/dashboard/page.js         → Admin dashboard (list/edit/delete)
  admin/dashboard/questions/new/  → Add question
  admin/dashboard/questions/[id]/edit/ → Edit question
components/                       → Reusable UI (Hero, QuestionCard, ReferenceEmbed, etc.)
lib/supabaseClient.js             → Supabase client
supabase/schema.sql               → Database schema + security rules
```

## Notes

- Similar/related sawalaat automatically usi `category` se dikhaye jaate
  hain — isliye har sawal ko sahi category dena zaroori hai
  (misaal: "Milad", "Qabar Parasti", "Taqleed", waghera).
- Naye admin accounts sirf Supabase Dashboard se banayein — signup form
  public website par jaan-boojh kar nahi diya gaya hai.
