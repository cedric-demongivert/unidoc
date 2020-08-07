import { Allocator, Pack } from '@cedric-demongivert/gl-tool-collection'

import { CodePoint } from '../CodePoint'

import { UnidocPath } from '../path/UnidocPath'
import { UnidocToken } from '../token/UnidocToken'
import { UnidocTokenType } from '../token/UnidocTokenType'

import { UnidocParserStateType } from './UnidocParserStateType'

const EMPTY_STRING : string = ''

export class UnidocParserState {
  public type                : UnidocParserStateType
  public tag                 : string
  public identifier          : string
  public readonly content    : Pack<CodePoint>
  public readonly from       : UnidocPath
  public readonly to         : UnidocPath
  public readonly classes    : Set<string>

  /**
  * Instantiate a new empty state.
  */
  public constructor () {
    this.type       = UnidocParserStateType.START
    this.tag        = EMPTY_STRING
    this.identifier = EMPTY_STRING
    this.content    = Pack.uint32(128)
    this.classes    = new Set()
    this.from       = new UnidocPath()
    this.to         = new UnidocPath()
  }

  public begin (type : UnidocParserStateType, token : UnidocToken) : void
  public begin (type : UnidocParserStateType, start : UnidocPath) : void
  public begin (type : UnidocParserStateType, start : UnidocToken | UnidocPath) : void {
    this.clear()
    this.type = type

    if (start instanceof UnidocToken) {
      switch (start.type) {
        case UnidocTokenType.CLASS:
          this.classes.add(start.substring(1))
          break
        case UnidocTokenType.IDENTIFIER:
          this.identifier = start.substring(1)
          break
        case UnidocTokenType.TAG:
          this.tag = start.substring(1)
          break
        case UnidocTokenType.NEW_LINE:
        case UnidocTokenType.SPACE:
        case UnidocTokenType.WORD:
          this.content.concat(start.symbols)
          break
      }

      this.from.copy(start.from)
      this.to.copy(start.to)
    } else {
      this.from.copy(start)
      this.to.copy(start)
    }
  }

  public append (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.CLASS:
        this.classes.add(token.substring(1))
        break
      case UnidocTokenType.IDENTIFIER:
        this.identifier = token.substring(1)
        break
      case UnidocTokenType.TAG:
        this.tag = token.substring(1)
        break
      case UnidocTokenType.NEW_LINE:
      case UnidocTokenType.SPACE:
      case UnidocTokenType.WORD:
        this.content.concat(token.symbols)
        break
    }

    this.to.copy(token.to)
  }

  public at (location : UnidocPath) : void {
    this.from.copy(location)
    this.to.copy(location)
  }

  /**
  * Reset this instance in order to reuse it.
  */
  public clear () : void {
    this.type       = UnidocParserStateType.START
    this.tag        = EMPTY_STRING
    this.identifier = EMPTY_STRING
    this.content.clear()
    this.classes.clear()
    this.from.clear()
    this.to.clear()
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
    this.content.copy(toCopy.content)
    this.from.copy(toCopy.from)
    this.to.copy(toCopy.to)
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
        !other.content.equals(this.content)      ||
        !other.from.equals(this.from)            ||
        !other.to.equals(this.to)                ||
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
