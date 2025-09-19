-- ====================================
-- BEEF ARENA - Supabase Database Setup
-- ====================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT UNIQUE
);

-- Opponents table
CREATE TABLE IF NOT EXISTS opponents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  nickname TEXT NOT NULL,
  base_photo_url TEXT NOT NULL,
  allowed BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates table  
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  style_prompt TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generations table
CREATE TABLE IF NOT EXISTS generations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  selfie_url TEXT NOT NULL,
  opponent_slug TEXT NOT NULL,
  style TEXT NOT NULL,
  result_url TEXT,
  captions TEXT[],
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
  safety_flags JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default opponents
INSERT INTO opponents (name, slug, nickname, base_photo_url, allowed) VALUES
  ('Elon Musk', 'elon-musk', 'The Algorithm Assassin', '/opponents/elon-musk.jpg', true),
  ('Taylor Swift', 'taylor-swift', 'The Reputation Wrecker', '/opponents/taylor-swift.jpg', true),
  ('MrBeast', 'mrbeast', 'The Content King', '/opponents/mrbeast.jpg', true),
  ('Drake', 'drake', 'The Chart Dominator', '/opponents/drake.jpg', true),
  ('Jeff Bezos', 'jeff-bezos', 'The Prime Punisher', '/opponents/jeff-bezos.jpg', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert default templates
INSERT INTO templates (name, slug, style_prompt, description) VALUES
  (
    'Staredown', 
    'staredown', 
    'boxing ring, neon lights, dramatic shadows, face-to-face staredown, professional lighting, intense atmosphere',
    'Classic boxing ring face-off'
  ),
  (
    'Weigh-In', 
    'weighin', 
    'weigh-in stage, sponsor wall, flex pose, camera flashes, press conference setup, professional sports atmosphere',
    'Press conference stage scene'
  ),
  (
    'Courtroom', 
    'press', 
    'courtroom setting, judge bench, microphones, wooden desks, formal legal atmosphere, dramatic lighting',
    'Courtroom roast battle'
  ),
  (
    'Anime Duel', 
    'anime', 
    'anime style, rooftop setting, glowing eyes, cracked floor, sunset sky, dramatic wind effects, energy auras',
    'Epic rooftop showdown'
  ),
  (
    'Street Fight', 
    'street', 
    'nighttime city street, paparazzi cameras, camera flashes, urban chaos, dramatic street lighting, crowd atmosphere',
    'Paparazzi chaos scene'
  )
ON CONFLICT (slug) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generations_status ON generations(status);
CREATE INDEX IF NOT EXISTS idx_generations_opponent_slug ON generations(opponent_slug);
CREATE INDEX IF NOT EXISTS idx_opponents_slug ON opponents(slug);
CREATE INDEX IF NOT EXISTS idx_templates_slug ON templates(slug);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE opponents ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: Users can only see and modify their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Opponents: Everyone can read, only authenticated users
CREATE POLICY "Anyone can view opponents" ON opponents
  FOR SELECT USING (allowed = true);

-- Templates: Everyone can read
CREATE POLICY "Anyone can view templates" ON templates
  FOR SELECT USING (true);

-- Generations: Users can view their own, create new ones
CREATE POLICY "Users can view own generations" ON generations
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can create generations" ON generations
  FOR INSERT WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can update own generations" ON generations
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ====================================
-- Setup complete! 
-- Your Beef Arena database is ready! 🥩💥
-- ==================================== 