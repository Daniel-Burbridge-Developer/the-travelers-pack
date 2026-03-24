import type z from 'zod'
import type { itemCatalogue } from '@/schemas/schemas'
import type { Id } from 'convex/_generated/dataModel'

export type Item = z.infer<typeof itemCatalogue> & {
  _id: Id<'itemCatalogue'>
  _creationTime: number
}
