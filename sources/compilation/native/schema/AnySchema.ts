import { EventStreamReducer } from '../reducer/EventStreamReducer'

import { SchemaType } from './SchemaType'
import { Schema } from './Schema'

export type AnySchema<T> = {
  type: SchemaType,
  description: Schema<T>[]
}

export namespace AnySchema {
  export function create <T> (...description : Schema<T>[]) : AnySchema<T> {
    return {
      type: SchemaType.ANY,
      description
    }
  }

  const REDUCER : EventStreamReducer<any, AnySchema<any>> = (
    EventStreamReducer.object({
      type: EventStreamReducer.token().map(SchemaType.only(SchemaType.ANY)),
      description: EventStreamReducer.stream(Schema.reducer())
    })
  )

  export function reducer () : EventStreamReducer<any, AnySchema<any>> {
    return REDUCER
  }
}
