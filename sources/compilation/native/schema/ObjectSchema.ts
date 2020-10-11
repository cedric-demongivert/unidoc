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
}
