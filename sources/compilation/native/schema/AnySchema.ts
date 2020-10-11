import { SchemaType } from './SchemaType'
import { Schema } from './Schema'

export type AnySchema<T> = {
  type: SchemaType,
  description: Schema<T>[]
}

export namespace AnySchema {
  export function create <T> (...description : Schema<T>[]) : AnySchema<T> {
    return createFromArray(description)
  }

  export function createFromArray <T> (description : Schema<T>[]) : AnySchema<T> {
    return {
      type: SchemaType.ANY,
      description
    }
  }
}
