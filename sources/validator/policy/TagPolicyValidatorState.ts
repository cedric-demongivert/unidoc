export type TagPolicyValidatorState = number

export namespace TagPolicyValidatorState {
  export const BEFORE_TAG : TagPolicyValidatorState = 0
  export const WITHIN_TAG : TagPolicyValidatorState = 1
  export const AFTER_TAG  : TagPolicyValidatorState = 2
  export const IN_ERROR   : TagPolicyValidatorState = 3

  export const ALL : TagPolicyValidatorState[] = [
    BEFORE_TAG,
    WITHIN_TAG,
    AFTER_TAG,
    IN_ERROR
  ]

  export function toString (value : TagPolicyValidatorState) : string | undefined {
    switch (value) {
      case BEFORE_TAG : return 'BEFORE_TAG'
      case WITHIN_TAG : return 'WITHIN_TAG'
      case AFTER_TAG  : return 'AFTER_TAG'
      case IN_ERROR   : return 'IN_ERROR'
      default         : return undefined
    }
  }
}
