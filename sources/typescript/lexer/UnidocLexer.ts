import { Subscriber } from 'rxjs'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { Location } from '../Location'
import { CodePoint } from '../CodePoint'
import { UnidocToken } from '../token/UnidocToken'
import { UnidocTokenType } from '../token/UnidocTokenType'

import { UnidocLexerState } from './UnidocLexerState'

/**
* Unidoc lexer.
*/
export class UnidocLexer {
  /**
  * A set of subscriber to this lexer output.
  */
  private _subscribers : Set<Subscriber<UnidocToken>>

  /**
  * Current state of this lexer.
  */
  private _state    : UnidocLexerState

  /**
  * Buffer of symbols of this lexer.
  */
  private _symbols  : Pack<CodePoint>

  /**
  * Token instance used to publish discovered tokens.
  */
  private _token    : UnidocToken

  /**
  * Location of the first symbol of this buffer.
  */
  private _location : Location

  /**
  * Instantiate a new unidoc lexer.
  *
  * @param [capacity = 64] - Unidoc lexer internal symbol buffer capacity.
  */
  public constructor (capacity : number = 64) {
    this._state       = UnidocLexerState.START
    this._symbols     = Pack.uint32(capacity)
    this._token       = new UnidocToken(capacity)
    this._subscribers = new Set<Subscriber<UnidocToken>>()
    this._location    = new Location()
  }

  /**
  * Feed this lexer with the given symbol.
  *
  * @param codePoint - The next symbol to give to this lexer.
  */
  public next (codePoint : CodePoint) : void {
    switch (this._state) {
      case UnidocLexerState.SPACE:
        this.handleAfterSpace(codePoint)
        break
      case UnidocLexerState.CARRIAGE_RETURN:
        this.handleAfterCarriageReturn(codePoint)
        break
      case UnidocLexerState.SHARP:
        this.handleAfterSharp(codePoint)
        break
      case UnidocLexerState.IDENTIFIER:
        this.handleAfterIdentifier(codePoint)
        break
      case UnidocLexerState.DOT:
        this.handleAfterDot(codePoint)
        break
      case UnidocLexerState.ANTISLASH:
        this.handleAfterAntislash(codePoint)
        break
      case UnidocLexerState.TAG:
        this.handleAfterTag(codePoint)
        break
      case UnidocLexerState.WORD:
        this.handleAfterWord(codePoint)
        break
      default:
        this.handleAfterStart(codePoint)
        break
    }
  }

  /**
  * Handle the given symbol after an antislash.
  *
  * @param codePoint - The symbol to handle.
  */
  private handleAfterAntislash (codePoint : CodePoint) : void {
    if (
      (codePoint >= CodePoint.a && codePoint <= CodePoint.z) ||
      (codePoint >= CodePoint.A && codePoint <= CodePoint.Z)
    ) {
      this._symbols.push(codePoint)
      this._state = UnidocLexerState.TAG
    } else {
      this._symbols.push(codePoint)
      this._state = UnidocLexerState.WORD
    }
  }

  /**
  * Handle the given symbol after a word.
  *
  * @param codePoint - The symbol to handle.
  */
  private handleAfterWord (codePoint : CodePoint) : void {
    switch (codePoint) {
      case CodePoint.TABULATION:
      case CodePoint.SPACE:
      case CodePoint.NEW_LINE:
      case CodePoint.CARRIAGE_RETURN:
      case CodePoint.OPENING_BRACE:
      case CodePoint.CLOSING_BRACE:
        this.emitWord()
        this._state = UnidocLexerState.START
        this.handleAfterStart(codePoint)
        break
      default:
        this._symbols.push(codePoint)
        break
    }
  }

  /**
  * Handle the given symbol after a tag.
  *
  * @param codePoint - The symbol to handle.
  */
  private handleAfterTag (codePoint : CodePoint) : void {
    if (
      (codePoint >= CodePoint.a && codePoint <= CodePoint.z) ||
      (codePoint >= CodePoint.A && codePoint <= CodePoint.Z) ||
      (codePoint >= CodePoint.ZERO && codePoint <= CodePoint.NINE) ||
      (codePoint === CodePoint.MINUS)
    ) {
      this._symbols.push(codePoint)
    } else {
      switch (codePoint) {
        case CodePoint.TABULATION:
        case CodePoint.SPACE:
        case CodePoint.NEW_LINE:
        case CodePoint.CARRIAGE_RETURN:
        case CodePoint.DOT:
        case CodePoint.SHARP:
        case CodePoint.OPENING_BRACE:
        case CodePoint.CLOSING_BRACE:
          this.emitTag()
          this._state = UnidocLexerState.START
          this.handleAfterStart(codePoint)
          break
        default:
          this._symbols.push(codePoint)
          this._state = UnidocLexerState.WORD
          break
      }
    }
  }

  /**
  * Handle the given symbol after a carriage return.
  *
  * @param codePoint - The symbol to handle.
  */
  private handleAfterCarriageReturn (codePoint : CodePoint) : void {
    switch (codePoint) {
      case CodePoint.NEW_LINE:
        this._symbols.push(codePoint)
        this.emitNewLine()
        this._state = UnidocLexerState.START
        break
      default:
        this.emitNewLine()
        this._state = UnidocLexerState.START
        this.handleAfterStart(codePoint)
        break
    }
  }

