import { ListenableUnidocProducer } from '../producer/ListenableUnidocProducer'
import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocValidation } from './UnidocValidation'
import { UnidocValidationProcessEvent } from './UnidocValidationProcessEvent'

export class UnidocValidationProcessEventProducer extends ListenableUnidocProducer<UnidocValidationProcessEvent> {
  private readonly _event : UnidocValidationProcessEvent

  /**
  * Instantiate a new unidoc event.
  */
  public constructor () {
    super()
    this._event = new UnidocValidationProcessEvent()
  }

  public fromEvent (event : UnidocEvent) : UnidocValidationProcessEventProducer {
    this._event.event.copy(event)
    return this
  }

  public produceSequenceStart () : UnidocValidationProcessEventProducer {
    this._event.asSequenceStart()

    this.produce(this._event)

    return this
  }

  public produceSequenceEnd () : UnidocValidationProcessEventProducer {
    this._event.asSequenceEnd()

    this.produce(this._event)

    return this
  }

  public produceForkStart () : UnidocValidationProcessEventProducer {
    this._event.asSequenceEnd()

    this.produce(this._event)

    return this
  }

  public produceForkEnd () : UnidocValidationProcessEventProducer {
    this._event.asSequenceEnd()

    this.produce(this._event)

    return this
  }

  public produceValidation () : UnidocValidationProcessEventProducer {
    this._event.asValidation()

    this.produce(this._event)

    return this
  }

  public produceMessage (message : UnidocValidation) : UnidocValidationProcessEventProducer {
    this._event.asMessage(message)

    this.produce(this._event)

    return this
  }

  /**
  * @see ListenableUnidocProducer.complete
  */
  public complete () : void {
    super.complete()
  }
}

export namespace UnidocValidationProcessEventProducer {
  export function create () : UnidocValidationProcessEventProducer {
    return new UnidocValidationProcessEventProducer()
  }
}
