import { ListenableUnidocProducer } from '../../producer/ListenableUnidocProducer'

import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocReductionInput } from './UnidocReductionInput'

export class UnidocReductionInputProducer extends ListenableUnidocProducer<UnidocReductionInput> {
  /**
  *
  */
  private readonly _event: UnidocReductionInput

  /**
  * Instantiate a new unidoc event.
  */
  public constructor() {
    super()
    this._event = new UnidocReductionInput()
  }

  /**
  * @see ListenableUnidocProducer.fail
  */
  public fail(error: Error): void {
    super.fail(error)
  }

  /**
  * @see ListenableUnidocProducer.initialize
  */
  public initialize(): void {
    super.initialize()
  }

  /**
  *
  */
  public produceStart(): UnidocReductionInputProducer {
    this.produce(UnidocReductionInput.START)
    return this
  }

  /**
  *
  */
  public produceEvent(event: UnidocEvent): UnidocReductionInputProducer {
    this.produce(this._event.asEvent(event))
    return this
  }

  /**
  *
  */
  public produceGroupStart(group: any): UnidocReductionInputProducer {
    this.produce(this._event.asGroupStart(group))
    return this
  }

  /**
  *
  */
  public produceGroupEnd(group: any): UnidocReductionInputProducer {
    this.produce(this._event.asGroupEnd(group))
    return this
  }

  /**
  *
  */
  public produceEnd(): UnidocReductionInputProducer {
    this.produce(UnidocReductionInput.END)
    return this
  }

  /**
  * @see ListenableUnidocProducer.produce
  */
  public produce(event: UnidocReductionInput = this._event): void {
    super.produce(event)
  }

  /**
  * @see ListenableUnidocProducer.complete
  */
  public complete(): void {
    super.complete()
  }

  /**
  *
  */
  public clear(): void {
    this._event.clear()
    this.removeAllEventListener()
  }
}

export namespace UnidocReductionInputProducer {
  /**
  *
  */
  export function create(): UnidocReductionInputProducer {
    return new UnidocReductionInputProducer()
  }
}
