-- Supabase Migration: Create Events Table
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on start_date for better query performance
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) - optional but recommended for Supabase
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
-- You can modify this based on your authentication requirements
CREATE POLICY "Allow all operations for authenticated users" ON events
  FOR ALL USING (auth.role() = 'authenticated');

-- Alternative: Allow all operations for anonymous users (less secure)
-- CREATE POLICY "Allow all operations for anonymous users" ON events
--   FOR ALL USING (true);
