-- Add icon and color columns to d_day_events
ALTER TABLE public.d_day_events 
ADD COLUMN IF NOT EXISTS icon text DEFAULT 'event',
ADD COLUMN IF NOT EXISTS color text DEFAULT '#1976d2';
