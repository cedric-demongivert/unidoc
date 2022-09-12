/**
 * Identifier of a type of unidoc event.
 */
export type UnidocEventType = number

export namespace UnidocEventType {
  /**
  *
  */
  export const TAG: number = 0b000

  /**
  *
  */
  export const WHITESPACE: number = 0b100

  /**
  *
  */
  export const WORD: number = 0b110

  /**
  *
  */
  export const START: number = 0b000

  /**
  *
  */
  export const END: number = 0b001


  /**
  *
  */
  export const DEFAULT_TYPE: UnidocEventType = 0b000

  /**
  *
  */
  export const START_TAG: UnidocEventType = START | TAG

  /**
  *
  */
  export const END_TAG: UnidocEventType = END | TAG

  /**
  *
  */
  export const ALL: UnidocEventType[] = [
    START_TAG, END_TAG, WHITESPACE, WORD
  ]

  /**
  * Return a string representation of a given unidoc event type.
  *
  * @param value - Unidoc event type to stringify.
  */
  export function toString(value: UnidocEventType): string | undefined {
    switch (value) {
      case START_TAG: return 'START_TAG'
      case END_TAG: return 'END_TAG'
      case WHITESPACE: return 'WHITESPACE'
      case WORD: return 'WORD'
      default: return undefined
    }
  }

  /**
   * 
   */
  export function toSignature(value: UnidocEventType): string | undefined {
    switch (value) {
      case START_TAG: return 'ST'
      case END_TAG: return 'ET'
      case WHITESPACE: return 'WC'
      case WORD: return 'WD'
      default: return undefined
    }
  }

  /**
  *
  */
  export function toDebugString(value: UnidocEventType): string | undefined {
    return '#' + value + ' (' + (toString(value) || 'undefined') + ')'
  }
}
