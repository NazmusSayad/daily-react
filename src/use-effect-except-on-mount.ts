import { DependencyList, EffectCallback, useEffect, useRef } from 'react'

/**
 * Like React's useEffect, but skips running the effect on the initial mount.
 *
 * @param effect Effect callback (same as useEffect)
 * @param dependencies Dependency list (same as useEffect)
 *
 * @example
 * useEffectExceptOnMount(() => {
 *   // Will not run on mount, only on updates
 *   console.log('Updated!')
 * }, [value])
 */
export function useEffectExceptOnMount(
  effect: EffectCallback,
  dependencies: DependencyList
) {
  const mounted = useRef(false)

  useEffect(() => {
    if (mounted.current) {
      const unmount = effect()
      return typeof unmount === 'function' ? unmount : undefined
    } else {
      mounted.current = true
    }
  }, dependencies)

  useEffect(() => {
    return () => {
      mounted.current = false
    }
  }, [])
}
