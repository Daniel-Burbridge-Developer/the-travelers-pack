import { createFileRoute } from '@tanstack/react-router'
import { ItemTable } from '#/components/ItemTable.tsx'

export const Route = createFileRoute('/items/')({
  component: Inventory,
})

function Inventory() {
  return <div className="bg-background">Not yet implemented</div>
}
