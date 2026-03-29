
CREATE OR REPLACE FUNCTION public.compute_match_score(viewer_id uuid, candidate_id uuid)
 RETURNS TABLE(score integer, reasons text[])
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_profile profiles%ROWTYPE;
  c_profile profiles%ROWTYPE;
  total integer := 0;
  r text[] := '{}';
  c_behavior integer;
BEGIN
  SELECT * INTO v_profile FROM profiles WHERE id = viewer_id;
  SELECT * INTO c_profile FROM profiles WHERE id = candidate_id;

  IF v_profile IS NULL OR c_profile IS NULL THEN
    RETURN QUERY SELECT 0, ARRAY[]::text[];
    RETURN;
  END IF;

  -- Get behavior score
  c_behavior := COALESCE(c_profile.behavior_score, 50);

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

  -- Behavior score modifier (invisible): boost or penalize based on behavior
  -- High behavior (>70) adds up to +5, low behavior (<30) subtracts up to -10
  IF c_behavior > 70 THEN
    total := total + LEAST((c_behavior - 70) / 6, 5);
  ELSIF c_behavior < 30 THEN
    total := total - LEAST((30 - c_behavior) / 3, 10);
  END IF;

  -- Cap at 100, floor at 0
  IF total > 100 THEN total := 100; END IF;
  IF total < 0 THEN total := 0; END IF;

  RETURN QUERY SELECT total, r;
END;
$function$;
