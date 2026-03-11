ALTER TABLE public.fuel_reports 
DROP CONSTRAINT IF EXISTS fuel_reports_user_id_fkey;

ALTER TABLE public.fuel_reports 
ADD CONSTRAINT fuel_reports_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
