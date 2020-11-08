import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocValidationEvent } from '../validation/UnidocValidationEvent'

import { UnidocProducer } from '../producer/UnidocProducer'
import { UnidocConsumer } from '../consumer/UnidocConsumer'

export interface UnidocValidator
  extends UnidocProducer<UnidocValidationEvent>, UnidocConsumer<UnidocEvent> { }
