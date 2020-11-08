export type UnidocInstructionType = number

export namespace UnidocInstructionType {
  /**
  * An instruction that await an event that describe the begining of a tag.
  */
  export const TAG_START: UnidocInstructionType = 0

  /**
  * An instruction that await an event that describe the termination of a tag.
  */
  export const TAG_END: UnidocInstructionType = 1

  /**
  * An instruction that await a word.
  */
  export const WORD: UnidocInstructionType = 2

  /**
  * An instruction that await a whitespace.
  */
  export const WHITESPACE: UnidocInstructionType = 3

  /**
  * An instruction that accept any kind of event.
  */
  export const ANY: UnidocInstructionType = 4

  /**
  * An instruction that mark the begining of a blueprint fragment.
  */
  export const START_FRAGMENT: UnidocInstructionType = 5

  /**
  * An instruction that mark the termination of a blueprint fragment.
  */
  export const END_FRAGMENT: UnidocInstructionType = 6

  /**
  * An instruction that mark the begining of a repetition block.
  */
  export const START_MANY: UnidocInstructionType = 7

  /**
  * An instruction that mark the termination of a repetition block.
  */
  export const END_MANY: UnidocInstructionType = 8

  /**
  * An instruction that mark the termination of the validation process.
  */
  export const END: UnidocInstructionType = 9

  /**
  * Default instruction type
  */
  export const DEFAULT: UnidocInstructionType = TAG_START

  export const ALL: UnidocInstructionType[] = [
    TAG_START,
    TAG_END,
    WORD,
    WHITESPACE,
    ANY,
    START_FRAGMENT,
    END_FRAGMENT,
    START_MANY,
    END_MANY,
    END
  ]

  export function isControlBegining(value: UnidocInstructionType): boolean {
    switch (value) {
      case START_FRAGMENT:
      case START_MANY:
        return true
      default:
        return false
    }
  }

  export function isControlTermination(value: UnidocInstructionType): boolean {
    switch (value) {
      case END_FRAGMENT:
      case END_MANY:
        return true
      default:
        return false
    }
  }

  export function isAssertion(value: UnidocInstructionType): boolean {
    switch (value) {
      case TAG_START:
      case TAG_END:
      case WORD:
      case WHITESPACE:
      case ANY:
        return true
      default:
        return false
    }
  }

  export function toString(value: UnidocInstructionType): string | undefined {
    switch (value) {
      case TAG_START: return 'TAG_START'
      case TAG_END: return 'TAG_END'
      case WORD: return 'WORD'
      case WHITESPACE: return 'WHITESPACE'
      case ANY: return 'ANY'
      case START_FRAGMENT: return 'START_FRAGMENT'
      case END_FRAGMENT: return 'END_FRAGMENT'
      case START_MANY: return 'START_MANY'
      case END_MANY: return 'END_MANY'
      case END: return 'END'
      default: return undefined
    }
  }
}
