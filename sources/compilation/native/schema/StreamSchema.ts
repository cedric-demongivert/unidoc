import { EventStreamReducer } from '../reducer/EventStreamReducer'

import { SchemaType } from './SchemaType'
import { Schema } from './Schema'

export type StreamSchema<T> = {
  type: SchemaType,
  description: Schema<T>
}

export namespace StreamSchema {
  export function create <T> (description : Schema<T>) : StreamSchema<T> {
    return {
      type: SchemaType.STREAM,
      description
    }
  }

  /*
  const REDUCER : EventStreamReducer<any, StreamSchema<any>> = (
    EventStreamReducer.object({
      type: EventStreamReducer.token().map(SchemaType.only(SchemaType.STREAM)),
      description: Schema.reducer()
    })
  )

  export function reducer () : EventStreamReducer<any, StreamSchema<any>> {
    return REDUCER
  }*/
}
