import { SchemaType } from './SchemaType'

export type Schema<T> = {
  type: SchemaType,
  description: any
}

export namespace Schema {
  export const FLOAT : Schema<number> = { type: SchemaType.SCALAR, description: 'float' }
  export const INTEGER : Schema<number> = { type: SchemaType.SCALAR, description: 'integer' }
  export const STRING : Schema<string> = { type: SchemaType.SCALAR, description: 'string' }

  export function number () : Schema<number> {
    return FLOAT
  }

  export function float () : Schema<number> {
    return FLOAT
  }

  export function integer () : Schema<number> {
    return INTEGER
  }

  export function string () : Schema<string> {
    return STRING
  }

  export function scalar<T> (description : Schema<T>) : Schema<T[]> {
    return {
      type: SchemaType.SCALAR,
      description
    }
  }

  export function tags<T> (description : any) : Schema<T[]> {
    return {
      type: SchemaType.SWITCH,
      description
    }
  }

  export function stream<T> (description : Schema<T>) : Schema<T[]> {
    return {
      type: SchemaType.STREAM,
      description
    }
  }

  export function object <T> (description : any) : Schema<T> {
    return {
      type: SchemaType.OBJECT,
      description
    }
  }
}
