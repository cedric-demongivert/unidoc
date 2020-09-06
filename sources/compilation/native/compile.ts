import { Observable } from 'rxjs'
import { Subscriber } from 'rxjs'
import { Subscription } from 'rxjs'

import { NativeCompiler } from './compilation/NativeCompiler'
import { UnidocEvent } from '../../event/UnidocEvent'

class Compilator<T> {
  private _compiler : NativeCompiler<T>

  private _input : Observable<UnidocEvent> | null

  private _subscription : Subscription | null

  private _outputs : Set<Subscriber<T>>

  /**
  * Instantiate a new tokenizer.
  *
  * @param lexer - The lexer to use for tokenization.
  */
  public constructor (compiler : NativeCompiler<T>) {
    this._compiler         = compiler
    this._compiler.start()
    this._input            = null
    this._subscription     = null
    this._outputs          = new Set<Subscriber<T>>()

    this.consumeNextToken = this.consumeNextToken.bind(this)
    this.consumeNextError  = this.consumeNextError.bind(this)
    this.consumeCompletion = this.consumeCompletion.bind(this)
  }

  /**
  * Stream events to the given output.
  *
  * @param output - An output to fill with recognized events.
  */
  public stream (output : Subscriber<T>) : void {
    this._outputs.add(output)
  }

  /**
  * Stop streaming events to the given output.
  *
  * @param output - An output to stop to fill with recognized events.
  */
  public unstream (output : Subscriber<T>) : void {
    this._outputs.delete(output)
  }

  /**
  * Subscribe to the given source of token.
  *
  * @param input - A source of token.
  */
  public subscribe (input : Observable<UnidocEvent>) : void {
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
  * Consume the next available event.
  *
  * @param event - The event to consume.
  */
  public consumeNextToken (event : UnidocEvent) : void {
    this._compiler.next(event)
  }

  /**
  * Consume the next error.
  *
  * @param error - An error to consume.
  */
  public consumeNextError (error : Error) : void {
    console.error(error)
  }

  /**
  * Consume a completion signal.
  */
  public consumeCompletion () : void {
    const value : T = this._compiler.complete()

    for (const output of this._outputs) {
      output.next(value)
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
export function compile <T> (compiler : NativeCompiler<T>) : Operator<UnidocEvent, T> {
  const manager : Compilator<T> = new Compilator(compiler)

  return function (input : Observable<UnidocEvent>) : Observable<T> {
    return new Observable<T>(
      function (subscriber : Subscriber<T>) {
        manager.stream(subscriber)
        manager.subscribe(input)
      }
    )
  }
}
