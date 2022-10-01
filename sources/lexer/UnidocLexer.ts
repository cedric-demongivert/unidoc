import { UTF32CodeUnit } from '../symbol/UTF32CodeUnit'
import { UnidocSymbol } from '../symbol/UnidocSymbol'

import { UnidocToken } from '../token/UnidocToken'
import { UnidocTokenType } from '../token/UnidocTokenType'

import { UnidocProcess } from '../stream/UnidocProcess'
import { UnidocSink } from '../stream/UnidocSink'

import { UnidocLexerState } from './UnidocLexerState'
import { UnidocProducer } from 'sources/stream'

/**
* Unidoc lexer.
*/
export class UnidocLexer extends UnidocProcess<UnidocSymbol, UnidocToken>
{
  /**
  * Current state of this lexer.
  */
  private _state: UnidocLexerState

  /**
  * Token instance used to publish discovered tokens.
  */
  private readonly _token: UnidocToken

  /**
   * 
   */
  private _first: boolean

  /**
  * Instantiate a new unidoc lexer.
  *
  * @param [capacity = 64] - Unidoc lexer internal symbol buffer capacity.
  */
  public constructor(capacity: number = 64) {
    super()

    this._state = UnidocLexerState.START
    this._token = new UnidocToken(capacity)
    this._first = true
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
    this.output.failure(error)
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
    switch (symbol.code) {
      // Space
      case UTF32CodeUnit.SPACE:
      case UTF32CodeUnit.HORIZONTAL_TABULATION:
      case UTF32CodeUnit.NO_BREAK_SPACE:
      case UTF32CodeUnit.EN_QUAD:
      case UTF32CodeUnit.EM_QUAD:
      case UTF32CodeUnit.EN_SPACE:
      case UTF32CodeUnit.EM_SPACE:
      case UTF32CodeUnit.THREE_PER_EM_SPACE:
      case UTF32CodeUnit.FOUR_PER_EM_SPACE:
      case UTF32CodeUnit.SIX_PER_EM_SPACE:
      case UTF32CodeUnit.FIGURE_SPACE:
      case UTF32CodeUnit.PUNCTUATION_SPACE:
      case UTF32CodeUnit.THIN_SPACE:
      case UTF32CodeUnit.HAIR_SPACE:
      case UTF32CodeUnit.MEDIUM_MATHEMATICAL_SPACE:
      case UTF32CodeUnit.IDEOGRAPHIC_SPACE:
      case UTF32CodeUnit.OGHAM_SPACE_MARK:
      // New line
      case UTF32CodeUnit.VERTICAL_TABULATION:
      case UTF32CodeUnit.FORM_FEED:
      case UTF32CodeUnit.LINE_SEPARATOR:
      case UTF32CodeUnit.PARAGRAPH_SEPARATOR:
      case UTF32CodeUnit.NEXT_LINE:
      case UTF32CodeUnit.NEW_LINE:
      case UTF32CodeUnit.CARRIAGE_RETURN:
        this.emit(UnidocTokenType.WORD)
        this._state = UnidocLexerState.START
        this.nextAfterStart(symbol)
        break
      // "Escape sequence"
      case UTF32CodeUnit.FULL_STOP:
      case UTF32CodeUnit.NUMBER_SIGN:
      case UTF32CodeUnit.LEFT_CURLY_BRACKET:
      case UTF32CodeUnit.RIGHT_CURLY_BRACKET:
      case UTF32CodeUnit.REVERSE_SOLIDUS:
        this._token.appendSymbol(symbol)
        this._state = UnidocLexerState.WORD
        break
      default:
        this._token.appendSymbol(symbol)
        this._state = UnidocLexerState.TAG
        break
    }
  }

