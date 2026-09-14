# 🏛️ CivicAI

**"See a problem. Report it. Let AI take it forward."**

An AI-powered civic problem reporting and management platform for Indian cities, campuses, and communities. Citizens photograph infrastructure issues, AI detects and prioritizes them, and municipal authorities resolve them with verified evidence.

---

## 🎯 Problem

Campus and municipal infrastructure problems often go unreported or unresolved because:
- Citizens don't know whom to contact
- Reporting is manual and bureaucratic
- There's no objective way to prioritize issues
- Resolution accountability is lacking
- There's no evidence trail for completed repairs

## 💡 Solution

CivicAI replaces this with:

```
📸 Take Photo → 🤖 AI Detects Problem → 📍 Location Captured
→ ⚡ Priority Calculated → 🛠 Admin Resolves → ✅ Verified Evidence
```

---

## ✨ Features

### For Citizens / Students / Staff
- 📸 Upload or capture photos of civic issues
- 🤖 AI-powered issue detection, severity analysis, and classification
- 📍 GPS auto-detection and manual location selection
- 📊 Transparent priority scoring (P1–P4) with explanation
- 🔄 Duplicate issue detection (600m radius)
- 📋 Personal dashboard to track all submitted reports
- 🔔 In-app notifications for status updates
- 🗺️ Interactive campus/city map with issue markers

### For Administrators
- 🎛️ Operations command center with real-time statistics
- 🔍 Search, filter, and sort issues by priority/status/category
- 👷 Assign issues to maintenance departments
- 📝 Update issue lifecycle (Reported → Verified → Assigned → In Progress → Resolved)
- 📸 Upload before/after resolution evidence
- 🗺️ Map view of all reported issues

### AI & Technology
- 🧠 Google Gemini Vision AI for image analysis
- 📐 4-factor algorithmic priority engine (Severity + Safety + Location + Infrastructure)
- 🌐 Bilingual support (English / हिन्दी)
- 🏙️ 20 Indian cities with municipal body mapping
- 🏫 Multi-institution support (Municipal Zones, Colleges, Housing Societies, Tech Parks)

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Styling** | Tailwind CSS 3 |
| **Routing** | React Router DOM v6 |
| **Icons** | Lucide React |
| **Maps** | Leaflet + OpenStreetMap (no API key needed) |
| **Backend** | Supabase (PostgreSQL + Auth + Storage + Edge Functions) |
| **AI** | Google Gemini 1.5 Flash (Vision API) |
| **Authentication** | Supabase Auth (Google OAuth + Email/Password) |
| **Deployment** | Vercel + GitHub |

---

## 📁 Project Structure

```
civicai/
├── 01-database/           # PostgreSQL schema & seed data
│   ├── schema.sql         # Tables, RLS policies, triggers
│   └── seed.sql           # Sample data
├── 02-edge-functions/     # Supabase serverless functions
│   └── analyze-civic-issue/
│       └── index.ts       # Gemini Vision AI integration
├── 03-frontend/           # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts (Auth, Issues, etc.)
│   │   ├── hooks/         # Custom hooks (geolocation, compression)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API & business logic
│   │   ├── data/          # Static data (cities, categories)
│   │   ├── types/         # TypeScript interfaces
│   │   └── utils/         # Utility functions
│   ├── vercel.json        # Vercel SPA routing config
│   └── package.json
├── 04-docs-and-guides/    # Documentation
└── README.md
```

---

## 🚀 Architecture

```
Student / Citizen
       ↓
  CivicAI Web App (React SPA)
       ↓
  Authentication (Supabase Auth + Google OAuth)
       ↓
  Report Engine (Image Upload → AI Analysis → Priority)
       ↓
  Supabase Backend
  ├── PostgreSQL (Issues, Profiles, Updates)
  ├── Storage (Issue Images, Resolution Evidence)
  ├── Edge Functions (Gemini Vision AI)
  └── Row Level Security (Authorization)
       ↓
  Admin Dashboard
       ↓
  Issue Resolution (Before/After Evidence)
```

---

## 🗄️ Database Schema

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles linked to auth.users (name, email, role, city) |
| `organizations` | Institutions (Municipal Zones, Colleges, RWAs) |
| `issues` | Civic reports with AI analysis, location, priority, status |
| `issue_updates` | Status change history with comments |
| `resolutions` | Resolution evidence with after-images |

