-- Backfill points for existing content
UPDATE public.profiles
SET points = (
  COALESCE((SELECT COUNT(*) * 10 FROM public.notes WHERE notes.user_id = profiles.user_id), 0) +
  COALESCE((SELECT COUNT(*) * 50 FROM public.lost_found WHERE lost_found.user_id = profiles.user_id), 0) +
  COALESCE((SELECT COUNT(*) * 20 FROM public.events WHERE events.user_id = profiles.user_id), 0)
)
WHERE points = 0;