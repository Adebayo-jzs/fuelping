-- Add locality and state columns to fuel_reports table
ALTER TABLE public.fuel_reports 
ADD COLUMN IF NOT EXISTS locality TEXT,
ADD COLUMN IF NOT EXISTS state TEXT;
