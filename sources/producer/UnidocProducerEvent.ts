/**
* Event that define the lifecycle of an unidoc producer.
*/
export type UnidocProducerEvent = number

export namespace UnidocProducerEvent {
  export type CompletionEvent = UnidocProducerEvent
  export type ProductionEvent = UnidocProducerEvent
  export type InitializationEvent = UnidocProducerEvent
  export type FailureEvent = UnidocProducerEvent

  /**
  * Event triggered just before the production of the first element.
  */
  export const INITIALIZATION : InitializationEvent = 0

  /**
  * Event triggered after the production of an element.
  */
  export const PRODUCTION : ProductionEvent = 1

  /**
  * Event triggered after the production of the last element.
  */
  export const COMPLETION : CompletionEvent = 2

  /**
  * Event triggered when an error arise during the production process.
  */
  export const FAILURE : FailureEvent = 3

  export const ALL : UnidocProducerEvent[] = [
    INITIALIZATION,
    PRODUCTION,
    COMPLETION,
    FAILURE
  ]

  /**
  * Return a string representation of an unidoc producer event.
  *
  * @param value - A producer event.
  *
  * @return A string representation of the given event. 
  */
  export function toString (value : UnidocProducerEvent) : string | undefined {
    switch (value) {
      case INITIALIZATION : return 'INITIALIZATION'
      case PRODUCTION     : return 'PRODUCTION'
      case COMPLETION     : return 'COMPLETION'
      case FAILURE        : return 'FAILURE'
      default             : return undefined
    }
  }
}
