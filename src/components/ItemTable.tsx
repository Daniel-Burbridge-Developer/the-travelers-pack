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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

import { itemSchema } from '@/schemas/itemSchema'
import type z from 'zod'

type Item = z.infer<typeof itemSchema> & { _id: string; _creationTime: number }

const columns: ColumnDef<Item>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'rarity',
    header: 'Rarity',
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
  const { data, error, isPending } = useQuery(convexQuery(api.items.list, {}))

  // If TanStack Query crashes, print the error in giant red letters
  if (error) {
    return (
      <div style={{ color: 'red', padding: '50px', fontSize: '24px' }}>
        <strong>Crash Details:</strong> {error.message}
      </div>
    )
  }

  // If the WebSocket is still connecting
  if (isPending) {
    return <div style={{ color: 'white', padding: '50px' }}>Loading...</div>
  }

  // If the connection is perfect, but the database is empty
  if (!data || data.length === 0) {
    return (
      <div style={{ color: 'white', padding: '50px' }}>
        Database is successfully connected, but empty!
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <section>
        <DataTable columns={columns} data={data} />
      </section>
    </div>
  )
}
