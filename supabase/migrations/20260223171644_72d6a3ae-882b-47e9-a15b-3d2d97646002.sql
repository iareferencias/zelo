
CREATE TABLE public.match_gate (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prayed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(match_id, user_id)
);

ALTER TABLE public.match_gate ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own gate" ON public.match_gate
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own gate" ON public.match_gate
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own gate" ON public.match_gate
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
