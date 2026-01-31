-- Create the early_access_signups table with enhanced fields
CREATE TABLE IF NOT EXISTS early_access_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  confirmation_token VARCHAR(64),
  confirmed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  source VARCHAR(50) DEFAULT 'hero-form',
  user_agent TEXT,
  ip_address VARCHAR(45),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_early_access_email ON early_access_signups(email);
CREATE INDEX IF NOT EXISTS idx_early_access_confirmed ON early_access_signups(confirmed);
CREATE INDEX IF NOT EXISTS idx_early_access_token ON early_access_signups(confirmation_token);
CREATE INDEX IF NOT EXISTS idx_early_access_created_at ON early_access_signups(created_at);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_early_access_signups_updated_at ON early_access_signups;
CREATE TRIGGER update_early_access_signups_updated_at
    BEFORE UPDATE ON early_access_signups
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE early_access_signups ENABLE ROW LEVEL SECURITY;

-- Create policies for the service role
CREATE POLICY "Service role can do everything" ON early_access_signups
    FOR ALL USING (auth.role() = 'service_role');

-- Create policy for authenticated users to read their own data
CREATE POLICY "Users can read their own signup" ON early_access_signups
    FOR SELECT USING (auth.email() = email);

-- Insert some sample data for testing (optional)
-- INSERT INTO early_access_signups (email, confirmed, source) 
-- VALUES ('test@example.com', true, 'hero-form')
-- ON CONFLICT (email) DO NOTHING;