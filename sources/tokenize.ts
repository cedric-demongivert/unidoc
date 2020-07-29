import { Observable } from 'rxjs'
import { Subscriber } from 'rxjs'
import { Subscription } from 'rxjs'

import { CodePoint } from './CodePoint'

import { UnidocLexer } from './lexer/UnidocLexer'
import { UnidocToken } from './token/UnidocToken'
import { UnidocValidation } from './validation/UnidocValidation'

class Tokenizer {
  /**
  * The lexer to use for tokenization.
  */
  private _lexer : UnidocLexer

  /**
  * The source of symbol of this tokenizer.
  */
  private _input : Observable<CodePoint> | null

  /**
  * The subscription to the ource of symbol of this tokenizer.
  */
  private _subscription : Subscription | null

  /**
  * The subscription to the source of symbol of this tokenizer.
  */
  private _outputs : Set<Subscriber<UnidocToken>>

  /**
  * Instantiate a new tokenizer.
  *
  * @param lexer - The lexer to use for tokenization.
  */
  public constructor () {
    this._lexer            = new UnidocLexer()
    this._input            = null
    this._subscription     = null
    this._outputs          = new Set<Subscriber<UnidocToken>>()

    this.consumeNextSymbol = this.consumeNextSymbol.bind(this)
    this.consumeNextError  = this.consumeNextError.bind(this)
    this.consumeCompletion = this.consumeCompletion.bind(this)

    this.handleNextToken = this.handleNextToken.bind(this)
    this.handleNextValidation  = this.handleNextValidation.bind(this)
    this.handleNextError = this.handleNextError.bind(this)
    this.handleCompletion = this.handleCompletion.bind(this)

    this._lexer.addEventListener('token', this.handleNextToken)
    this._lexer.addEventListener('error', this.handleNextError)
    this._lexer.addEventListener('completion', this.handleCompletion)
    this._lexer.addEventListener('validation', this.handleNextValidation)
  }

  /**
  * Stream tokens to the given output.
  *
  * @param output - An output to fill with recognized tokens.
  */
  public addEventListener (output : Subscriber<UnidocToken>) : void {
    this._outputs.add(output)
  }

  /**
  * Stop streaming tokens to the given output.
  *
  * @param output - An output to stop to fill with recognized tokens.
  */
  public removeEventListener (output : Subscriber<UnidocToken>) : void {
    this._outputs.delete(output)
  }

  /**
  * Subscribe to the given source of symbols.
  *
  * @param input - A source of symbols.
  */
  public subscribe (input : Observable<CodePoint>) : void {
    if (this._input !== input) {
      if (this._subscription) {
        this._subscription.unsubscribe()
      }

      this._input = input

      if (input) {
        this._subscription = input.subscribe(
          this.consumeNextSymbol,
          this.consumeNextError,
          this.consumeCompletion
        )
      } else {
        this._subscription = null
      }
    }
  }

  /**
  * Consume the next available symbol.
  *
  * @param symbol - The symbol to consume.
  */
  public consumeNextSymbol (codePoint : CodePoint) : void {
    this._lexer.nextCodePoint(codePoint)
  }

  /**
  * Consume the next error.
  *
  * @param error - An error to consume.
  */
  public consumeNextError (error : Error) : void {
    console.log(error)
  }

  /**
  * Consume a completion signal.
  */
  public consumeCompletion () : void {
    this._lexer.complete()
  }

  /**
  * Handle a parser token event.
  */
  public handleNextToken (token : UnidocToken) : void {
    for (const output of this._outputs) {
      output.next(token)
    }
  }

  /**
  * Handle a parser validation event.
  */
  public handleNextValidation (validation : UnidocValidation) : void {
  }

  /**
  * Handle a parser error event.
  */
  public handleNextError (error : Error) : void {
    for (const output of this._outputs) {
      output.error(error)
    }
  }

  /**
  * Handle a parser completion event.
  */
  public handleCompletion () : void {
    for (const output of this._outputs) {
      output.complete()
    }
  }
}

type Operator<In, Out> = (source : Observable<In>) => Observable<Out>

/**
* Transform a stream of symbols to a stream of tokens.
*
* @return An operator that transform a stream of symbols to a stream of tokens.
*/
export function tokenize () : Operator<CodePoint, UnidocToken> {
  const tokenizer : Tokenizer = new Tokenizer()

  return function (input : Observable<CodePoint>) : Observable<UnidocToken> {
    return new Observable<UnidocToken>(
      function (subscriber : Subscriber<UnidocToken>) {
        tokenizer.addEventListener(subscriber)
        tokenizer.subscribe(input)
      }
    )
  }
}
