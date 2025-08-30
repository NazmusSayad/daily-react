export type Prettify<T extends object> = {
  [Key in keyof T]: T[Key]
} & {}

export type PrettifyRecord<T> =
  T extends Record<string, unknown> ? Prettify<T> : T
