-- Add locality and state columns to fuel_reports table
ALTER TABLE public.fuel_reports 
ADD COLUMN IF NOT EXISTS locality TEXT,
ADD COLUMN IF NOT EXISTS state TEXT;

-- Make user_id nullable for anonymous reports
ALTER TABLE public.fuel_reports ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policy to allow anyone (including anonymous) to insert reports
DROP POLICY IF EXISTS "Authenticated users can create reports" ON public.fuel_reports;
CREATE POLICY "Anyone can create reports" ON public.fuel_reports FOR INSERT WITH CHECK (true);

