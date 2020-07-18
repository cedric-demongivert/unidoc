export type HTMLEventType = number

export namespace HTMLEventType {
  export const WHITESPACE : HTMLEventType = 0
  export const WORD : HTMLEventType = 1
  export const START_TAG : HTMLEventType = 2
  export const END_TAG : HTMLEventType = 3
  export const COMMENT : HTMLEventType = 4

  export const ALL : HTMLEventType[] = [
    WHITESPACE, WORD, START_TAG, END_TAG, COMMENT
  ]

  export function toString (type : HTMLEventType) : string {
    switch (type) {
      case WHITESPACE : return 'WHITESPACE'
      case WORD       : return 'WORD'
      case START_TAG  : return 'START_TAG'
      case END_TAG    : return 'END_TAG'
      case COMMENT    : return 'COMMENT'
      default         : return undefined
    }
  }
}