  /**
  * Handle the given symbol after a tag.
  *
  * @param symbol - The symbol to handle.
  */
  private nextAfterTag(symbol: UnidocSymbol): void {
    switch (symbol.code) {
      // Space
      case UTF32CodeUnit.SPACE:
      case UTF32CodeUnit.HORIZONTAL_TABULATION:
      case UTF32CodeUnit.NO_BREAK_SPACE:
      case UTF32CodeUnit.EN_QUAD:
      case UTF32CodeUnit.EM_QUAD:
      case UTF32CodeUnit.EN_SPACE:
      case UTF32CodeUnit.EM_SPACE:
      case UTF32CodeUnit.THREE_PER_EM_SPACE:
      case UTF32CodeUnit.FOUR_PER_EM_SPACE:
      case UTF32CodeUnit.SIX_PER_EM_SPACE:
      case UTF32CodeUnit.FIGURE_SPACE:
      case UTF32CodeUnit.PUNCTUATION_SPACE:
      case UTF32CodeUnit.THIN_SPACE:
      case UTF32CodeUnit.HAIR_SPACE:
      case UTF32CodeUnit.MEDIUM_MATHEMATICAL_SPACE:
      case UTF32CodeUnit.IDEOGRAPHIC_SPACE:
      case UTF32CodeUnit.OGHAM_SPACE_MARK:
      // New line
      case UTF32CodeUnit.VERTICAL_TABULATION:
      case UTF32CodeUnit.FORM_FEED:
      case UTF32CodeUnit.LINE_SEPARATOR:
      case UTF32CodeUnit.PARAGRAPH_SEPARATOR:
      case UTF32CodeUnit.NEXT_LINE:
      case UTF32CodeUnit.NEW_LINE:
      case UTF32CodeUnit.CARRIAGE_RETURN:
      // Other control
      case UTF32CodeUnit.FULL_STOP:
      case UTF32CodeUnit.NUMBER_SIGN:
      case UTF32CodeUnit.LEFT_CURLY_BRACKET:
      case UTF32CodeUnit.RIGHT_CURLY_BRACKET:
      case UTF32CodeUnit.REVERSE_SOLIDUS:
        this.emit(UnidocTokenType.TAG)
        this._state = UnidocLexerState.START
        this.nextAfterStart(symbol)
        break
      default:
        this._token.appendSymbol(symbol)
        break
    }
  }

  /**
  * Handle the given symbol after a word.
  *
  * @param symbol - The symbol to handle.
  */
  private nextAfterWord(symbol: UnidocSymbol): void {
    switch (symbol.code) {
      // Space
      case UTF32CodeUnit.SPACE:
      case UTF32CodeUnit.HORIZONTAL_TABULATION:
      case UTF32CodeUnit.NO_BREAK_SPACE:
      case UTF32CodeUnit.EN_QUAD:
      case UTF32CodeUnit.EM_QUAD:
      case UTF32CodeUnit.EN_SPACE:
      case UTF32CodeUnit.EM_SPACE:
      case UTF32CodeUnit.THREE_PER_EM_SPACE:
      case UTF32CodeUnit.FOUR_PER_EM_SPACE:
      case UTF32CodeUnit.SIX_PER_EM_SPACE:
      case UTF32CodeUnit.FIGURE_SPACE:
      case UTF32CodeUnit.PUNCTUATION_SPACE:
      case UTF32CodeUnit.THIN_SPACE:
      case UTF32CodeUnit.HAIR_SPACE:
      case UTF32CodeUnit.MEDIUM_MATHEMATICAL_SPACE:
      case UTF32CodeUnit.IDEOGRAPHIC_SPACE:
      case UTF32CodeUnit.OGHAM_SPACE_MARK:
      // New line
      case UTF32CodeUnit.VERTICAL_TABULATION:
      case UTF32CodeUnit.FORM_FEED:
      case UTF32CodeUnit.LINE_SEPARATOR:
      case UTF32CodeUnit.PARAGRAPH_SEPARATOR:
      case UTF32CodeUnit.NEXT_LINE:
      case UTF32CodeUnit.NEW_LINE:
      case UTF32CodeUnit.CARRIAGE_RETURN:
      // Other control
      case UTF32CodeUnit.LEFT_CURLY_BRACKET:
      case UTF32CodeUnit.RIGHT_CURLY_BRACKET:
      case UTF32CodeUnit.REVERSE_SOLIDUS: // @improvment Check escape sequence in word.
        this.emit(UnidocTokenType.WORD)
        this._state = UnidocLexerState.START
        this.nextAfterStart(symbol)
        break
      default:
        this._token.appendSymbol(symbol)
        break
    }
  }

