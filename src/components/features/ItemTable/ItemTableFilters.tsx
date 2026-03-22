import {
  ComboboxContent,
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '../../ui/combobox'

import type { Table as TanstackTable } from '@tanstack/react-table'
import { useState } from 'react'

export const SelectableFilter = <TData,>({
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
