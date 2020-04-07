export type UnidocPathElementType = number

export namespace UnidocPathElementType {
  export const BLOCK  : UnidocPathElementType = 0
  export const TAG    : UnidocPathElementType = 1
  export const SYMBOL : UnidocPathElementType = 2

  export const ALL    : UnidocPathElementType[] = [
    BLOCK,
    TAG,
    SYMBOL
  ]

  export function toString (value : UnidocPathElementType) : string {
    switch (value) {
      case BLOCK  : return 'BLOCK'
      case TAG    : return 'TAG'
      case SYMBOL : return 'SYMBOL'
      default     : return undefined
    }
  }
}
