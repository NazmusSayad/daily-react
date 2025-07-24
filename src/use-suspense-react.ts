import { useRef } from 'react'

/**
 * React Suspense utility hook. Throws a promise when suspended is true, triggering a Suspense boundary.
 *
 * @param suspended If true, throws a promise to suspend rendering
 *
 * @example
 * useSuspense(isLoading)
 */
export function useSuspense(suspended: boolean = false) {
  const promise = useRef<{ resolve: (...args: unknown[]) => void }>(undefined)

  if (suspended && !promise.current) {
    throw new Promise((resolve) => {
      promise.current = { resolve }
    })
  }

  if (!suspended && promise.current) {
    promise.current.resolve()
    promise.current = undefined
  }
}
