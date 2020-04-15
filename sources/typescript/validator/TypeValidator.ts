import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'
import { StandardErrorCode } from '../standard/StandardErrorCode'
import { UnidocValidation } from '../Validation/UnidocValidation'

import { BaseUnidocValidator } from './BaseUnidocValidator'
import { UnidocValidator } from './UnidocValidator'
import { AnyValidator } from './AnyValidator'

export class TypeValidator extends BaseUnidocValidator {
  public allowWhitespaces : boolean
  public allowWords       : boolean

  private _validators     : Map<string, UnidocValidator>
  private readonly _validation     : UnidocValidation

  private _depth          : number
  private _state          : UnidocValidator
  private _initialized    : boolean

  public constructor () {
    super()

    this.allowWhitespaces = false
    this.allowWords       = false
    this._validation      = new UnidocValidation()
    this._validators      = new Map<string, UnidocValidator>()
    this._depth           = 0
    this._state           = null
    this._initialized     = false

    this.handleTypeValidation = this.handleTypeValidation.bind(this)
  }

  /**
  * @return An array with each tag that are allowed.
  */
  public get allowTags () : string[] {
    return [...this._validators.keys()]
  }

  /**
  * Allow a tag of this type to contains tags of the given type.
  *
  * @param type - Tag type to allow.
  * @param [validator = new AnyValidator()] - Validator to use for the given tag type.
  */
  public allow (type : string, validator : UnidocValidator = new AnyValidator()) : void {
    this._validators.set(type, validator)
  }

  /**
  * @see UnidocValidator#reset
  */
  public reset () : void {
    this._depth = 0
    this._state = null
    this._initialized = false
  }

  /**
  * @see UnidocValidator#clear
  */
  public clear () : void {
    super.clear()

    this.allowWords = false
    this.allowWhitespaces = false
    this._validators.clear()
    this._depth = 0
    this._state = null
    this._initialized = false
  }

  /**
  * @see BaseUnidocValidator#copy
  */
  public copy (toCopy : TypeValidator) : void {
    super.copy(toCopy)

    this.allowWords = toCopy.allowWords
    this.allowWhitespaces = toCopy.allowWhitespaces
    this._validators.clear()

    for (const key of toCopy._validators.keys()) {
      this.allow(key, toCopy._validators.get(key))
    }
  }

  /**
  * @see UnidocValidator#next
  */
  public next (event : UnidocEvent) : void {
    if (!this._initialized) {
      this._initialized = true
    } else if (this._depth > 0) {
      this.handleNextDeepEvent(event)
    } else if (this._depth === 0) {
      this.handleNextShallowEvent(event)
    } else {
      return
    }
  }

  public handleNextShallowEvent (event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.START_TAG:
        this._depth += 1

        if (this._validators.has(event.tag.toLowerCase())) {
          this._state = this._validators.get(event.tag).clone()
          this._state.addEventListener('validation', this.handleTypeValidation)
        } else {
          this.emitForbiddenTag(event)
          this._state = new AnyValidator()
        }

        this._state.reset()
        this._state.next(event)
        return
      case UnidocEventType.END_TAG:
        this.complete()
        return
      case UnidocEventType.WHITESPACE:
        if (!this.allowWhitespaces) {
          this.emitForbiddenWhitespace(event)
        }
        return
      case UnidocEventType.WORD:
      if (!this.allowWords) {
        this.emitForbiddenWord(event)
      }
      return
    }
  }

  public handleNextDeepEvent (event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.START_TAG:
        this._depth += 1
        break
      case UnidocEventType.END_TAG:
        this._depth -= 1
        break
      case UnidocEventType.WHITESPACE:
      case UnidocEventType.WORD:
        break
    }

    this._state.next(event)
  }

  private handleTypeValidation (validation : UnidocValidation) : void {
    this.emitValidation(validation)
  }

  private emitForbiddenTag (event : UnidocEvent) : void {
    this.initializeForbiddenContentError(event)
    this._validation.data.set('tag', event.tag)
    this.emitValidation(this._validation)
  }

  private emitForbiddenWord (event : UnidocEvent) : void {
    this.initializeForbiddenContentError(event)
    this._validation.data.set('word', event.text)
    this.emitValidation(this._validation)
  }

  private emitForbiddenWhitespace (event : UnidocEvent) : void {
    this.initializeForbiddenContentError(event)
    this._validation.data.set('whitespace', event.text)
    this.emitValidation(this._validation)
  }

  private initializeForbiddenContentError (event : UnidocEvent) : void {
    this._validation.clear()
    this._validation.asError()
    this._validation.code = StandardErrorCode.FORBIDDEN_CONTENT
    this._validation.path.copy(event.path)
    this._validation.path.pushSymbol(event.from)
    this._validation.data.set('tag', false)
    this._validation.data.set('whitespace', false)
    this._validation.data.set('word', false)
    this._validation.data.set('allowTags', this.allowTags)
    this._validation.data.set('allowWords', this.allowWords)
    this._validation.data.set('allowWhitespaces', this.allowWhitespaces)
  }

  /**
  * @see UnidocValidator#complete
  */
  public complete () : void {
    if (this._depth === 0) {
      this._depth = -1
      this.emitCompletion()
    } else {
      // error
    }
  }

  /**
  * @see UnidocValidator#clone
  */
  public clone () : TypeValidator {
    const result : TypeValidator = new TypeValidator()

    result.copy(this)

    return result
  }
}
