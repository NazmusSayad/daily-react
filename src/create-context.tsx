import * as React from 'react'

export function createContext<
  TCtxProps extends object,
  TResult,
  THookProps extends unknown[] = []
>(
  useProvider: (props: TCtxProps) => TResult,
  useContextHook: (...input: THookProps) => void = () => {}
) {
  const ctx = React.createContext<NoInfer<TResult>>(
    undefined as NoInfer<TResult>
  )

  function useContext(...input: THookProps) {
    const context = React.useContext(ctx)
    if (!context) throw new Error('useContext must be used within a Provider')

    useContextHook(...input)
    return context
  }

  function ContextProvider({
    children,
    ...props
  }: TCtxProps & { children: React.ReactNode }) {
    const value = useProvider(props as TCtxProps)
    return <ctx.Provider value={value}>{children}</ctx.Provider>
  }

  return {
    context: ctx,
    Provider: ContextProvider,
    useContext: useContext as (...input: THookProps) => TResult,
  }
}
