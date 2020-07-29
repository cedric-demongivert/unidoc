import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocValidation } from '../validation/UnidocValidation'

import { UnidocValidator } from './UnidocValidator'
import { UnidocValidationProcess } from './UnidocValidationProcess'

export class UnidocValidationContext {
  /**
  * The parent validator instance.
  */
  public readonly validator : UnidocValidator

  /**
  * The next event to validate.
  */
  public readonly event : UnidocEvent

  /**
  * A validation message instance to use for emission.
  */
  public readonly validation : UnidocValidation

  /**
  * Instantiate a new validation context for the given validator.
  *
  * @param validator - The parent validator that hold this context.
  */
  public constructor (validator : UnidocValidator) {
    this.validator = validator
    this.event = new UnidocEvent()
    this.validation = new UnidocValidation()
  }

  /**
  * Start the given validation process and add it to the stack.
  *
  * @param process - A validation process to start.
  */
  public start (process : UnidocValidationProcess) : void {
    this.validator.start(process)
    process.resolve(this)
  }

  /**
  * Emit the validation message hold by this context.
  */
  public emit () : void {
    this.validator.emit(this.validation)
  }

  /**
  * Terminate the current validation process and remove it from the stack.
  */
  public terminate () : void {
    this.validator.terminate()

    if (this.validator.current) {
      this.validator.current.resolve(this)
    }
  }

  /**
  *
  */
  public replace (process : UnidocValidationProcess) : void {
    this.validator.terminate()
    this.validator.start(process)
    process.resolve(this)
  }

  /**
  * @see Object.equals
  */
  public equals (other : any) : boolean {
    return other === this
  }
}
