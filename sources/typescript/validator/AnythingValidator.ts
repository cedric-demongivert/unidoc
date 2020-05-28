import { UnidocEvent } from '../event/UnidocEvent'
import { Sink } from '../query/Sink'
import { UnidocValidation } from '../validation/UnidocValidation'

import { UnidocValidator } from './UnidocValidator'

/**
* A validator that validate anything.
*/
export class AnythingValidator implements UnidocValidator {
  /**
  * A listener called when a value is published by this query.
  */
  public output : Sink<UnidocValidation>

  public constructor () {
    this.output = Sink.NONE
  }

  /**
  * @see UnidocQuery.start
  */
  public start (): void {
    this.output.start()
  }

  /**
  * @see UnidocQuery.next
  */
  public next (event : UnidocEvent): void {

  }

  /**
  * @see UnidocQuery.next
  */
  public error (error : Error): void {
    this.output.error(error)
  }

  /**
  * @see UnidocQuery.complete
  */
  public complete () : void {
    this.output.complete()
  }

  /**
  * @see UnidocQuery.reset
  */
  public reset () : void {

  }

  /**
  * @see UnidocQuery.reset
  */
  public clear () : void {
    this.output = Sink.NONE
  }

  /**
  * @see UnidocQuery.clone
  */
  public clone (): AnythingValidator {
    const result : AnythingValidator = new AnythingValidator()

    result.output = this.output

    return result
  }
}
