/**
* Identifier of a type of unidoc event.
*/
export type UnidocEventType = number

export namespace UnidocEventType {
  export const BLOCK            : number = 0b0000
  export const TAG              : number = 0b0010
  export const WHITESPACE       : number = 0b0100
  export const WORD             : number = 0b0110
  export const DOCUMENT         : number = 0b1000

  export const START            : number = 0b0000
  export const END              : number = 0b0001

  export const DEFAULT_TYPE     : UnidocEventType = 0b0000

  export const START_BLOCK      : UnidocEventType = START | BLOCK
  export const END_BLOCK        : UnidocEventType = END   | BLOCK
  export const START_TAG        : UnidocEventType = START | TAG
  export const END_TAG          : UnidocEventType = END   | TAG
  export const START_DOCUMENT   : UnidocEventType = START | DOCUMENT
  export const END_DOCUMENT     : UnidocEventType = END   | DOCUMENT

  export const ALL              : UnidocEventType[] = [
    START_BLOCK, END_BLOCK, START_TAG, END_TAG, WHITESPACE, WORD,
    START_DOCUMENT, END_DOCUMENT
  ]

  /**
  * Return a string representation of a given unidoc event type.
  *
  * @param value - Unidoc event type to stringify.
  */
  export function toString (value : UnidocEventType) : string {
    switch (value) {
      case START_BLOCK: return 'START_BLOCK'
      case END_BLOCK: return 'END_BLOCK'
      case START_TAG: return 'START_TAG'
      case END_TAG: return 'END_TAG'
      case START_DOCUMENT: return 'START_DOCUMENT'
      case END_DOCUMENT: return 'END_DOCUMENT'
      case WHITESPACE: return 'WHITESPACE'
      case WORD: return 'WORD'
      default: return undefined
    }
  }
}
