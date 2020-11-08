import { ListenableUnidocProducer } from './ListenableUnidocProducer'

/**
* A implementation of the unidoc producer interface that is listenable.
*/
export class StaticUnidocProducer<T> extends ListenableUnidocProducer<T> {
  /**
  * @see ListenableUnidocProducer.initialize
  */
  public initialize(): void {
    super.initialize()
  }

  /**
  * @see ListenableUnidocProducer.fail
  */
  public fail(error: Error): void {
    super.fail(error)
  }

  /**
  * @see ListenableUnidocProducer.produce
  */
  public produce(value: T): void {
    super.produce(value)
  }

  /**
  * @see ListenableUnidocProducer.complete
  */
  public complete(): void {
    super.complete()
  }
}
