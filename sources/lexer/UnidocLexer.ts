import { UTF32CodeUnit } from '../symbol/UTF32CodeUnit'
import { UnidocSymbol } from '../symbol/UnidocSymbol'

import { UnidocToken } from '../token/UnidocToken'
import { UnidocTokenType } from '../token/UnidocTokenType'
import { UnidocTokenBuilder } from '../token/UnidocTokenBuilder'

import { UnidocFunction } from '../stream/UnidocFunction'
import { UnidocSink } from '../stream/UnidocSink'

import { UnidocLexerState } from './UnidocLexerState'

/**
* Unidoc lexer.
*/
export class UnidocLexer extends UnidocFunction<UnidocSymbol, UnidocToken>
{
  /**
  * Current state of this lexer.
  */
  private _state: UnidocLexerState

  /**
  * Token instance used to publish discovered tokens.
  */
  private readonly _token: UnidocTokenBuilder

  /**
  * Instantiate a new unidoc lexer.
  *
  * @param [capacity = 64] - Unidoc lexer internal symbol buffer capacity.
  */
  public constructor(capacity: number = 64) {
    super()

    this._state = UnidocLexerState.START
    this._token = new UnidocTokenBuilder(capacity)
  }

  /**
  * @return The current state of this lexer.
  */
  public get state(): UnidocLexerState {
    return this._state
  }

  /**
  * @see UnidocConsumer.handleInitialization
  */
  public start(): void {

  }

  /**
  * @see UnidocConsumer.handleFailure
  */
  public failure(error: Error): void {
    this.output.fail(error)
  }

  /**
  * Feed this lexer with the given symbol.
  *
  * @param codePoint - A symbol to give to this lexer.
  */
  public next(symbol: UnidocSymbol): void {
    switch (this._state) {
      case UnidocLexerState.SPACE:
        return this.nextAfterSpace(symbol)
      case UnidocLexerState.CARRIAGE_RETURN:
        return this.nextAfterCarriageReturn(symbol)
      case UnidocLexerState.NUMBER_SIGN:
        return this.nextAfterSharp(symbol)
      case UnidocLexerState.IDENTIFIER:
        return this.nextAfterIdentifier(symbol)
      case UnidocLexerState.FULL_STOP:
        return this.nextAfterDot(symbol)
      case UnidocLexerState.CLASS:
        return this.nextAfterClass(symbol)
      case UnidocLexerState.REVERSE_SOLIDUS:
        return this.nextAfterAntislash(symbol)
      case UnidocLexerState.TAG:
        return this.nextAfterTag(symbol)
      case UnidocLexerState.WORD:
        return this.nextAfterWord(symbol)
      default:
        return this.nextAfterStart(symbol)
    }
  }

  /**
  * Notify to this lexer that the stream of symbol has terminated.
  */
  public success(): void {
    switch (this._state) {
      case UnidocLexerState.END:
        //this.error()
        break
      case UnidocLexerState.NUMBER_SIGN:
      case UnidocLexerState.FULL_STOP:
      case UnidocLexerState.REVERSE_SOLIDUS:
        this.emit(UnidocTokenType.WORD)
        break
      case UnidocLexerState.SPACE:
        this.emit(UnidocTokenType.SPACE)
        break
      case UnidocLexerState.CARRIAGE_RETURN:
        this.emit(UnidocTokenType.NEW_LINE)
        break
      case UnidocLexerState.TAG:
        this.emit(UnidocTokenType.TAG)
        break
      case UnidocLexerState.WORD:
        this.emit(UnidocTokenType.WORD)
        break
      case UnidocLexerState.IDENTIFIER:
        this.emit(UnidocTokenType.IDENTIFIER)
        break
      case UnidocLexerState.CLASS:
        this.emit(UnidocTokenType.CLASS)
        break
      case UnidocLexerState.START:
        break
    }

    this._state = UnidocLexerState.END
    this.output.success()
  }

