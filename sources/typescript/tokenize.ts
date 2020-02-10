import { Observable } from 'rxjs'
import { Subscriber } from 'rxjs'
import { Subscription } from 'rxjs'

import { Lexer } from 'antlr4ts/Lexer'
import { Token } from 'antlr4ts/Token'

import { BufferedCharStream } from '@library/antlr/BufferedCharStream'

const STATE_START : number = 0
const STATE_SPACE : number = 1
const STATE_VALUE: number = 2

const SPACE : number = ' '.charCodeAt(0)
const TABULATION : number = '\t'.charCodeAt(0)

class ANTLRTokenizer {
  /**
  * A symbol buffer.
  */
  private _buffer : BufferedCharStream

  /**
  * The ANTLR lexer to use for tokenization.
  */
  private _lexer : Lexer

  /**
  * A set of listeners.
  */
  private _subscribers : Set<Subscriber<Token>>

  /**
  * The source of symbol of this tokenizer.
  */
  private _input : Observable<number>

  /**
  * The subscription to the source of symbol of this tokenizer.
  */
  private _subscription : Subscription

  private _state : number

  /**
  * Instantiate a new tokenizer.
  *
  * @param lexer - The lexer to use for tokenization.
  */
  public constructor (lexer : Lexer) {
    this._buffer           = new BufferedCharStream()
    this._lexer            = lexer
    this._subscribers      = new Set<Subscriber<Token>>()
    this._input            = null
    this._state            = STATE_START

    this.consumeNextSymbol = this.consumeNextSymbol.bind(this)
    this.consumeNextError  = this.consumeNextError.bind(this)
    this.consumeCompletion = this.consumeCompletion.bind(this)

    this._lexer.inputStream = this._buffer
    this._lexer.reset()
  }

  /**
  * Stream tokens to the given output.
  *
  * @param output - An output to fill with recognized tokens.
  */
  public stream (output : Subscriber<Token>) : void {
    this._subscribers.add(output)
  }

  /**
  * Stop streaming tokens to the given output.
  *
  * @param output - An output to stop to fill with recognized tokens.
  */
  public unstream (output : Subscriber<Token>) : void {
    this._subscribers.delete(output)
  }

  /**
  * Subscribe to the given source of symbols.
  *
  * @param input - A source of symbols.
  */
  public subscribe (input : Observable<number>) : void {
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
  * Try to recognize a token from the current symbol buffer.
  */
  public recognizeNextToken () : void {
    while (!this._buffer.atLast()) {
      this.emit(this._lexer.nextToken())
    }

    this._buffer.truncate()
  }

  public emit (token : Token) : void {
    for (const subscriber of this._subscribers) {
      subscriber.next(token)
    }
  }

  /**
  * Try to recognize all remaining tokens.
  */
  public recognizeRemainingTokens () : void {
    while (this._buffer.hasNext()) {
      this.emit(this._lexer.nextToken())
    }
  }

  /**
  * Consume the next available symbol.
  *
  * @param symbol - The symbol to consume.
  */
  public consumeNextSymbol (symbol : number) : void {
    this._buffer.push(symbol)

    switch (symbol) {
      case SPACE:
      case TABULATION:
        this._state = STATE_SPACE
        break
      default:
        if (this._state === STATE_SPACE) {
          this.recognizeNextToken()
        }

        this._state = STATE_VALUE
        break
    }
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
    this.recognizeRemainingTokens()

    for (const subscriber of this._subscribers) {
      subscriber.complete()
    }
  }
}

type Operator<In, Out> = (source : Observable<In>) => Observable<Out>

/**
* Transform a stream of symbols to a stream of tokens.
*
* @param lexer - A lexer to use in order to build the tokens.
*
* @return An operator that transform a stream of symbols to a stream of tokens.
*/
export function tokenize (lexer : Lexer) : Operator<number, Token> {
  const tokenizer : ANTLRTokenizer = new ANTLRTokenizer(lexer)

  return function (input : Observable<number>) : Observable<Token> {
    return new Observable<Token>(function (subscriber : Subscriber<Token>) {
      tokenizer.stream(subscriber)
      tokenizer.subscribe(input)
    })
  }
}
