export type UnidocOriginType = number

export namespace UnidocOriginType {
  /**
  * The runtime origin describe unidoc elements that are generated from nowhere
  * during the execution of a program.
  */
  export const RUNTIME : UnidocOriginType = 0

  /**
  * A resource origin describe unidoc elements that are generated from the
  * content of a document described by an unified resource identifier.
  */
  export const RESOURCE : UnidocOriginType = 1

  /**
  * The buffer origin describe unidoc elements that are generated from the
  * content of a buffer.
  */
  export const BUFFER : UnidocOriginType = 2

  /**
  * The text origin describe unidoc elements that are generated from the
  * content of a document made of symbols.
  */
  export const TEXT : UnidocOriginType = 3

  /**
  * The network origin describe unidoc elements that are generated from the
  * content of a network connection.
  */
  export const NETWORK : UnidocOriginType = 4

  /**
  * The RANGE origin describe unidoc elements that are generated from a
  * continuity between two origins.
  */
  export const RANGE : UnidocOriginType = 5

  export const ALL : UnidocOriginType[] = [
    RUNTIME,
    RESOURCE,
    BUFFER,
    TEXT,
    NETWORK,
    RANGE
  ]

  export function toString (value : UnidocOriginType) : string | undefined{
    switch (value) {
      case RUNTIME  : return 'RUNTIME'
      case RESOURCE : return 'RESOURCE'
      case BUFFER   : return 'BUFFER'
      case TEXT     : return 'TEXT'
      case NETWORK  : return 'NETWORK'
      case RANGE    : return 'RANGE'
      default       : return undefined
    }
  }
}
