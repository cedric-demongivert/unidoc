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

  export function create <T> (type : ScalarType) : ScalarSchema<T> {
    switch (type) {
      case ScalarType.TOKEN:
        return TOKEN
      case ScalarType.TEXT:
        return TEXT
      case ScalarType.FLOAT:
        return FLOAT
      case ScalarType.INTEGER:
        return INTEGER
      case ScalarType.DOUBLE:
      case ScalarType.BYTE:
      case ScalarType.SHORT:
      case ScalarType.LONG:
      default:
        throw new Error(
          'Unable to create a scalar schema for scalar type #' + type + ' (' +
          ScalarType.toString(type) + ') because the given type is not ' +
          'supported at this time.'
        )
    }
  }

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
}
