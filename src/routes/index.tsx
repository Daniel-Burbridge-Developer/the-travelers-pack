import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const featuredPages = [
    <Link to="/inventory">Inventory</Link>,
    <Link to="/items">Items</Link>,
  ]

  return (
    <div className="bg-background">
      <section>
        <h1> The Travelers Pack</h1>
      </section>
      <section>
        {featuredPages.map((page, i) => (
          <div key={i}>{page}</div>
        ))}
      </section>
    </div>
  )
}
