export type UnidocBlueprintType = number

export namespace UnidocBlueprintType {
  /**
  * A blueprint that describe a specification that match unidoc documents that
  * contains only one unidoc event.
  */
  export const EVENT: UnidocBlueprintType = 1

  /**
  * A blueprint that describe a specification that match unidoc documents that
  * are the repeatition of another type of unidoc document.
  */
  export const MANY: UnidocBlueprintType = 32

  /**
  * A blueprint that describe a choice between multiple contents.
  */
  export const DISJUNCTION: UnidocBlueprintType = 3

  /**
  * A blueprint that describe multiple contents that must exists but that can
  * appears in any order.
  */
  export const SET: UnidocBlueprintType = 4

  /**
  *
  */
  export const SEQUENCE: UnidocBlueprintType = 5

  /**
  * A blueprint that describe multiple contents that we prefer to get in
  * sequence
  */
  export const LENIENT_SEQUENCE: UnidocBlueprintType = 6

  /**
  * A blueprint that describe the termination of the document, or a termination
  * of the current blueprint fragment.
  */
  export const END: UnidocBlueprintType = 7

  /**
  * A blueprint that describe a tag.
  */
  export const TAG: UnidocBlueprintType = 8

  /**
  * Default blueprint type
  */
  export const DEFAULT: UnidocBlueprintType = EVENT

  /**
  * All existing blueprint types.
  */
  export const ALL: UnidocBlueprintType[] = [
    EVENT,
    MANY,
    DISJUNCTION,
    SET,
    SEQUENCE,
    LENIENT_SEQUENCE,
    END,
    TAG
  ]

  export function toString(value: UnidocBlueprintType): string | undefined {
    switch (value) {
      case EVENT: return 'EVENT'
      case MANY: return 'MANY'
      case DISJUNCTION: return 'DISJUNCTION'
      case SET: return 'SET'
      case SEQUENCE: return 'SEQUENCE'
      case LENIENT_SEQUENCE: return 'LENIENT_SEQUENCE'
      case END: return 'END'
      case TAG: return 'TAG'
      default: return undefined
    }
  }
}
