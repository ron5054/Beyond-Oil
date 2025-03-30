/**
 * Utility functions for managing URL state in a way that's compatible with React Server Components
 */

type ParsedValue = string | number | boolean
type StateRecord = Record<string, ParsedValue>

/**
 * Parse URL search params into a structured object
 * @param searchParams - The URL search parameters
 * @param options - Configuration options for parsing
 * @returns Parsed state object
 */
export function parseUrlState<T extends StateRecord>(
  searchParams:
    | URLSearchParams
    | { get(name: string): string | null; entries(): IterableIterator<[string, string]> },
  options?: {
    parseNumbers?: boolean
    parseBooleans?: boolean
    defaultValues?: Partial<T>
  },
): T {
  const result = { ...(options?.defaultValues || {}) } as Partial<T>

  // Convert searchParams to entries for easier iteration
  const entries = Array.from(searchParams.entries())

  for (const [key, value] of entries) {
    if (options?.parseNumbers && !isNaN(Number(value)) && value !== '') {
      result[key as keyof T] = Number(value) as T[keyof T]
    } else if (options?.parseBooleans && (value === 'true' || value === 'false')) {
      result[key as keyof T] = (value === 'true') as T[keyof T]
    } else {
      result[key as keyof T] = value as T[keyof T]
    }
  }

  return result as T
}

/**
 * Create a URL with updated search parameters
 * @param pathname - The base pathname
 * @param currentParams - Current URL search parameters
 * @param newParams - New parameters to add or update
 * @returns New URL string with updated parameters
 */
export function createUrlWithState(
  pathname: string,
  currentParams: URLSearchParams | { toString(): string },
  newParams: Record<string, string | number | boolean | undefined | null>,
): string {
  // Create a new URLSearchParams instance from the current params
  const params = new URLSearchParams(currentParams.toString())

  // Update params with new values
  Object.entries(newParams).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      params.delete(key)
    } else {
      params.set(key, String(value))
    }
  })

  // Create the new URL
  return `${pathname}${params.toString() ? '?' + params.toString() : ''}`
}

/**
 * Get default values for URL state
 * This can be used in both server and client components
 */
export function getDefaultUrlState() {
  return {
    page: '1',
    filter: '',
    sort: '',
    view: 'grid',
  }
}

type QueryParams = Record<string, string | string[] | undefined>

export const addParamsToUrl = (currentParams: QueryParams, newParams: QueryParams): QueryParams => {
  return { ...currentParams, ...newParams }
}

export const removeParamsFromUrl = (
  currentParams: QueryParams,
  paramsToRemove: string[],
): QueryParams => {
  const newParams = { ...currentParams }
  paramsToRemove.forEach((param) => delete newParams[param])
  return newParams
}
