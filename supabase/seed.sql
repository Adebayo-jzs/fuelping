-- MOCK DATA FOR FUELPING
-- Run this in your Supabase SQL Editor

-- 1. Identify a user to be the 'reporter'
-- This script assumes there is at least one user in auth.users.
-- If you haven't signed up yet, please do so in the app first!

DO $$
DECLARE
    target_user_id UUID;
    report_id_1 UUID := gen_random_uuid();
    report_id_2 UUID := gen_random_uuid();
    report_id_3 UUID := gen_random_uuid();
    report_id_4 UUID := gen_random_uuid();
BEGIN
    -- Get the most recently created user
    SELECT id INTO target_user_id FROM auth.users ORDER BY created_at DESC LIMIT 1;

    IF target_user_id IS NULL THEN
        RAISE NOTICE 'No user found in auth.users. Please sign up in the app first to run this script.';
    ELSE
        -- 2. Insert Fuel Reports
        INSERT INTO public.fuel_reports (id, user_id, station_name, fuel_type, price, lat, lng, upvotes, downvotes, created_at)
        VALUES 
        (report_id_1, target_user_id, 'Total Energies - Lekki Phase 1', 'PMS', 617, 6.4481, 3.4725, 12, 1, NOW() - INTERVAL '25 minutes'),
        (report_id_2, target_user_id, 'NNPC Mega Station - Ikoyi', 'PMS', 590, 6.4481, 3.4345, 34, 2, NOW() - INTERVAL '45 minutes'),
        (report_id_3, target_user_id, 'Mobil - Victoria Island', 'Diesel', 1250, 6.4281, 3.4215, 8, 0, NOW() - INTERVAL '80 minutes'),
        (report_id_4, target_user_id, 'Oando - Ikeja', 'Gas', 950, 6.6018, 3.3515, 5, 0, NOW() - INTERVAL '120 minutes');

        -- 3. Insert some mock votes for the first report
        -- (Self-voting is allowed in this mock script for demonstration)
        INSERT INTO public.fuel_report_votes (user_id, report_id, vote_type)
        VALUES 
        (target_user_id, report_id_1, 'up');

        RAISE NOTICE 'Mock data successfully inserted for user: %', target_user_id;
    END IF;
END $$;
