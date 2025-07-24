# create-react-ctx

A lightweight, type-safe utility for creating React contexts with minimal boilerplate. Eliminates the common pain points of React context setup while maintaining full TypeScript support.

## Features

- 🚀 **Zero boilerplate** - Create contexts in just a few lines
- 🔒 **Type-safe** - Full TypeScript support with automatic type inference
- ⚡ **Lightweight** - Minimal bundle impact
- 🛡️ **Error boundaries** - Built-in provider validation
- 🎯 **Simple API** - Intuitive and developer-friendly

## Installation

```bash
npm install create-react-ctx
# or
yarn add create-react-ctx
# or
pnpm add create-react-ctx
# or
bun add create-react-ctx
```

## API Reference

### createReactCtx

```typescript
function createReactCtx<
  TCtxProps extends object,
  TResult,
  THookProps extends unknown[] = [],
>(
  useProvider: (props: TCtxProps) => TResult,
  useContextHook?: (...input: THookProps) => void
): {
  context: React.Context<TResult>
  Provider: React.FC<TCtxProps & { children: React.ReactNode }>
  useContext: (...input: THookProps) => TResult
}
```

- **`useProvider`**: Function that receives provider props and returns the context value.
- **`useContextHook`**: Optional function that runs every time the context is consumed.
- **Returns**: `{ context, Provider, useContext }`

#### Example

```tsx
const { Provider, useContext } = createReactCtx(
  ({ initial }: { initial: number }) => {
    const [count, setCount] = useState(initial)
    return { count, setCount }
  }
)
```

---

### ErrorBoundary

```typescript
class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode
    fallback:
      | React.ReactNode
      | ((error: Error, errorInfo: React.ErrorInfo) => React.ReactNode)
  },
  {
    error: Error | null
    errorInfo: React.ErrorInfo | null
  }
> {}
```

- **`children`**: React children to render.
- **`fallback`**: ReactNode or function to render on error.

#### Example

```tsx
<ErrorBoundary fallback={<div>Something went wrong</div>}>
  <App />
</ErrorBoundary>
```

---

### useEffectExceptOnMount

```typescript
function useEffectExceptOnMount(
  effect: () => void | (() => void),
  dependencies: React.DependencyList
): void
```

- **`effect`**: Effect callback, same as in `useEffect`.
- **`dependencies`**: Dependency list, same as in `useEffect`.

#### Example

```tsx
useEffectExceptOnMount(() => {
  // Will not run on mount, only on updates
  console.log('Updated!')
}, [value])
```

---

### Redux Toolkit Helpers

#### createSlice

```typescript
function createSlice<State, Name extends string, Selectors, ActionReducers, CaseReducers, ReducerPath extends string = Name>(
  name: Name,
  config: { ... }
): Slice
```

- **Type-safe**: Supports custom reducers and selectors.
- **Actions**: Accepts an `actions` object for custom logic.

#### createStore

```typescript
function createStore<TSlices extends Slice[]>(
  ...slices: TSlices
): [Store, useStore, actions]
```

- **`slices`**: Array of RTK slices.
- **Returns**: `[store, useStore, actions]`

#### createAdvancedStore

```typescript
function createAdvancedStore<
  TSlices extends Slice[],
  TConfig extends Record<string, unknown>,
>(config: TConfig, ...slices: TSlices): [Store, useStore, actions]
```

- **`config`**: Store config (middleware, etc).
- **`slices`**: Array of RTK slices.
- **Returns**: `[store, useStore, actions]`

#### Example

```tsx
const counterSlice = createSlice('counter', {
  initialState: 0,
  actions: {
    increment: (state) => state + 1,
    add: (state, amount: number) => state + amount,
  },
})
const [store, useStore, actions] = createStore(counterSlice)
```

---

### Utility Types

- `Modify<T, R>`: Replace keys in T with R
- `Prettify<T>`: Flatten type
- `RemoveFirstElement<T>`: Remove first tuple element
- `EntriesToObject<T>`: Convert entries to object
- `PartialObjectByKeys<T, K>`: Partial by keys
- `ObjectPath<T>`: Dot notation path for object
- `ObjectPathValue<T, P>`: Value at path

---

## JSDoc

All public functions are documented with JSDoc in the source code for full IntelliSense and type safety.

---

## License

MIT
