import { QueryClient } from '@tanstack/react-query'
import { ConvexQueryClient } from '@convex-dev/react-query'
import { env } from '../../env'

let context:
  | {
      queryClient: QueryClient
      convexQueryClient: ConvexQueryClient
    }
  | undefined

export function getContext() {
  if (context) {
    return context
  }

  const CONVEX_URL = env.VITE_CONVEX_URL
  const convexQueryClient = new ConvexQueryClient(CONVEX_URL)

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  })

  // Connect them together immediately here!
  convexQueryClient.connect(queryClient)

  context = {
    queryClient,
    convexQueryClient,
  }

  return context
}