  /**
  * Handle the given symbol after a space.
  *
  * @param codePoint - The symbol to handle.
  */
  private handleAfterSpace (codePoint : CodePoint) : void {
    switch (codePoint) {
      case CodePoint.SPACE:
      case CodePoint.TABULATION:
        this._symbols.push(codePoint)
        break
      default:
        this.emitSpace()
        this._state = UnidocLexerState.START
        this.handleAfterStart(codePoint)
        break
    }
  }

  /**
  * Handle the given symbol after a dot.
  *
  * @param codePoint - The symbol to handle.
  */
  private handleAfterDot (codePoint : CodePoint) : void {
    if (
      codePoint >= CodePoint.a && codePoint <= CodePoint.z ||
      codePoint >= CodePoint.A && codePoint <= CodePoint.Z
    ) {
      this._symbols.push(codePoint)
      this._state = UnidocLexerState.CLASS
    } else {
      switch (codePoint) {
        case CodePoint.SPACE:
        case CodePoint.TABULATION:
        case CodePoint.NEW_LINE:
        case CodePoint.CARRIAGE_RETURN:
        case CodePoint.OPENING_BRACE:
        case CodePoint.CLOSING_BRACE:
          this.emitWord()
          this.handleAfterStart(codePoint)
          break
        default:
          this._symbols.push(codePoint)
          this._state = UnidocLexerState.WORD
          break
      }
    }
  }

  /**
  * Handle the given symbol after a class.
  *
  * @param codePoint - The symbol to handle.
  */
  private handleAfterClass (codePoint : CodePoint) : void {
    if (
      codePoint >= CodePoint.a    && codePoint <= CodePoint.z    ||
      codePoint >= CodePoint.A    && codePoint <= CodePoint.Z    ||
      codePoint >= CodePoint.ZERO && codePoint <= CodePoint.NINE ||
      codePoint === CodePoint.MINUS
    ) {
      this._symbols.push(codePoint)
    } else {
      switch (codePoint) {
        case CodePoint.TABULATION:
        case CodePoint.SPACE:
        case CodePoint.NEW_LINE:
        case CodePoint.CARRIAGE_RETURN:
        case CodePoint.DOT:
        case CodePoint.SHARP:
        case CodePoint.OPENING_BRACE:
        case CodePoint.CLOSING_BRACE:
          this.emitClass()
          this._state = UnidocLexerState.START
          this.handleAfterStart(codePoint)
          break
        default:
          this._symbols.push(codePoint)
          this._state = UnidocLexerState.WORD
          break
      }
    }
  }

  /**
  * Handle the given symbol after a sharp.
  *
  * @param codePoint - The symbol to handle.
  */
  private handleAfterSharp (codePoint : CodePoint) : void {
    if (
      codePoint >= CodePoint.a && codePoint <= CodePoint.z ||
      codePoint >= CodePoint.A && codePoint <= CodePoint.Z
    ) {
      this._symbols.push(codePoint)
      this._state = UnidocLexerState.IDENTIFIER
    } else {
      this._symbols.push(codePoint)
      this._state = UnidocLexerState.WORD
    }
  }

  /**
  * Handle the given symbol after an identifier.
  *
  * @param codePoint - The symbol to handle.
  */
  private handleAfterIdentifier (codePoint : CodePoint) : void {
    if (
      codePoint >= CodePoint.a    && codePoint <= CodePoint.z    ||
      codePoint >= CodePoint.A    && codePoint <= CodePoint.Z    ||
      codePoint >= CodePoint.ZERO && codePoint <= CodePoint.NINE ||
      codePoint === CodePoint.MINUS
    ) {
      this._symbols.push(codePoint)
    } else {
      switch (codePoint) {
        case CodePoint.TABULATION:
        case CodePoint.SPACE:
        case CodePoint.NEW_LINE:
        case CodePoint.CARRIAGE_RETURN:
        case CodePoint.DOT:
        case CodePoint.SHARP:
        case CodePoint.OPENING_BRACE:
        case CodePoint.CLOSING_BRACE:
          this.emitIdentifier()
          this._state = UnidocLexerState.START
          this.handleAfterStart(codePoint)
          break
        default:
          this._symbols.push(codePoint)
          this._state = UnidocLexerState.WORD
          break
      }
    }
  }

