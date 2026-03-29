
-- 1) Add status_level and behavior_score to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS status_level text NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS behavior_score integer NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS family_vision text DEFAULT '',
  ADD COLUMN IF NOT EXISTS spiritual_routine text DEFAULT '',
  ADD COLUMN IF NOT EXISTS life_goals text DEFAULT '';

-- 2) Create preparation modules progress table
CREATE TABLE IF NOT EXISTS public.preparation_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_key text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_key)
);

ALTER TABLE public.preparation_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress" ON public.preparation_progress
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.preparation_progress
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.preparation_progress
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
