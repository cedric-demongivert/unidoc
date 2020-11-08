import { CodePoint } from '../symbol/CodePoint'
import { UnidocSymbol } from '../symbol/UnidocSymbol'
import { UnidocSymbolBuffer } from '../symbol/UnidocSymbolBuffer'

import { UnidocProducer } from '../producer/UnidocProducer'
import { UnidocProducerEvent } from '../producer/UnidocProducerEvent'
import { SubscribableUnidocConsumer } from '../consumer/SubscribableUnidocConsumer'

import { UnidocToken } from '../token/UnidocToken'
import { UnidocTokenProducer } from '../token/UnidocTokenProducer'
import { UnidocTokenType } from '../token/UnidocTokenType'

import { UnidocLexerState } from './UnidocLexerState'

/**
* Unidoc lexer.
*/
export class UnidocLexer extends SubscribableUnidocConsumer<UnidocSymbol>
  implements UnidocProducer<UnidocToken>
{
  /**
  * Current state of this lexer.
  */
  private _state: UnidocLexerState

  /**
  * Token instance used to publish discovered tokens.
  */
  private _symbols: UnidocSymbolBuffer

  /**
  * Token instance used to publish discovered tokens.
  */
  private _producer: UnidocTokenProducer

  /**
  * Instantiate a new unidoc lexer.
  *
  * @param [capacity = 64] - Unidoc lexer internal symbol buffer capacity.
  */
  public constructor(capacity: number = 64) {
    super()

    this._state = UnidocLexerState.START
    this._symbols = new UnidocSymbolBuffer(capacity)
    this._producer = new UnidocTokenProducer()
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
  public handleInitialization(): void { }

  /**
  * @see UnidocConsumer.handleProduction
  */
  public handleProduction(symbol: UnidocSymbol): void {
    this.next(symbol)
  }

  /**
  * @see UnidocConsumer.handleCompletion
  */
  public handleCompletion(): void {
    this.complete()
  }

  /**
  * @see UnidocConsumer.handleFailure
  */
  public handleFailure(error: Error): void {
    this._producer.fail(error)
  }

  /**
  * Feed this lexer with the given symbol.
  *
  * @param codePoint - A symbol to give to this lexer.
  */
  public next(symbol: UnidocSymbol): void {
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
  public complete(): void {
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
    this._producer.complete()
  }

  /**
  * Handle the given symbol after an antislash.
  *
  * @param symbol - The symbol to handle.
  */
  private handleAfterAntislash(symbol: UnidocSymbol): void {
    const codePoint: CodePoint = symbol.symbol

    if (
      (codePoint >= CodePoint.a && codePoint <= CodePoint.z) ||
      (codePoint >= CodePoint.A && codePoint <= CodePoint.Z) ||
      (codePoint >= CodePoint.ZERO && codePoint <= CodePoint.NINE) ||
      (codePoint === CodePoint.MINUS) ||
      (codePoint === CodePoint.DOUBLE_DOT)
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
  private handleAfterTag(symbol: UnidocSymbol): void {
    const codePoint: CodePoint = symbol.symbol

    if (
      (codePoint >= CodePoint.a && codePoint <= CodePoint.z) ||
      (codePoint >= CodePoint.A && codePoint <= CodePoint.Z) ||
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
  private handleAfterWord(symbol: UnidocSymbol): void {
    const codePoint: CodePoint = symbol.symbol

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
  private handleAfterCarriageReturn(symbol: UnidocSymbol): void {
    const codePoint: CodePoint = symbol.symbol

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
  private handleAfterSpace(symbol: UnidocSymbol): void {
    const codePoint: CodePoint = symbol.symbol

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
  private handleAfterDot(symbol: UnidocSymbol): void {
    const codePoint: CodePoint = symbol.symbol

    if (
      codePoint >= CodePoint.a && codePoint <= CodePoint.z ||
      codePoint >= CodePoint.A && codePoint <= CodePoint.Z ||
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
  private handleAfterClass(symbol: UnidocSymbol): void {
    const codePoint: CodePoint = symbol.symbol

    if (
      codePoint >= CodePoint.a && codePoint <= CodePoint.z ||
      codePoint >= CodePoint.A && codePoint <= CodePoint.Z ||
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
  private handleAfterSharp(symbol: UnidocSymbol): void {
    const codePoint: CodePoint = symbol.symbol

    if (
      codePoint >= CodePoint.a && codePoint <= CodePoint.z ||
      codePoint >= CodePoint.A && codePoint <= CodePoint.Z ||
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
  private handleAfterIdentifier(symbol: UnidocSymbol): void {
    const codePoint: CodePoint = symbol.symbol

    if (
      codePoint >= CodePoint.a && codePoint <= CodePoint.z ||
      codePoint >= CodePoint.A && codePoint <= CodePoint.Z ||
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
  private handleAfterStart(symbol: UnidocSymbol): void {
    const codePoint: CodePoint = symbol.symbol

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

  private emitBuffer(type: UnidocTokenType): void {
    this._producer.initializeIfFirst()

    this._producer
      .from(this._symbols.from)
      .to(this._symbols.to)
      .withType(type)
      .withSymbols(this._symbols.symbols)

    this._symbols.clear()

    this._producer.produce()
  }

  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event: UnidocProducerEvent.ProductionEvent, listener: UnidocProducer.ProductionListener<UnidocToken>): void
  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event: UnidocProducerEvent.CompletionEvent, listener: UnidocProducer.CompletionListener): void
  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event: UnidocProducerEvent.InitializationEvent, listener: UnidocProducer.InitializationListener): void
  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event: UnidocProducerEvent.FailureEvent, listener: UnidocProducer.FailureListener): void
  public addEventListener(event: any, listener: any): void {
    this._producer.addEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event: UnidocProducerEvent.ProductionEvent, listener: UnidocProducer.ProductionListener<UnidocToken>): void
  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event: UnidocProducerEvent.CompletionEvent, listener: UnidocProducer.CompletionListener): void
  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event: UnidocProducerEvent.InitializationEvent, listener: UnidocProducer.InitializationListener): void
  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event: UnidocProducerEvent.FailureEvent, listener: UnidocProducer.FailureListener): void
  public removeEventListener(event: any, listener: any): void {
    this._producer.removeEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeAllEventListener
  */
  public removeAllEventListener(event: number): void
  /**
  * @see UnidocProducer.removeAllEventListener
  */
  public removeAllEventListener(): void
  public removeAllEventListener(...params: [any?]): void {
    this._producer.removeAllEventListener(...params)
  }

  /**
  * Reset this lexer in order to reuse-it.
  */
  public clear(): void {
    this._producer.clear()
    this._state = UnidocLexerState.START
    this._symbols.clear()
    this.removeAllEventListener()
  }
}

export namespace UnidocLexer {

}
