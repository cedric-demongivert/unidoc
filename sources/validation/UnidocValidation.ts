import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocPath } from '../path/UnidocPath'

import { UnidocValidationType } from './UnidocValidationType'

const EMPTY_STRING : string = ''

export class UnidocValidation {
  public type          : UnidocValidationType
  public path          : UnidocPath
  public code          : string
  public readonly data : Map<string, any>

  /**
  * Instantiate a new validation instance.
  */
  public constructor () {
    this.type = UnidocValidationType.DEFAULT
    this.path = new UnidocPath()
    this.code = EMPTY_STRING
    this.data = new Map<string, any>()
  }

  /**
  * Configure this validation as an error.
  */
  public asError () : void {
    this.type = UnidocValidationType.ERROR
  }

  /**
  * Configure this validation as an information.
  */
  public asInformation () : void {
    this.type = UnidocValidationType.INFORMATION
  }

  /**
  * Configure this validation as a warning.
  */
  public asWarning () : void {
    this.type = UnidocValidationType.WARNING
  }

  /**
  * Clear this validation instance in order to reuse it.
  */
  public clear () : void {
    this.type = UnidocValidationType.DEFAULT
    this.code = EMPTY_STRING
    this.data.clear()
    this.path.clear()
  }

  /**
  * Copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy (toCopy : UnidocValidation) : void {
    this.type = toCopy.type
    this.code = toCopy.code
    this.path.copy(toCopy.path)
    this.data.clear()

    for (const [key, data] of toCopy.data) {
      this.data.set(key, data)
    }
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
      `[${UnidocValidationType.toString(this.type)}] ${this.path.toString()} ${this.code} : {${[...this.data.entries()].map(x => x[0] + ': ' + x[1]).join(', ')}}`
    )
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocValidation) {
      if (
        other.type !== this.type ||
        other.code !== this.code ||
        other.data.size !== this.data.size ||
        !other.path.equals(this.path)
      ) return false

      for (const [key, data] of this.data) {
        if (other.data.get(key) !== data) {
          return false
        }
      }

      return true
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
  export function copy (toCopy : UnidocValidation) : UnidocValidation
  export function copy (toCopy : null) : null
  export function copy (toCopy : UnidocValidation | null) : UnidocValidation | null {
    return toCopy == null ? toCopy : toCopy.clone()
  }

  export const ALLOCATOR : Allocator<UnidocValidation> = {
    allocate () : UnidocValidation {
      return new UnidocValidation()
    },

    clear (instance : UnidocValidation) : void {
      instance.clear()
    },

    copy (source : UnidocValidation, destination : UnidocValidation) : void {
      destination.copy(source)
    }
  }
}