**Row Level Security (RLS)** is enforced on all tables:
- Citizens can create and view issues
- Only admins/authorities can update issue status
- Only admins/authorities can add resolutions

---

## 🔧 Local Setup

### Prerequisites
- Node.js 18+ and npm
- A Supabase account (free tier works)
- (Optional) Google Cloud project for OAuth
- (Optional) Google Gemini API key for AI analysis

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/civicai.git
cd civicai/03-frontend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> 💡 **Demo Mode**: If you leave these blank, CivicAI runs in zero-config demo mode with local storage persistence!

### 3. Set Up Database

Run the SQL in your Supabase SQL Editor:
1. Execute `01-database/schema.sql` (creates tables, RLS, triggers)
2. Execute `01-database/seed.sql` (adds sample data)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Build for Production

```bash
npm run build
npm run preview
```

---

## 🔐 Authentication Setup

### Google OAuth (Optional but Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials (Web application)
3. Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
4. In Supabase Dashboard → Authentication → Providers → Google:
   - Enable Google provider
   - Enter your Client ID and Client Secret
5. Add your production URL to authorized origins

### Email/Password

Email/password authentication works out of the box with Supabase Auth.

---

## 🤖 Gemini AI Setup

1. Get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. In Supabase Dashboard → Edge Functions → Secrets:
   - Add `GEMINI_API_KEY` with your key
3. Deploy the edge function:
   ```bash
   supabase functions deploy analyze-civic-issue --no-verify-jwt
   ```

> ⚠️ The Gemini API key is **never** exposed to the browser. It runs server-side in the Edge Function.

---

## 🌐 Deployment (Vercel)

### 1. Connect GitHub to Vercel

1. Push your project to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Set the **Root Directory** to `03-frontend`
4. Framework Preset: Vite
5. Build Command: `npm run build`
6. Output Directory: `dist`

### 2. Environment Variables in Vercel

Add these in Vercel → Project Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

### 3. Google OAuth Production URL

Add your Vercel production URL to:
- Google Cloud Console → Authorized redirect URIs
- Supabase → Authentication → URL Configuration → Redirect URLs

---

## 🧪 Testing Checklist

- [x] Landing page renders
- [x] Authentication (login/signup/logout)
- [x] Google OAuth button
- [x] Demo quick-login accounts
- [x] Report creation workflow
- [x] Image upload & compression
- [x] AI analysis (demo mode / Gemini)
- [x] Priority engine calculation
- [x] Duplicate detection
- [x] Location capture (GPS + manual)
- [x] User dashboard
- [x] Admin dashboard with real stats
- [x] Issue detail page with timeline
- [x] Status updates & resolution
- [x] Interactive map with markers
- [x] Responsive design (mobile/tablet/desktop)
- [x] Protected routes
- [x] Browser navigation (back/forward)
- [x] Production build
- [x] Vercel deployment

---

## 🔮 Future Scope

- 📱 Native mobile app (React Native)
- 🤖 Predictive maintenance using historical data
- 🌡️ IoT sensor integration for real-time monitoring
- 📊 Analytics heatmaps for civic problem density
- 📧 Email/SMS notifications
- 🏢 Automatic department routing based on issue type
- 📈 Machine learning model fine-tuning for Indian civic contexts
- 🔗 Integration with government portals (CPGRAMS, Swachhata)

---

## 🏆 Hackathon Demo (2–3 Minutes)

1. **Open CivicAI** → Show landing page
2. **Explain the problem** → "Campus/city issues go unreported"
3. **Login as student** → Demo account
4. **Upload a problem photo** → Show AI detecting it
5. **Show severity & priority** → "Why P1?" breakdown
6. **Show location on map** → GPS auto-detect
7. **Submit report** → Success screen with ticket ID
8. **Switch to admin** → Show issue appearing
9. **Assign department** → Change status
10. **Resolve with evidence** → Upload after photo
11. **Return to student** → Show updated status & timeline

---

## 📄 License

MIT License — Built for educational and civic improvement purposes.

---

**Built with ❤️ for Indian civic infrastructure**
