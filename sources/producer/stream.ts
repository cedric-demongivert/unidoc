import { Observable } from 'rxjs'
import { Subscriber } from 'rxjs'

import { UnidocProducer } from './UnidocProducer'
import { UnidocProducerEvent } from './UnidocProducerEvent'

class UnidocStreamer<T> {
  /**
  * The stream to stream.
  */
  private _producer : UnidocProducer<T>

  /**
  * The subscription to the source of symbol of this tokenizer.
  */
  private _outputs : Set<Subscriber<T>>

  /**
  * Instantiate a new static string streamer.
  *
  * @param value - The string to stream.
  */
  public constructor (value : UnidocProducer<T>) {
    this._producer = value
    this._outputs = new Set()

    this.handleCompletion = this.handleCompletion.bind(this)
    this.handleProduction = this.handleProduction.bind(this)

    this._producer.addEventListener(UnidocProducerEvent.COMPLETION, this.handleCompletion)
    this._producer.addEventListener(UnidocProducerEvent.PRODUCTION, this.handleProduction)
  }

  /**
  * Stream the string symbols to the given output.
  *
  * @param output - Output subscriber to feed with this string symbols.
  */
  public stream (output : Subscriber<T>) : void {
    this._outputs.add(output)
  }

  public handleProduction (value : T) : void {
    for (const output of this._outputs) {
      output.next(value)
    }
  }

  public handleCompletion () : void {
    for (const output of this._outputs) {
      output.complete()
    }

    this.destroy()
  }

  public destroy () : void {
    this._producer.removeEventListener(UnidocProducerEvent.COMPLETION, this.handleCompletion)
    this._producer.removeEventListener(UnidocProducerEvent.PRODUCTION, this.handleProduction)
  }
}

export function stream <T> (value : UnidocProducer<T>) : Observable<T> {
  const streamer : UnidocStreamer<T> = new UnidocStreamer(value)
  return new Observable<T>(streamer.stream.bind(streamer))
}
