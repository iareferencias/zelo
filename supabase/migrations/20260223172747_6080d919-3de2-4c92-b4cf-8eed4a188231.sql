
-- 1) NOTIFICATIONS TABLE
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  reference_id uuid,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications"
ON public.notifications FOR INSERT
WITH CHECK (true);

CREATE INDEX idx_notifications_user ON public.notifications(user_id, read, created_at DESC);

-- 2) AUDIT LOGS TABLE
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid NOT NULL,
  action text NOT NULL,
  target_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
ON public.audit_logs FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert audit logs"
ON public.audit_logs FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- 3) ADD COLUMNS TO PROFILES FOR LIMITS & BANNING
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS daily_likes_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_like_reset timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS daily_message_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS warning_level integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS banned_until timestamptz;

-- 4) Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
