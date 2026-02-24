import { z } from 'zod'
export const userInventories = z.object({
  user_id: z.string(),
  item_id: z.string(),
  quantity: z.number().optional(),
})
