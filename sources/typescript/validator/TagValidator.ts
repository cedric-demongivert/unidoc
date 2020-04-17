import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocValidation } from '../Validation/UnidocValidation'

import { TagMetadata } from './TagMetadata'

import { AssertionValidator } from './AssertionValidator'
import { ConditionalValidator } from './ConditionalValidator'
import { BaseUnidocValidator } from './BaseUnidocValidator'

export class TagValidator extends BaseUnidocValidator {
  private _assertions : AssertionValidator
  private _restream   : ConditionalValidator

  public readonly metadata : TagMetadata

  public constructor () {
    super()

    this.handleSubValidation = this.handleSubValidation.bind(this)

    this._assertions = null
    this._restream = null

    this.metadata = new TagMetadata()
  }

  /**
  * @see UnidocValidator#reset
  */
  public reset () : void {
    this._assertions.reset()
    this._restream.reset()
  }

  /**
  * @see UnidocValidator#clear
  */
  public clear () : void {
    super.clear()

    this._assertions.clear()
    this._restream.clear()
  }

  /**
  * @see BaseUnidocValidator#copy
  */
  public copy (toCopy : TagValidator) : void {
    super.copy(toCopy)

    this._assertions.copy(toCopy._assertions)
    this._restream.copy(toCopy._restream)
  }

  private instantiate () : void {
    if (this._assertions != null) return

    this._assertions = new AssertionValidator()
    this._restream = new ConditionalValidator()

    this._assertions.addEventListener('validation', this.handleSubValidation)
    this._restream.addEventListener('validation', this.handleSubValidation)

    this.metadata.configureAssertionValidator(this._assertions)
    this.metadata.configureConditionalValidator(this._restream)
  }

  private destroy () : void {
    if (this._assertions == null) return

    this._assertions.removeEventListener('validation', this.handleSubValidation)
    this._restream.removeEventListener('validation', this.handleSubValidation)

    this._assertions = null
    this._restream = null
  }

  /**
  * @see UnidocValidator#next
  */
  public next (event : UnidocEvent) : void {
    this.instantiate()

    this._assertions.next(event)
    this._restream.next(event)
  }

  /**
  * @see UnidocValidator#complete
  */
  public complete () : void {
    this._assertions.complete()
    this._restream.complete()

    this.emitCompletion()
    
    this.destroy()
  }

  private handleSubValidation (validation : UnidocValidation) : void {
    this.emitValidation(validation)
  }

  /**
  * @see UnidocValidator#clone
  */
  public clone () : TagValidator {
    const result : TagValidator = new TagValidator()

    result.copy(this)

    return result
  }
}
