export type SchemaType = number

export namespace SchemaType {
  export const SCALAR : SchemaType = 0
  export const OBJECT : SchemaType = 1
  export const STREAM : SchemaType = 2
  export const SWITCH : SchemaType = 3
  export const ANY    : SchemaType = 4

  export const DEFAULT : SchemaType = SCALAR

  export const ALL : SchemaType[] = [
    SCALAR,
    OBJECT,
    STREAM,
    SWITCH,
    ANY
  ]

  export function toString (value : SchemaType) : string | undefined {
    switch (value) {
      case SCALAR : return 'SCALAR'
      case OBJECT : return 'OBJECT'
      case STREAM : return 'STREAM'
      case SWITCH : return 'SWITCH'
      case ANY    : return 'ANY'
      default     : return undefined
    }
  }

  export function only (value : SchemaType) : (x : string) => SchemaType {
    const str : any = toString(value)

    return function (x : string) : SchemaType {
      if (x.toUpperCase() === str) {
        return value
      } else {
        throw new Error('Invalid schema type, ' + str + ' was expected.')
      }
    }
  }
}
