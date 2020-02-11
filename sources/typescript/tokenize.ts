import { Observable } from 'rxjs'
import { Subscriber } from 'rxjs'
import { Subscription } from 'rxjs'

import { CodePoint } from '@library/CodePoint'

import { UnidocLexer } from '@library/lexer/UnidocLexer'
import { UnidocToken } from '@library/token/UnidocToken'

class Tokenizer {
  /**
  * The lexer to use for tokenization.
  */
  private _lexer : UnidocLexer

  /**
  * The source of symbol of this tokenizer.
  */
  private _input : Observable<CodePoint>

  /**
  * The subscription to the source of symbol of this tokenizer.
  */
  private _subscription : Subscription

  /**
  * Instantiate a new tokenizer.
  *
  * @param lexer - The lexer to use for tokenization.
  */
  public constructor () {
    this._lexer            = new UnidocLexer()
    this._input            = null
    this._subscription     = null

    this.consumeNextSymbol = this.consumeNextSymbol.bind(this)
    this.consumeNextError  = this.consumeNextError.bind(this)
    this.consumeCompletion = this.consumeCompletion.bind(this)
  }

  /**
  * Stream tokens to the given output.
  *
  * @param output - An output to fill with recognized tokens.
  */
  public stream (output : Subscriber<UnidocToken>) : void {
    this._lexer.addEventListener(output)
  }

  /**
  * Stop streaming tokens to the given output.
  *
  * @param output - An output to stop to fill with recognized tokens.
  */
  public unstream (output : Subscriber<UnidocToken>) : void {
    this._lexer.deleteEventListener(output)
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
  public consumeNextSymbol (symbol : number) : void {
    this._lexer.next(symbol)
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
    console.log('completion')
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
        tokenizer.stream(subscriber)
        tokenizer.subscribe(input)
      }
    )
  }
}
