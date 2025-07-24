import { Slice, configureStore } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { CustomReducers, CustomReducersToActions } from './create-slice'
import { EntriesToObject, ObjectPath, ObjectPathValue } from './types'
import { getValueUsingPath } from './utils'

/**
 * Creates a Redux store from one or more slices.
 * @template TSlices Array of slices
 * @param slices The slices to include in the store
 * @returns [store, useStore, actions]
 */
export function createStore<TSlices extends Slice[]>(...slices: TSlices) {
  return createAdvancedStore({}, ...slices)
}

/**
 * Creates an advanced Redux store with custom config and slices.
 * @template TSlices Array of slices
 * @template TConfig Store config type
 * @param config Store configuration (middleware, etc)
 * @param slices The slices to include in the store
 * @returns [store, useStore, actions]
 */
export function createAdvancedStore<
  TSlices extends Slice[],
  TConfig extends Record<string, unknown>,
>(config: TConfig, ...slices: TSlices) {
  type Reducers = EntriesToObject<{
    [I in keyof TSlices]: [TSlices[I]['name'], TSlices[I]['reducer']]
  }>

  type State = {
    [I in keyof Reducers]: ReturnType<Reducers[I]>
  }

  type Actions = EntriesToObject<{
    [I in keyof TSlices]: [
      TSlices[I]['name'],
      TSlices[I] extends { actions: infer A }
        ? A extends CustomReducers<State>
          ? CustomReducersToActions<A, State>
          : unknown
        : unknown,
    ]
  }>

  const reducer = generateReducers(slices) as Reducers
  const store = configureStore<State>({ ...config, reducer })
  const actions = generateActions<typeof store.dispatch, State>(
    store.dispatch,
    slices
  ) as Actions

  function useStore<T extends ((state: State) => unknown) | ObjectPath<State>>(
    path: T
  ) {
    const selectorFn =
      typeof path === 'string'
        ? (state: State) => getValueUsingPath(state, path as ObjectPath<State>)
        : path

    type Value =
      T extends ObjectPath<State>
        ? ObjectPathValue<State, T>
        : T extends (...args: unknown[]) => infer ReturnType
          ? ReturnType
          : never

    return useSelector(selectorFn as (state: State) => Value)
  }

  return [store, useStore, actions] as const
}

function generateReducers(slices: Slice[]): Record<string, unknown> {
  const reducers: Record<string, unknown> = {}
  slices.forEach((slice) => {
    reducers[slice.name] = slice.reducer
  })
  return reducers
}

function generateActions<Dispatch extends (action: unknown) => unknown, _State>(
  dispatch: Dispatch,
  slices: Slice[]
): Record<string, unknown> {
  function wrapActions(
    actions: Record<string, (...args: unknown[]) => unknown>
  ) {
    const newActions: Record<string, unknown> = {}
    for (const key in actions) {
      newActions[key] = (...args: unknown[]) => {
        return dispatch(actions[key](...args))
      }
    }
    return newActions
  }

  const actions: Record<string, unknown> = {}
  slices.forEach((slice) => {
    actions[slice.name] = wrapActions(
      slice.actions as Record<string, (...args: unknown[]) => unknown>
    )
  })

  return actions
}
