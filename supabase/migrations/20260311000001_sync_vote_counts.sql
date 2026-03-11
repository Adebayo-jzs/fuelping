-- Trigger to sync upvotes/downvotes counts in fuel_reports table
CREATE OR REPLACE FUNCTION public.sync_fuel_report_votes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        UPDATE public.fuel_reports
        SET 
            upvotes = (SELECT count(*) FROM public.fuel_report_votes WHERE report_id = NEW.report_id AND vote_type = 'up'),
            downvotes = (SELECT count(*) FROM public.fuel_report_votes WHERE report_id = NEW.report_id AND vote_type = 'down')
        WHERE id = NEW.report_id;
    END IF;

    IF (TG_OP = 'DELETE' OR TG_OP = 'UPDATE') THEN
        UPDATE public.fuel_reports
        SET 
            upvotes = (SELECT count(*) FROM public.fuel_report_votes WHERE report_id = OLD.report_id AND vote_type = 'up'),
            downvotes = (SELECT count(*) FROM public.fuel_report_votes WHERE report_id = OLD.report_id AND vote_type = 'down')
        WHERE id = OLD.report_id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_sync_fuel_report_votes ON public.fuel_report_votes;
CREATE TRIGGER tr_sync_fuel_report_votes
AFTER INSERT OR UPDATE OR DELETE ON public.fuel_report_votes
FOR EACH ROW EXECUTE FUNCTION public.sync_fuel_report_votes();

-- Initial sync for existing data
UPDATE public.fuel_reports r
SET 
    upvotes = (SELECT count(*) FROM public.fuel_report_votes v WHERE v.report_id = r.id AND v.vote_type = 'up'),
    downvotes = (SELECT count(*) FROM public.fuel_report_votes v WHERE v.report_id = r.id AND v.vote_type = 'down');
