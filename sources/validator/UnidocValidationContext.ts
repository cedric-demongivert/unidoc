import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocValidationProcessEventProducer } from '../validation/UnidocValidationProcessEventProducer'

import { UnidocEventBuffer } from './UnidocEventBuffer'

export class UnidocValidationContext {
  /**
  * Event that is validated.
  */
  public readonly event : UnidocEvent

  /**
  * A buffer with the current and previous events.
  */
  public readonly events : UnidocEventBuffer

  /**
  * An unidoc validation process event producer.
  */
  public readonly output : UnidocValidationProcessEventProducer

  /**
  * Instantiate a new validation context.
  */
  public constructor (capacity : number = 8) {
    this.event = new UnidocEvent()
    this.events = new UnidocEventBuffer(capacity)
    this.output = new UnidocValidationProcessEventProducer()
  }

  public next (event : UnidocEvent) : void {
    this.event.copy(event)
    this.events.push(event)
  }
}
