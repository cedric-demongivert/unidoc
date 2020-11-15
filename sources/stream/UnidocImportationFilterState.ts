export type UnidocImportationFilterState = number

export namespace UnidocImportationFilterState {
  export const CONTENT: UnidocImportationFilterState = 0
  export const IMPORTATION_START: UnidocImportationFilterState = 1
  export const IMPORTATION_CONTENT: UnidocImportationFilterState = 2
  export const IMPORTATION_TRAILING_WHITESPACE: UnidocImportationFilterState = 3

  export const ALL: UnidocImportationFilterState[] = [
    CONTENT,
    IMPORTATION_START,
    IMPORTATION_CONTENT,
    IMPORTATION_TRAILING_WHITESPACE
  ]

  export function toString(value: UnidocImportationFilterState): string | undefined {
    switch (value) {
      case CONTENT: return 'CONTENT'
      case IMPORTATION_START: return 'IMPORTATION_START'
      case IMPORTATION_CONTENT: return 'IMPORTATION_CONTENT'
      case IMPORTATION_TRAILING_WHITESPACE: return 'IMPORTATION_TRAILING_WHITESPACE'
      default: return undefined
    }
  }
}
