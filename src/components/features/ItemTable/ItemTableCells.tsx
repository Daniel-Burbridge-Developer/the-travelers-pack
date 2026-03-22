import { ArrowRightLeft } from 'lucide-react'

import type { itemCatalogue } from '@/schemas/schemas'
import type { Id } from 'convex/_generated/dataModel'
import { useConvexMutation } from '@convex-dev/react-query'
import type z from 'zod'
import { useMutation } from '@tanstack/react-query'
import { api } from 'convex/_generated/api'
import { useState } from 'react'
import { Button } from '../../ui/button'
import {
  ComboboxContent,
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '../../ui/combobox'

type Item = z.infer<typeof itemCatalogue> & {
  _id: Id<'itemCatalogue'>
  _creationTime: number
}

export const ToggleDeletedCell = ({ item }: { item: Item }) => {
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

export const EditableStringFieldCell = ({
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

export const EditableOptionFieldCell = ({
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

export const EditableNumberFieldCell = ({
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

export const EditableBooleanFieldCell = ({
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
