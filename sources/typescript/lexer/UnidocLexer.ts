import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { CodePoint } from '../CodePoint'
import { UnidocLocation } from '../UnidocLocation'
import { UnidocToken } from '../token/UnidocToken'
import { UnidocTokenType } from '../token/UnidocTokenType'
import { UnidocValidation } from '../validation/UnidocValidation'

import { UnidocLexerEventType } from './UnidocLexerEventType'
import { UnidocLexerState } from './UnidocLexerState'

/**
* Unidoc lexer.
*/
export class UnidocLexer {
  /**
  * UnidocLocation of the first symbol of this buffer.
  */
  public readonly location : UnidocLocation

  /**
  * UnidocLocation of the first symbol of this buffer.
  */
  private readonly _from : UnidocLocation

  /**
  * Current state of this lexer.
  */
  private _state : UnidocLexerState

  /**
  * Buffer of symbols of this lexer.
  */
  private _symbols  : Pack<CodePoint>

  /**
  * Token instance used to publish discovered tokens.
  */
  private _token    : UnidocToken

  /**
  * A set of listeners of the 'token' event.
  */
  private _tokenListeners : Set<UnidocLexer.TokenListener>

  /**
  * A set of listeners of the 'validation' event.
  */
  private _validationListeners : Set<UnidocLexer.ValidationListener>

  /**
  * A set of listeners of the 'completion' event.
  */
  private _completionListeners : Set<UnidocLexer.CompletionListener>

  /**
  * A set of listeners of the 'error' event.
  */
  private _errorListeners : Set<UnidocLexer.ErrorListener>

  /**
  * Instantiate a new unidoc lexer.
  *
  * @param [capacity = 64] - Unidoc lexer internal symbol buffer capacity.
  */
  public constructor (capacity : number = 64) {
    this.location             = new UnidocLocation()
    this._from                = new UnidocLocation()

    this._state               = UnidocLexerState.START
    this._symbols             = Pack.uint32(capacity)
    this._token               = new UnidocToken(capacity)

    this._tokenListeners      = new Set<UnidocLexer.TokenListener>()
    this._validationListeners = new Set<UnidocLexer.ValidationListener>()
    this._completionListeners = new Set<UnidocLexer.CompletionListener>()
    this._errorListeners      = new Set<UnidocLexer.ErrorListener>()
  }

  /**
  * @return The current state of this lexer.
  */
  public get state () : UnidocLexerState {
    return this._state
  }

  /**
  * Feed this lexer with the given string.
  *
  * @param content - A string to explode into code point to give to this lexer.
  */
  public nextString (content : String) : void {
    for (let index = 0, size = content.length; index < size; ++index) {
      this.nextCodePoint(content.codePointAt(index))
    }
  }

