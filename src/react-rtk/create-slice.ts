import {
  CaseReducer,
  CreateSliceOptions,
  Draft,
  PayloadAction,
  SliceCaseReducers,
  SliceSelectors,
  ValidateSliceCaseReducers,
  createSlice as createSliceOriginal,
} from '@reduxjs/toolkit'
import { PartialObjectByKeys, Prettify, RemoveFirstElement } from './types'

/**
 * Type-safe createSlice with support for custom actions and selectors.
 *
 * @template State State type
 * @template Name Slice name
 * @template Selectors Slice selectors
 * @template ActionReducers Custom reducers
 * @template CaseReducers Case reducers
 * @template ReducerPath Reducer path
 * @param name The slice name
 * @param config Slice configuration (initialState, reducers, actions, selectors, etc)
 * @returns A Redux Toolkit slice
 */
export function createSlice<
  State,
  Name extends string,
  Selectors extends SliceSelectors<State>,
  ActionReducers extends CustomReducers<State>,
  CaseReducers extends SliceCaseReducers<State>,
  ReducerPath extends string = Name,
>(
  name: Name,
  config: Prettify<
    PartialObjectByKeys<
      Omit<
        CreateSliceOptions<State, CaseReducers, Name, ReducerPath, Selectors>,
        'name'
      >,
      'reducers'
    > & { actions: ActionReducers }
  >
) {
  type ActionsCaseReducers = {
    [K in keyof ActionReducers]: CaseReducer<
      State,
      PayloadAction<RemoveFirstElement<Parameters<ActionReducers[K]>>>
    >
  }

  type CombinedCaseReducers = {
    [K in keyof CaseReducers]: K extends keyof ActionsCaseReducers
      ? never
      : CaseReducers[K]
  } & ActionsCaseReducers

  const actionsToReducers = {} as ActionsCaseReducers
  for (const key in config.actions) {
    actionsToReducers[key] = function (
      state: Draft<State>,
      action: PayloadAction<
        RemoveFirstElement<Parameters<ActionReducers[typeof key]>>
      > // strictly type payload
    ) {
      return config.actions[key](state, ...action.payload)
    }
  }

  const sliceConfig = {
    ...config,
    reducers: {
      ...config.reducers,
      ...actionsToReducers,
    } as unknown as ValidateSliceCaseReducers<State, CombinedCaseReducers>,
    name,
  }

  return createSliceOriginal(sliceConfig)
}

/**
 * Type for custom reducers used in createSlice.
 * @template State State type
 */
export type CustomReducers<State> = Record<
  string,
  (state: Draft<State>, ...args: unknown[]) => State | void
>

/**
 * Maps custom reducers to action creators.
 * @template Reducer CustomReducers type
 * @template State State type
 */
export type CustomReducersToActions<
  Reducer extends CustomReducers<State>,
  State = unknown,
> = {
  [K in keyof Reducer]: (
    ...args: RemoveFirstElement<Parameters<Reducer[K]>>
  ) => {
    type: string
    payload: RemoveFirstElement<Parameters<Reducer[K]>>
  }
}
