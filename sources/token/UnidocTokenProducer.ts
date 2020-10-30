import { BasicUnidocProducer } from '../producer/BasicUnidocProducer'
import { UnidocProducerEvent } from '../producer/UnidocProducerEvent'
import { UnidocLocationTracker } from '../location/UnidocLocationTracker'
import { UnidocParser } from '../parser/UnidocParser'

import { CodePoint } from '../symbol/CodePoint'

import { UnidocToken } from './UnidocToken'
import { UnidocTokenBuffer } from './UnidocTokenBuffer'

/**
* A unidoc token.
*/
export class UnidocTokenProducer extends BasicUnidocProducer<UnidocToken> {
  private readonly _token : UnidocToken

  private readonly _tracker : UnidocLocationTracker

  /**
  * Instantiate a new unidoc token.
  *
  * @param [capacity = 16] - Initial capacity of the symbol buffer of this token.
  */
  public constructor () {
    super()
    this._token = new UnidocToken()
    this._tracker = new UnidocLocationTracker()
  }

  /**
  * Produce an identifier token.
  *
  * @param value - Code points of the token to produce.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceIdentifier (value : string) : UnidocTokenProducer {
    this._token.asIdentifier(value)
    this._token.origin.clear()
    this._token.origin.from.text(this._tracker.location).runtime()
    this._tracker.nextString(value)
    this._token.origin.to.text(this._tracker.location).runtime()

    this.produce(this._token)

    return this
  }

  /**
  * Produce a class token.
  *
  * @param value - Code points of the token to produce.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceClass (value : string) : UnidocTokenProducer {
    this._token.asClass(value)
    this._token.origin.clear()
    this._token.origin.from.text(this._tracker.location).runtime()
    this._tracker.nextString(value)
    this._token.origin.to.text(this._tracker.location).runtime()

    this.produce(this._token)

    return this
  }

  /**
  * Produce a tag token.
  *
  * @param value - Code points of the token to produce.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceTag (value : string) : UnidocTokenProducer {
    this._token.asTag(value)
    this._token.origin.clear()
    this._token.origin.from.text(this._tracker.location).runtime()
    this._tracker.nextString(value)
    this._token.origin.to.text(this._tracker.location).runtime()

    this.produce(this._token)

    return this
  }

  /**
  * Produce a block start token.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceBlockStart () : UnidocTokenProducer {
    this._token.asBlockStart()
    this._token.origin.clear()
    this._token.origin.from.text(this._tracker.location).runtime()
    this._tracker.next(CodePoint.OPENING_BRACE)
    this._token.origin.to.text(this._tracker.location).runtime()

    this.produce(this._token)

    return this
  }

  /**
  * Produce a block end token.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceBlockEnd () : UnidocTokenProducer {
    this._token.asBlockEnd()
    this._token.origin.clear()
    this._token.origin.from.text(this._tracker.location).runtime()
    this._tracker.next(CodePoint.CLOSING_BRACE)
    this._token.origin.to.text(this._tracker.location).runtime()

    this.produce(this._token)

    return this
  }

  /**
  * Produce a space token.
  *
  * @param value - Code points of the token to produce.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceSpace (value : string) : UnidocTokenProducer {
    this._token.asSpace(value)
    this._token.origin.clear()
    this._token.origin.from.text(this._tracker.location).runtime()
    this._tracker.nextString(value)
    this._token.origin.to.text(this._tracker.location).runtime()

    this.produce(this._token)

    return this
  }

  /**
  * Produce a newline token.
  *
  * @param [type = '\r\n'] - Type of new line to produce.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceNewline (type : '\r\n' | '\r' | '\n' = '\r\n') : UnidocTokenProducer {
    this._token.asNewline(type)
    this._token.origin.clear()
    this._token.origin.from.text(this._tracker.location).runtime()
    this._tracker.nextString(type)
    this._token.origin.to.text(this._tracker.location).runtime()

    this.produce(this._token)

    return this
  }

  /**
  * Produce a word token.
  *
  * @param value - Code points of the token to produce.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceWord (value : string) : UnidocTokenProducer {
    this._token.asWord(value)
    this._token.origin.clear()
    this._token.origin.from.text(this._tracker.location).runtime()
    this._tracker.nextString(value)
    this._token.origin.to.text(this._tracker.location).runtime()

    this.produce(this._token)

    return this
  }

  /**
  * @see BasicUnidocProducer.complete
  */
  public complete () : void {
    super.complete()
  }
}

export namespace UnidocTokenProducer {
  export function create () : UnidocTokenProducer {
    return new UnidocTokenProducer()
  }

  export function forBuffer (buffer : UnidocTokenBuffer) : UnidocTokenProducer {
    const result : UnidocTokenProducer = new UnidocTokenProducer()

    result.addEventListener(UnidocProducerEvent.PRODUCTION, buffer.push.bind(buffer))
    result.addEventListener(UnidocProducerEvent.COMPLETION, buffer.fit.bind(buffer))

    return result
  }

  export function forParser (parser : UnidocParser) : UnidocTokenProducer {
    const result : UnidocTokenProducer = new UnidocTokenProducer()

    result.addEventListener(UnidocProducerEvent.PRODUCTION, parser.next.bind(parser))
    result.addEventListener(UnidocProducerEvent.COMPLETION, parser.complete.bind(parser))

    return result
  }
}
