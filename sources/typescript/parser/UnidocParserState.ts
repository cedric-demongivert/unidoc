import { UnidocParserStateType } from './UnidocParserStateType'

import { UnidocLocation } from '../UnidocLocation'

export class UnidocParserState {
  public type                : UnidocParserStateType
  public tag                 : string
  public identifier          : string
  public readonly from       : UnidocLocation
  public readonly classes    : Set<string>

  /**
  * Instantiate a new empty state.
  */
  public constructor () {
    this.type       = UnidocParserStateType.START
    this.tag        = undefined
    this.identifier = undefined
    this.classes    = new Set()
    this.from       = new UnidocLocation()
  }

  /**
  * Reset this instance in order to reuse it.
  */
  public clear () : void {
    this.type       = UnidocParserStateType.START
    this.tag        = undefined
    this.identifier = undefined
    this.classes.clear()
    this.from.clear()
  }

  /**
  * Copy an existing parser state instance.
  *
  * @param toCopy - A parser state to copy.
  */
  public copy (toCopy : UnidocParserState) : void {
    this.type = toCopy.type
    this.tag = toCopy.tag
    this.identifier = toCopy.identifier
    this.from.copy(toCopy.from)
    this.classes.clear()

    for (const element of toCopy.classes) {
      this.classes.add(element)
    }
  }

  /**
  * @see Object.equals
  */
  public equals (other : any) : boolean {
    if (other == null)  return false
    if (other === this) return true

    if (other instanceof UnidocParserState) {
      if (
        other.type         !== this.type         ||
        other.tag          !== this.tag          ||
        other.identifier   !== this.identifier   ||
        !other.from.equals(this.from)            ||
        other.classes.size !== this.classes.size
      ) { return false }

      for (const element of other.classes) {
        if (!this.classes.has(element)) {
          return false
        }
      }

      return true
    }
  }
}
