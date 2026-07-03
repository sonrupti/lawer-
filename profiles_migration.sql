-- ====================================================================
-- AUTH PROFILES MIGRATION
-- Run this in the Supabase SQL Editor AFTER running schema.sql
-- Creates the 'profiles' table linked to Supabase Auth users
-- ====================================================================

-- Drop the profiles table if it already exists
DROP TABLE IF EXISTS profiles;

-- 1. Create the profiles table
-- This stores extra user data that Supabase Auth doesn't natively support
CREATE TABLE profiles (
    -- Primary key matches the Supabase Auth user UUID
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,

    -- Unique display username chosen at registration
    username text UNIQUE NOT NULL,

    -- Optional phone number
    phone text,

    -- Preferred UI language (ISO code or language name)
    preferred_language text,

    -- True after the user selects their language for the first time
    has_selected_language boolean NOT NULL DEFAULT false,

    -- Timestamps
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Users can only read and update their own profile
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Allow inserts during registration (service role or trigger)
CREATE POLICY "Allow insert for authenticated users"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 4. Trigger: auto-create a profile row when a new auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$;

-- Drop the trigger if it already exists, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. Trigger: auto-update updated_at on profile changes
CREATE OR REPLACE FUNCTION public.handle_profile_updated()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;

CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_profile_updated();
