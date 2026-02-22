// src/integrations/ConvexQueryProvider.tsx
import { QueryClientProvider } from '@tanstack/react-query'
import { ConvexProvider } from 'convex/react'
import { getContext } from './tanstack-query/root-provider' // Import the single source of truth

export default function ConvexQueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Grab the already-connected clients
  const { queryClient, convexQueryClient } = getContext()

  return (
    <ConvexProvider client={convexQueryClient.convexClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ConvexProvider>
  )
}
