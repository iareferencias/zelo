
CREATE OR REPLACE FUNCTION public.compute_match_score(viewer_id uuid, candidate_id uuid)
RETURNS TABLE(score int, reasons text[])
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v profiles%ROWTYPE;
  c profiles%ROWTYPE;
  s int := 0;
  r text[] := '{}';
BEGIN
  SELECT * INTO v FROM profiles WHERE id = viewer_id;
  SELECT * INTO c FROM profiles WHERE id = candidate_id;

  IF NOT FOUND THEN
    score := 0; reasons := '{}'; RETURN NEXT; RETURN;
  END IF;

  -- Mesma cidade (+30)
  IF v.city IS NOT NULL AND c.city IS NOT NULL AND lower(trim(v.city)) = lower(trim(c.city)) THEN
    s := s + 30;
    r := array_append(r, 'Mesma cidade');
  END IF;

  -- Intenção de casamento alinhada (+25)
  IF v.marriage_intent = true AND c.marriage_intent = true THEN
    s := s + 25;
    r := array_append(r, 'Intenção de casamento alinhada');
  END IF;

  -- Visão sobre filhos (+20)
  IF v.wants_children IS NOT NULL AND c.wants_children IS NOT NULL AND v.wants_children = c.wants_children THEN
    s := s + 20;
    r := array_append(r, 'Visão sobre filhos compatível');
  END IF;

  -- Participação semelhante (+15) — pelo menos 1 tag em comum
  IF v.participation_tags IS NOT NULL AND c.participation_tags IS NOT NULL
     AND array_length(v.participation_tags, 1) > 0
     AND array_length(c.participation_tags, 1) > 0 THEN
    IF EXISTS (
      SELECT 1 FROM unnest(v.participation_tags) vt
      INNER JOIN unnest(c.participation_tags) ct ON vt = ct
    ) THEN
      s := s + 15;
      r := array_append(r, 'Participação semelhante na igreja');
    END IF;
  END IF;

  -- Faixa etária próxima (+10) — diferença <= 5 anos
  IF v.age IS NOT NULL AND c.age IS NOT NULL AND abs(v.age - c.age) <= 5 THEN
    s := s + 10;
    r := array_append(r, 'Faixa etária próxima');
  END IF;

  score := s;
  reasons := r;
  RETURN NEXT;
END;
$$;
