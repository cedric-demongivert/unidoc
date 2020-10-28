import { Sequence } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../../event/UnidocEvent'
import { UnidocValidation } from '../../validation/UnidocValidation'

import { ValidationState } from './ValidationState'

export class ValidationContext {
  /**
  * The current state of the validation process.
  */
  public state : ValidationState

  /**
  * Index of the last state modification.
  */
  public stateIndex : number

  /**
  * Event that is validated.
  */
  public readonly event : UnidocEvent

  /**
  * A validation object to use for emitting new events.
  */
  public readonly message : UnidocValidation

  /**
  * A view over the buffer that contains each new message that are available.
  */
  public readonly messages : Sequence<UnidocValidation>

  /**
  * A buffer that contains each new message that are available.
  */
  private readonly _messages : Pack<UnidocValidation>

  /**
  * Instantiate a new validation context.
  */
  public constructor (capacity : number = 8) {
    this.state = ValidationState.VALID
    this.stateIndex = 0

    this.event = new UnidocEvent()
    this.message = new UnidocValidation()

    this._messages = Pack.instance(UnidocValidation.ALLOCATOR, capacity)
    this.messages = this._messages.view()
  }

  /**
  * Publish the current validation message.
  */
  public publish () : void {
    const nextState : number = Math.max(
      ValidationState.fromValidationType(this.message.type),
      this.state
    )

    if (nextState !== this.state) {
      this.state = nextState
      this.stateIndex = this.event.index
    }

    this._messages.push(this.message)
    this.message.clear()
  }

  public clear () : void {
    this.state = ValidationState.VALID
    this.event.clear()
    this.message.clear()
    this._messages.clear()
  }

  public clearMessages () : void {
    this._messages.clear()
  }
}
