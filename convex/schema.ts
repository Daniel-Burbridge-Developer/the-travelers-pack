import { defineSchema, defineTable } from 'convex/server'
import { zodToConvex } from 'convex-helpers/server/zod'
import { itemSchema } from '../src/schemas/itemSchema'
// convex/schema.ts
export default defineSchema({
  items: defineTable(zodToConvex(itemSchema)),
})
