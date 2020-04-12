export type StandardErrorCode = string

export namespace StandardErrorCode {
  export const COMPOSITION_ERROR : StandardErrorCode = 'standard:error:composition'

  export const ALL : StandardErrorCode[] = [
    COMPOSITION_ERROR
  ]
}
