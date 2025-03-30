'use client'

import { Suspense } from 'react'

// This wrapper is specifically for components that use useSearchParams
// to ensure they are properly wrapped in Suspense boundaries
export default function SearchParamsWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="p-6">Loading...</div>}>{children}</Suspense>
}
