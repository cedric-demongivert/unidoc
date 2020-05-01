import { Observable } from 'rxjs'
import { Subscriber } from 'rxjs'
import { Subscription } from 'rxjs'

import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocQuery } from './UnidocQuery'

class Query<Output> {
  /**
  * The unidoc query used by this operation.
  */
  private _query : UnidocQuery<Output>

  /**
  * This operation source of event.
  */
  private _input : Observable<UnidocEvent>

  /**
  * This operation subscription to it's source of event.
  */
  private _subscription : Subscription

  /**
  * This operations outputs.
  */
  private _outputs : Set<Subscriber<Output>>

  /**
  * Instantiate a new query operation.
  *
  * @param query - The unidoc query to use.
  */
  public constructor (query : UnidocQuery<Output>) {
    this._query            = query
    this._input            = null
    this._subscription     = null
    this._outputs          = new Set<Subscriber<Output>>()

    this.consumeNextEvent  = this.consumeNextEvent.bind(this)
    this.consumeCompletion = this.consumeCompletion.bind(this)

    this.handleNextValue   = this.handleNextValue.bind(this)
    this.handleCompletion  = this.handleCompletion.bind(this)

    this._query.addEventListener('next', this.handleNextValue)
    this._query.addEventListener('complete', this.handleCompletion)
  }

  /**
  * Stream events to the given output.
  *
  * @param output - An output to fill with recognized events.
  */
  public stream (output : Subscriber<Output>) : void {
    this._outputs.add(output)
  }

  /**
  * Stop streaming events to the given output.
  *
  * @param output - An output to stop to fill with recognized events.
  */
  public unstream (output : Subscriber<Output>) : void {
    this._outputs.delete(output)
  }

  /**
  * Subscribe to the given source of event.
  *
  * @param input - A source of event.
  */
  public subscribe (input : Observable<UnidocEvent>) : void {
    if (this._input !== input) {
      if (this._subscription) {
        this._subscription.unsubscribe()
      }

      this._input = input

      if (input) {
        this._subscription = input.subscribe(
          this.consumeNextEvent,
          this.consumeNextError,
          this.consumeCompletion
        )
      } else {
        this._subscription = null
      }
    }
  }

  /**
  * Handle the emission of the given value.
  *
  * @param value - The value to consume.
  */
  public handleNextValue (value : Output) : void {
    for (const output of this._outputs) {
      output.next(value)
    }
  }

  /**
  * Handle a query completion event.
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
  public consumeNextEvent (event : UnidocEvent) : void {
    this._query.next(event)
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
    this._query.complete()
  }
}

type Operator<In, Out> = (source : Observable<In>) => Observable<Out>

/**
* Transform a stream of event into a stream of query result.
*
* @param query - A query to use.
*
* @return An operator that transform a stream of events to a stream of query result.
*/
export function query <Output> (query : UnidocQuery<Output>) : Operator<UnidocEvent, Output> {
  const match : Query<Output> = new Query<Output>(query)

  return function (input : Observable<UnidocEvent>) : Observable<Output> {
    return new Observable<Output>(
      function (subscriber : Subscriber<Output>) {
        match.stream(subscriber)
        match.subscribe(input)
      }
    )
  }
}
