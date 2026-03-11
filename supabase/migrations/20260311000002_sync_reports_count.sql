-- Trigger to sync reports_count in profiles table
CREATE OR REPLACE FUNCTION public.sync_user_reports_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.profiles
        SET reports_count = (SELECT count(*) FROM public.fuel_reports WHERE user_id = NEW.user_id)
        WHERE user_id = NEW.user_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.profiles
        SET reports_count = (SELECT count(*) FROM public.fuel_reports WHERE user_id = OLD.user_id)
        WHERE user_id = OLD.user_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_sync_user_reports_count ON public.fuel_reports;
CREATE TRIGGER tr_sync_user_reports_count
AFTER INSERT OR DELETE ON public.fuel_reports
FOR EACH ROW EXECUTE FUNCTION public.sync_user_reports_count();

-- Initial sync
UPDATE public.profiles p
SET reports_count = (SELECT count(*) FROM public.fuel_reports WHERE user_id = p.user_id);
