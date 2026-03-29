
-- Drop the old restrictive policy and keep the new one that allows reading approved profiles
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
