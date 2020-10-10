import { EventStreamReducer } from '../reducer/EventStreamReducer'

import { SchemaType } from './SchemaType'
import { Schema } from './Schema'

export type ObjectSchema<T> = {
  type: SchemaType,
  description: {
    [key : string] : Schema<any>
  }
}

export namespace ObjectSchema {
  export function create <T> (description : { [key : string] : Schema<any> }) : ObjectSchema<T> {
    return {
      type: SchemaType.OBJECT,
      description
    }
  }

  const REDUCER : EventStreamReducer<any, ObjectSchema<any>> = (
    EventStreamReducer.object({
      type: EventStreamReducer.token().map(SchemaType.only(SchemaType.OBJECT)),
      description: EventStreamReducer.object({ '*': Schema.reducer() })
    })
  )

  export function reducer () : EventStreamReducer<any, ObjectSchema<any>> {
    return REDUCER
  }
}
