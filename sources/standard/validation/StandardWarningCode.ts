export type StandardWarningCode = string

export namespace StandardWarningCode {
  export const OPTIONAL_TAG_PRESENCE_PREFERRED : StandardWarningCode = 'standard:warning:optional-tag-presence-preferred'
  export const TAG_PREFERRED_FIRST             : StandardWarningCode = 'standard:warning:tag-preferred-first'

  export const ALL : StandardWarningCode[] = [
    OPTIONAL_TAG_PRESENCE_PREFERRED,
    TAG_PREFERRED_FIRST
  ]
}
