import type { ColumnDef } from '@tanstack/react-table'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { api } from 'convex/_generated/api'

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { CATEGORY_META, RARITY_META } from '@/schemas/itemSchema'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

import { itemSchema } from '@/schemas/itemSchema'
import type z from 'zod'

type Item = z.infer<typeof itemSchema> & { _id: string; _creationTime: number }

const columns: ColumnDef<Item>[] = [
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const itemCategory = row.original.category
      const meta = CATEGORY_META[itemCategory]

      return (
        <span>
          {meta.icon} {meta.label}
        </span>
      )
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'rarity',
    header: 'Rarity',

    cell: ({ row }) => {
      const itemRarity = row.original.rarity
      const meta = RARITY_META[itemRarity]

      return <span className={`${meta.color} ${meta.glow}`}>{meta.label}</span>
    },
  },
  {
    accessorKey: 'weight',
    header: 'Weight',
  },
  {
    accessorKey: 'value',
    header: 'Value',
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
  },
]

function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export const ItemTable = () => {
  const { data } = useQuery(convexQuery(api.items.list, {}))

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section>
        <DataTable columns={columns} data={data || []} />
      </section>
    </div>
  )
}
