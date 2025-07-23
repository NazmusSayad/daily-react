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

## Quick Start

### 1. Create your context

```tsx
import { useState } from 'react'
import { createReactCtx } from 'create-react-ctx'

const { Provider: AuthProvider, useContext: useAuth } = createReactCtx(
  ({ initialUser }: { initialUser: string }) => {
    const [user, setUser] = useState(initialUser)
    const [isLoading, setIsLoading] = useState(false)

    const login = async (username: string) => {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setUser(username)
      setIsLoading(false)
    }

    const logout = () => {
      setUser('guest')
    }

    return { user, login, logout, isLoading }
  }
)
```

### 2. Wrap your app with the provider

```tsx
function App() {
  return (
    <AuthProvider initialUser="guest">
      <Dashboard />
    </AuthProvider>
  )
}
```

### 3. Use the context anywhere

```tsx
function Dashboard() {
  const { user, login, logout, isLoading } = useAuth()

  return (
    <div>
      <h1>Welcome, {user}!</h1>
      {isLoading && <p>Loading...</p>}
      <div>
        <button onClick={() => login('admin')} disabled={isLoading}>
          Login as Admin
        </button>
        <button onClick={logout} disabled={isLoading}>
          Logout
        </button>
      </div>
    </div>
  )
}
```

## Advanced Usage

### With Context Hook

You can provide an optional hook that runs when the context is consumed:

```tsx
const { Provider: ThemeProvider, useContext: useTheme } = createReactCtx(
  ({ defaultTheme }: { defaultTheme: 'light' | 'dark' }) => {
    const [theme, setTheme] = useState(defaultTheme)

    const toggleTheme = () => {
      setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
    }

    return { theme, toggleTheme }
  },
  // Optional: runs every time context is consumed
  () => {
    console.log('Theme context accessed')
  }
)
```

### Multiple Contexts

Easily compose multiple contexts:

```tsx
function App() {
  return (
    <AuthProvider initialUser="guest">
      <ThemeProvider defaultTheme="light">
        <NotificationProvider>
          <Dashboard />
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
```

### Access Raw Context

If you need direct access to the React context:

```tsx
const { context: AuthContext, Provider, useContext } = createReactCtx()
// ... your provider logic

// Use AuthContext directly with React.useContext if needed
const rawValue = React.useContext(AuthContext)
```

## API

### createReactCtx

```typescript
function createReactCtx<
  TCtxProps extends object,
  TResult,
  THookProps extends unknown[] = []
>(
  useProvider: (props: TCtxProps) => TResult,
  useContextHook?: (...input: THookProps) => void
): {
  context: React.Context<TResult>
  Provider: React.FC<TCtxProps & { children: React.ReactNode }>
  useContext: (...input: THookProps) => TResult
}
```

#### Parameters

- **`useProvider`** - A function that receives props and returns the context value. This is where you define your context logic.
- **`useContextHook`** _(optional)_ - A function that runs every time the context is consumed. Useful for logging, analytics, or side effects.

#### Returns

- **`context`** - The raw React context instance (for advanced use cases)
- **`Provider`** - The context provider component to wrap your app/components
- **`useContext`** - Hook to access the context value anywhere within the provider tree

#### Type Parameters

- **`TCtxProps`** - The props interface for the provider
- **`TResult`** - The return type of your provider function
- **`THookProps`** - Parameters for the optional context hook

## Error Handling

The library includes built-in error boundaries. If you try to use the context outside of a provider, you'll get a helpful error message:

```
Error: useContext must be used within a Provider
```

## TypeScript Support

Full TypeScript support with automatic type inference:

```tsx
// Types are automatically inferred
const { Provider, useContext } = createReactCtx(
  ({ apiKey, baseUrl }: { apiKey: string; baseUrl: string }) => {
    // Return type is automatically inferred
    return {
      apiKey,
      baseUrl,
      makeRequest: (endpoint: string) => fetch(`${baseUrl}${endpoint}`),
    }
  }
)

// useContext return type is automatically typed
const { apiKey, baseUrl, makeRequest } = useContext()
```

## Comparison with Raw React Context

### Before (Raw React Context)

```tsx
// 1. Create context
const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

// 2. Create provider component
function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState(initialUser)

  const login = (username: string) => setUser(username)

  const value = { user, login }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 3. Create custom hook
function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// 4. Export everything
export { AuthProvider, useAuth }
```

### After (with create-react-ctx)

```tsx
const { Provider: AuthProvider, useContext: useAuth } = createReactCtx(
  ({ initialUser }: { initialUser: string }) => {
    const [user, setUser] = useState(initialUser)
    const login = (username: string) => setUser(username)
    return { user, login }
  }
)
```

## License

MIT
