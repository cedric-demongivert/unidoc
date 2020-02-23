import { Observable } from 'rxjs'
import { Subscriber } from 'rxjs'
import { Subscription } from 'rxjs'

import { CodePoint } from './CodePoint'

import { UnidocParser } from './parser/UnidocParser'
import { UnidocEvent } from './event/UnidocEvent'
import { UnidocToken } from './token/UnidocToken'

class Parser {
  /**
  * The lexer to use for tokenization.
  */
  private _parser : UnidocParser

  /**
  * The source of symbol of this tokenizer.
  */
  private _input : Observable<UnidocToken>

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
    this._parser           = new UnidocParser()
    this._input            = null
    this._subscription     = null

    this.consumeNextToken = this.consumeNextToken.bind(this)
    this.consumeNextError  = this.consumeNextError.bind(this)
    this.consumeCompletion = this.consumeCompletion.bind(this)
  }

  /**
  * Stream events to the given output.
  *
  * @param output - An output to fill with recognized events.
  */
  public stream (output : Subscriber<UnidocEvent>) : void {
    this._parser.addEventListener(output)
  }

  /**
  * Stop streaming events to the given output.
  *
  * @param output - An output to stop to fill with recognized events.
  */
  public unstream (output : Subscriber<UnidocEvent>) : void {
    this._parser.deleteEventListener(output)
  }

  /**
  * Subscribe to the given source of token.
  *
  * @param input - A source of token.
  */
  public subscribe (input : Observable<UnidocToken>) : void {
    if (this._input !== input) {
      if (this._subscription) {
        this._subscription.unsubscribe()
      }

      this._input = input

      if (input) {
        this._subscription = input.subscribe(
          this.consumeNextToken,
          this.consumeNextError,
          this.consumeCompletion
        )
      } else {
        this._subscription = null
      }
    }
  }

  /**
  * Consume the next available token.
  *
  * @param symbol - The token to consume.
  */
  public consumeNextToken (token : UnidocToken) : void {
    this._parser.next(token)
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
export function parse () : Operator<UnidocToken, UnidocEvent> {
  const tokenizer : Parser = new Parser()

  return function (input : Observable<UnidocToken>) : Observable<UnidocEvent> {
    return new Observable<UnidocEvent>(
      function (subscriber : Subscriber<UnidocEvent>) {
        tokenizer.stream(subscriber)
        tokenizer.subscribe(input)
      }
    )
  }
}
