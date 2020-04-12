import { UnidocEvent } from '../event/UnidocEvent'

import { BaseUnidocValidator } from './BaseUnidocValidator'

/**
* A validator that validate anything.
*/
export class AnyValidator extends BaseUnidocValidator {
  /**
  * @see UnidocValidator.next
  */
  public next (event: UnidocEvent): void { }

  /**
  * @see UnidocValidator.complete
  */
  public complete () : void {
    this.emitCompletion()
  }

  /**
  * @see UnidocValidator.reset
  */
  public reset () : void { }

  /**
  * @see UnidocValidator.clone
  */
  public clone (): AnyValidator {
    const result : AnyValidator = new AnyValidator()

    result.copy(this)

    return result
  }
}
