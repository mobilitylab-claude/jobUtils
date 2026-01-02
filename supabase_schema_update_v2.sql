-- Add is_annual column to d_day_events table
ALTER TABLE d_day_events 
ADD COLUMN is_annual BOOLEAN DEFAULT FALSE;
