import * as React from 'react'
import { createContextEZ } from '../src/create-context-v2'

export const [AuthProvider, useAuth, ctx] = createContextEZ(() => {
  const [name, setName] = React.useState('John')
  const [age, setAge] = React.useState(30)

  return { name, age, setName, setAge }
})

export function useGetAuth() {
  const { name, age } = useAuth()
  return { name, age }
}

export function App({}) {
  const { name, age } = useAuth()

  return (
    <div>
      app {name} {age}
    </div>
  )
}
