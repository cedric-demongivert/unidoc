/**
* Describe the nature of a schema.
*/
export type UnidocSchemaType = number

export namespace UnidocSchemaType {
  /**
  * A tag schema is a schema that describe a validator that MUST accept only one
  * tag of a given type. A tag schema MAY contain a schema that describe the
  * content of the tag to accept, in such a case the resulting validator MUST
  * only accept tag of the requested type with the requested content. If a tag
  * schema does not declare a schema that describe the content of the tag to
  * accept, the resulting validator MUST accept only tags of the requested type
  * without any content.
  */
  export const TAG: UnidocSchemaType = 0

  /**
  * A content schema is a schema that describe a validator that MUST accept one
  * word, one tag or one whitespace.
  */
  export const CONTENT: UnidocSchemaType = 1

  /**
  * A whitespace schema is a schema that describe a validator that MUST accept
  * one whitespace.
  */
  export const WHITESPACE: UnidocSchemaType = 2

  /**
  * A word schema is a schema that describe a validator that MUST accept
  * one word.
  */
  export const WORD: UnidocSchemaType = 3

  /**
  * A disjunction schema is a schema that describe a validator that MUST only
  * accept one type of content among a given set of choices.
  */
  export const DISJUNCTION: UnidocSchemaType = 4

  /**
  * A many schema is a schema that describe a validator that MUST only
  * accept one ore more content of the same type.
  */
  export const MANY: UnidocSchemaType = 5

  /**
  * A nammed schema is a hint that MAY result in the production of a rule when
  * the given schema is encoded.
  */
  export const NAMMED: UnidocSchemaType = 6

  /**
  * A set schema is a schema that describe a validator that MUST accept one
  * instance of each specified type of content only once but in any order.
  */
  export const SET: UnidocSchemaType = 7

  /**
  * A sequence schema is a schema that describe a validator that MUST accept one
  * instance of each specified type of content in a predefined order.
  */
  export const SEQUENCE: UnidocSchemaType = 8

  /**
  * An empty schema is a schema that describe a validator that MUST only accept
  * an empty content.
  */
  export const EMPTY: UnidocSchemaType = 10

  export const ALL: UnidocSchemaType[] = [
    TAG,
    CONTENT,
    WHITESPACE,
    WORD,
    DISJUNCTION,
    MANY,
    NAMMED,
    SET,
    SEQUENCE,
    EMPTY
  ]

  export function toString(type: UnidocSchemaType): string | undefined {
    switch (type) {
      case TAG: return 'TAG'
      case CONTENT: return 'CONTENT'
      case WHITESPACE: return 'WHITESPACE'
      case WORD: return 'WORD'
      case DISJUNCTION: return 'DISJUNCTION'
      case MANY: return 'MANY'
      case NAMMED: return 'NAMMED'
      case SET: return 'SET'
      case SEQUENCE: return 'SEQUENCE'
      case EMPTY: return 'EMPTY'
      default: return undefined
    }
  }
}
