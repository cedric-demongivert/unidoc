export type PolicyErrorMessage = string

export namespace PolicyErrorMessage {
  export const EXPECTED_CONTENT : PolicyErrorMessage = 'standard::policy::error::expected-content'
  export const INVALID_CONTENT : PolicyErrorMessage = 'standard::policy::error::invalid-content'
  export const SUPERFLUOUS_CONTENT : PolicyErrorMessage = 'standard::policy::error::superfluous-content'
  export const WRONG_TAG_TYPE : PolicyErrorMessage = 'standard::policy::error::wrong-tag-type'
  export const NULL_POLICY : PolicyErrorMessage = 'standard::policy::error::null-policy'
  export const UNCLOSED_TAG : PolicyErrorMessage = 'standard::policy::error::unclosed-tag'

  export const ALL : PolicyErrorMessage[] = [
    EXPECTED_CONTENT,
    INVALID_CONTENT,
    SUPERFLUOUS_CONTENT,
    WRONG_TAG_TYPE,
    NULL_POLICY,
    UNCLOSED_TAG
  ]

  export namespace NullPolicy {
    export const EVENT : string = 'event'
    export const METHOD : string = 'method'
  }

  export namespace InvalidContent {
    export const EVENT : string = 'event'
    export const POLICY : string = 'policy'
  }

  export namespace ExpectedContent {
    export const EVENT : string = 'event'
    export const POLICY : string = 'policy'
  }

  export namespace SuperfluousContent {
    export const EVENT : string = 'event'
    export const POLICY : string = 'policy'
  }

  export namespace UnclosedTag {
    export const EVENT : string = 'event'
    export const METHOD : string = 'method'
  }
}
