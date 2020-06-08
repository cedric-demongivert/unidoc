export type StandardErrorCode = string

export namespace StandardErrorCode {
  export const FORBIDDEN_CONTENT : StandardErrorCode = 'standard:error:forbidden-content'
  export const NOT_ENOUGH_TAG : StandardErrorCode = 'standard:error:not-enough-tag'
  export const TOO_MANY_TAG : StandardErrorCode = 'standard:error:too-many-tag'

  export const ALL : StandardErrorCode[] = [
    FORBIDDEN_CONTENT,
    NOT_ENOUGH_TAG,
    TOO_MANY_TAG
  ]
}
