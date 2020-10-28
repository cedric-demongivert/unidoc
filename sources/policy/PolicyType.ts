/**
* Describe the nature of a policy.
*/
export type PolicyType = number

export namespace PolicyType {
  /**
  * Document policies are policies that describe an entire document.
  */
  export const DOCUMENT : PolicyType = 0

  /**
  * Tag policies are policies that require the apparition of a particular tag in
  * a given point of an unidoc document.
  */
  export const TAG : PolicyType = 1

  /**
  * Anything policies are policies that accepts any content.
  */
  export const ANYTHING : PolicyType = 2

  /**
  * Reference policies allows to "duplicate" the behavior of an existing nammed
  * policy.
  */
  export const REFERENCE : PolicyType = 3

  /**
  * Sequence policies are policies that await an arbitrary number of structures
  * in a predefined order. Sequence policies can be marked as leniant, and in
  * this case can allows the usage of any order of apparition. A leniant
  * sequence will emit a warning message if the predefined order is not
  * respected.
  */
  export const SEQUENCE : PolicyType = 4

  /**
  * Token policies are policies that await for only one consecutive chain of
  * non-space characters that may, or not, follow a particular format in the
  * form of a regexp.
  */
  export const TOKEN : PolicyType = 5

  /**
  * Optional policies are policies that can be ignored, but that throw an error
  * if they begin a match that fails that can't be pursued by another policy.
  */
  export const OPTIONAL : PolicyType = 6

  export const ALL : PolicyType[] = [
    DOCUMENT,
    TAG,
    ANYTHING,
    REFERENCE,
    SEQUENCE,
    TOKEN,
    OPTIONAL
  ]

  export function toString (type : PolicyType) : string | undefined {
    switch (type) {
      case DOCUMENT  : return 'DOCUMENT'
      case TAG       : return 'TAG'
      case ANYTHING  : return 'ANYTHING'
      case REFERENCE : return 'REFERENCE'
      case SEQUENCE  : return 'SEQUENCE'
      case TOKEN     : return 'TOKEN'
      case OPTIONAL  : return 'OPTIONAL'
      default        : return undefined
    }
  }
}
