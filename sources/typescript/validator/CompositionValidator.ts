import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'
import { UnidocValidation } from '../validation/UnidocValidation'
import { StandardErrorCode } from '../standard/StandardErrorCode'
import { UnidocPath } from '../path'

import { BaseUnidocValidator } from './BaseUnidocValidator'

export class CompositionValidator extends BaseUnidocValidator {
  private _minimums            : Map<string, number>
  private _maximums            : Map<string, number>

  private _counts              : Map<string, number>
  private _depth               : number
  private _initialized         : boolean

  private readonly _validation : UnidocValidation

  public readonly path         : UnidocPath

  public constructor () {
    super()

    this._maximums    = new Map<string, number>()
    this._minimums    = new Map<string, number>()
    this._counts      = new Map<string, number>()
    this._depth       = 0
    this._initialized = false
    this._validation  = new UnidocValidation()
    this.path         = new UnidocPath()
  }

  /**
  * Validate that a tag of this type must have exactly the given number of elements of the given type.
  *
  * @param count - Number of element of the given type that a tag of this type must have.
  * @param type  - Type of tag to assert.
  */
  public require (count : number, type : string) : void {
    this._minimums.set(type, count)
    this._maximums.set(type, count)
  }

  /**
  * Validate that a tag of this type have a minimum number of elements of the given type.
  *
  * @param minimum - Minimum number of element of the given type that a tag of this type must have.
  * @param type  - Type of tag to assert.
  */
  public requireAtLeast (minimum : number, type : string) : void {
    this._minimums.set(type, minimum)

    if (!this._maximums.has(type)) {
      this._maximums.set(type, Number.POSITIVE_INFINITY)
    }
  }

  /**
  * Validate that a tag of this type have a maximum number of elements of the given type.
  *
  * @param maximum - Maximum number of element of the given type that a tag of this type may have.
  * @param type  - Type of tag to assert.
  */
  public mayHave (maximum : number, type : string) : void {
    this._maximums.set(type, maximum)

    if (!this._minimums.has(type)) {
      this._minimums.set(type, 0)
    }
  }

  /**
  * @see UnidocValidator.next
  */
  public next (event : UnidocEvent) : void {
    if (!this._initialized) {
      this.path.copy(event.path)
      this._initialized = true
      return
    }

    if (this._depth < 0) return

    switch (event.type) {
      case UnidocEventType.START_TAG:
        if (this._depth === 0) {
          this.increment(event.tag)
        }

        this._depth += 1
        return
      case UnidocEventType.END_TAG:
        if (this._depth === 0) {
          this.complete()
        } else {
          this._depth -= 1
        }

        return
      case UnidocEventType.WHITESPACE:
      case UnidocEventType.WORD:
        return
    }
  }

  /**
  * @see UnidocValidator.complete
  */
  public complete () : void {
    if (this._depth === 0) {
      this._depth = -1
      this.validate()
    } else {
      // error
    }
  }

  /**
  * Execute the validation process.
  */
  private validate () : void {
    for (const type of this._minimums.keys()) {
      const count : number = this._counts.get(type) || 0
      const minimum : number = this._minimums.get(type)
      const maximum : number = this._maximums.get(type)

      if (count < minimum || count > maximum) {
        this._validation.asError()

        if (count < minimum) {
          this._validation.code = StandardErrorCode.NOT_ENOUGH_TAG
        } else {
          this._validation.code = StandardErrorCode.TOO_MANY_TAG
        }

        this._validation.data.set('tag', type)
        this._validation.data.set('minimum', minimum)
        this._validation.data.set('maximum', maximum)
        this._validation.data.set('count', count)
        this._validation.path.copy(this.path)

        this.emitValidation(this._validation)
      }
    }
  }

  /**
  * Increment the count of tags of the given type.
  */
  private increment (type : string) : void {
    if (this._counts.has(type)) {
      this._counts.set(type, this._counts.get(type) + 1)
    } else {
      this._counts.set(type, 1)
    }
  }

  /**
  * @see UnidocValidator.reset
  */
  public clear () : void {
    super.clear()

    this._depth = 0
    this._counts.clear()
    this._initialized = false
    this._maximums.clear()
    this._minimums.clear()
    this.path.clear()
  }

  /**
  * @see UnidocValidator.reset
  */
  public reset () : void {
    this._counts.clear()
    this._depth = 0
    this._initialized = false
  }

  /**
  * @see BaseUnidocValidator.copy
  */
  public copy (toCopy : CompositionValidator) : void {
    super.copy(toCopy)

    this._depth = toCopy._depth
    this.path.copy(toCopy.path)
    this._initialized = toCopy._initialized

    this._counts.clear()
    this._maximums.clear()
    this._minimums.clear()

    for (const [key, maximum] of toCopy._maximums.entries()) {
      this._maximums.set(key, maximum)
    }

    for (const [key, minimum] of toCopy._minimums.entries()) {
      this._minimums.set(key, minimum)
    }

    for (const [key, count] of toCopy._counts.entries()) {
      this._counts.set(key, count)
    }
  }

  /**
  * @see UnidocValidator.clone
  */
  public clone () : CompositionValidator {
    const result : CompositionValidator = new CompositionValidator()

    result.copy(this)

    return result
  }
}
