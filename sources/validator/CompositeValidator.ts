import { Sequence } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocValidator } from './UnidocValidator'
import { UnidocValidationContext } from './UnidocValidationContext'

export class CompositeValidator implements UnidocValidator {
  /**
  * Validator used to validate the content of the parent document tree.
  */
  public readonly validators : Sequence<UnidocValidator>

  /**
  * Validator used to validate the content of the parent document tree.
  */
  private readonly _validators : Pack<UnidocValidator>

  /**
  * Instantiate a new composite validator.
  *
  * @param validators - All validators to use.
  */
  public constructor (validators : Iterable<UnidocValidator>) {
    this._validators = Pack.any(0)

    for (const validator of validators) {
      this._validators.push(validator.clone())
    }

    this.validators = this._validators.view()
  }

  /**
  * @see UnidocValidationContext.start
  */
  public start (context : UnidocValidationContext) : void {
    for (let index = 0, size = this._validators.size; index < size; ++index) {
      this._validators.get(index).start(context)
    }
  }

  /**
  * @see UnidocValidationContext.next
  */
  public next (context : UnidocValidationContext) : void {
    for (let index = 0, size = this._validators.size; index < size; ++index) {
      this._validators.get(index).next(context)
    }
  }

  /**
  * @see UnidocValidationContext.complete
  */
  public complete (context : UnidocValidationContext) : void {
    for (let index = 0, size = this._validators.size; index < size; ++index) {
      this._validators.get(index).complete(context)
    }
  }

  /**
  * @see UnidocValidationContext.clone
  */
  public clone () : UnidocValidator {
    return new CompositeValidator(this._validators)
  }

  /**
  * @see Object.toString
  */
  public toString () : string {
    let result : string = '$all('

    for (let index = 0, size = this._validators.size; index < size; ++index)  {
      if (index > 0) {
        result += ', '
      }

      result += this._validators.get(index).toString()
    }

    result += ')'

    return result
  }
}
