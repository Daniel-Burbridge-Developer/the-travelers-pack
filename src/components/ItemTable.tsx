import { itemCatalogue } from '@/schemas/schemas'
import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { useMutation, useQuery } from '@tanstack/react-query'
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  Table as TanstackTable,
} from '@tanstack/react-table'
import { api } from 'convex/_generated/api'
import type { Id } from 'convex/_generated/dataModel'
import { ArrowRightLeft } from 'lucide-react'
import type z from 'zod'

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
import { useState } from 'react'
import { Button } from './ui/button'
import {
  ComboboxContent,
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from './ui/combobox'

import { Input } from './ui/input'

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

const EditableStringFieldCell = ({
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

const EditableOptionFieldCell = ({
  item,
  columnId,
  options,
}: {
  item: Item
  columnId: string
  options: string[]
}) => {
  const mutation = useMutation({
    mutationFn: useConvexMutation(api.items.modify),
  })

  const [inputValue, setInputValue] = useState(
    String(item[columnId as keyof Item]),
  )

  const handleChange = (value: string | null) => {
    if (!value) return
    setInputValue(value)
    mutation.mutate({
      id: item._id,
      field: columnId,
      value: value,
    })
  }
  return (
    <Combobox items={options} value={inputValue} onValueChange={handleChange}>
      <ComboboxInput placeholder="Select a Category" />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {options.map((option) => (
            <ComboboxItem key={option} value={option}>
              {option}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

const EditableNumberFieldCell = ({
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
          mutation.mutate({
            id: item._id,
            field: columnId,
            value: Number(inputValue),
          })
        }
      }}
    ></input>
  )
}

const EditableBooleanFieldCell = ({
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
          mutation.mutate({
            id: item._id,
            field: columnId,
            value: inputValue == 'true' ? true : false,
          })
        }
      }}
    ></input>
  )
}

const SelectableFilter = <TData,>({
  options,
  table,
  field,
}: {
  options: string[]
  table: TanstackTable<TData>
  field: string
}) => {
  const [inputValue, setInputValue] = useState('')

  const handleChange = (value: string | null) => {
    if (!value) return
    if (value == 'all') {
      setInputValue('')
      table.getColumn(field)?.setFilterValue('')
    } else {
      setInputValue(value)
      table.getColumn(field)?.setFilterValue(value)
    }
  }

  options = [...options, 'all']

  return (
    <Combobox items={options} value={inputValue} onValueChange={handleChange}>
      <ComboboxInput placeholder={`Select a ${field}`} />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {options.map((option) => (
            <ComboboxItem key={option} value={option}>
              {option}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

const columns: ColumnDef<Item>[] = [
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row, column }) => (
      <EditableStringFieldCell item={row.original} columnId={column.id} />
    ),
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row, column }) => (
      <EditableStringFieldCell item={row.original} columnId={column.id} />
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row, column }) => (
      <EditableStringFieldCell item={row.original} columnId={column.id} />
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
      <EditableOptionFieldCell
        item={row.original}
        columnId={column.id}
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
      <EditableOptionFieldCell
        item={row.original}
        columnId={column.id}
        options={itemCatalogue.shape.rarity.options}
      />
    ),
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row, column }) => (
      <EditableNumberFieldCell item={row.original} columnId={column.id} />
    ),
  },
  {
    accessorKey: 'weight',
    header: 'Weight',
    cell: ({ row, column }) => (
      <EditableNumberFieldCell item={row.original} columnId={column.id} />
    ),
  },
  {
    accessorKey: 'imageURL',
    header: 'Image URL',
    cell: ({ row, column }) => (
      <EditableStringFieldCell item={row.original} columnId={column.id} />
    ),
  },
  {
    accessorKey: 'stackable',
    header: 'Stackable',
    cell: ({ row, column }) => (
      <EditableBooleanFieldCell item={row.original} columnId={column.id} />
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
