import { Path } from '@library/path'

import { UnidocValidationType } from './UnidocValidationType'

const EMPTY_MESSAGE : string = ''

export class UnidocValidation {
  public type : UnidocValidationType
  public path : Path
  public message : string

  /**
  * Instantiate a new validation instance.
  */
  public constructor () {
    this.type = UnidocValidationType.DEFAULT
    this.path = new Path()
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
  * Validation building configuration.
  */
  export type Configuration = {
    type : UnidocValidationType,
    path : Path,
    message : string
  }

  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : UnidocValidation) : UnidocValidation {
    return new UnidocValidation()
  }
}
