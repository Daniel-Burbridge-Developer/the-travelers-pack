import { itemCatalogue } from '@/schemas/schemas'
import type { Item } from '@/types/types'
import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from 'convex/_generated/api'
import { useState } from 'react'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
} from '@tanstack/react-table'

import { ToggleDeletedCell, EditableCell } from './ItemTableCells'

import { SelectableFilter } from './ItemTableFilters'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

const columns: ColumnDef<Item>[] = [
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row, column }) => (
      <EditableCell
        item={row.original}
        columnId={column.id}
        transform={(v: string) => v}
      />
    ),
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row, column }) => (
      <EditableCell
        item={row.original}
        columnId={column.id}
        transform={(v: string) => v}
      />
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row, column }) => (
      <EditableCell
        item={row.original}
        columnId={column.id}
        transform={(v: string) => v}
      />
    ),
  },
  {
    accessorKey: 'category',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Category
        </Button>
      )
    },
    cell: ({ row, column }) => (
      <EditableCell
        item={row.original}
        columnId={column.id}
        transform={(v: string) => v}
        options={itemCatalogue.shape.category.options}
      />
    ),
  },
  {
    accessorKey: 'rarity',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Rarity
        </Button>
      )
    },
    cell: ({ row, column }) => (
      <EditableCell
        item={row.original}
        columnId={column.id}
        transform={(v: string) => v}
        options={itemCatalogue.shape.rarity.options}
      />
    ),
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row, column }) => (
      <EditableCell
        item={row.original}
        columnId={column.id}
        transform={(v: string) => Number(v)}
      />
    ),
  },
  {
    accessorKey: 'weight',
    header: 'Weight',
    cell: ({ row, column }) => (
      <EditableCell
        item={row.original}
        columnId={column.id}
        transform={(v: string) => Number(v)}
      />
    ),
  },
  {
    accessorKey: 'imageURL',
    header: 'Image URL',
    cell: ({ row, column }) => (
      <EditableCell
        item={row.original}
        columnId={column.id}
        transform={(v: string) => v}
      />
    ),
  },
  {
    accessorKey: 'stackable',
    header: 'Stackable',
    cell: ({ row, column }) => (
      <EditableCell
        item={row.original}
        columnId={column.id}
        transform={(v: string) => v == 'true'}
      />
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
  const [inputValues, setInputValues] = useState<Record<string, string>>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const mutation = useMutation({
    mutationFn: useConvexMutation(api.items.add),
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
      sorting,
    },
    onSortingChange: setSorting,
  })

  const handleCellChange = (cellID: string, value: string) => {
    setInputValues({ ...inputValues, [cellID]: value })
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter items"
          value={table.getColumn('name')?.getFilterValue() as string}
          onChange={(e) =>
            table.getColumn('name')?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <SelectableFilter
          options={itemCatalogue.shape.category.options}
          table={table}
          field="category"
        />
        <SelectableFilter
          options={itemCatalogue.shape.rarity.options}
          table={table}
          field="rarity"
        />
      </div>
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
                  placeholder={
                    cell.id.charAt(0).toUpperCase() + cell.id.slice(1)
                  }
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
