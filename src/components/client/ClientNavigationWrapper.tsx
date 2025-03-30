'use client'

import { Suspense } from 'react'

// This wrapper ensures that any client components using useSearchParams are properly
// wrapped in a Suspense boundary, which is required for Next.js
export default function ClientNavigationWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div>Loading navigation...</div>}>{children}</Suspense>
}
