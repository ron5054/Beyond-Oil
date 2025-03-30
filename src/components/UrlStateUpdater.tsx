'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { createUrlWithState } from '../lib/urlStateUtils'
import { useCallback } from 'react'
import SearchParamsWrapper from './client/SearchParamsWrapper'

interface UrlStateUpdaterProps {
  children: (
    updateUrlState: (
      newParams: Record<string, string | number | boolean | undefined | null>,
      options?: { preserveExisting?: boolean },
    ) => void,
  ) => React.ReactNode
}

/**
 * Client component that provides a function to update URL state
 * This is the only component that needs to be a client component
 */
export function UrlStateUpdater({ children }: UrlStateUpdaterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateUrlState = useCallback(
    (
      newParams: Record<string, string | number | boolean | undefined | null>,
      options?: { preserveExisting?: boolean },
    ) => {
      // If preserveExisting is true, we'll merge the new params with existing ones
      // Otherwise, we'll only use the new params (potentially removing existing ones)
      const preserveExisting = options?.preserveExisting ?? true

      let mergedParams = { ...newParams }

      // If we want to preserve existing params, add them to mergedParams
      if (preserveExisting) {
        const existingParams: Record<string, string> = {}
        searchParams.forEach((value, key) => {
          existingParams[key] = value
        })

        // Merge existing params with new ones (new ones take precedence)
        mergedParams = { ...existingParams, ...newParams }
      }

      const url = createUrlWithState(pathname, searchParams, mergedParams)
      router.push(url)
    },
    [pathname, router, searchParams],
  )

  // Wrap in SearchParamsWrapper since we're using useSearchParams
  return <SearchParamsWrapper>{children(updateUrlState)}</SearchParamsWrapper>
}
