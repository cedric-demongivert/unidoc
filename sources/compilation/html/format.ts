import { Observable } from 'rxjs'
import { Subscriber } from 'rxjs'
import { Subscription } from 'rxjs'

import { HTMLFormatter } from './formatting/HTMLFormatter'
import { HTMLFormatterEventType } from './formatting/HTMLFormatterEventType'
import { HTMLEvent } from './event/HTMLEvent'

class Formatter {
  private _formatter : HTMLFormatter

  private _input : Observable<HTMLEvent> | null

  private _subscription : Subscription | null

  private _outputs : Set<Subscriber<string>>

  /**
  * Instantiate a new tokenizer.
  *
  * @param lexer - The lexer to use for tokenization.
  */
  public constructor (compiler : HTMLFormatter) {
    this._formatter         = compiler
    this._formatter.start()
    this._input            = null
    this._subscription     = null
    this._outputs          = new Set<Subscriber<string>>()

    this.consumeNextToken = this.consumeNextToken.bind(this)
    this.consumeNextError  = this.consumeNextError.bind(this)
    this.consumeCompletion = this.consumeCompletion.bind(this)

    this.handleNextEvent = this.handleNextEvent.bind(this)
    this.handleNextError = this.handleNextError.bind(this)
    this.handleCompletion = this.handleCompletion.bind(this)

    this._formatter.addEventListener(HTMLFormatterEventType.CONTENT, this.handleNextEvent)
    this._formatter.addEventListener(HTMLFormatterEventType.ERROR, this.handleNextError)
    this._formatter.addEventListener(HTMLFormatterEventType.COMPLETION, this.handleCompletion)
  }

  /**
  * Stream events to the given output.
  *
  * @param output - An output to fill with recognized events.
  */
  public stream (output : Subscriber<string>) : void {
    this._outputs.add(output)
  }

  /**
  * Stop streaming events to the given output.
  *
  * @param output - An output to stop to fill with recognized events.
  */
  public unstream (output : Subscriber<string>) : void {
    this._outputs.delete(output)
  }

  /**
  * Subscribe to the given source of token.
  *
  * @param input - A source of token.
  */
  public subscribe (input : Observable<HTMLEvent>) : void {
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
  public handleNextEvent (event : string) : void {
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
  public consumeNextToken (event : HTMLEvent) : void {
    this._formatter.next(event)
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
    this._formatter.complete()
  }
}

type Operator<In, Out> = (source : Observable<In>) => Observable<Out>

/**
* Transform a stream of symbols to a stream of tokens.
*
* @return An operator that transform a stream of symbols to a stream of tokens.
*/
export function format (formatter : HTMLFormatter) : Operator<HTMLEvent, string> {
  const manager : Formatter = new Formatter(formatter)

  return function (input : Observable<HTMLEvent>) : Observable<string> {
    return new Observable<string>(
      function (subscriber : Subscriber<string>) {
        manager.stream(subscriber)
        manager.subscribe(input)
      }
    )
  }
}