  /**
  * Handle the given symbol after a carriage return.
  *
  * @param symbol - The symbol to handle.
  */
  private nextAfterCarriageReturn(symbol: UnidocSymbol): void {
    switch (symbol.code) {
      case UTF32CodeUnit.NEW_LINE:
        this._token.appendSymbol(symbol)
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
    switch (symbol.code) {
      // Space
      case UTF32CodeUnit.SPACE:
      case UTF32CodeUnit.HORIZONTAL_TABULATION:
      case UTF32CodeUnit.NO_BREAK_SPACE:
      case UTF32CodeUnit.EN_QUAD:
      case UTF32CodeUnit.EM_QUAD:
      case UTF32CodeUnit.EN_SPACE:
      case UTF32CodeUnit.EM_SPACE:
      case UTF32CodeUnit.THREE_PER_EM_SPACE:
      case UTF32CodeUnit.FOUR_PER_EM_SPACE:
      case UTF32CodeUnit.SIX_PER_EM_SPACE:
      case UTF32CodeUnit.FIGURE_SPACE:
      case UTF32CodeUnit.PUNCTUATION_SPACE:
      case UTF32CodeUnit.THIN_SPACE:
      case UTF32CodeUnit.HAIR_SPACE:
      case UTF32CodeUnit.MEDIUM_MATHEMATICAL_SPACE:
      case UTF32CodeUnit.IDEOGRAPHIC_SPACE:
      case UTF32CodeUnit.OGHAM_SPACE_MARK:
        this._token.appendSymbol(symbol)
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
    switch (symbol.code) {
      // Space
      case UTF32CodeUnit.SPACE:
      case UTF32CodeUnit.HORIZONTAL_TABULATION:
      case UTF32CodeUnit.NO_BREAK_SPACE:
      case UTF32CodeUnit.EN_QUAD:
      case UTF32CodeUnit.EM_QUAD:
      case UTF32CodeUnit.EN_SPACE:
      case UTF32CodeUnit.EM_SPACE:
      case UTF32CodeUnit.THREE_PER_EM_SPACE:
      case UTF32CodeUnit.FOUR_PER_EM_SPACE:
      case UTF32CodeUnit.SIX_PER_EM_SPACE:
      case UTF32CodeUnit.FIGURE_SPACE:
      case UTF32CodeUnit.PUNCTUATION_SPACE:
      case UTF32CodeUnit.THIN_SPACE:
      case UTF32CodeUnit.HAIR_SPACE:
      case UTF32CodeUnit.MEDIUM_MATHEMATICAL_SPACE:
      case UTF32CodeUnit.IDEOGRAPHIC_SPACE:
      case UTF32CodeUnit.OGHAM_SPACE_MARK:
      // New line
      case UTF32CodeUnit.VERTICAL_TABULATION:
      case UTF32CodeUnit.FORM_FEED:
      case UTF32CodeUnit.LINE_SEPARATOR:
      case UTF32CodeUnit.PARAGRAPH_SEPARATOR:
      case UTF32CodeUnit.NEXT_LINE:
      case UTF32CodeUnit.NEW_LINE:
      case UTF32CodeUnit.CARRIAGE_RETURN:
      // Other control
      case UTF32CodeUnit.LEFT_CURLY_BRACKET:
      case UTF32CodeUnit.RIGHT_CURLY_BRACKET:
      case UTF32CodeUnit.REVERSE_SOLIDUS:
        this.emit(UnidocTokenType.WORD)
        this._state = UnidocLexerState.START
        this.nextAfterStart(symbol)
        break
      case UTF32CodeUnit.FULL_STOP:
      case UTF32CodeUnit.NUMBER_SIGN:
        this._token.appendSymbol(symbol)
        this._state = UnidocLexerState.WORD
        break
      default:
        this._token.appendSymbol(symbol)
        this._state = UnidocLexerState.CLASS
        break
    }
  }
  /**
  * Handle the given symbol after a class.
  *
  * @param symbol - The symbol to handle.
  */
  private nextAfterClass(symbol: UnidocSymbol): void {
    switch (symbol.code) {
      // Space
      case UTF32CodeUnit.SPACE:
      case UTF32CodeUnit.HORIZONTAL_TABULATION:
      case UTF32CodeUnit.NO_BREAK_SPACE:
      case UTF32CodeUnit.EN_QUAD:
      case UTF32CodeUnit.EM_QUAD:
      case UTF32CodeUnit.EN_SPACE:
      case UTF32CodeUnit.EM_SPACE:
      case UTF32CodeUnit.THREE_PER_EM_SPACE:
      case UTF32CodeUnit.FOUR_PER_EM_SPACE:
      case UTF32CodeUnit.SIX_PER_EM_SPACE:
      case UTF32CodeUnit.FIGURE_SPACE:
      case UTF32CodeUnit.PUNCTUATION_SPACE:
      case UTF32CodeUnit.THIN_SPACE:
      case UTF32CodeUnit.HAIR_SPACE:
      case UTF32CodeUnit.MEDIUM_MATHEMATICAL_SPACE:
      case UTF32CodeUnit.IDEOGRAPHIC_SPACE:
      case UTF32CodeUnit.OGHAM_SPACE_MARK:
      // New line
      case UTF32CodeUnit.VERTICAL_TABULATION:
      case UTF32CodeUnit.FORM_FEED:
      case UTF32CodeUnit.LINE_SEPARATOR:
      case UTF32CodeUnit.PARAGRAPH_SEPARATOR:
      case UTF32CodeUnit.NEXT_LINE:
      case UTF32CodeUnit.NEW_LINE:
      case UTF32CodeUnit.CARRIAGE_RETURN:
      // Other control
      case UTF32CodeUnit.FULL_STOP:
      case UTF32CodeUnit.NUMBER_SIGN:
      case UTF32CodeUnit.LEFT_CURLY_BRACKET:
      case UTF32CodeUnit.RIGHT_CURLY_BRACKET:
      case UTF32CodeUnit.REVERSE_SOLIDUS:
        this.emit(UnidocTokenType.CLASS)
        this._state = UnidocLexerState.START
        this.nextAfterStart(symbol)
        break
      default:
        this._token.appendSymbol(symbol)
        break
    }
  }

  /**
  * Handle the given symbol after a sharp.
  *
  * @param symbol - The symbol to handle.
  */
  private nextAfterSharp(symbol: UnidocSymbol): void {
    switch (symbol.code) {
      // Space
      case UTF32CodeUnit.SPACE:
      case UTF32CodeUnit.HORIZONTAL_TABULATION:
      case UTF32CodeUnit.NO_BREAK_SPACE:
      case UTF32CodeUnit.EN_QUAD:
      case UTF32CodeUnit.EM_QUAD:
      case UTF32CodeUnit.EN_SPACE:
      case UTF32CodeUnit.EM_SPACE:
      case UTF32CodeUnit.THREE_PER_EM_SPACE:
      case UTF32CodeUnit.FOUR_PER_EM_SPACE:
      case UTF32CodeUnit.SIX_PER_EM_SPACE:
      case UTF32CodeUnit.FIGURE_SPACE:
      case UTF32CodeUnit.PUNCTUATION_SPACE:
      case UTF32CodeUnit.THIN_SPACE:
      case UTF32CodeUnit.HAIR_SPACE:
      case UTF32CodeUnit.MEDIUM_MATHEMATICAL_SPACE:
      case UTF32CodeUnit.IDEOGRAPHIC_SPACE:
      case UTF32CodeUnit.OGHAM_SPACE_MARK:
      // New line
      case UTF32CodeUnit.VERTICAL_TABULATION:
      case UTF32CodeUnit.FORM_FEED:
      case UTF32CodeUnit.LINE_SEPARATOR:
      case UTF32CodeUnit.PARAGRAPH_SEPARATOR:
      case UTF32CodeUnit.NEXT_LINE:
      case UTF32CodeUnit.NEW_LINE:
      case UTF32CodeUnit.CARRIAGE_RETURN:
      // Other control
      case UTF32CodeUnit.LEFT_CURLY_BRACKET:
      case UTF32CodeUnit.RIGHT_CURLY_BRACKET:
      case UTF32CodeUnit.REVERSE_SOLIDUS:
        this.emit(UnidocTokenType.WORD)
        this._state = UnidocLexerState.START
        this.nextAfterStart(symbol)
        break
      case UTF32CodeUnit.NUMBER_SIGN:
      case UTF32CodeUnit.FULL_STOP:
        this._token.appendSymbol(symbol)
        this._state = UnidocLexerState.WORD
        break
      default:
        this._token.appendSymbol(symbol)
        this._state = UnidocLexerState.IDENTIFIER
        break
    }
  }

  /**
  * Handle the given symbol after an identifier.
  *
  * @param symbol - The symbol to handle.
  */
  private nextAfterIdentifier(symbol: UnidocSymbol): void {
    switch (symbol.code) {
      // Space
      case UTF32CodeUnit.SPACE:
      case UTF32CodeUnit.HORIZONTAL_TABULATION:
      case UTF32CodeUnit.NO_BREAK_SPACE:
      case UTF32CodeUnit.EN_QUAD:
      case UTF32CodeUnit.EM_QUAD:
      case UTF32CodeUnit.EN_SPACE:
      case UTF32CodeUnit.EM_SPACE:
      case UTF32CodeUnit.THREE_PER_EM_SPACE:
      case UTF32CodeUnit.FOUR_PER_EM_SPACE:
      case UTF32CodeUnit.SIX_PER_EM_SPACE:
      case UTF32CodeUnit.FIGURE_SPACE:
      case UTF32CodeUnit.PUNCTUATION_SPACE:
      case UTF32CodeUnit.THIN_SPACE:
      case UTF32CodeUnit.HAIR_SPACE:
      case UTF32CodeUnit.MEDIUM_MATHEMATICAL_SPACE:
      case UTF32CodeUnit.IDEOGRAPHIC_SPACE:
      case UTF32CodeUnit.OGHAM_SPACE_MARK:
      // New line
      case UTF32CodeUnit.VERTICAL_TABULATION:
      case UTF32CodeUnit.FORM_FEED:
      case UTF32CodeUnit.LINE_SEPARATOR:
      case UTF32CodeUnit.PARAGRAPH_SEPARATOR:
      case UTF32CodeUnit.NEXT_LINE:
      case UTF32CodeUnit.NEW_LINE:
      case UTF32CodeUnit.CARRIAGE_RETURN:
      // Other control
      case UTF32CodeUnit.LEFT_CURLY_BRACKET:
      case UTF32CodeUnit.RIGHT_CURLY_BRACKET:
      case UTF32CodeUnit.REVERSE_SOLIDUS:
      case UTF32CodeUnit.NUMBER_SIGN:
      case UTF32CodeUnit.FULL_STOP:
        this.emit(UnidocTokenType.IDENTIFIER)
        this._state = UnidocLexerState.START
        this.nextAfterStart(symbol)
        break
      default:
        this._token.appendSymbol(symbol)
        break
    }
  }

  /**
  * Handle the given symbol at the entry state of this lexer.
  *
  * @param symbol - The symbol to handle.
  */
  private nextAfterStart(symbol: UnidocSymbol): void {
    this._token.appendSymbol(symbol)

    switch (symbol.code) {
      case UTF32CodeUnit.LEFT_CURLY_BRACKET:
        this.emit(UnidocTokenType.BLOCK_START)
        break
      case UTF32CodeUnit.RIGHT_CURLY_BRACKET:
        this.emit(UnidocTokenType.BLOCK_END)
        break
      case UTF32CodeUnit.REVERSE_SOLIDUS:
        this._state = UnidocLexerState.REVERSE_SOLIDUS
        break
      // Space
      case UTF32CodeUnit.SPACE:
      case UTF32CodeUnit.HORIZONTAL_TABULATION:
      case UTF32CodeUnit.NO_BREAK_SPACE:
      case UTF32CodeUnit.EN_QUAD:
      case UTF32CodeUnit.EM_QUAD:
      case UTF32CodeUnit.EN_SPACE:
      case UTF32CodeUnit.EM_SPACE:
      case UTF32CodeUnit.THREE_PER_EM_SPACE:
      case UTF32CodeUnit.FOUR_PER_EM_SPACE:
      case UTF32CodeUnit.SIX_PER_EM_SPACE:
      case UTF32CodeUnit.FIGURE_SPACE:
      case UTF32CodeUnit.PUNCTUATION_SPACE:
      case UTF32CodeUnit.THIN_SPACE:
      case UTF32CodeUnit.HAIR_SPACE:
      case UTF32CodeUnit.MEDIUM_MATHEMATICAL_SPACE:
      case UTF32CodeUnit.IDEOGRAPHIC_SPACE:
      case UTF32CodeUnit.OGHAM_SPACE_MARK:
        this._state = UnidocLexerState.SPACE
        break
      // New line
      case UTF32CodeUnit.VERTICAL_TABULATION:
      case UTF32CodeUnit.FORM_FEED:
      case UTF32CodeUnit.LINE_SEPARATOR:
      case UTF32CodeUnit.PARAGRAPH_SEPARATOR:
      case UTF32CodeUnit.NEXT_LINE:
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
    const token: UnidocToken = this._token
    const output: UnidocSink<UnidocToken> = this.output

    if (this._first) {
      output.start()
      this._first = false
    }

    token.setType(type)
    output.next(token)
    token.origin.clear()
    token.symbols.clear()
  }

  /**
  * Reset this lexer in order to reuse-it.
  */
  public clear(): void {
    this._state = UnidocLexerState.START
    this._token.clear()
    this._first = true
    this.off()
  }
}

/**
 * 
 */
export namespace UnidocLexer {
  /**
   * 
   */
  export function create(capacity: number = 64): UnidocLexer {
    return new UnidocLexer(capacity)
  }

  /**
   * 
   */
  export function lex(source: UnidocProducer<UnidocSymbol>): UnidocProducer<UnidocToken> {
    const lexer: UnidocLexer = create()
    lexer.subscribe(source)
    return lexer
  }
}
