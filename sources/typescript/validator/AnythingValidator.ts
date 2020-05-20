import { UnidocEvent } from '../event/UnidocEvent'
import { nothing } from '../query/nothing'
import { UnidocQuery } from '../query/UnidocQuery'
import { UnidocValidation } from '../validation/UnidocValidation'

import { UnidocValidator } from './UnidocValidator'

/**
* A validator that validate anything.
*/
export class AnythingValidator implements UnidocValidator {
  /**
  * A listener called when a value is published by this query.
  */
  public resultListener : UnidocQuery.ResultListener<UnidocValidation>

  /**
  * A listener called when the output stream of this query reach it's end.
  */
  public completionListener : UnidocQuery.CompletionListener

  public constructor () {
    this.resultListener = nothing
    this.completionListener = nothing
  }

  /**
  * @see UnidocQuery.start
  */
  public start (): void {

  }

  /**
  * @see UnidocQuery.next
  */
  public next (event : UnidocEvent): void {

  }

  /**
  * @see UnidocQuery.complete
  */
  public complete () : void {
    this.completionListener()
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
    this.resultListener = nothing
    this.completionListener = nothing
  }

  /**
  * @see UnidocQuery.clone
  */
  public clone (): AnythingValidator {
    const result : AnythingValidator = new AnythingValidator()

    result.resultListener = this.resultListener
    result.completionListener = this.completionListener

    return result
  }
}
