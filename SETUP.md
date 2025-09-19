# 🚀 Beef Arena Setup Guide

## 1. 🗄️ Supabase Database Setup

**Copy and paste this SQL into your Supabase SQL Editor:**

```sql
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
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can view opponents" ON opponents FOR SELECT USING (allowed = true);
CREATE POLICY "Anyone can view templates" ON templates FOR SELECT USING (true);
CREATE POLICY "Users can view own generations" ON generations FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Anyone can create generations" ON generations FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own generations" ON generations FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
```

## 2. 🔐 Environment Variables

**Create `.env.local` file in your project root with these variables:**

```bash
# ===== SUPABASE =====
# Get from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# ===== UPLOADTHING =====
# Get from: https://uploadthing.com/dashboard → API Keys → V7 tab
UPLOADTHING_TOKEN=your_uploadthing_token_here

# ===== OPENAI =====
# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your_openai_api_key_here

# ===== REPLICATE =====
# Get from: https://replicate.com/account/api-tokens
REPLICATE_API_TOKEN=r8_your_replicate_api_token_here

# Replicate model to use for image generation
REPLICATE_MODEL=stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b
```

## 3. 📝 Step-by-Step API Setup

### 🟢 Supabase
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Create new project or select existing
3. Go to **Settings** → **API**
4. Copy **Project URL** and **anon public** key
5. Run the SQL commands above in **SQL Editor**

### 🟠 UploadThing
1. Go to [uploadthing.com/dashboard](https://uploadthing.com/dashboard)
2. Create new app (if needed)
3. Go to **API Keys** section
4. Select the **V7** tab
5. Copy the **UPLOADTHING_TOKEN** (contains app ID, API key, and config)

### 🟡 OpenAI
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create new API key
3. **Important:** Set up billing/credits for GPT-4 usage

### 🟣 Replicate
1. Go to [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)
2. Create new token
3. Set up billing for AI model usage

## 4. 🚀 Start the App

```bash
npm run dev
```

Visit [http://localhost:3001](http://localhost:3001) (or whatever port shows in terminal)

## 5. ✅ Test the Application

1. **Upload a selfie** in the Blue Corner
2. **Pick an opponent** like Elon Musk
3. **Choose a fight style** like "Staredown"
4. **Click "SETTLE THE BEEF"**
5. **Wait for AI generation** (takes 10-30 seconds)
6. **Get your fight poster** with meme captions!

---

🥩 **Your Beef Arena is ready to rumble!** 💥 