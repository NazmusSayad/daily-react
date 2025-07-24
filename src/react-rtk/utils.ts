import { ObjectPath, ObjectPathValue } from './types'

export function getValueUsingPath<
  T extends Record<string, unknown>,
  P extends ObjectPath<T>,
>(obj: T, key: P): ObjectPathValue<T, P> {
  const keys = key.split('.') as (keyof T & string)[]
  let result: unknown = obj

  for (const k of keys) {
    result = (result as Record<string, unknown>)[k]
  }

  return result as ObjectPathValue<T, P>
}
