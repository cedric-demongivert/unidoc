export type UnidocPathElementType = number

export namespace UnidocPathElementType {
  export const TAG    : UnidocPathElementType = 0
  export const SYMBOL : UnidocPathElementType = 1

  export const ALL    : UnidocPathElementType[] = [
    TAG,
    SYMBOL
  ]

  export function toString (value : UnidocPathElementType) : string {
    switch (value)  {
      case TAG    : return 'TAG'
      case SYMBOL : return 'SYMBOL'
      default     : return undefined
    }
  }
}
