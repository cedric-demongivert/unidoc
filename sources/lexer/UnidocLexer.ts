import { CodePoint } from '../symbol/CodePoint'
import { UnidocSymbol } from '../symbol/UnidocSymbol'
import { UnidocSymbolBuffer } from '../symbol/UnidocSymbolBuffer'

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
  * Current state of this lexer.
  */
  private _state : UnidocLexerState

  /**
  * Token instance used to publish discovered tokens.
  */
  private _symbols : UnidocSymbolBuffer

  /**
  * Token instance used to publish discovered tokens.
  */
  private _token : UnidocToken

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
    this._state               = UnidocLexerState.START
    this._symbols             = new UnidocSymbolBuffer(capacity)
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
  * Feed this lexer with the given symbol.
  *
  * @param codePoint - A symbol to give to this lexer.
  */
  public next (symbol : UnidocSymbol) : void {
    switch (this._state) {
      case UnidocLexerState.SPACE:
        this.handleAfterSpace(symbol)
        break
      case UnidocLexerState.CARRIAGE_RETURN:
        this.handleAfterCarriageReturn(symbol)
        break
      case UnidocLexerState.SHARP:
        this.handleAfterSharp(symbol)
        break
      case UnidocLexerState.IDENTIFIER:
        this.handleAfterIdentifier(symbol)
        break
      case UnidocLexerState.DOT:
        this.handleAfterDot(symbol)
        break
      case UnidocLexerState.CLASS:
        this.handleAfterClass(symbol)
        break
      case UnidocLexerState.ANTISLASH:
        this.handleAfterAntislash(symbol)
        break
      case UnidocLexerState.TAG:
        this.handleAfterTag(symbol)
        break
      case UnidocLexerState.WORD:
        this.handleAfterWord(symbol)
        break
      default:
        this.handleAfterStart(symbol)
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
        this.emitBuffer(UnidocTokenType.WORD)
        break
      case UnidocLexerState.SPACE:
        this.emitBuffer(UnidocTokenType.SPACE)
        break
      case UnidocLexerState.CARRIAGE_RETURN:
        this.emitBuffer(UnidocTokenType.NEW_LINE)
        break
      case UnidocLexerState.TAG:
        this.emitBuffer(UnidocTokenType.TAG)
        break
      case UnidocLexerState.WORD:
        this.emitBuffer(UnidocTokenType.WORD)
        break
      case UnidocLexerState.IDENTIFIER:
        this.emitBuffer(UnidocTokenType.IDENTIFIER)
        break
      case UnidocLexerState.CLASS:
        this.emitBuffer(UnidocTokenType.CLASS)
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
  * @param symbol - The symbol to handle.
  */
  private handleAfterAntislash (symbol : UnidocSymbol) : void {
    const codePoint : CodePoint = symbol.symbol

    if (
      (codePoint >= CodePoint.a    && codePoint <= CodePoint.z)    ||
      (codePoint >= CodePoint.A    && codePoint <= CodePoint.Z)    ||
      (codePoint >= CodePoint.ZERO && codePoint <= CodePoint.NINE) ||
      (codePoint === CodePoint.MINUS)
    ) {
      this._symbols.bufferize(symbol)
      this._state = UnidocLexerState.TAG
    } else {
      switch (codePoint) {
        case CodePoint.SPACE:
        case CodePoint.TABULATION:
        case CodePoint.FORM_FEED:
        case CodePoint.NEW_LINE:
        case CodePoint.CARRIAGE_RETURN:
          this.emitBuffer(UnidocTokenType.WORD)
          this._state = UnidocLexerState.START
          this.handleAfterStart(symbol)
          break
        default:
          this._symbols.bufferize(symbol)
          this._state = UnidocLexerState.WORD
          break
      }
    }
  }

  /**
  * Handle the given symbol after a tag.
  *
  * @param symbol - The symbol to handle.
  */
  private handleAfterTag (symbol : UnidocSymbol) : void {
    const codePoint : CodePoint = symbol.symbol

    if (
      (codePoint >= CodePoint.a    && codePoint <= CodePoint.z)    ||
      (codePoint >= CodePoint.A    && codePoint <= CodePoint.Z)    ||
      (codePoint >= CodePoint.ZERO && codePoint <= CodePoint.NINE) ||
      (codePoint === CodePoint.MINUS)
    ) {
      this._symbols.bufferize(symbol)
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
          this.emitBuffer(UnidocTokenType.TAG)
          this._state = UnidocLexerState.START
          this.handleAfterStart(symbol)
          break
        default:
          this._symbols.bufferize(symbol)
          this._state = UnidocLexerState.WORD
          break
      }
    }
  }

  /**
  * Handle the given symbol after a word.
  *
  * @param symbol - The symbol to handle.
  */
  private handleAfterWord (symbol : UnidocSymbol) : void {
    const codePoint : CodePoint = symbol.symbol

    switch (codePoint) {
      case CodePoint.TABULATION:
      case CodePoint.SPACE:
      case CodePoint.FORM_FEED:
      case CodePoint.NEW_LINE:
      case CodePoint.ANTISLASH:
      case CodePoint.CARRIAGE_RETURN:
      case CodePoint.OPENING_BRACE:
      case CodePoint.CLOSING_BRACE:
        this.emitBuffer(UnidocTokenType.WORD)
        this._state = UnidocLexerState.START
        this.handleAfterStart(symbol)
        break
      default:
        this._symbols.bufferize(symbol)
        break
    }
  }

  /**
  * Handle the given symbol after a carriage return.
  *
  * @param symbol - The symbol to handle.
  */
  private handleAfterCarriageReturn (symbol : UnidocSymbol) : void {
    const codePoint : CodePoint = symbol.symbol

    switch (codePoint) {
      case CodePoint.NEW_LINE:
        this._symbols.bufferize(symbol)
        this.emitBuffer(UnidocTokenType.NEW_LINE)
        this._state = UnidocLexerState.START
        break
      default:
        this.emitBuffer(UnidocTokenType.NEW_LINE)
        this._state = UnidocLexerState.START
        this.handleAfterStart(symbol)
        break
    }
  }

  /**
  * Handle the given symbol after a space.
  *
  * @param symbol - The symbol to handle.
  */
  private handleAfterSpace (symbol : UnidocSymbol) : void {
    const codePoint : CodePoint = symbol.symbol

    switch (codePoint) {
      case CodePoint.SPACE:
      case CodePoint.TABULATION:
      case CodePoint.FORM_FEED:
        this._symbols.bufferize(symbol)
        break
      default:
        this.emitBuffer(UnidocTokenType.SPACE)
        this._state = UnidocLexerState.START
        this.handleAfterStart(symbol)
        break
    }
  }

  /**
  * Handle the given symbol after a dot.
  *
  * @param symbol - The symbol to handle.
  */
  private handleAfterDot (symbol : UnidocSymbol) : void {
    const codePoint : CodePoint = symbol.symbol

    if (
      codePoint >= CodePoint.a && codePoint <= CodePoint.z       ||
      codePoint >= CodePoint.A && codePoint <= CodePoint.Z       ||
      codePoint >= CodePoint.ZERO && codePoint <= CodePoint.NINE ||
      codePoint === CodePoint.MINUS
    ) {
      this._symbols.bufferize(symbol)
      this._state = UnidocLexerState.CLASS
    } else {
      switch (codePoint) {
        case CodePoint.SPACE:
        case CodePoint.TABULATION:
        case CodePoint.FORM_FEED:
        case CodePoint.NEW_LINE:
        case CodePoint.CARRIAGE_RETURN:
        case CodePoint.OPENING_BRACE:
        case CodePoint.CLOSING_BRACE:
          this.emitBuffer(UnidocTokenType.WORD)
          this._state = UnidocLexerState.START
          this.handleAfterStart(symbol)
          break
        default:
          this._symbols.bufferize(symbol)
          this._state = UnidocLexerState.WORD
          break
      }
    }
  }
  /**
  * Handle the given symbol after a class.
  *
  * @param symbol - The symbol to handle.
  */
  private handleAfterClass (symbol : UnidocSymbol) : void {
    const codePoint : CodePoint = symbol.symbol

    if (
      codePoint >= CodePoint.a    && codePoint <= CodePoint.z    ||
      codePoint >= CodePoint.A    && codePoint <= CodePoint.Z    ||
      codePoint >= CodePoint.ZERO && codePoint <= CodePoint.NINE ||
      codePoint === CodePoint.MINUS
    ) {
      this._symbols.bufferize(symbol)
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
          this.emitBuffer(UnidocTokenType.CLASS)
          this._state = UnidocLexerState.START
          this.handleAfterStart(symbol)
          break
        default:
          this._symbols.bufferize(symbol)
          this._state = UnidocLexerState.WORD
          break
      }
    }
  }

  /**
  * Handle the given symbol after a sharp.
  *
  * @param symbol - The symbol to handle.
  */
  private handleAfterSharp (symbol : UnidocSymbol) : void {
    const codePoint : CodePoint = symbol.symbol

    if (
      codePoint >= CodePoint.a && codePoint <= CodePoint.z       ||
      codePoint >= CodePoint.A && codePoint <= CodePoint.Z       ||
      codePoint >= CodePoint.ZERO && codePoint <= CodePoint.NINE ||
      codePoint === CodePoint.MINUS
    ) {
      this._symbols.bufferize(symbol)
      this._state = UnidocLexerState.IDENTIFIER
    } else {
      switch (codePoint) {
        case CodePoint.SPACE:
        case CodePoint.TABULATION:
        case CodePoint.FORM_FEED:
        case CodePoint.NEW_LINE:
        case CodePoint.CARRIAGE_RETURN:
        case CodePoint.OPENING_BRACE:
        case CodePoint.CLOSING_BRACE:
          this.emitBuffer(UnidocTokenType.WORD)
          this._state = UnidocLexerState.START
          this.handleAfterStart(symbol)
          break
        default:
          this._symbols.bufferize(symbol)
          this._state = UnidocLexerState.WORD
          break
      }
    }
  }

  /**
  * Handle the given symbol after an identifier.
  *
  * @param symbol - The symbol to handle.
  */
  private handleAfterIdentifier (symbol : UnidocSymbol) : void {
    const codePoint : CodePoint = symbol.symbol

    if (
      codePoint >= CodePoint.a    && codePoint <= CodePoint.z    ||
      codePoint >= CodePoint.A    && codePoint <= CodePoint.Z    ||
      codePoint >= CodePoint.ZERO && codePoint <= CodePoint.NINE ||
      codePoint === CodePoint.MINUS
    ) {
      this._symbols.bufferize(symbol)
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
          this.emitBuffer(UnidocTokenType.IDENTIFIER)
          this._state = UnidocLexerState.START
          this.handleAfterStart(symbol)
          break
        default:
          this._symbols.bufferize(symbol)
          this._state = UnidocLexerState.WORD
          break
      }
    }
  }

  /**
  * Handle the given symbol at the entry state of this lexer.
  *
  * @param symbol - The symbol to handle.
  */
  private handleAfterStart (symbol : UnidocSymbol) : void {
    const codePoint : CodePoint = symbol.symbol

    switch (codePoint) {
      case CodePoint.OPENING_BRACE:
        this._symbols.bufferize(symbol)
        this.emitBuffer(UnidocTokenType.BLOCK_START)
        break
      case CodePoint.CLOSING_BRACE:
        this._symbols.bufferize(symbol)
        this.emitBuffer(UnidocTokenType.BLOCK_END)
        break
      case CodePoint.ANTISLASH:
        this._symbols.bufferize(symbol)
        this._state = UnidocLexerState.ANTISLASH
        break
      case CodePoint.SPACE:
      case CodePoint.TABULATION:
      case CodePoint.FORM_FEED:
        this._state = UnidocLexerState.SPACE
        this.next(symbol)
        break
      case CodePoint.NEW_LINE:
        this._symbols.bufferize(symbol)
        this.emitBuffer(UnidocTokenType.NEW_LINE)
        break
      case CodePoint.CARRIAGE_RETURN:
        this._symbols.bufferize(symbol)
        this._state = UnidocLexerState.CARRIAGE_RETURN
        break
      case CodePoint.SHARP:
        this._symbols.bufferize(symbol)
        this._state = UnidocLexerState.SHARP
        break
      case CodePoint.DOT:
        this._symbols.bufferize(symbol)
        this._state = UnidocLexerState.DOT
        break
      default:
        this._symbols.bufferize(symbol)
        this._state = UnidocLexerState.WORD
        break
    }
  }

  private emitBuffer (type : UnidocTokenType) : void {
    this._token.clear()
    this._token.origin.from.copy(this._symbols.from)
    this._token.origin.to.copy(this._symbols.to)
    this._token.symbols.copy(this._symbols.symbols)
    this._symbols.clear()
    this._token.type = type

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
