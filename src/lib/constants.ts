export const OPPONENTS = [
  { 
    id: '1', 
    name: 'Elon Musk', 
    slug: 'elon-musk', 
    nickname: 'The Rocket Tyrant', 
    base_photo_url: '/opponents/elon-musk.jpg', 
    allowed: true,
    description: 'Elon Musk, pale skin, angular face with sharp jawline, thick brown eyebrows, wide pale green eyes with intense stare, narrow nose, thin lips with slight smirk, short slightly messy brown hair combed forward, light stubble, wearing a sleek black bomber jacket over a SpaceX T-shirt, holding a glowing Tesla orb or flamethrower, lean tall body type, arms crossed with smug posture, raised eyebrow expression, tech billionaire with god-complex energy'
  },
  { 
    id: '2', 
    name: 'Taylor Swift', 
    slug: 'taylor-swift', 
    nickname: 'Pop Queen of Pain', 
    base_photo_url: '/opponents/taylor-swift.jpg', 
    allowed: true,
    description: 'Taylor Swift, fair skin with subtle blush, heart-shaped face, arched blonde eyebrows, large piercing blue eyes with mascara, small upturned nose, bright red lips with playful smirk, long golden blonde hair with signature curtain bangs, wearing a sparkly silver concert dress with mic in one hand, tall slim figure, standing with one leg slightly forward, hand on hip, winking confidently, surrounded by glittery pink aura'
  },
  { 
    id: '3', 
    name: 'MrBeast', 
    slug: 'mrbeast', 
    nickname: 'The Giveaway God', 
    base_photo_url: '/opponents/mrbeast.jpg', 
    allowed: true,
    description: 'MrBeast (Jimmy Donaldson), light peach skin, rounded jawline, light brown parted fringe haircut, thick brown eyebrows, bright hazel eyes wide open, button nose, open-mouthed smile with slightly crooked teeth, short trimmed brown beard, wearing a branded MrBeast hoodie (blue with panther logo), holding a YouTube play button in one hand and cash in the other, medium build, standing in generous game show pose'
  },
  { 
    id: '4', 
    name: 'Drake', 
    slug: 'drake', 
    nickname: 'The 6ix God', 
    base_photo_url: '/opponents/drake.jpg', 
    allowed: true,
    description: 'Drake, medium brown skin, oval face with well-groomed black beard, short fade haircut, thick eyebrows, warm brown eyes with confident stare, wide nose, slight smile, wearing luxury streetwear hoodie with gold chains, athletic build, standing with arms crossed in hip-hop pose, Toronto energy with urban lighting'
  },
  { 
    id: '5', 
    name: 'Jeff Bezos', 
    slug: 'jeff-bezos', 
    nickname: 'The Capitalist Cyborg', 
    base_photo_url: '/opponents/jeff-bezos.jpg', 
    allowed: true,
    description: 'Jeff Bezos, tanned skin with plastic shine, diamond-shaped face, no hair at all (smooth bald head), thin dark eyebrows, wide almond eyes with laser focus, long narrow nose, thin smiling lips, clean-shaven face, black fitted turtleneck and sleek blazer, standing with arms behind back like a space villain, slight grin and tilted head, lean and fit body, hovering over a glowing Amazon-branded drone'
  },
  { 
    id: '6', 
    name: 'Donald Trump', 
    slug: 'donald-trump', 
    nickname: 'Commander of Clout', 
    base_photo_url: '/opponents/donald-trump.jpg', 
    allowed: true,
    description: 'Donald Trump, warm orange skin tone, round face with jowls, exaggerated golden blonde combover, bushy eyebrows, squinting blue eyes with smug look, bulbous nose, pouting lips, red tie and navy blue suit with American flag pin, pointing aggressively with one hand, large frame with hunched-forward stance, puffed chest'
  },
  { 
    id: '7', 
    name: 'The Rock', 
    slug: 'the-rock', 
    nickname: 'The People\'s Elbow', 
    base_photo_url: '/opponents/the-rock.jpg', 
    allowed: true,
    description: 'Dwayne "The Rock" Johnson, deep tan skin, bald head with smooth scalp shine, arched thick black eyebrows, intense brown eyes with piercing stare, broad nose, gritted white teeth with cocky smile, clean-shaven, wearing a tight black Under Armour tank top, tribal Samoan shoulder tattoo showing, hyper-muscular V-shaped body, crossed arms pose, standing proud with glowing aura of strength, raised single eyebrow'
  },
  { 
    id: '8', 
    name: 'Mark Zuckerberg', 
    slug: 'mark-zuckerberg', 
    nickname: 'The Android', 
    base_photo_url: '/opponents/mark-zuckerberg.jpg', 
    allowed: true,
    description: 'Mark Zuckerberg, very pale skin, square face, light reddish eyebrows, narrow blue-gray eyes with blank stare, thin sharp nose, pursed lips, short neat auburn-brown hair, completely clean-shaven, wearing a basic grey t-shirt and dark jeans, holding nothing, slightly hunched narrow body, hands resting flat by sides in neutral pose, expressionless robotic face, posture of an AI learning to behave human'
  }
] as const

export const FIGHT_TEMPLATES = [
  {
    id: '1',
    name: 'Staredown',
    slug: 'staredown',
    description: 'Classic boxing ring face-off',
    style_prompt: 'boxing ring, neon lights, dramatic shadows, face-to-face staredown, professional lighting, intense atmosphere'
  },
  {
    id: '2',
    name: 'Weigh-In',
    slug: 'weighin',
    description: 'Press conference stage scene',
    style_prompt: 'weigh-in stage, sponsor wall, flex pose, camera flashes, press conference setup, professional sports atmosphere'
  },
  {
    id: '3',
    name: 'Courtroom',
    slug: 'press',
    description: 'Courtroom roast battle',
    style_prompt: 'courtroom setting, judge bench, microphones, wooden desks, formal legal atmosphere, dramatic lighting'
  },
  {
    id: '4',
    name: 'Anime Duel',
    slug: 'anime',
    description: 'Epic rooftop showdown',
    style_prompt: 'anime style, rooftop setting, glowing eyes, cracked floor, sunset sky, dramatic wind effects, energy auras'
  },
  {
    id: '5',
    name: 'Street Fight',
    slug: 'street',
    description: 'Paparazzi chaos scene',
    style_prompt: 'nighttime city street, paparazzi cameras, camera flashes, urban chaos, dramatic street lighting, crowd atmosphere'
  }
] as const

export const FIGHT_STATUSES = {
  PENDING: 'pending',
  GENERATING: 'generating',
  COMPLETED: 'completed',
  FAILED: 'failed'
} as const 