  /**
  * Handle the given symbol after an antislash.
  *
  * @param symbol - The symbol to handle.
  */
  private nextAfterAntislash(symbol: UnidocSymbol): void {
    const codePoint: UTF32CodeUnit = symbol.code

    if (
      (codePoint >= UTF32CodeUnit.LATIN_SMALL_LETTER_A && codePoint <= UTF32CodeUnit.LATIN_SMALL_LETTER_Z) ||
      (codePoint >= UTF32CodeUnit.LATIN_CAPITAL_LETTER_A && codePoint <= UTF32CodeUnit.LATIN_CAPITAL_LETTER_Z) ||
      (codePoint >= UTF32CodeUnit.ZERO && codePoint <= UTF32CodeUnit.NINE) ||
      (codePoint === UTF32CodeUnit.MINUS) ||
      (codePoint === UTF32CodeUnit.COLON)
    ) {
      this._token.appendSymbol(codePoint).setTo(symbol.origin.to)
      this._state = UnidocLexerState.TAG
    } else {
      switch (codePoint) {
        case UTF32CodeUnit.SPACE:
        case UTF32CodeUnit.HORIZONTAL_TABULATION:
        case UTF32CodeUnit.FORM_FEED:
        case UTF32CodeUnit.NEW_LINE:
        case UTF32CodeUnit.CARRIAGE_RETURN:
          this.emit(UnidocTokenType.WORD)
          this._state = UnidocLexerState.START
          this.nextAfterStart(symbol)
          break
        default:
          this._token.appendSymbol(codePoint).setTo(symbol.origin.to)
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
  private nextAfterTag(symbol: UnidocSymbol): void {
    const codePoint: UTF32CodeUnit = symbol.code

    if (
      (codePoint >= UTF32CodeUnit.LATIN_SMALL_LETTER_A && codePoint <= UTF32CodeUnit.LATIN_SMALL_LETTER_Z) ||
      (codePoint >= UTF32CodeUnit.LATIN_CAPITAL_LETTER_A && codePoint <= UTF32CodeUnit.LATIN_CAPITAL_LETTER_Z) ||
      (codePoint >= UTF32CodeUnit.ZERO && codePoint <= UTF32CodeUnit.NINE) ||
      (codePoint === UTF32CodeUnit.MINUS)
    ) {
      this._token.appendSymbol(codePoint).setTo(symbol.origin.to)
    } else {
      switch (codePoint) {
        case UTF32CodeUnit.HORIZONTAL_TABULATION:
        case UTF32CodeUnit.REVERSE_SOLIDUS:
        case UTF32CodeUnit.SPACE:
        case UTF32CodeUnit.FORM_FEED:
        case UTF32CodeUnit.NEW_LINE:
        case UTF32CodeUnit.CARRIAGE_RETURN:
        case UTF32CodeUnit.FULL_STOP:
        case UTF32CodeUnit.NUMBER_SIGN:
        case UTF32CodeUnit.LEFT_CURLY_BRACKET:
        case UTF32CodeUnit.RIGHT_CURLY_BRACKET:
          this.emit(UnidocTokenType.TAG)
          this._state = UnidocLexerState.START
          this.nextAfterStart(symbol)
          break
        default:
          this._token.appendSymbol(codePoint).setTo(symbol.origin.to)
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
  private nextAfterWord(symbol: UnidocSymbol): void {
    const codePoint: UTF32CodeUnit = symbol.code

    switch (codePoint) {
      case UTF32CodeUnit.HORIZONTAL_TABULATION:
      case UTF32CodeUnit.SPACE:
      case UTF32CodeUnit.FORM_FEED:
      case UTF32CodeUnit.NEW_LINE:
      case UTF32CodeUnit.REVERSE_SOLIDUS:
      case UTF32CodeUnit.CARRIAGE_RETURN:
      case UTF32CodeUnit.LEFT_CURLY_BRACKET:
      case UTF32CodeUnit.RIGHT_CURLY_BRACKET:
        this.emit(UnidocTokenType.WORD)
        this._state = UnidocLexerState.START
        this.nextAfterStart(symbol)
        break
      default:
        this._token.appendSymbol(codePoint).setTo(symbol.origin.to)
        break
    }
  }

  /**
  * Handle the given symbol after a carriage return.
  *
  * @param symbol - The symbol to handle.
  */
  private nextAfterCarriageReturn(symbol: UnidocSymbol): void {
    const codePoint: UTF32CodeUnit = symbol.code

    switch (codePoint) {
      case UTF32CodeUnit.NEW_LINE:
        this._token.appendSymbol(codePoint).setTo(symbol.origin.to)
        this.emit(UnidocTokenType.NEW_LINE)
        this._state = UnidocLexerState.START
        break
      default:
        this.emit(UnidocTokenType.NEW_LINE)
        this._state = UnidocLexerState.START
        this.nextAfterStart(symbol)
        break
    }
  }

  /**
  * Handle the given symbol after a space.
  *
  * @param symbol - The symbol to handle.
  */
  private nextAfterSpace(symbol: UnidocSymbol): void {
    const codePoint: UTF32CodeUnit = symbol.code

    switch (codePoint) {
      case UTF32CodeUnit.SPACE:
      case UTF32CodeUnit.HORIZONTAL_TABULATION:
      case UTF32CodeUnit.FORM_FEED:
        this._token.appendSymbol(codePoint).setTo(symbol.origin.to)
        break
      default:
        this.emit(UnidocTokenType.SPACE)
        this._state = UnidocLexerState.START
        this.nextAfterStart(symbol)
        break
    }
  }

  /**
  * Handle the given symbol after a dot.
  *
  * @param symbol - The symbol to handle.
  */
  private nextAfterDot(symbol: UnidocSymbol): void {
    const codePoint: UTF32CodeUnit = symbol.code

    if (
      codePoint >= UTF32CodeUnit.LATIN_SMALL_LETTER_A && codePoint <= UTF32CodeUnit.LATIN_SMALL_LETTER_Z ||
      codePoint >= UTF32CodeUnit.LATIN_CAPITAL_LETTER_A && codePoint <= UTF32CodeUnit.LATIN_CAPITAL_LETTER_Z ||
      codePoint >= UTF32CodeUnit.ZERO && codePoint <= UTF32CodeUnit.NINE ||
      codePoint === UTF32CodeUnit.MINUS
    ) {
      this._token.appendSymbol(codePoint).setTo(symbol.origin.to)
      this._state = UnidocLexerState.CLASS
    } else {
      switch (codePoint) {
        case UTF32CodeUnit.SPACE:
        case UTF32CodeUnit.HORIZONTAL_TABULATION:
        case UTF32CodeUnit.FORM_FEED:
        case UTF32CodeUnit.NEW_LINE:
        case UTF32CodeUnit.CARRIAGE_RETURN:
        case UTF32CodeUnit.LEFT_CURLY_BRACKET:
        case UTF32CodeUnit.RIGHT_CURLY_BRACKET:
          this.emit(UnidocTokenType.WORD)
          this._state = UnidocLexerState.START
          this.nextAfterStart(symbol)
          break
        default:
          this._token.appendSymbol(codePoint).setTo(symbol.origin.to)
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
  private nextAfterClass(symbol: UnidocSymbol): void {
    const codePoint: UTF32CodeUnit = symbol.code

    if (
      codePoint >= UTF32CodeUnit.LATIN_SMALL_LETTER_A && codePoint <= UTF32CodeUnit.LATIN_SMALL_LETTER_Z ||
      codePoint >= UTF32CodeUnit.LATIN_CAPITAL_LETTER_A && codePoint <= UTF32CodeUnit.LATIN_CAPITAL_LETTER_Z ||
      codePoint >= UTF32CodeUnit.ZERO && codePoint <= UTF32CodeUnit.NINE ||
      codePoint === UTF32CodeUnit.MINUS
    ) {
      this._token.appendSymbol(codePoint).setTo(symbol.origin.to)
    } else {
      switch (codePoint) {
        case UTF32CodeUnit.HORIZONTAL_TABULATION:
        case UTF32CodeUnit.REVERSE_SOLIDUS:
        case UTF32CodeUnit.SPACE:
        case UTF32CodeUnit.NEW_LINE:
        case UTF32CodeUnit.CARRIAGE_RETURN:
        case UTF32CodeUnit.FULL_STOP:
        case UTF32CodeUnit.NUMBER_SIGN:
        case UTF32CodeUnit.LEFT_CURLY_BRACKET:
        case UTF32CodeUnit.RIGHT_CURLY_BRACKET:
          this.emit(UnidocTokenType.CLASS)
          this._state = UnidocLexerState.START
          this.nextAfterStart(symbol)
          break
        default:
          this._token.appendSymbol(codePoint).setTo(symbol.origin.to)
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
  private nextAfterSharp(symbol: UnidocSymbol): void {
    const codePoint: UTF32CodeUnit = symbol.code

    if (
      codePoint >= UTF32CodeUnit.LATIN_SMALL_LETTER_A && codePoint <= UTF32CodeUnit.LATIN_SMALL_LETTER_Z ||
      codePoint >= UTF32CodeUnit.LATIN_CAPITAL_LETTER_A && codePoint <= UTF32CodeUnit.LATIN_CAPITAL_LETTER_Z ||
      codePoint >= UTF32CodeUnit.ZERO && codePoint <= UTF32CodeUnit.NINE ||
      codePoint === UTF32CodeUnit.MINUS
    ) {
      this._token.appendSymbol(codePoint).setTo(symbol.origin.to)
      this._state = UnidocLexerState.IDENTIFIER
    } else {
      switch (codePoint) {
        case UTF32CodeUnit.SPACE:
        case UTF32CodeUnit.HORIZONTAL_TABULATION:
        case UTF32CodeUnit.FORM_FEED:
        case UTF32CodeUnit.NEW_LINE:
        case UTF32CodeUnit.CARRIAGE_RETURN:
        case UTF32CodeUnit.LEFT_CURLY_BRACKET:
        case UTF32CodeUnit.RIGHT_CURLY_BRACKET:
          this.emit(UnidocTokenType.WORD)
          this._state = UnidocLexerState.START
          this.nextAfterStart(symbol)
          break
        default:
          this._token.appendSymbol(codePoint).setTo(symbol.origin.to)
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
  private nextAfterIdentifier(symbol: UnidocSymbol): void {
    const codePoint: UTF32CodeUnit = symbol.code

    if (
      codePoint >= UTF32CodeUnit.LATIN_SMALL_LETTER_A && codePoint <= UTF32CodeUnit.LATIN_SMALL_LETTER_Z ||
      codePoint >= UTF32CodeUnit.LATIN_CAPITAL_LETTER_A && codePoint <= UTF32CodeUnit.LATIN_CAPITAL_LETTER_Z ||
      codePoint >= UTF32CodeUnit.ZERO && codePoint <= UTF32CodeUnit.NINE ||
      codePoint === UTF32CodeUnit.MINUS
    ) {
      this._token.appendSymbol(codePoint).setTo(symbol.origin.to)
    } else {
      switch (codePoint) {
        case UTF32CodeUnit.HORIZONTAL_TABULATION:
        case UTF32CodeUnit.REVERSE_SOLIDUS:
        case UTF32CodeUnit.SPACE:
        case UTF32CodeUnit.NEW_LINE:
        case UTF32CodeUnit.CARRIAGE_RETURN:
        case UTF32CodeUnit.FULL_STOP:
        case UTF32CodeUnit.NUMBER_SIGN:
        case UTF32CodeUnit.LEFT_CURLY_BRACKET:
        case UTF32CodeUnit.RIGHT_CURLY_BRACKET:
          this.emit(UnidocTokenType.IDENTIFIER)
          this._state = UnidocLexerState.START
          this.nextAfterStart(symbol)
          break
        default:
          this._token.appendSymbol(codePoint).setTo(symbol.origin.to)
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
  private nextAfterStart(symbol: UnidocSymbol): void {
    const codePoint: UTF32CodeUnit = symbol.code
    this._token.appendSymbol(codePoint).setOrigin(symbol.origin.from, symbol.origin.to)

    switch (codePoint) {
      case UTF32CodeUnit.LEFT_CURLY_BRACKET:
        this.emit(UnidocTokenType.BLOCK_START)
        break
      case UTF32CodeUnit.RIGHT_CURLY_BRACKET:
        this.emit(UnidocTokenType.BLOCK_END)
        break
      case UTF32CodeUnit.REVERSE_SOLIDUS:
        this._state = UnidocLexerState.REVERSE_SOLIDUS
        break
      case UTF32CodeUnit.SPACE:
      case UTF32CodeUnit.HORIZONTAL_TABULATION:
      case UTF32CodeUnit.FORM_FEED:
        this._state = UnidocLexerState.SPACE
        break
      case UTF32CodeUnit.NEW_LINE:
        this.emit(UnidocTokenType.NEW_LINE)
        break
      case UTF32CodeUnit.CARRIAGE_RETURN:
        this._state = UnidocLexerState.CARRIAGE_RETURN
        break
      case UTF32CodeUnit.NUMBER_SIGN:
        this._state = UnidocLexerState.NUMBER_SIGN
        break
      case UTF32CodeUnit.FULL_STOP:
        this._state = UnidocLexerState.FULL_STOP
        break
      default:
        this._state = UnidocLexerState.WORD
        break
    }
  }

  /**
   * 
   */
  private emit(type: UnidocTokenType): void {
    const token: UnidocTokenBuilder = this._token
    const output: UnidocSink<UnidocToken> = this.output

    if (token.index === 0) {
      output.start()
    }

    token.setType(type)
    output.next(token.get())
    token.setOrigin(token.to).clearSymbols()
    token.incrementIndex()
  }

  /**
  * Reset this lexer in order to reuse-it.
  */
  public clear(): void {
    this._state = UnidocLexerState.START
    this._token.clear()
    this.off()
  }
}
