-- Function to award points when a user creates content
CREATE OR REPLACE FUNCTION public.award_points_for_content()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  points_to_award INTEGER;
BEGIN
  -- Determine points based on table
  IF TG_TABLE_NAME = 'notes' THEN
    points_to_award := 10;
  ELSIF TG_TABLE_NAME = 'lost_found' THEN
    points_to_award := 50;
  ELSIF TG_TABLE_NAME = 'events' THEN
    points_to_award := 20;
  ELSE
    points_to_award := 0;
  END IF;
  
  -- Update user's points
  UPDATE public.profiles
  SET points = COALESCE(points, 0) + points_to_award
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Trigger for notes table
CREATE TRIGGER award_points_on_note_insert
AFTER INSERT ON public.notes
FOR EACH ROW
EXECUTE FUNCTION public.award_points_for_content();

-- Trigger for lost_found table
CREATE TRIGGER award_points_on_lost_found_insert
AFTER INSERT ON public.lost_found
FOR EACH ROW
EXECUTE FUNCTION public.award_points_for_content();

-- Trigger for events table
CREATE TRIGGER award_points_on_event_insert
AFTER INSERT ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.award_points_for_content();