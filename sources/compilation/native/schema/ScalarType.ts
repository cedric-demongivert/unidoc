export type ScalarType = number

export namespace ScalarType {
  export const FLOAT : ScalarType = 0
  export const DOUBLE : ScalarType = 1
  export const BYTE : ScalarType = 2
  export const SHORT : ScalarType = 3
  export const INTEGER : ScalarType = 4
  export const LONG : ScalarType = 5
  export const TOKEN : ScalarType = 6
  export const TEXT : ScalarType = 7

  export const ALL : ScalarType[] = [
    FLOAT,
    DOUBLE,
    BYTE,
    SHORT,
    INTEGER,
    LONG,
    TOKEN,
    TEXT
  ]

  export function toString (value : ScalarType) : string | undefined {
    switch (value) {
      case FLOAT   : return 'FLOAT'
      case DOUBLE  : return 'DOUBLE'
      case BYTE    : return 'BYTE'
      case SHORT   : return 'SHORT'
      case INTEGER : return 'INTEGER'
      case LONG    : return 'LONG'
      case TOKEN   : return 'TOKEN'
      case TEXT    : return 'TEXT'
      default      : return undefined
    }
  }

  export function fromString (value : string) : ScalarType {
    switch (value.toUpperCase()) {
      case 'FLOAT'   : return FLOAT
      case 'DOUBLE'  : return DOUBLE
      case 'BYTE'    : return BYTE
      case 'SHORT'   : return SHORT
      case 'INTEGER' : return INTEGER
      case 'LONG'    : return LONG
      case 'TOKEN'   : return TOKEN
      case 'TEXT'    : return TEXT
      default        : throw new Error(
        'The string "' + value + '" is not a valid scalar type, valid scalar ' +
        'types are : ' + ALL.map(toString).join(', ') + '.'
      )
    }
  }
}
