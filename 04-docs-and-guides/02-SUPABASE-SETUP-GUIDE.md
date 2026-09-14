# Supabase Setup Guide for CivicAI

This guide details how to configure Supabase for production deployment.

> **Zero-Config Hackathon Note**: CivicAI works immediately out of the box in Demo Mode without requiring any Supabase setup or API keys! Follow these steps only when deploying to live Supabase cloud.

---

## Step 1: Create a Supabase Project
1. Log in to [https://supabase.com](https://supabase.com)
2. Click **New Project**
3. Set your project name (e.g., `civicai-india`), select a database password, and choose an Indian region (`ap-south-1` Mumbai is recommended for lowest latency).

---

## Step 2: Run Database Migrations
1. In the Supabase Dashboard, navigate to the **SQL Editor** on the left menu.
2. Open `01-database/schema.sql` from this repository.
3. Paste the contents into the SQL Editor and click **Run**.
4. To populate realistic sample reports for Delhi, Mumbai, Bengaluru, etc., open `01-database/seed.sql`, paste, and click **Run**.

---

## Step 3: Verify Storage Buckets
The SQL script automatically registers two storage buckets:
- `issue-images` (Public read, authenticated insert)
- `resolution-images` (Public read, authority/admin insert)

Navigate to **Storage** in the dashboard and verify both buckets exist.

---

## Step 4: Configure Environment Variables
In your frontend directory (`03-frontend`), create `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 5: Deploy Edge Function (Optional)
To run the external Vision AI function on Supabase Edge:
1. Install Supabase CLI: `npm i -g supabase`
2. Link project: `supabase link --project-ref your-project-id`
3. Set secret: `supabase secrets set GEMINI_API_KEY=your_key_here`
4. Deploy function:
   ```bash
   supabase functions deploy analyze-civic-issue --no-verify-jwt
   ```