  /**
  * Handle the given symbol at the entry state of this lexer.
  *
  * @param codePoint - The symbol to handle.
  */
  private handleAfterStart (codePoint : CodePoint) : void {
    switch (codePoint) {
      case CodePoint.OPENING_BRACE:
        this.emitBlockStart()
        break
      case CodePoint.CLOSING_BRACE:
        this.emitBlockEnd()
        break
      case CodePoint.ANTISLASH:
        this._symbols.push(codePoint)
        this._state = UnidocLexerState.ANTISLASH
        break
      case CodePoint.SPACE:
      case CodePoint.TABULATION:
        this._symbols.push(codePoint)
        this._state = UnidocLexerState.SPACE
        break
      case CodePoint.NEW_LINE:
        this._symbols.push(codePoint)
        this.emitNewLine()
        break
      case CodePoint.CARRIAGE_RETURN:
        this._symbols.push(codePoint)
        this._state = UnidocLexerState.CARRIAGE_RETURN
        break
      case CodePoint.SHARP:
        this._symbols.push(codePoint)
        this._state = UnidocLexerState.SHARP
        return undefined
      case CodePoint.DOT:
        this._symbols.push(codePoint)
        this._state = UnidocLexerState.DOT
        return undefined
      default:
        this._symbols.push(codePoint)
        this._state = UnidocLexerState.WORD
        return undefined
    }
  }

  /**
  * Configure a WORD token instance and emit it.
  */
  private emitWord () : void {
    this._token.clear()
    this._token.from.copy(this._location)
    this._location.column += this._symbols.size
    this._location.index += this._symbols.size
    this._token.to.copy(this._location)
    this._token.symbols.copy(this._symbols)
    this._symbols.clear()
    this._token.type = UnidocTokenType.WORD

    this.emit(this._token)
  }

  /**
  * Configure a TAG token instance and emit it.
  */
  private emitTag () : void {
    this._token.clear()
    this._token.from.copy(this._location)
    this._location.column += this._symbols.size
    this._location.index += this._symbols.size
    this._token.to.copy(this._location)
    this._token.symbols.copy(this._symbols)
    this._symbols.clear()
    this._token.type = UnidocTokenType.TAG

    this.emit(this._token)
  }

  /**
  * Configure a CLASS token instance and emit it.
  */
  private emitClass () : void {
    this._token.clear()
    this._token.from.copy(this._location)
    this._location.column += this._symbols.size
    this._location.index += this._symbols.size
    this._token.to.copy(this._location)
    this._token.symbols.copy(this._symbols)
    this._symbols.clear()
    this._token.type = UnidocTokenType.CLASS

    this.emit(this._token)
  }

  /**
  * Configure a IDENTIFIER token instance and emit it.
  */
  private emitIdentifier () : void {
    this._token.clear()
    this._token.from.copy(this._location)
    this._location.column += this._symbols.size
    this._location.index += this._symbols.size
    this._token.to.copy(this._location)
    this._token.symbols.copy(this._symbols)
    this._symbols.clear()
    this._token.type = UnidocTokenType.IDENTIFIER

    this.emit(this._token)
  }

  /**
  * Configure a SPACE token instance and emit it.
  */
  private emitSpace () : void {
    this._token.clear()
    this._token.from.copy(this._location)
    this._location.column += this._symbols.size
    this._location.index += this._symbols.size
    this._token.to.copy(this._location)
    this._token.symbols.copy(this._symbols)
    this._symbols.clear()
    this._token.type = UnidocTokenType.SPACE

    this.emit(this._token)
  }

  /**
  * Configure a NEW_LINE token instance and emit it.
  */
  private emitNewLine () : void {
    this._token.clear()
    this._token.from.copy(this._location)
    this._location.column = 0
    this._location.line += 1
    this._location.index += this._symbols.size
    this._token.to.copy(this._location)
    this._token.symbols.copy(this._symbols)
    this._symbols.clear()
    this._token.type = UnidocTokenType.NEW_LINE

    this.emit(this._token)
  }

  /**
  * Configure a BLOCK_START token instance and emit it.
  */
  private emitBlockStart () : void {
    this._token.clear()
    this._token.from.copy(this._location)
    this._location.column += 1
    this._location.index += 1
    this._token.to.copy(this._location)
    this._token.symbols.push(CodePoint.OPENING_BRACE)
    this._token.type = UnidocTokenType.BLOCK_START

    this.emit(this._token)
  }

  /**
  * Configure a BLOCK_END token instance and emit it.
  */
  private emitBlockEnd () : void {
    this._token.clear()
    this._token.from.copy(this._location)
    this._location.column += 1
    this._location.index += 1
    this._token.to.copy(this._location)
    this._token.symbols.push(CodePoint.CLOSING_BRACE)
    this._token.type = UnidocTokenType.BLOCK_END

    this.emit(this._token)
  }

  /**
  * Notify this lexer's listeners that the given token was discovered.
  *
  * @param token - A discovered token to publish.
  */
  private emit (token : UnidocToken) : void {
    for (const subscriber of this._subscribers) {
      subscriber.next(token)
    }
  }

  /**
  * Add the given listener.
  *
  * @param listener - A subscriber to add to the list of listeners.
  */
  public addEventListener (listener : Subscriber<UnidocToken>) : void {
    this._subscribers.add(listener)
  }

  /**
  * Delete a registered listener.
  *
  * @param listener - A subscriber to delete from the list of listeners.
  */
  public deleteEventListener (listener : Subscriber<UnidocToken>) : void {
    this._subscribers.delete(listener)
  }

  /**
  * Reset this lexer in order to reuse-it.
  */
  public clear () : void {
    this._token.clear()
    this._state = UnidocLexerState.START
    this._location.clear()
    this._subscribers.clear()
    this._symbols.clear()
  }
}
