
-- Add approved column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS approved boolean DEFAULT false;

-- Create likes table
CREATE TABLE IF NOT EXISTS public.likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  to_user uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(from_user, to_user)
);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own likes" ON public.likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = from_user);
CREATE POLICY "Users can read own likes" ON public.likes FOR SELECT TO authenticated USING (auth.uid() = from_user OR auth.uid() = to_user);

-- Create matches table
CREATE TABLE IF NOT EXISTS public.matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_b uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_a, user_b)
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own matches" ON public.matches FOR SELECT TO authenticated USING (auth.uid() = user_a OR auth.uid() = user_b);
CREATE POLICY "Users can insert matches" ON public.matches FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_a OR auth.uid() = user_b);

-- Create notifications table for the app
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  reference_id text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Create compute_match_score function
CREATE OR REPLACE FUNCTION public.compute_match_score(viewer_id uuid, candidate_id uuid)
RETURNS TABLE(score integer, reasons text[])
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile profiles%ROWTYPE;
  c_profile profiles%ROWTYPE;
  total integer := 0;
  r text[] := '{}';
BEGIN
  SELECT * INTO v_profile FROM profiles WHERE id = viewer_id;
  SELECT * INTO c_profile FROM profiles WHERE id = candidate_id;

  IF v_profile IS NULL OR c_profile IS NULL THEN
    RETURN QUERY SELECT 0, ARRAY[]::text[];
    RETURN;
  END IF;

  -- Same city (+25)
  IF v_profile.city IS NOT NULL AND v_profile.city != '' AND LOWER(v_profile.city) = LOWER(c_profile.city) THEN
    total := total + 25;
    r := array_append(r, 'Mesma cidade');
  END IF;

  -- Both want marriage (+20)
  IF v_profile.marriage_intent = true AND c_profile.marriage_intent = true THEN
    total := total + 20;
    r := array_append(r, 'Intenção de casar');
  END IF;

  -- Same view on children (+15)
  IF v_profile.wants_children IS NOT NULL AND v_profile.wants_children = c_profile.wants_children THEN
    total := total + 15;
    r := array_append(r, 'Visão sobre filhos');
  END IF;

  -- Same congregation (+15)
  IF v_profile.congregation IS NOT NULL AND v_profile.congregation != '' AND LOWER(v_profile.congregation) = LOWER(c_profile.congregation) THEN
    total := total + 15;
    r := array_append(r, 'Mesma congregação');
  END IF;

  -- Age proximity (+10 if within 5 years, +5 if within 10)
  IF v_profile.age IS NOT NULL AND c_profile.age IS NOT NULL THEN
    IF ABS(v_profile.age - c_profile.age) <= 5 THEN
      total := total + 10;
      r := array_append(r, 'Idade próxima');
    ELSIF ABS(v_profile.age - c_profile.age) <= 10 THEN
      total := total + 5;
      r := array_append(r, 'Faixa etária compatível');
    END IF;
  END IF;

  -- Has testimony (+5)
  IF c_profile.testimony IS NOT NULL AND c_profile.testimony != '' THEN
    total := total + 5;
    r := array_append(r, 'Testemunho compartilhado');
  END IF;

  -- Both have complete profiles (+10)
  IF c_profile.onboarding_complete = true AND v_profile.onboarding_complete = true THEN
    total := total + 10;
    r := array_append(r, 'Perfil completo');
  END IF;

  -- Cap at 100
  IF total > 100 THEN total := 100; END IF;

  RETURN QUERY SELECT total, r;
END;
$$;

-- Allow authenticated users to read other approved profiles
CREATE POLICY "Users can read approved profiles" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR approved = true);