  /**
  * Feed this lexer with the given code point.
  *
  * @param codePoint - A code point to give to this lexer.
  */
  public nextCodePoint (codePoint : CodePoint) : void {
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
      case UnidocLexerState.CLASS:
        this.handleAfterClass(codePoint)
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
  * Notify to this lexer that the stream of symbol has terminated.
  */
  public complete () : void {
    switch (this._state) {
      case UnidocLexerState.END:
        //this.error()
        break
      case UnidocLexerState.SHARP:
      case UnidocLexerState.DOT:
      case UnidocLexerState.ANTISLASH:
        this.emitWord()
        break
      case UnidocLexerState.SPACE:
        this.emitSpace()
        break
      case UnidocLexerState.CARRIAGE_RETURN:
        this.emitNewLine()
        break
      case UnidocLexerState.TAG:
        this.emitTag()
        break
      case UnidocLexerState.WORD:
        this.emitWord()
        break
      case UnidocLexerState.IDENTIFIER:
        this.emitIdentifier()
        break
      case UnidocLexerState.CLASS:
        this.emitClass()
        break
      case UnidocLexerState.START:
        break
    }

    this._state = UnidocLexerState.END
    this.emitCompletion()
  }

  /**
  * Handle the given symbol after an antislash.
  *
  * @param codePoint - The symbol to handle.
  */
  private handleAfterAntislash (codePoint : CodePoint) : void {
    if (
      (codePoint >= CodePoint.a    && codePoint <= CodePoint.z)    ||
      (codePoint >= CodePoint.A    && codePoint <= CodePoint.Z)    ||
      (codePoint >= CodePoint.ZERO && codePoint <= CodePoint.NINE) ||
      (codePoint === CodePoint.MINUS)
    ) {
      this._symbols.push(codePoint)
      this._state = UnidocLexerState.TAG
      this.location.add(0, 1, 1)
    } else {
      switch (codePoint) {
        case CodePoint.SPACE:
        case CodePoint.TABULATION:
        case CodePoint.FORM_FEED:
        case CodePoint.NEW_LINE:
        case CodePoint.CARRIAGE_RETURN:
          this.emitWord()
          this._state = UnidocLexerState.START
          this.handleAfterStart(codePoint)
          break
        default:
          this._symbols.push(codePoint)
          this._state = UnidocLexerState.WORD
          this.location.add(0, 1, 1)
          break
      }
    }
  }

  /**
  * Handle the given symbol after a tag.
  *
  * @param codePoint - The symbol to handle.
  */
  private handleAfterTag (codePoint : CodePoint) : void {
    if (
      (codePoint >= CodePoint.a    && codePoint <= CodePoint.z)    ||
      (codePoint >= CodePoint.A    && codePoint <= CodePoint.Z)    ||
      (codePoint >= CodePoint.ZERO && codePoint <= CodePoint.NINE) ||
      (codePoint === CodePoint.MINUS)
    ) {
      this._symbols.push(codePoint)
      this.location.add(0, 1, 1)
    } else {
      switch (codePoint) {
        case CodePoint.TABULATION:
        case CodePoint.ANTISLASH:
        case CodePoint.SPACE:
        case CodePoint.FORM_FEED:
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
          this.location.add(0, 1, 1)
          break
      }
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
      case CodePoint.FORM_FEED:
      case CodePoint.NEW_LINE:
      case CodePoint.ANTISLASH:
      case CodePoint.CARRIAGE_RETURN:
      case CodePoint.OPENING_BRACE:
      case CodePoint.CLOSING_BRACE:
        this.emitWord()
        this._state = UnidocLexerState.START
        this.handleAfterStart(codePoint)
        break
      default:
        this._symbols.push(codePoint)
        this.location.add(0, 1, 1)
        break
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
        this.location.add(0, 0, 1)
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
      case CodePoint.FORM_FEED:
        this._symbols.push(codePoint)
        this.location.add(0, 1, 1)
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
      codePoint >= CodePoint.a && codePoint <= CodePoint.z       ||
      codePoint >= CodePoint.A && codePoint <= CodePoint.Z       ||
      codePoint >= CodePoint.ZERO && codePoint <= CodePoint.NINE ||
      codePoint === CodePoint.MINUS
    ) {
      this._symbols.push(codePoint)
      this._state = UnidocLexerState.CLASS
      this.location.add(0, 1, 1)
    } else {
      switch (codePoint) {
        case CodePoint.SPACE:
        case CodePoint.TABULATION:
        case CodePoint.FORM_FEED:
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
          this._state = UnidocLexerState.WORD
          this.location.add(0, 1, 1)
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
      this.location.add(0, 1, 1)
    } else {
      switch (codePoint) {
        case CodePoint.TABULATION:
        case CodePoint.ANTISLASH:
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
          this.location.add(0, 1, 1)
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
      codePoint >= CodePoint.a && codePoint <= CodePoint.z       ||
      codePoint >= CodePoint.A && codePoint <= CodePoint.Z       ||
      codePoint >= CodePoint.ZERO && codePoint <= CodePoint.NINE ||
      codePoint === CodePoint.MINUS
    ) {
      this._symbols.push(codePoint)
      this._state = UnidocLexerState.IDENTIFIER
      this.location.add(0, 1, 1)
    } else {
      switch (codePoint) {
        case CodePoint.SPACE:
        case CodePoint.TABULATION:
        case CodePoint.FORM_FEED:
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
          this._state = UnidocLexerState.WORD
          this.location.add(0, 1, 1)
          break
      }
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
      this.location.add(0, 1, 1)
    } else {
      switch (codePoint) {
        case CodePoint.TABULATION:
        case CodePoint.ANTISLASH:
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
          this.location.add(0, 1, 1)
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
        this.location.add(0, 1, 1)
        this.emitBlockStart()
        break
      case CodePoint.CLOSING_BRACE:
        this.location.add(0, 1, 1)
        this.emitBlockEnd()
        break
      case CodePoint.ANTISLASH:
        this._symbols.push(codePoint)
        this._state = UnidocLexerState.ANTISLASH
        this.location.add(0, 1, 1)
        break
      case CodePoint.SPACE:
      case CodePoint.TABULATION:
      case CodePoint.FORM_FEED:
        this._state = UnidocLexerState.SPACE
        this.nextCodePoint(codePoint)
        break
      case CodePoint.NEW_LINE:
        this._symbols.push(codePoint)
        this._from.copy(this.location)
        this.location.add(1, 0, 1)
        this.location.column = 0
        this.emitNewLine()
        break
      case CodePoint.CARRIAGE_RETURN:
        this._symbols.push(codePoint)
        this._state = UnidocLexerState.CARRIAGE_RETURN
        this._from.copy(this.location)
        this.location.add(1, 0, 1)
        this.location.column = 0
        break
      case CodePoint.SHARP:
        this._symbols.push(codePoint)
        this._state = UnidocLexerState.SHARP
        this.location.add(0, 1, 1)
        break
      case CodePoint.DOT:
        this._symbols.push(codePoint)
        this._state = UnidocLexerState.DOT
        this.location.add(0, 1, 1)
        break
      default:
        this._symbols.push(codePoint)
        this._state = UnidocLexerState.WORD
        this.location.add(0, 1, 1)
        break
    }
  }

  /**
  * Configure a WORD token instance and emit it.
  */
  private emitWord () : void {
    this._token.clear()
    this._token.from.copy(this.location)
    this._token.from.subtract(0, this._symbols.size, this._symbols.size)
    this._token.to.copy(this.location)
    this._token.symbols.copy(this._symbols)
    this._symbols.clear()
    this._token.type = UnidocTokenType.WORD

    this.emitToken(this._token)
  }

  /**
  * Configure a TAG token instance and emit it.
  */
  private emitTag () : void {
    this._token.clear()
    this._token.from.copy(this.location)
    this._token.from.subtract(0, this._symbols.size, this._symbols.size)
    this._token.to.copy(this.location)
    this._token.symbols.copy(this._symbols)
    this._symbols.clear()
    this._token.type = UnidocTokenType.TAG

    this.emitToken(this._token)
  }

  /**
  * Configure a CLASS token instance and emit it.
  */
  private emitClass () : void {
    this._token.clear()
    this._token.from.copy(this.location)
    this._token.from.subtract(0, this._symbols.size, this._symbols.size)
    this._token.to.copy(this.location)
    this._token.symbols.copy(this._symbols)
    this._symbols.clear()
    this._token.type = UnidocTokenType.CLASS

    this.emitToken(this._token)
  }

  /**
  * Configure a IDENTIFIER token instance and emit it.
  */
  private emitIdentifier () : void {
    this._token.clear()
    this._token.from.copy(this.location)
    this._token.from.subtract(0, this._symbols.size, this._symbols.size)
    this._token.to.copy(this.location)
    this._token.symbols.copy(this._symbols)
    this._symbols.clear()
    this._token.type = UnidocTokenType.IDENTIFIER

    this.emitToken(this._token)
  }

  /**
  * Configure a SPACE token instance and emit it.
  */
  private emitSpace () : void {
    this._token.clear()
    this._token.from.copy(this.location)
    this._token.from.subtract(0, this._symbols.size, this._symbols.size)
    this._token.to.copy(this.location)
    this._token.symbols.copy(this._symbols)
    this._symbols.clear()
    this._token.type = UnidocTokenType.SPACE

    this.emitToken(this._token)
  }

  /**
  * Configure a NEW_LINE token instance and emit it.
  */
  private emitNewLine () : void {
    this._token.clear()
    this._token.from.copy(this._from)
    this._token.to.copy(this.location)
    this._token.symbols.copy(this._symbols)
    this._symbols.clear()
    this._token.type = UnidocTokenType.NEW_LINE

    this.emitToken(this._token)
  }

  /**
  * Configure a BLOCK_START token instance and emit it.
  */
  private emitBlockStart () : void {
    this._token.clear()
    this._token.from.copy(this.location)
    this._token.from.subtract(0, 1, 1)
    this._token.to.copy(this.location)
    this._token.symbols.push(CodePoint.OPENING_BRACE)
    this._token.type = UnidocTokenType.BLOCK_START

    this.emitToken(this._token)
  }

  /**
  * Configure a BLOCK_END token instance and emit it.
  */
  private emitBlockEnd () : void {
    this._token.clear()
    this._token.from.copy(this.location)
    this._token.from.subtract(0, 1, 1)
    this._token.to.copy(this.location)
    this._token.symbols.push(CodePoint.CLOSING_BRACE)
    this._token.type = UnidocTokenType.BLOCK_END

    this.emitToken(this._token)
  }

  /**
  * Notify this lexer's listeners that the given token was discovered.
  *
  * @param token - A discovered token to publish.
  */
  private emitToken (token : UnidocToken) : void {
    for (const listener of this._tokenListeners) {
      listener(token)
    }
  }

  /**
  * Notify this lexer's listeners that this lexer finished is work.
  */
  private emitCompletion () : void {
    for (const listener of this._completionListeners) {
      listener()
    }
  }

  /**
  * Add the given listener to this lexer set of listeners.
  *
  * @param type - Type of event to listen to.
  * @param listener - A listener to call then the given type of event happens.
  */
  public addEventListener (type : 'token', listener : UnidocLexer.TokenListener) : void
  public addEventListener (type : 'validation', listener : UnidocLexer.ValidationListener) : void
  public addEventListener (type : 'completion', listener : UnidocLexer.CompletionListener) : void
  public addEventListener (type : 'error', listener : UnidocLexer.ErrorListener) : void
  public addEventListener (type : UnidocLexerEventType, listener : any) : void {
    if (type === UnidocLexerEventType.TOKEN) {
      this._tokenListeners.add(listener)
    } else if (type === UnidocLexerEventType.VALIDATION) {
      this._validationListeners.add(listener)
    } else if (type === UnidocLexerEventType.COMPLETION) {
      this._completionListeners.add(listener)
    } else if (type === UnidocLexerEventType.ERROR) {
      this._errorListeners.add(listener)
    } else {
      throw new Error(
        'Unable to add the given listener for the "' + type +
        '" type of event because "' + type + '" is not a valid unidoc lexer ' +
        'event type, valid event types are : ' +
        UnidocLexerEventType.ALL.join(', ') + '.'
      )
    }
  }

  /**
  * Remove a registered event listener.
  *
  * @param type - Type of event to stop to listen to.
  * @param listener - A listener to remove.
  */
  public removeEventListener (type : 'token', listener : UnidocLexer.TokenListener) : void
  public removeEventListener (type : 'validation', listener : UnidocLexer.ValidationListener) : void
  public removeEventListener (type : 'completion', listener : UnidocLexer.CompletionListener) : void
  public removeEventListener (type : 'error', listener : UnidocLexer.ErrorListener) : void
  public removeEventListener (type : UnidocLexerEventType, listener : any) : void {
    if (type === UnidocLexerEventType.TOKEN) {
      this._tokenListeners.delete(listener)
    } else if (type === UnidocLexerEventType.VALIDATION) {
      this._validationListeners.delete(listener)
    } else if (type === UnidocLexerEventType.COMPLETION) {
      this._completionListeners.delete(listener)
    } else if (type === UnidocLexerEventType.ERROR) {
      this._errorListeners.delete(listener)
    } else {
      throw new Error(
        'Unable to remove the given listener for the "' + type +
        '" type of event because "' + type + '" is not a valid unidoc lexer ' +
        'event type, valid event types are : ' +
        UnidocLexerEventType.ALL.join(', ') + '.'
      )
    }
  }

  /**
  * Reset this lexer in order to reuse-it.
  */
  public clear () : void {
    this._token.clear()
    this._state = UnidocLexerState.START
    this.location.clear()
    this._symbols.clear()

    this._tokenListeners.clear()
    this._validationListeners.clear()
    this._completionListeners.clear()
    this._errorListeners.clear()
  }
}

export namespace UnidocLexer {
  export type TokenListener      = (token : UnidocToken) => void
  export type ValidationListener = (validation : UnidocValidation) => void
  export type CompletionListener = () => void
  export type ErrorListener      = (error : Error) => void
}
