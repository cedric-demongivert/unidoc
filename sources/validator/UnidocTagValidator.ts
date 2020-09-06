import { UnidocEventType } from '../event/UnidocEventType'
import { UnidocEvent } from '../event/UnidocEvent'

import { StandardErrorCode } from '../standard/validation/StandardErrorCode'

import { Predicate } from '../predicate'

import { UnidocValidator } from './UnidocValidator'
import { UnidocValidationContext } from './UnidocValidationContext'
import { UnidocTagValidatorState } from './UnidocTagValidatorState'

export class UnidocTagValidator implements UnidocValidator {
  /**
  * The type of tag to accept.
  */
  public readonly type : Predicate<string>

  /**
  * The validator to use in order to validate the inner content of the
  * underlying tag.
  */
  public readonly validator : UnidocValidator

  /**
  * Current state of this validator.
  */
  private _state : UnidocTagValidatorState

  /**
  * Current depth of this validator.
  */
  private _depth : number

  /**
  * Current depth of this validator.
  */
  private readonly _tag : UnidocEvent

  /**
  * Instantiate a new unidoc tag validator.
  *
  * @param type - Expected tag type.
  * @param validator - Expected tag content.
  */
  public constructor (type : Predicate<string>, validator : UnidocValidator) {
    this.type = type
    this.validator = validator.clone()
    this._state = UnidocTagValidatorState.BEFORE_TAG_START
    this._depth = 0
    this._tag = new UnidocEvent()
  }

  /**
  * @see UnidocValidator.start
  */
  public start (context : UnidocValidationContext) : void {
    this._state = UnidocTagValidatorState.BEFORE_TAG_START
    this._depth = 0
    this._tag.clear()
  }

  /**
  * @see UnidocValidator.next
  */
  public next (context : UnidocValidationContext) : void {
    switch (this._state) {
      case UnidocTagValidatorState.BEFORE_TAG_START:
        return this.nextBeforeTagStart(context)
      case UnidocTagValidatorState.AFTER_TAG_START:
        return this.nextAfterTagStart(context)
      case UnidocTagValidatorState.AFTER_TAG_END:
      case UnidocTagValidatorState.AFTER_ERROR:
        return
      default:
        throw new Error(
          'Unhandled UnidocTagValidatorState #' + this._state + ' "' +
          UnidocTagValidatorState.toString(this._state) + '".'
        )
    }
  }

  private nextBeforeTagStart (context : UnidocValidationContext) : void {
    if (context.event.type === UnidocEventType.START_TAG) {
      if (this.type.validate(context.event.tag)) {
        this._state = UnidocTagValidatorState.AFTER_TAG_START
        this._tag.copy(context.event)
        this.validator.start(context)
      } else {
        this.publishForbiddenContentError(context)
        this._state = UnidocTagValidatorState.AFTER_ERROR
      }
    } else {
      this.publishNotATagError(context)
      this._state = UnidocTagValidatorState.AFTER_ERROR
    }
  }

  private nextAfterTagStart (context : UnidocValidationContext) : void {
    switch (context.event.type) {
      case UnidocEventType.START_TAG:
        this._depth += 1
        break
      case UnidocEventType.END_TAG:
        this._depth -= 1
        break
      default:
        break
    }

    if (this._depth < 0) {
      this.validator.complete(context)
      this._state = UnidocTagValidatorState.AFTER_TAG_END
    } else {
      this.validator.next(context)
    }
  }

  /**
  * @see UnidocValidator.complete
  */
  public complete (context: UnidocValidationContext) : void {
    if (this._state === UnidocTagValidatorState.AFTER_TAG_START) {
      this.validator.complete(context)
      this.publishUnclosedTagError(context)
      this._state = UnidocTagValidatorState.AFTER_ERROR
    }
  }

  private publishNotATagError (context : UnidocValidationContext) : void {
    context.validation.clear()
    context.validation.asError()
    context.validation.code = StandardErrorCode.NOT_A_TAG
    context.validation.path.copy(context.event.path)
    context.validation.data.set('predicate', this.type)
    context.publish()
  }

  private publishForbiddenContentError (context : UnidocValidationContext) : void {
    context.validation.clear()
    context.validation.asError()
    context.validation.code = StandardErrorCode.FORBIDDEN_CONTENT
    context.validation.path.copy(context.event.path)
    context.validation.data.set('content', event)
    context.validation.data.set('allowWords', false)
    context.validation.data.set('allowWhitespaces', false)
    context.validation.data.set('allowedTags', this.type)
    context.publish()
  }

  private publishUnclosedTagError (context : UnidocValidationContext) : void {
    context.validation.clear()
    context.validation.asError()
    context.validation.code = StandardErrorCode.UNCLOSED_TAG
    context.validation.data.set('tag', this._tag)
    context.publish()
  }

  /**
  * @see UnidocValidator.clone
  */
  public clone () : UnidocTagValidator {
    return new UnidocTagValidator(this.type, this.validator.clone())
  }

  /**
  * @see UnidocValidator.clone
  */
  public toString () : string {
    return '$tag(' +
      this.type.toString() + ', ' + this.validator.toString() +
    ')'
  }
}
