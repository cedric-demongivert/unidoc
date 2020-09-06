export type SchemaType = number

export namespace SchemaType {
  export const SCALAR : SchemaType = 0
  export const OBJECT : SchemaType = 1
  export const STREAM : SchemaType = 2
  export const SWITCH : SchemaType = 3

  export const DEFAULT : SchemaType = SCALAR

  export const ALL : SchemaType[] = [
    SCALAR,
    OBJECT,
    STREAM,
    SWITCH
  ]

  export function toString (value : SchemaType) : string | undefined {
    switch (value) {
      case SCALAR : return 'SCALAR'
      case OBJECT : return 'OBJECT'
      case STREAM : return 'STREAM'
      case SWITCH : return 'SWITCH'
      default     : return undefined
    }
  }

  export function make (value : SchemaType) : any {
    switch (value) {
      case SCALAR : return null
      case SWITCH : return null
      case OBJECT : return {}
      case STREAM : return []
      default     :
        throw new Error(
          'Unable to instantiate value of type #' + value + ' (' +
          toString(value) + ') because this factory does not declare any ' +
          'function for making a value of the given type.'
        )
    }
  }
}
