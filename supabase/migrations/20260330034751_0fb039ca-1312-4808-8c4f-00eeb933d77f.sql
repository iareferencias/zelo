-- Add missing columns for admin moderation
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS warning_level integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS banned_until timestamp with time zone DEFAULT NULL;