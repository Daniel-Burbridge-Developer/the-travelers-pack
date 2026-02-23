import { createFileRoute } from '@tanstack/react-router'
import { ItemTable } from '#/components/ItemTable.tsx'

export const Route = createFileRoute('/inventory/')({
  component: Inventory,
})

function Inventory() {
  return (
    <div className="bg-background">
      <ItemTable />
    </div>
  )
}
