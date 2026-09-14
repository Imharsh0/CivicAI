# Vercel Deployment Guide for CivicAI

CivicAI is pre-configured for instant deployment on [Vercel](https://vercel.com) with zero build configuration.

---

## 1. Deploying via GitHub (Recommended)

1. Create a clean GitHub repository (e.g., `civicai`).
2. Push your `civicai` repository:
   ```bash
   git init
   git add .
   git commit -m "feat: initial CivicAI platform release"
   git branch -M main
   git remote add origin https://github.com/<your-username>/civicai.git
   git push -u origin main
   ```
3. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
4. Import your GitHub repository.
5. In the **Project Settings**:
   - **Root Directory**: Select `03-frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. (Optional) In **Environment Variables**, add:
   - `VITE_SUPABASE_URL`: (Your Supabase URL)
   - `VITE_SUPABASE_ANON_KEY`: (Your Supabase Anon Key)
   *(If omitted, CivicAI runs in high-performance Demo Mode automatically!)*
7. Click **Deploy**.

Your application will be live at `https://civicai-yourproject.vercel.app` in under 60 seconds!
