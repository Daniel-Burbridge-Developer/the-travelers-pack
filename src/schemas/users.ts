import z from 'zod'

export const users = z.object({
  slug: z.string(),
  name: z.string(),
})
