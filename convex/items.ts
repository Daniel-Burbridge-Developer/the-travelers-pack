import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { itemSchema } from '../src/schemas/itemSchema'
import { zodToConvex } from 'convex-helpers/server/zod'

export const add = mutation({
  args: zodToConvex(itemSchema),
  handler: async (ctx, args) => {
    return await ctx.db.insert('items', args)
  },
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('items').collect()
  },
})

// export const modify = mutation({
// args: zodToConvex(itemSchema),
// handler: async(convexToJson, args) => {

// }})

export const remove = mutation({
  args: { id: v.id('items') },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id)
  },
})

// Example of modify
// export const toggle = mutation({
//   args: { id: v.id('todos') },
//   handler: async (ctx, args) => {
//     const todo = await ctx.db.get(args.id)
//     if (!todo) {
//       throw new Error('Todo not found')
//     }
//     return await ctx.db.patch(args.id, {
//       completed: !todo.completed,
//     })
//   },
// })
