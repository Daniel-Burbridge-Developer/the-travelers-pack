import { itemCatalogue } from '@/schemas/schemas'
import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { api } from 'convex/_generated/api'
import type { Id } from 'convex/_generated/dataModel'
import { ArrowRightLeft } from 'lucide-react'
import type z from 'zod'

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
import { useState } from 'react'
import { Button } from './ui/button'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

type Item = z.infer<typeof itemCatalogue> & {
  _id: Id<'itemCatalogue'>
  _creationTime: number
}

const ToggleDeletedCell = ({ item }: { item: Item }) => {
  const mutation = useMutation({
    mutationFn: useConvexMutation(api.items.toggleDeleted),
  })
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => mutation.mutate({ id: item._id })}
      className={item.deleted ? 'text-gray-400' : 'text-red-500'}
    >
      <span>{item.deleted ? 'Restore' : 'Delete'}</span>
      <ArrowRightLeft />
    </Button>
  )
}

const EditableFieldCell = ({
  item,
  columnId,
}: {
  item: Item
  columnId: string
}) => {
  const mutation = useMutation({
    mutationFn: useConvexMutation(api.items.modify),
  })

  const [inputValue, setInputValue] = useState(
    String(item[columnId as keyof Item]),
  )

  const handleChange = (value: string) => {
    setInputValue(value)
  }

  return (
    <input
      onChange={(e) => handleChange(e.target.value)}
      value={inputValue}
      onBlur={() => {
        if (inputValue !== String(item[columnId as keyof Item])) {
          mutation.mutate({ id: item._id, field: columnId, value: inputValue })
        }
      }}
    ></input>
  )
}

const columns: ColumnDef<Item>[] = [
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row, column }) => (
      <EditableFieldCell item={row.original} columnId={column.id} />
    ),
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row, column }) => (
      <EditableFieldCell item={row.original} columnId={column.id} />
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row, column }) => (
      <EditableFieldCell item={row.original} columnId={column.id} />
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row, column }) => (
      <EditableFieldCell item={row.original} columnId={column.id} />
    ),
  },
  {
    accessorKey: 'rarity',
    header: 'Rarity',
    cell: ({ row, column }) => (
      <EditableFieldCell item={row.original} columnId={column.id} />
    ),
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row, column }) => (
      <EditableFieldCell item={row.original} columnId={column.id} />
    ),
  },
  {
    accessorKey: 'weight',
    header: 'Weight',
    cell: ({ row, column }) => (
      <EditableFieldCell item={row.original} columnId={column.id} />
    ),
  },
  {
    accessorKey: 'imageURL',
    header: 'Image URL',
    cell: ({ row, column }) => (
      <EditableFieldCell item={row.original} columnId={column.id} />
    ),
  },
  {
    accessorKey: 'stackable',
    header: 'Stackable',
    cell: ({ row, column }) => (
      <EditableFieldCell item={row.original} columnId={column.id} />
    ),
  },
  {
    accessorKey: 'deleted',
    header: 'Deleted',
    cell: ({ row }) => <ToggleDeletedCell item={row.original} />,
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

  const [inputValues, setInputValues] = useState<Record<string, string>>({})
  const mutation = useMutation({ mutationFn: useConvexMutation(api.items.add) })

  const handleCellChange = (cellID: string, value: string) => {
    setInputValues({ ...inputValues, [cellID]: value })
  }

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
          {table.getRowModel().rows.length ? (
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
          <TableRow>
            {table.getVisibleFlatColumns().map((cell) => (
              <TableCell key={cell.id}>
                <input
                  onChange={(e) => handleCellChange(cell.id, e.target.value)}
                  value={inputValues[cell.id] ?? ''}
                  placeholder={cell.columnDef.header?.toString()}
                ></input>
              </TableCell>
            ))}
          </TableRow>
          {/* clicking on the below row validates above row, if not valid shows smart errors, if valid adds to DB, clears above row to start again. */}
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="text-center"
              onClick={() => {
                const result = itemCatalogue.safeParse(inputValues)

                if (result.success) {
                  mutation.mutate(result.data)
                } else {
                  console.log(result.error.issues)
                }

                setInputValues({})
              }}
            >
              Add Item
            </TableCell>
          </TableRow>
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
