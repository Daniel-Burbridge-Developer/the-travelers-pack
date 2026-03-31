import { ArrowRightLeft } from 'lucide-react'
import type { Item } from '@/types/types'
import { useConvexMutation } from '@convex-dev/react-query'
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

export const EditableCell = ({
  item,
  columnId,
  transform,
  options,
}: {
  item: Item
  columnId: string
  transform: (v: string) => string | number | boolean
  options?: string[]
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

  const optionsChange = (value: string | null) => {
    if (!value) return
    setInputValue(value)
    mutation.mutate({
      id: item._id,
      field: columnId,
      value: value,
    })
  }

  if (options) {
    return (
      <Combobox
        items={options}
        value={inputValue}
        onValueChange={optionsChange}
      >
        <ComboboxInput placeholder={`Select a ${columnId}`} />
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

  return (
    <input
      onChange={(e) => handleChange(e.target.value)}
      value={inputValue}
      onBlur={() => {
        if (inputValue !== String(item[columnId as keyof Item])) {
          mutation.mutate({
            id: item._id,
            field: columnId,
            value: transform(inputValue),
          })
        }
      }}
    />
  )
}
