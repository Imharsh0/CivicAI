# CivicAI — Detailed Setup Guide

## Prerequisites

- **Node.js** 18 or newer (check with `node --version`)
- **npm** 9+ (comes with Node.js)
- **Git** (for version control)
- A modern browser (Chrome, Firefox, Edge, Safari)

## Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/civicai.git
cd civicai
```

## Step 2: Install Frontend Dependencies

```bash
cd 03-frontend
npm install
```

This installs:
- React 18, React DOM, React Router DOM
- Supabase JS client
- Leaflet (map library)
- Lucide React (icons)
- Tailwind CSS, PostCSS, Autoprefixer
- TypeScript, Vite

## Step 3: Environment Variables

```bash
cp .env.example .env.local
```

### Running in Demo Mode (No Backend Required)

If you want to try CivicAI without setting up Supabase:
- Leave `.env.local` with the default placeholder values
- CivicAI will run in **Demo Mode** with local storage persistence
- AI analysis will use the intelligent demo engine (no API key needed)
- Authentication will use demo accounts

### Connecting to Supabase (Production Mode)

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project (recommended region: Mumbai `ap-south-1` for India)
3. Go to **Project Settings → API** and copy:
   - Project URL
   - Anon/public key

4. Update `.env.local`:
```
VITE_SUPABASE_URL=https://your-actual-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...your-actual-key
```

## Step 4: Database Setup (Supabase Only)

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Run `01-database/schema.sql`:
   - Creates tables: `organizations`, `profiles`, `issues`, `issue_updates`, `resolutions`
   - Sets up Row Level Security policies
   - Creates storage buckets (`issue-images`, `resolution-images`)
   - Creates triggers for auto-profile creation and timestamp updates
4. Run `01-database/seed.sql`:
   - Adds sample organizations and issues for demo purposes

## Step 5: Google OAuth Setup (Optional)

### Google Cloud Console

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google+ API** (or **Google Identity**)
4. Go to **Credentials → Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add Authorized redirect URI:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
7. Copy the **Client ID** and **Client Secret**

### Supabase Dashboard

1. Go to **Authentication → Providers → Google**
2. Enable the Google provider
3. Paste your Client ID and Client Secret
4. Save

### For Production Deployment

Add your production URL to:
- Google Cloud Console → Authorized JavaScript origins
- Supabase → Authentication → URL Configuration → Site URL and Redirect URLs

## Step 6: Gemini AI Setup (Optional)

1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Create an API key
3. In Supabase Dashboard → **Edge Functions → Secrets**:
   - Add secret: `GEMINI_API_KEY` = your key
4. Deploy the edge function using Supabase CLI:
   ```bash
   npm install -g supabase
   supabase login
   supabase link --project-ref your-project-ref
   cd 02-edge-functions
   supabase functions deploy analyze-civic-issue --no-verify-jwt
   ```

> ⚠️ The API key is stored server-side in Supabase. It is **never** exposed to the browser.

## Step 7: Run the Development Server

```bash
cd 03-frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Accounts

In demo mode, use these quick-login buttons on the auth page:
- **Citizen**: `aarav.sharma@example.in`
- **Field Officer**: `officer.verma@mcd.gov.in`
- **Admin**: `admin.delhi@civicai.org`

## Step 8: Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

Preview the production build:
```bash
npm run preview
```

## Step 9: Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Select your GitHub repository
4. Configure:
   - **Root Directory**: `03-frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy!

## Troubleshooting

### "Cannot find module" errors
```bash
cd 03-frontend
rm -rf node_modules
npm install
```

### Map not loading
- Ensure Leaflet CSS is loaded (check `index.html` for the CDN link)
- OpenStreetMap tiles may be slow on first load

### AI analysis not working
- In demo mode: AI analysis uses the built-in demo engine (expected behavior)
- In production: Check that `GEMINI_API_KEY` is set in Supabase Edge Function secrets

### Google OAuth redirect error
- Ensure your redirect URI matches exactly: `https://your-project.supabase.co/auth/v1/callback`
- Check that the Google provider is enabled in Supabase Authentication settings
