export type UnidocOriginElementType = number

export namespace UnidocOriginElementType {
  /**
  * The runtime origin describe unidoc elements that are generated from nowhere
  * during the execution of a program.
  */
  export const RUNTIME : UnidocOriginElementType = 0

  /**
  * A resource origin describe unidoc elements that are generated from the
  * content of a document described by an unified resource identifier.
  */
  export const RESOURCE : UnidocOriginElementType = 1

  /**
  * The buffer origin describe unidoc elements that are generated from the
  * content of a buffer.
  */
  export const BUFFER : UnidocOriginElementType = 2

  /**
  * The text origin describe unidoc elements that are generated from the
  * content of a document made of symbols.
  */
  export const TEXT : UnidocOriginElementType = 3

  /**
  * The network origin describe unidoc elements that are generated from the
  * content of a network connection.
  */
  export const NETWORK : UnidocOriginElementType = 4

  export const ALL : UnidocOriginElementType[] = [
    RUNTIME,
    RESOURCE,
    BUFFER,
    TEXT,
    NETWORK
  ]

  export function toString (value : UnidocOriginElementType) : string | undefined{
    switch (value) {
      case RUNTIME  : return 'RUNTIME'
      case RESOURCE : return 'RESOURCE'
      case BUFFER   : return 'BUFFER'
      case TEXT     : return 'TEXT'
      case NETWORK  : return 'NETWORK'
      default       : return undefined
    }
  }
}
