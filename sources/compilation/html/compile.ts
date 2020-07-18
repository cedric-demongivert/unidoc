import { Observable } from 'rxjs'
import { Subscriber } from 'rxjs'
import { Subscription } from 'rxjs'

import { HTMLCompiler } from './compilation/HTMLCompiler'
import { HTMLCompilerEventType } from './compilation/HTMLCompilerEventType'
import { UnidocEvent } from '../../event/UnidocEvent'
import { HTMLEvent } from './event/HTMLEvent'

class Compilator {
  private _compiler : HTMLCompiler

  private _input : Observable<UnidocEvent>

  private _subscription : Subscription

  private _outputs : Set<Subscriber<HTMLEvent>>

  /**
  * Instantiate a new tokenizer.
  *
  * @param lexer - The lexer to use for tokenization.
  */
  public constructor (compiler : HTMLCompiler) {
    this._compiler         = compiler
    this._compiler.start()
    this._input            = null
    this._subscription     = null
    this._outputs          = new Set<Subscriber<HTMLEvent>>()

    this.consumeNextToken = this.consumeNextToken.bind(this)
    this.consumeNextError  = this.consumeNextError.bind(this)
    this.consumeCompletion = this.consumeCompletion.bind(this)

    this.handleNextEvent = this.handleNextEvent.bind(this)
    this.handleNextError = this.handleNextError.bind(this)
    this.handleCompletion = this.handleCompletion.bind(this)

    this._compiler.addEventListener(HTMLCompilerEventType.CONTENT, this.handleNextEvent)
    this._compiler.addEventListener(HTMLCompilerEventType.ERROR, this.handleNextError)
    this._compiler.addEventListener(HTMLCompilerEventType.COMPLETION, this.handleCompletion)
  }

  /**
  * Stream events to the given output.
  *
  * @param output - An output to fill with recognized events.
  */
  public stream (output : Subscriber<HTMLEvent>) : void {
    this._outputs.add(output)
  }

  /**
  * Stop streaming events to the given output.
  *
  * @param output - An output to stop to fill with recognized events.
  */
  public unstream (output : Subscriber<HTMLEvent>) : void {
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
  * Handle the emission of the given event.
  *
  * @param event - The event to consume.
  */
  public handleNextEvent (event : HTMLEvent) : void {
    for (const output of this._outputs) {
      output.next(event)
    }
  }

  /**
  * Handle the emission of the given error.
  *
  * @param error - The error to consume.
  */
  public handleNextError (error : Error) : void {
    console.error(error)
  }

  /**
  * Handle a completion event.
  */
  public handleCompletion () : void {
    for (const output of this._outputs) {
      output.complete()
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
    this._compiler.complete()
  }
}

type Operator<In, Out> = (source : Observable<In>) => Observable<Out>

/**
* Transform a stream of symbols to a stream of tokens.
*
* @return An operator that transform a stream of symbols to a stream of tokens.
*/
export function compile (compiler : HTMLCompiler) : Operator<UnidocEvent, HTMLEvent> {
  const manager : Compilator = new Compilator(compiler)

  return function (input : Observable<UnidocEvent>) : Observable<HTMLEvent> {
    return new Observable<HTMLEvent>(
      function (subscriber : Subscriber<HTMLEvent>) {
        manager.stream(subscriber)
        manager.subscribe(input)
      }
    )
  }
}
