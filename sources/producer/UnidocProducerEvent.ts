export type UnidocProducerEvent = number

export namespace UnidocProducerEvent {
  export type CompletionEvent = UnidocProducerEvent
  export type ProductionEvent = UnidocProducerEvent

  export const COMPLETION : CompletionEvent = 0
  export const PRODUCTION : ProductionEvent = 1

  export const ALL : UnidocProducerEvent[] = [
    COMPLETION,
    PRODUCTION
  ]

  export function toString (value : UnidocProducerEvent) : string | undefined {
    switch (value) {
      case COMPLETION : return 'COMPLETION'
      case PRODUCTION : return 'PRODUCTION'
      default         : return undefined
    }
  }
}
