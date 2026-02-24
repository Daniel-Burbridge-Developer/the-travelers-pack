import { defineSchema, defineTable } from 'convex/server'
import { zodToConvex } from 'convex-helpers/server/zod'
import { itemCatalogue, userInventories, users } from '../src/schemas/schemas'
// convex/schema.ts
export default defineSchema({
  itemCatalogue: defineTable(zodToConvex(itemCatalogue)),
  userInventories: defineTable(zodToConvex(userInventories)),
  users: defineTable(zodToConvex(users)),
})
