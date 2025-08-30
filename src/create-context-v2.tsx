import * as React from 'react'
import { PrettifyRecord } from './utils.type'

/**
 * @description Create a context with very easy to use hook
 *
 * @example
 * ```tsx
 * const [CounterProvider, useCounter] = createContextEZ(() => {
 *   const [count, setCount] = useState(0)
 *
 *   return {
 *    count,
 *    setCount,
 *   }
 * })
 *
 * function App() {
 *   return (
 *     <CounterProvider>
 *       <Counter />
 *     </CounterProvider>
 *   )
 * }
 *
 * function Counter() {
 *   const { count, setCount } = useCounter()
 *   return <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
 * }
 * ```
 */
export function createContextEZ<const TInput extends object, const TOutput>(
  useValue: (props: TInput) => TOutput,
  options?: CreateContextOptions<TInput, TOutput>
) {
  const displayName = options?.displayName ?? 'Daily Context'
  const nativeContext = React.createContext(options?.initialValue)

  function useContext(): PrettifyRecord<NoInfer<TOutput>> {
    const context = React.useContext(nativeContext)

    if (context === undefined) {
      throw new Error(`${displayName}: Used outside of its provider`)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return context as any
  }

  function ContextProvider({
    children,
    ...props
  }: React.PropsWithChildren<TInput>) {
    return (
      <nativeContext.Provider value={useValue(props as TInput)}>
        {children}
      </nativeContext.Provider>
    )
  }

  nativeContext.displayName = displayName
  ContextProvider.displayName = `${displayName} Provider`

  return [ContextProvider, useContext, nativeContext] as const
}

type CreateContextOptions<_TInput, TOutput> = {
  displayName?: string
  initialValue?: NoInfer<TOutput>
}
