export type HTMLContentType = number

export namespace HTMLContentType {
  export const BLOCK_START : HTMLContentType = 0
  export const BLOCK_END : HTMLContentType = 1
  export const INLINE : HTMLContentType = 2
  export const DOCUMENT_START : HTMLContentType = 3
  export const COMMENT : HTMLContentType = 4

  export const ALL : HTMLContentType[] = [
    BLOCK_START,
    BLOCK_END,
    INLINE,
    DOCUMENT_START,
    COMMENT
  ]

  export function toString (type : HTMLContentType) : string {
    switch (type) {
      case DOCUMENT_START : return 'DOCUMENT_START'
      case BLOCK_START    : return 'BLOCK_START'
      case BLOCK_END      : return 'BLOCK_END'
      case INLINE         : return 'INLINE'
      case COMMENT        : return 'COMMENT'
      default             : return undefined
    }
  }
}
