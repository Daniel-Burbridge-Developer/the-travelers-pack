import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { itemCatalogue } from '../src/schemas/schemas'
import { zodToConvex } from 'convex-helpers/server/zod'

export const add = mutation({
  args: zodToConvex(itemCatalogue),
  handler: async (ctx, args) => {
    return await ctx.db.insert('itemCatalogue', args)
  },
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('itemCatalogue').collect()
  },
})

// export const modify = mutation({
// args: zodToConvex(itemCatalogue),
// handler: async(convexToJson, args) => {

// }})

export const remove = mutation({
  args: { id: v.id('itemCatalogue') },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id)
  },
})

export const toggleDeleted = mutation({
  args: { id: v.id('itemCatalogue') },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id)
    if (!item) throw new Error('Item not found')

    await ctx.db.patch(args.id, { deleted: !item.deleted })
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
