import { Observable } from 'rxjs'
import { Subscriber } from 'rxjs'

import { CodePoint } from './CodePoint'

class StaticStringStreamer {
  /**
  * The string to stream.
  */
  private _value : string

  /**
  * Instantiate a new static string streamer.
  *
  * @param value - The string to stream.
  */
  public constructor (value : string) {
    this._value = value
  }

  /**
  * Stream the string symbols to the given output.
  *
  * @param output - Output subscriber to feed with this string symbols.
  */
  public stream (output : Subscriber<CodePoint>) : void {
    const value : string = this._value
    const length : number = value.length

    for (let index = 0; index < length; ++index) {
      output.next(value.codePointAt(index))
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
export function fromString (value : string) : Observable<CodePoint> {
  const streamer : StaticStringStreamer = new StaticStringStreamer(value)
  return new Observable<CodePoint>(streamer.stream.bind(streamer))
}
