import { Sequence } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../../event/UnidocEvent'
import { UnidocValidation } from '../../validation/UnidocValidation'

export interface ValidationProcess {
  /**
  * Event that is validated.
  */
  readonly event : UnidocEvent

  /**
  * A validation object to use for emitting new events.
  */
  readonly message : UnidocValidation

  startSequence() : void

  endSequence() : void

  startFork() : void

  endFork() : void

  validate (event : UnidocEvent) : void

  publish () : void
}
