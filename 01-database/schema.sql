-- ==============================================================================
-- CIVICAI DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- “See a problem. Report it. Let AI take it forward.”
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ORGANIZATIONS TABLE
-- Supports: Municipal Zones, Campuses, Housing Societies, Tech Parks, Communities
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Municipal Zone', 'College', 'School', 'Housing Society', 'Office', 'Community', 'Residential Society')),
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. USER PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'authority')),
    city TEXT DEFAULT 'Delhi',
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CIVIC ISSUES TABLE
CREATE TABLE IF NOT EXISTS public.issues (
    id TEXT PRIMARY KEY, -- Formatted ID: e.g. CA-2026-00124
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    issue_type TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'Road Infrastructure',
        'Solid Waste Management',
        'Water & Drainage',
        'Lighting & Electricity',
        'Public Infrastructure',
        'Environment & Greenery',
        'Other'
    )),
    description TEXT NOT NULL,
    location_text TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    severity TEXT NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    priority_score INTEGER NOT NULL CHECK (priority_score >= 0 AND priority_score <= 100),
    priority_level TEXT NOT NULL CHECK (priority_level IN ('P1', 'P2', 'P3', 'P4')),
    ai_confidence INTEGER NOT NULL CHECK (ai_confidence >= 0 AND ai_confidence <= 100),
    ai_explanation TEXT,
    status TEXT NOT NULL DEFAULT 'Reported' CHECK (status IN (
        'Reported',
        'Verified',
        'Assigned',
        'In Progress',
        'Resolved',
        'Rejected'
    )),
    assigned_to TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ISSUE TIMELINE & UPDATES LOG
CREATE TABLE IF NOT EXISTS public.issue_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id TEXT NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ISSUE RESOLUTION EVIDENCE TABLE
CREATE TABLE IF NOT EXISTS public.resolutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id TEXT NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    resolution_note TEXT NOT NULL,
    after_image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- STORAGE BUCKETS CONFIGURATION (Run in Supabase SQL editor)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('issue-images', 'issue-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('resolution-images', 'resolution-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for issue-images
CREATE POLICY "Public can view issue images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'issue-images');

CREATE POLICY "Authenticated users can upload issue images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'issue-images' AND auth.role() = 'authenticated');

-- Storage policies for resolution-images
CREATE POLICY "Public can view resolution images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'resolution-images');

CREATE POLICY "Authorities can upload resolution images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'resolution-images' AND auth.role() = 'authenticated');

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resolutions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles can be viewed by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Organizations policies
CREATE POLICY "Organizations are viewable by all users" 
ON public.organizations FOR SELECT USING (true);

-- Issues policies
CREATE POLICY "Issues are viewable by everyone" 
ON public.issues FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert issues" 
ON public.issues FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authorities and admins can update all issues; creators can update their own pending issues" 
ON public.issues FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'authority')
    ) OR (user_id = auth.uid() AND status = 'Reported')
);

-- Issue updates policies
CREATE POLICY "Issue updates are viewable by everyone" 
ON public.issue_updates FOR SELECT USING (true);

CREATE POLICY "Authenticated users with authority/admin can create updates" 
ON public.issue_updates FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'authority')
    ) OR auth.uid() IS NOT NULL
);

-- Resolutions policies
CREATE POLICY "Resolutions are viewable by everyone" 
ON public.resolutions FOR SELECT USING (true);

CREATE POLICY "Authorities/admins can create resolutions" 
ON public.resolutions FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'authority')
    )
);

-- ==============================================================================
-- AUTO-SYNC NEW AUTH USERS INTO PROFILES
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, role, city)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        new.email,
        COALESCE(new.raw_user_meta_data->>'role', 'user'),
        COALESCE(new.raw_user_meta_data->>'city', 'Delhi')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger for issues
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    new.updated_at = timezone('utc'::text, now());
    RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_issue_updated ON public.issues;
CREATE TRIGGER on_issue_updated
    BEFORE UPDATE ON public.issues
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
