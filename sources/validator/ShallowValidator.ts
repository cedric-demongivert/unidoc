import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocValidator } from './UnidocValidator'
import { UnidocValidationContext } from './UnidocValidationContext'

export class ShallowValidator implements UnidocValidator {
  /**
  * Current relative depth from the root element of this validator into the
  * parent document tree.
  */
  private _depth : number

  /**
  * Validator used to validate the content of the parent document tree.
  */
  public readonly validator : UnidocValidator

  /**
  * Instantiate a new content validator.
  *
  * @param validator - The validator to use over the content.
  */
  public constructor (validator : UnidocValidator) {
    this._depth = 0
    this.validator = validator.clone()
  }

  /**
  * @see UnidocValidationContext.start
  */
  public start (context : UnidocValidationContext) : void {
    this._depth = 0
    this.validator.start(context)
  }

  /**
  * @see UnidocValidationContext.next
  */
  public next (context : UnidocValidationContext) : void {
    if (this._depth < 0) {
      return
    }

    switch (context.event.type) {
      case UnidocEventType.START_TAG:
        if (this._depth === 0) {
          this.validator.next(context)
        }
        this._depth += 1
        break
      case UnidocEventType.END_TAG:
        this._depth -= 1
        if (this._depth === 0) {
          this.validator.next(context)
        } else if (this._depth < 0) {
          this.validator.complete(context)
        }
        break
      default:
        if (this._depth === 0) {
          this.validator.next(context)
        }
        break
    }
  }

  /**
  * @see UnidocValidationContext.complete
  */
  public complete (context : UnidocValidationContext) : void {
    if (this._depth < 0) {
      return
    } else {
      this.validator.complete(context)
    }
  }

  /**
  * @see UnidocValidationContext.clone
  */
  public clone () : UnidocValidator {
    return new ShallowValidator(this.validator.clone())
  }

  /**
  * @see Object.toString
  */
  public toString () : string {
    return '$shallow(' + this.validator.toString() + ')'
  }
}
