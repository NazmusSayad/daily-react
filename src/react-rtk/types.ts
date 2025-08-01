export type Modify<T, R> = Omit<T, keyof R> & R

export type Prettify<T extends object> = {
  [Key in keyof T]: T[Key]
} & {}

export type RemoveFirstElement<T extends unknown[]> = T extends [
  infer _,
  ...infer Rest,
]
  ? Rest
  : never

export type EntriesToObject<T extends [string, unknown][]> = {
  [K in T[number][0]]: Extract<T[number], [K, unknown]>[1]
}

export type PartialObjectByKeys<
  T extends Record<string, unknown>,
  TKeys extends keyof T,
> = Prettify<
  Omit<T, TKeys> & {
    [K in TKeys]?: T[K]
  }
>

export type ObjectPath<T> =
  T extends Record<string, unknown>
    ? {
        [K in keyof T]: K extends string
          ? T[K] extends Record<string, unknown>
            ? `${K}` | `${K}.${ObjectPath<T[K]>}`
            : `${K}`
          : never
      }[keyof T]
    : never

export type ObjectPathValue<
  T,
  P extends string,
> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rest extends ObjectPath<T[K]>
      ? ObjectPathValue<T[K], Rest>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never
