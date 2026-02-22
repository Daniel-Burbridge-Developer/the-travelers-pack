import { z } from 'zod'

export const itemSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.enum(['weapon', 'armor', 'potion', 'material', 'misc']),
  rarity: z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']),
  quantity: z.number().min(0).max(99),
  value: z.number().min(0),
  weight: z.number(),
  isFavorite: z.boolean(),
  imageURL: z.url().nullable(),
  createdAt: z.number(),
})
