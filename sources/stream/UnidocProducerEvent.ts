/**
 * Events triggered during the lifecycle of an unidoc producer.
 */
export type UnidocProducerEvent = (
  UnidocProducerEvent.START |
  UnidocProducerEvent.NEXT |
  UnidocProducerEvent.SUCCESS |
  UnidocProducerEvent.FAILURE
)

/**
 * 
 */
export namespace UnidocProducerEvent {
  /**
   * Event triggered just before the production of the first element.
   */
  export type START = 'start'

  /**
   * @see START
   */
  export const START: START = 'start'

  /**
   * Event triggered after the production of an element.
   */
  export type NEXT = 'next'

  /**
   * @see NEXT
   */
  export const NEXT: NEXT = 'next'

  /**
   * Event triggered after the production of the last element.
   */
  export type SUCCESS = 'success'

  /**
   * @see SUCCESS
   */
  export const SUCCESS: SUCCESS = 'success'

  /**
   * Event triggered when an error arise during the production process.
   */
  export type FAILURE = 'failure'

  /**
   * @see FAILURE
   */
  export const FAILURE: FAILURE = 'failure'

  /**
   * 
   */
  export const ALL: UnidocProducerEvent[] = [
    START,
    NEXT,
    SUCCESS,
    FAILURE
  ]
}
