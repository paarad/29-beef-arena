# �� Beef Arena 💥

**A photorealistic, parody fight poster generator where you face off with celebrities — Mortal Kombat meets meme culture.**

![Beef Arena](https://img.shields.io/badge/status-MVP-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC)

## 🧠 What is Beef Arena?

Beef Arena is a web app that lets users upload a selfie, pick a celebrity opponent, choose a scene (boxing match, anime duel, courtroom roast, etc.), and generate a photorealistic fight poster with meme captions.

It feels more like a fighter intro screen from UFC or Mortal Kombat than a regular web form. The tone is dramatic, absurd, and PG-13 — for parody and memes, not violence.

## ✨ Features

- 🧍‍♂️ **Upload your face** - Simple selfie upload with preview
- 🎯 **Pick opponent** - Choose from celebrities like Elon Musk, Taylor Swift, MrBeast
- 🥊 **Choose fight scene** - Boxing ring, anime duel, courtroom roast, paparazzi street brawl
- 🎨 **Generate fight poster** - AI generates photorealistic fight scenes
- ✍️ **Meme captions** - GPT generates punchy, meme-worthy captions
- 💾 **Download/share** - Save your poster or share online
- 🔁 **Remix** - Try different styles or opponents
- 🛡️ **Parody watermark** - Optional watermark for legal safety
- 🧼 **Content moderation** - Automatic safety checks

## 🎮 UI Experience

- **Dark mode UI** with ring spotlights, fog, and neon accents
- **VS layout** - User vs Opponent (Blue Corner vs Red Corner)
- **Animated VS emblem** in center
- **Framer Motion animations** throughout
- **Game-style interactions** like Mortal Kombat fighter selection

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, TypeScript, TailwindCSS, shadcn/ui |
| **Animations** | Framer Motion |
| **File Upload** | UploadThing |
| **AI Generation** | Replicate (SDXL, InstantID, Real-ESRGAN) |
| **AI Captions** | OpenAI GPT-4 |
| **Database** | Supabase (Postgres + Storage) |
| **Moderation** | OpenAI Moderation API |
| **Deployment** | Vercel |

## 🛠 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- API keys for:
  - OpenAI
  - Replicate
  - Supabase
  - UploadThing

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/paarad/29-beef-arena.git
   cd 29-beef-arena
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your API keys:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # UploadThing
   UPLOADTHING_SECRET=your_uploadthing_secret
   UPLOADTHING_APP_ID=your_uploadthing_app_id
   
   # OpenAI
   OPENAI_API_KEY=your_openai_api_key
   
   # Replicate
   REPLICATE_API_TOKEN=your_replicate_api_token
   ```

4. **Set up Supabase database**
   
   Create tables in your Supabase instance:
   ```sql
   -- Users table
   CREATE TABLE beefarena_users (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     email TEXT
   );
   
   -- Opponents table
   CREATE TABLE beefarena_opponents (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     name TEXT NOT NULL,
     slug TEXT UNIQUE NOT NULL,
     nickname TEXT NOT NULL,
     base_photo_url TEXT NOT NULL,
     allowed BOOLEAN DEFAULT true,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Templates table
   CREATE TABLE beefarena_templates (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     name TEXT NOT NULL,
     slug TEXT UNIQUE NOT NULL,
     style_prompt TEXT NOT NULL,
     description TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Generations table
   CREATE TABLE beefarena_generations (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     user_id UUID REFERENCES beefarena_users(id) ON DELETE SET NULL,
     selfie_url TEXT NOT NULL,
     opponent_slug TEXT NOT NULL,
     style TEXT NOT NULL,
     result_url TEXT,
     captions TEXT[],
     status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
     safety_flags JSONB,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 🎯 Scene Templates

| Scene | Description | Style |
|-------|-------------|-------|
| **Staredown** | Classic boxing ring face-off | Neon lights, dramatic shadows |
| **Weigh-In** | Press conference stage | Sponsor wall, camera flashes |
| **Courtroom** | Roast battle | Judge bench, microphones |
| **Anime Duel** | Epic rooftop showdown | Glowing effects, speed lines |
| **Street Fight** | Paparazzi chaos scene | Night city, camera flashes |

## 🧩 API Endpoints

### `POST /api/generate`

Generate a fight poster.

**Request:**
```json
{
  "selfieUrl": "data:image/jpeg;base64,...",
  "opponentSlug": "elon-musk",
  "styleSlug": "staredown",
  "watermarkEnabled": true
}
```

**Response:**
```json
{
  "success": true,
  "resultUrl": "https://...",
  "captions": [
    "When algorithms meet attitude 🔥",
    "This beef is well done 🥩"
  ],
  "opponent": "Elon Musk",
  "style": "Staredown"
}
```

## 🔐 Safety & Legal

- ✅ **PG-13 only** - No gore, weapons, or realistic violence
- ✅ **Public figures only** - Curated opponent list
- 🚫 **No minors** - Age detection via moderation
- ✅ **Parody watermark** - Clear parody labeling
- ✅ **Content moderation** - All images and text checked
- ✅ **Report feature** - Users can report inappropriate content

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**🥩 Start your beef. 💥 Settle it in the ring. 📸 Share the chaos.**
