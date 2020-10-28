import { UnidocEventType } from '../../event/UnidocEventType'

import { TagPolicy } from '../../policy/TagPolicy'

import { PolicyValidator } from './PolicyValidator'
import { ValidationContext } from './ValidationContext'
import { TagPolicyValidatorState } from './TagPolicyValidatorState'
import { PolicyErrorMessage } from './PolicyErrorMessage'
import { NullPolicyValidator } from './NullPolicyValidator'

export class TagPolicyValidator implements PolicyValidator {
  public readonly policy : TagPolicy

  private _state : TagPolicyValidatorState
  private _depth : number
  private _contentValidator : PolicyValidator

  public constructor (policy : TagPolicy) {
    this.policy = policy

    this._state = TagPolicyValidatorState.BEFORE_TAG
    this._depth = 0
    this._contentValidator = NullPolicyValidator.INSTANCE
  }

  /**
  * @see PolicyValidator.start
  */
  public start (_context : ValidationContext) : void {
    this._state = TagPolicyValidatorState.BEFORE_TAG
    this._depth = 0
    this._contentValidator = NullPolicyValidator.INSTANCE
  }

  /**
  * @see PolicyValidator.validate
  */
  public validate (context : ValidationContext) : void {
    switch (this._state) {
      case TagPolicyValidatorState.BEFORE_TAG:
        return this.validateBeforeTag(context)
      case TagPolicyValidatorState.WITHIN_TAG:
        return this.validateWithinTag(context)
      case TagPolicyValidatorState.AFTER_TAG:
        return this.validateAfterTag(context)
      case TagPolicyValidatorState.IN_ERROR:
        return
      default:
        throw new Error(
          'Unable to validate the next event in state #' + this._state + ' (' +
          TagPolicyValidatorState.toString(this._state) + ') because no validation ' +
          'procedure was defined for the given state.'
        )
    }
  }

  public validateAfterTag (context : ValidationContext) : void {
    context.message.asError()
    context.message.code = PolicyErrorMessage.SUPERFLUOUS_CONTENT
    context.message.data.set(PolicyErrorMessage.SuperfluousContent.EVENT, context.event.clone())
    context.message.data.set(PolicyErrorMessage.SuperfluousContent.POLICY, this.policy)
    context.publish()
  }

  public validateWithinTag (context : ValidationContext) : void {
    switch (context.event.type) {
      case UnidocEventType.START_TAG:
        this._depth += 1
        return this._contentValidator.validate(context)
      case UnidocEventType.END_TAG:
        this._depth -= 1

        if (this._depth === 0) {
          this._state = TagPolicyValidatorState.AFTER_TAG
          return this._contentValidator.complete(context)
        } else {
          return this._contentValidator.validate(context)
        }
      default:
        return this._contentValidator.validate(context)
    }
  }

  public validateBeforeTag (context : ValidationContext) : void {
    switch (context.event.type) {
      case UnidocEventType.START_TAG:
        if (context.event.tag === this.policy.name) {
          this._state = TagPolicyValidatorState.WITHIN_TAG
          this._depth += 1
          this._contentValidator = PolicyValidator.fromPolicy(this.policy.content)

          return this._contentValidator.start(context)
        }

      default:
        this._state = TagPolicyValidatorState.IN_ERROR

        context.message.asError()
        context.message.code = PolicyErrorMessage.INVALID_CONTENT
        context.message.data.set(PolicyErrorMessage.InvalidContent.EVENT, context.event.clone())
        context.message.data.set(PolicyErrorMessage.InvalidContent.POLICY, this.policy)
        context.publish()

        return
    }
  }

  /**
  * @see PolicyValidator.complete
  */
  public complete (context : ValidationContext) : void {
    switch (this._state) {
      case TagPolicyValidatorState.BEFORE_TAG:
        return this.completeBeforeTag(context)
      case TagPolicyValidatorState.WITHIN_TAG:
        return this.completeWithinTag(context)
      case TagPolicyValidatorState.AFTER_TAG:
        return
      case TagPolicyValidatorState.IN_ERROR:
        return
      default:
        throw new Error(
          'Unable to complete the validation in state #' + this._state + ' (' +
          TagPolicyValidatorState.toString(this._state) + ') because no procedure ' +
          'was defined for the given state.'
        )
    }
  }

  public completeBeforeTag (context : ValidationContext) : void {
    context.message.asError()
    context.message.code = PolicyErrorMessage.EXPECTED_CONTENT
    context.message.data.set(PolicyErrorMessage.ExpectedContent.EVENT, context.event.clone())
    context.message.data.set(PolicyErrorMessage.ExpectedContent.POLICY, this.policy)
    context.publish()
  }

  public completeWithinTag (context : ValidationContext) : void {
    context.message.asError()
    context.message.code = PolicyErrorMessage.UNCLOSED_TAG
    context.message.data.set(PolicyErrorMessage.ExpectedContent.EVENT, context.event.clone())
    context.message.data.set(PolicyErrorMessage.ExpectedContent.POLICY, this.policy)
    context.publish()
  }
}
