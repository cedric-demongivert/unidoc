export type UnidocFailureCode = string

export namespace UnidocFailureCode {
  export const EMPTY_STREAM: UnidocFailureCode = 'standard::unidoc::failure::empty-stream'
  export const INVALID_EVENT_INDEX: UnidocFailureCode = 'standard::unidoc::failure::invalid-event-index'

  export const ALL: UnidocFailureCode[] = [
    EMPTY_STREAM,
    INVALID_EVENT_INDEX
  ]

  export namespace InvalidEventIndex {
    export const CODE: UnidocFailureCode = INVALID_EVENT_INDEX
    export const EXPECTED_INDEX: string = 'expected-index'
  }
}
