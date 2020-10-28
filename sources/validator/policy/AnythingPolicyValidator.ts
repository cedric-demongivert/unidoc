import { PolicyValidator } from './PolicyValidator'
import { ValidationContext } from './ValidationContext'

export class AnythingPolicyValidator implements PolicyValidator {
  /**
  * @see PolicyValidator.start
  */
  public start (_context : ValidationContext) : void {

  }

  /**
  * @see PolicyValidator.validate
  */
  public validate (_context : ValidationContext) : void {

  }

  /**
  * @see PolicyValidator.complete
  */
  public complete (_context : ValidationContext) : void {

  }
}

export namespace AnythingPolicyValidator {
  export const INSTANCE : AnythingPolicyValidator = new AnythingPolicyValidator()
}
