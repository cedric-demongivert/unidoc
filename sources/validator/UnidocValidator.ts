import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocValidationProcessEvent } from '../validation/UnidocValidationProcessEvent'

import { UnidocProducer } from '../producer/UnidocProducer'

export interface UnidocValidator extends UnidocProducer<UnidocValidationProcessEvent> {
  start () : void

  validate (event : UnidocEvent) : void

  complete () : void
}
