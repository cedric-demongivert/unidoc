import { UnidocEvent } from '../event/UnidocEvent'

import { BaseUnidocValidator } from './BaseUnidocValidator'
import { UnidocValidator } from './UnidocValidator'
import { AnyValidator } from './AnyValidator'

export class TypeValidator extends BaseUnidocValidator {
  public allowWhitespaces : boolean
  public allowWords       : boolean

  private _validators     : Map<string, UnidocValidator>

  /**
  * Allow a tag of this type to contains tags of the given type.
  *
  * @param type - Tag type to allow.
  * @param [validator = new AnyValidator()] - Validator to use for the given tag type.
  */
  public allow (type : string, validator : UnidocValidator = new AnyValidator()) : void {
    this._validators.set(type, validator)
  }
  public reset(): void {
    throw new Error("Method not implemented.");
  }

  public next (event: UnidocEvent) : void {
    throw new Error("Method not implemented.");
  }
  public complete() : void {
    throw new Error("Method not implemented.");
  }
  public clone() : TypeValidator {
    throw new Error("Method not implemented.");
  }

}
