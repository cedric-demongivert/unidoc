import { EventStreamReducer } from '../reducer/EventStreamReducer'

import { SchemaType } from './SchemaType'
import { Schema } from './Schema'

export type SwitchSchema<T> = {
  type: SchemaType,
  description: {
    [key : string] : Schema<any>
  }
}

export namespace SwitchSchema {
  export function create <T> (description : { [key : string] : Schema<any> }) : SwitchSchema<T> {
    return {
      type: SchemaType.SWITCH,
      description
    }
  }

  const REDUCER : EventStreamReducer<any, SwitchSchema<any>> = (
    EventStreamReducer.object({
      type: EventStreamReducer.token().map(SchemaType.only(SchemaType.SWITCH)),
      description: EventStreamReducer.object({ '*': Schema.reducer() })
    })
  )

  export function reducer () : EventStreamReducer<any, SwitchSchema<any>> {
    return REDUCER
  }
}
