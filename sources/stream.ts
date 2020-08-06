import { Observable } from 'rxjs'
import { Subscriber } from 'rxjs'

import { UnidocStream } from './stream/UnidocStream'
import { UnidocSourceReader } from './stream/UnidocSourceReader'
import { UnidocSymbol } from './stream/UnidocSymbol'

class UnidocStreamer {
  /**
  * The stream to stream.
  */
  private _value : UnidocStream

  /**
  * Instantiate a new static string streamer.
  *
  * @param value - The string to stream.
  */
  public constructor (value : UnidocStream) {
    this._value = value
  }

  /**
  * Stream the string symbols to the given output.
  *
  * @param output - Output subscriber to feed with this string symbols.
  */
  public stream (output : Subscriber<UnidocSymbol>) : void {
    const value : UnidocStream = this._value

    while (value.hasNext()) {
      output.next(value.next())
    }

    output.complete()
  }
}

/**
* Return a stream of unidoc symbol extracted from a string.
*
* @param value - A string to stream.
*
* @return A stream of unidoc symbol extracted from the given string.
*/
export function stream (value : UnidocStream) : Observable<UnidocSymbol> {
  const streamer : UnidocStreamer = new UnidocStreamer(value)
  return new Observable<UnidocSymbol>(streamer.stream.bind(streamer))
}

export namespace stream {
  export function string (value : string, name : string = 'string') : Observable<UnidocSymbol> {
    return stream(new UnidocStream(UnidocSourceReader.fromString(value, name)))
  }
}
