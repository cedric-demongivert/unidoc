import { PolicyValidator } from './PolicyValidator'
import { ValidationContext } from './ValidationContext'
import { PolicyErrorMessage } from './PolicyErrorMessage'

export class NullPolicyValidator implements PolicyValidator {
  /**
  * @see PolicyValidator.start
  */
  public start (context : ValidationContext) : void {
    context.message.asError()
    context.message.code = PolicyErrorMessage.NULL_POLICY
    context.message.data.set(PolicyErrorMessage.NullPolicy.EVENT, context.event)
    context.message.data.set(PolicyErrorMessage.NullPolicy.METHOD, 'start')
  }

  /**
  * @see PolicyValidator.validate
  */
  public validate (context : ValidationContext) : void {
    context.message.asError()
    context.message.code = PolicyErrorMessage.NULL_POLICY
    context.message.data.set(PolicyErrorMessage.NullPolicy.EVENT, context.event)
    context.message.data.set(PolicyErrorMessage.NullPolicy.METHOD, 'validate')
  }

  /**
  * @see PolicyValidator.complete
  */
  public complete (context : ValidationContext) : void {
    context.message.asError()
    context.message.code = PolicyErrorMessage.NULL_POLICY
    context.message.data.set(PolicyErrorMessage.NullPolicy.EVENT, context.event)
    context.message.data.set(PolicyErrorMessage.NullPolicy.METHOD, 'complete')
  }
}

export namespace NullPolicyValidator {
  export const INSTANCE : NullPolicyValidator = new NullPolicyValidator()
}
