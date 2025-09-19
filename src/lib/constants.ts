export const OPPONENTS = [
  {
    id: '1',
    name: 'Elon Musk',
    slug: 'elon-musk',
    nickname: 'The Algorithm Assassin',
    base_photo_url: '/opponents/elon-musk.jpg',
    allowed: true
  },
  {
    id: '2',
    name: 'Taylor Swift',
    slug: 'taylor-swift',
    nickname: 'The Reputation Wrecker',
    base_photo_url: '/opponents/taylor-swift.jpg',
    allowed: true
  },
  {
    id: '3',
    name: 'MrBeast',
    slug: 'mrbeast',
    nickname: 'The Content King',
    base_photo_url: '/opponents/mrbeast.jpg',
    allowed: true
  },
  {
    id: '4',
    name: 'Drake',
    slug: 'drake',
    nickname: 'The Chart Dominator',
    base_photo_url: '/opponents/drake.jpg',
    allowed: true
  },
  {
    id: '5',
    name: 'Jeff Bezos',
    slug: 'jeff-bezos',
    nickname: 'The Prime Punisher',
    base_photo_url: '/opponents/jeff-bezos.jpg',
    allowed: true
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