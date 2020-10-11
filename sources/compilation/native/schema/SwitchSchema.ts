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
}
