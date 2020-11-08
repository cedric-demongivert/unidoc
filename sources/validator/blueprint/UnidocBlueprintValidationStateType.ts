export type UnidocBlueprintValidationStateType = number

export namespace UnidocBlueprintValidationStateType {
  export const MANY: UnidocBlueprintValidationStateType = 0
  export const STACK: UnidocBlueprintValidationStateType = 1

  export const DEFAULT: UnidocBlueprintValidationStateType = MANY

  export const ALL: UnidocBlueprintValidationStateType[] = [
    MANY,
    STACK
  ]

  export function toString(value: UnidocBlueprintValidationStateType): string | undefined {
    switch (value) {
      case MANY: return 'MANY'
      case STACK: return 'STACK'
      default: return undefined
    }
  }
}
