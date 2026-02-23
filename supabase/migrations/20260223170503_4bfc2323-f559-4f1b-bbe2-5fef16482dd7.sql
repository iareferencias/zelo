
-- Tabela de convites
CREATE TABLE public.invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  used_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'revoked')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

-- Admins podem tudo
CREATE POLICY "Admins can manage invites"
  ON public.invites FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Qualquer pessoa (mesmo anon) pode verificar se um código é válido (SELECT limitado)
CREATE POLICY "Anyone can check active invite codes"
  ON public.invites FOR SELECT
  USING (status = 'active');

-- Usuários autenticados podem marcar como usado (UPDATE do próprio)
CREATE POLICY "Authenticated users can use invite"
  ON public.invites FOR UPDATE
  USING (status = 'active')
  WITH CHECK (used_by = auth.uid() AND status = 'used');

-- Tabela de waitlist (lista de espera)
CREATE TABLE public.waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  city text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode se inscrever (INSERT anon)
CREATE POLICY "Anyone can join waitlist"
  ON public.waitlist FOR INSERT
  WITH CHECK (true);

-- Admins podem ver a waitlist
CREATE POLICY "Admins can view waitlist"
  ON public.waitlist FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins podem deletar da waitlist
CREATE POLICY "Admins can delete from waitlist"
  ON public.waitlist FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));
