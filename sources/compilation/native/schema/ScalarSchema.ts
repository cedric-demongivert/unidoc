import { EventStreamReducer } from '../reducer/EventStreamReducer'

import { SchemaType } from './SchemaType'
import { ScalarType } from './ScalarType'

export type ScalarSchema<T> = {
  type: SchemaType,
  description: ScalarType
}

export namespace ScalarSchema {
  export const FLOAT : ScalarSchema<number> = { type: SchemaType.SCALAR, description: ScalarType.FLOAT }
  export const INTEGER : ScalarSchema<number> = { type: SchemaType.SCALAR, description: ScalarType.INTEGER }
  export const TOKEN : ScalarSchema<string> = { type: SchemaType.SCALAR, description: ScalarType.TOKEN }
  export const TEXT : ScalarSchema<string> = { type: SchemaType.SCALAR, description: ScalarType.TEXT }

  export function float () : ScalarSchema<number> {
    return FLOAT
  }

  export function integer () : ScalarSchema<number> {
    return INTEGER
  }

  export function token () : ScalarSchema<string> {
    return TOKEN
  }

  export function text () : ScalarSchema<string> {
    return TEXT
  }

  const REDUCER : EventStreamReducer<any, ScalarSchema<any>> = (
    EventStreamReducer.object({
      type: EventStreamReducer.token().map(SchemaType.only(SchemaType.SCALAR)),
      description: EventStreamReducer.token().map(ScalarType.fromString)
    })
  )

  export function reducer () : EventStreamReducer<any, ScalarSchema<any>> {
    return REDUCER
  }
}
