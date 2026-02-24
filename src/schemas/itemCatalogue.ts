import { z } from 'zod'

export const itemCatalogue = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.enum(['weapon', 'armor', 'potion', 'material', 'misc']),
  rarity: z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']),
  value: z.number().min(0),
  weight: z.number(),
  imageURL: z.url().nullable(),
  stackable: z.boolean(),
  deleted: z.boolean().default(false),
})

export const RARITY_META = {
  common: {
    label: 'Common',
    color: 'text-gray-500',
    glow: '',
  },
  uncommon: {
    label: 'Uncommon',
    color: 'text-green-500',
    glow: 'shadow-[0_0_10px_rgba(34,197,94,0.5)]',
  },
  rare: {
    label: 'Rare',
    color: 'text-blue-500',
    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.6)]',
  },
  epic: {
    label: 'Epic',
    color: 'text-purple-500',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.7)]',
  },
  legendary: {
    label: 'Legendary',
    color: 'text-orange-500',
    glow: 'animate-pulse shadow-[0_0_25px_rgba(249,115,22,0.8)]',
  },
} as const

export const CATEGORY_META = {
  weapon: {
    icon: '⚔️',
    label: 'Weapon',
  },
  armor: {
    icon: '🛡️',
    label: 'Armor',
  },
  potion: {
    icon: '🧪',
    label: 'Potion',
  },
  material: {
    icon: '📦',
    label: 'Material',
  },
  misc: {
    icon: '✨',
    label: 'Misc',
  },
} as const
