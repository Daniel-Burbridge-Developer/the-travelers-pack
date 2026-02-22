import { createFileRoute } from '@tanstack/react-router'
import { ItemTable } from '#/components/ItemTable.tsx'
import type z from 'zod'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="bg-black">
      <ItemTable />
    </div>
  )
}
