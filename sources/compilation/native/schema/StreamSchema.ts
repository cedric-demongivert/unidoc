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
}
