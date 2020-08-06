import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocParserStateType } from './UnidocParserStateType'

import { UnidocPath } from '../path/UnidocPath'

const EMPTY_STRING : string = ''

export class UnidocParserState {
  public type                : UnidocParserStateType
  public tag                 : string
  public identifier          : string
  public readonly from       : UnidocPath
  public readonly classes    : Set<string>

  /**
  * Instantiate a new empty state.
  */
  public constructor () {
    this.type       = UnidocParserStateType.START
    this.tag        = EMPTY_STRING
    this.identifier = EMPTY_STRING
    this.classes    = new Set()
    this.from       = new UnidocPath()
  }

  /**
  * Reset this instance in order to reuse it.
  */
  public clear () : void {
    this.type       = UnidocParserStateType.START
    this.tag        = EMPTY_STRING
    this.identifier = EMPTY_STRING
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

    return false
  }
}

export namespace UnidocParserState {
  export const ALLOCATOR : Allocator<UnidocParserState> = {
    /**
    * @see Allocator.copy
    */
    allocate () : UnidocParserState {
      return new UnidocParserState()
    },

    /**
    * @see Allocator.copy
    */
    copy (source : UnidocParserState, destination : UnidocParserState) : void {
      destination.copy(source)
    },

    /**
    * @see Allocator.clear
    */
    clear (instance : UnidocParserState) : void {
      instance.clear()
    }
  }
}
