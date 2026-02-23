
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS participation_tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS show_photo boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS show_congregation boolean NOT NULL DEFAULT false;
