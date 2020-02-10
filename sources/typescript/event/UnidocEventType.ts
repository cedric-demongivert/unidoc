/**
* Identifier of a type of unidoc event.
*/
export type UnidocEventType = number

export namespace UnidocEventType {
  export const BLOCK      : number = 0b0000
  export const TAG        : number = 0b0100
  export const WHITESPACE : number = 0b0010
  export const WORD       : number = 0b0110
  export const DOCUMENT   : number = 0b0001

  export const START      : number = 0b0
  export const END        : number = 0b1

  export const START_BLOCK      : UnidocEventType = START | BLOCK
  export const END_BLOCK        : UnidocEventType = END   | BLOCK
  export const START_TAG        : UnidocEventType = START | TAG
  export const END_TAG          : UnidocEventType = END   | TAG
  export const START_WHITESPACE : UnidocEventType = START | WHITESPACE
  export const END_WHITESPACE   : UnidocEventType = END   | WHITESPACE
  export const START_WORD       : UnidocEventType = START | WORD
  export const END_WORD         : UnidocEventType = END   | WORD
  export const START_DOCUMENT   : UnidocEventType = START | DOCUMENT
  export const END_DOCUMENT     : UnidocEventType = END   | DOCUMENT

  export const ALL              : UnidocEventType[] = [
    START_BLOCK, END_BLOCK, START_TAG, END_TAG, START_WHITESPACE,
    END_WHITESPACE, START_WORD, END_WORD, START_DOCUMENT, END_DOCUMENT
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
      case START_WHITESPACE: return 'START_WHITESPACE'
      case END_WHITESPACE: return 'END_WHITESPACE'
      case START_WORD: return 'START_WORD'
      case END_WORD: return 'END_WORD'
      case START_DOCUMENT: return 'START_DOCUMENT'
      case END_DOCUMENT: return 'END_DOCUMENT'
      default: return undefined
    }
  }
}
