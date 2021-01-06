export type UnidocSingleBlueprintReducingStep = number

export namespace UnidocSingleBlueprintReducingStep {
  /**
  *
  */
  export const LEADING: UnidocSingleBlueprintReducingStep = 0

  /**
  *
  */
  export const CONTENT: UnidocSingleBlueprintReducingStep = 1

  /**
  *
  */
  export const TRAILING: UnidocSingleBlueprintReducingStep = 2

  /**
  *
  */
  export const DEFAULT: UnidocSingleBlueprintReducingStep = LEADING

  /**
  *
  */
  export const ALL: UnidocSingleBlueprintReducingStep[] = [
    LEADING,
    CONTENT,
    TRAILING
  ]

  /**
  *
  */
  export function toString(value: UnidocSingleBlueprintReducingStep): string | undefined {
    switch (value) {
      case LEADING: return 'LEADING'
      case CONTENT: return 'CONTENT'
      case TRAILING: return 'TRAILING'
      default: return undefined
    }
  }

  /**
  *
  */
  export function toDebugString(value: UnidocSingleBlueprintReducingStep): string {
    return '#' + value + ' (' + (toString(value) || 'undefined') + ')'
  }
}
