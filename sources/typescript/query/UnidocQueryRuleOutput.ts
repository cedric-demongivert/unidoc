export type UnidocQueryRuleOutput = number

export namespace UnidocQueryRuleOutput {
  export const FAILURE : UnidocQueryRuleOutput = 0
  export const SUCCESS : UnidocQueryRuleOutput = 1
  export const AWAIT   : UnidocQueryRuleOutput = 2

  export const ALL : UnidocQueryRuleOutput[] = [
    FAILURE,
    SUCCESS,
    AWAIT
  ]

  export function toString (value : UnidocQueryRuleOutput) : string {
    switch (value) {
      case FAILURE : return 'FAILURE'
      case SUCCESS : return 'SUCCESS'
      case AWAIT   : return 'AWAIT'
      default      : return undefined
    }
  }
}
