import { createFileRoute } from '@tanstack/react-router'
import { ItemTable } from '#/components/ItemTable.tsx'

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
