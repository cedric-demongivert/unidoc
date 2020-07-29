export type UnidocPathElementType = number

export namespace UnidocPathElementType {
  /**
   * The location of a tag in a stream or a file.
   */
  export const TAG    : UnidocPathElementType = 0

  /**
   * The location of a symbol in a stream or a file.
   */
  export const SYMBOL : UnidocPathElementType = 1

  /**
   * The location of a symbol in a stream.
   */
  export const STREAM : UnidocPathElementType = 2

  /**
   * The location of a symbol in a file.
   */
  export const FILE : UnidocPathElementType = 3

  /**
   * The location of a symbol in memory.
   */
  export const MEMORY : UnidocPathElementType = 4

  export const ALL    : UnidocPathElementType[] = [
    TAG,
    SYMBOL,
    STREAM,
    FILE,
    MEMORY
  ]

  export function toString (value : UnidocPathElementType) : string | undefined {
    switch (value)  {
      case TAG    : return 'TAG'
      case SYMBOL : return 'SYMBOL'
      case STREAM : return 'STREAM'
      case FILE   : return 'FILE'
      case MEMORY : return 'MEMORY'
      default     : return undefined
    }
  }
}
