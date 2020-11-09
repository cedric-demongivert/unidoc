import { UnidocConsumer } from '../consumer/UnidocConsumer'
import { UnidocProducer } from '../producer/UnidocProducer'

import { UnidocValidationEvent } from './UnidocValidationEvent'

export interface UnidocValidationSelector extends UnidocConsumer<UnidocValidationEvent>, UnidocProducer<UnidocValidationEvent> {

}
