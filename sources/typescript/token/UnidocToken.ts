import { Packs } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { Location } from '@library/Location'
import { CodePoint } from '@library/CodePoint'

import { UnidocTokenType } from './UnidocTokenType'

/**
* A unidoc token.
*/
export class UnidocToken {
  /**
  * Type of this unidoc token.
  */
  public type : UnidocTokenType

  /**
  * The location of the starting symbol (included) of this token in its parent
  * document.
  */
  private _from : Location

  /**
  * The location of the ending symbol (excluded) of this token in its parent
  * document.
  */
  private _to : Location

  /**
  * Symbols that compose this unidoc token.
  */
  private _symbols : Pack<CodePoint>

  /**
  * Instantiate a new unidoc token.
  *
  * @param [capacity = 16] - Initial capacity of the symbol buffer of this token.
  */
  public constructor (capacity : number = 16) {
    this.type = UnidocTokenType.WORD
    this._symbols = Packs.uint32(capacity)
    this._from = new Location()
    this._to = new Location()
  }

  /**
  * @return This token as a string.
  */
  public get text () : string {
    return String.fromCodePoint(...this._symbols)
  }

  /**
  * @return This token as a string without invisible symbols.
  */
  public get debugText () : string {
    const buffer : number[] = []

    for (const codePoint of this._symbols) {
      switch (codePoint) {
        case CodePoint.NEW_LINE:
          buffer.push(CodePoint.COLON)
          buffer.push(CodePoint.n)
          break
        case CodePoint.CARRIAGE_RETURN:
          buffer.push(CodePoint.COLON)
          buffer.push(CodePoint.r)
          break
        case CodePoint.TABULATION:
          buffer.push(CodePoint.COLON)
          buffer.push(CodePoint.t)
          break
        case CodePoint.SPACE:
          buffer.push(CodePoint.COLON)
          buffer.push(CodePoint.s)
          break
        case CodePoint.FORM_FEED:
          buffer.push(CodePoint.COLON)
          buffer.push(CodePoint.f)
          break
        default:
          buffer.push(codePoint)
          break
      }
    }

    return String.fromCodePoint(...buffer)
  }

  /**
  * The location of the starting symbol (included) of this token in its parent
  * document.
  */
  public get from () : Location {
    return this._from
  }

  /**
  * Update the location of the starting symbol (included) of this token in its
  * parent document.
  *
  * @param location - The new starting symbol location.
  */
  public set from (location : Location) {
    this._from.copy(location)
  }

  /**
  * The location of the ending symbol (excluded) of this token in its parent
  * document.
  */
  public get to () : Location {
    return this._to
  }

  /**
  * Update the location of the ending symbol (excluded) of this token in its
  * parent document.
  *
  * @param location - The new ending symbol location.
  */
  public set to (location : Location) {
    this._to.copy(location)
  }

  /**
  * @return The buffer of the symbols that compose this token.
  */
  public get symbols () : Pack<number> {
    return this._symbols
  }

  /**
  * Deep-copy another token instance.
  *
  * @param toCopy - Another token instance to copy.
  */
  public copy (toCopy : UnidocToken) : void {
    const sourceSymbols : Pack<number> = toCopy._symbols
    const destinationSymbols : Pack<number> = this._symbols
    const sourceLength : number = sourceSymbols.size

    for (let index = 0; index < sourceLength; ++index) {
      destinationSymbols.set(index, sourceSymbols.get(index))
    }

    destinationSymbols.size = sourceLength

    this.type = toCopy.type
    this._from.copy(toCopy._from)
    this._to.copy(toCopy._to)
  }

  /**
  * @return A deep-copy of this token.
  */
  public clone () : UnidocToken {
    return UnidocToken.copy(this)
  }

  /**
  * Reset this token instance in order to reuse it.
  */
  public reset () : void {
    this.type = UnidocTokenType.WORD
    this._symbols.clear()
    this._from.reset()
    this._to.reset()
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    return UnidocTokenType.toString(this.type).padEnd(15) + ' ' +
           this._from.toString().padEnd(15, ' ') + ' ' +
           this._to.toString().padEnd(15, ' ') + ' "' + this.debugText + '" '
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocToken) {
      return other.type === this.type &&
             other._from.equals(this._from) &&
             other._to.equals(this._to) &&
             other._symbols.equals(this._symbols)
    }

    return false
  }
}

export namespace UnidocToken {
  /**
  * Instantiate a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : UnidocToken) : UnidocToken {
    const copy : UnidocToken = new UnidocToken()

    copy.copy(toCopy)

    return copy
  }
}
