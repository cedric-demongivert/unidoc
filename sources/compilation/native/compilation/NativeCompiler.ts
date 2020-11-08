import { UnidocEvent } from '../../../event/UnidocEvent'

import { UnidocConsumer } from '../../../consumer/UnidocConsumer'
import { UnidocProducer } from '../../../producer/UnidocProducer'

export interface NativeCompiler<T> extends UnidocConsumer<UnidocEvent>, UnidocProducer<T> {
  /**
  * Update the state of this compiler toke make it as if the compiler was just
  * instantiated.
  */
  clear(): void
}

export namespace NativeCompiler {
}
