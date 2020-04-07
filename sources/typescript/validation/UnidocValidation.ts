import { Path } from '@library/path'

import { UnidocValidationType } from './UnidocValidationType'

const EMPTY_MESSAGE : string = ''

export class UnidocValidation {
  public type : UnidocValidationType
  public path : Path
  public code : string
  public data : Map<string, any>

  /**
  * Instantiate a new validation instance.
  */
  public constructor () {
    this.type = UnidocValidationType.DEFAULT
    this.path = new Path()
    this.message = EMPTY_MESSAGE
  }

  /**
  * Configure this validation as an error message.
  *
  * @param message - Message to set.
  */
  public asError (message : string) : void {
    this.type = UnidocValidationType.ERROR
    this.message = message
  }

  /**
  * Configure this validation as an information message.
  *
  * @param message - Message to set.
  */
  public asInformation (message : string) : void {
    this.type = UnidocValidationType.INFORMATION
    this.message = message
  }

  /**
  * Configure this validation as a warning message.
  *
  * @param message - Message to set.
  */
  public asWarning (message : string) : void {
    this.type = UnidocValidationType.WARNING
    this.message = message
  }

  /**
  * Clear this validation instance in order to reuse it.
  */
  public clear () : void {
    this.type = UnidocValidationType.DEFAULT
    this.path.clear()
    this.message = EMPTY_MESSAGE
  }

  /**
  * Copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy (toCopy : UnidocValidation) : void {
    this.type = toCopy.type
    this.path.copy(toCopy.path)
    this.message = toCopy.message
  }

  /**
  * Return a copy of this instance.
  *
  * @return A copy of this instance.
  */
  public clone () : UnidocValidation {
    const result : UnidocValidation = new UnidocValidation()
    result.copy(this)
    return result
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    return (
      `[${UnidocValidationType.toString(this.type)}] ${this.path.toString()} : ${this.message}`
    )
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocValidation) {
      return other.type === this.type &&
             other.path.equals(this.path) &&
             other.message === this.message
    }

    return false
  }
}

export namespace UnidocValidation {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : UnidocValidation) : UnidocValidation {
    return toCopy == null ? null : toCopy.clone()
  }
}
