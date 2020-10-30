import { BasicUnidocProducer } from '../producer/BasicUnidocProducer'
import { UnidocProducerEvent } from '../producer/UnidocProducerEvent'
import { UnidocLocationTracker } from '../location/UnidocLocationTracker'

import { CodePoint } from '../symbol/CodePoint'

import { UnidocEvent } from './UnidocEvent'
import { UnidocEventBuffer } from './UnidocEventBuffer'

export class UnidocEventProducer extends BasicUnidocProducer<UnidocEvent> {
  private readonly _event : UnidocEvent
  private readonly _tracker : UnidocLocationTracker
  private _index : number

  /**
  * Instantiate a new unidoc event.
  */
  public constructor () {
    super()
    this._event = new UnidocEvent()
    this._tracker = new UnidocLocationTracker()
    this._index = 0
  }

  /**
  * Produce a new word event.
  *
  * @param content - Content of the event to produce.
  * @param [line = content] - Line to use for computing the begining and the ending point of the event.
  *
  * @return This producer for chaining purposes.
  */
  public produceWord (content : string, line : string = content) : UnidocEventProducer {
    this._event.asWord(content)
    this._event.index = this._index
    this._index += 1
    this._event.origin.clear()
    this._event.origin.from.text(this._tracker.location).runtime()
    this._tracker.nextString(line)
    this._event.origin.to.text(this._tracker.location).runtime()

    this.produce(this._event)

    return this
  }

  /**
  * Produce a new whitespace event.
  *
  * @param content - Content of the resulting event.
  * @param [line = content] - Line to use for computing the begining and the ending point of the event.
  *
  * @return This producer for chaining purposes.
  */
  public produceWhitespace (content : string, line : string = content) : UnidocEventProducer {
    this._event.asWhitespace(content)
    this._event.index = this._index
    this._index += 1
    this._event.origin.clear()
    this._event.origin.from.text(this._tracker.location).runtime()
    this._tracker.nextString(line)
    this._event.origin.to.text(this._tracker.location).runtime()

    this.produce(this._event)

    return this
  }

  /**
  * Configure this event as a new starting tag event.
  *
  * @param configuration - Type, identifiers and classes of the resulting tag.
  * @param [line = configuration] - Line to use for computing the begining and the ending point of the event.
  *
  * @return This producer for chaining purposes.
  */
  public produceTagStart (configuration : string, line : string = configuration) : UnidocEventProducer {
    this._event.asTagStart(configuration)
    this._event.index = this._index
    this._index += 1
    this._event.origin.clear()
    this._event.origin.from.text(this._tracker.location).runtime()
    if (Object.is(line, configuration)) this._tracker.next(CodePoint.ANTISLASH)
    this._tracker.nextString(line)
    if (Object.is(line, configuration)) this._tracker.next(CodePoint.OPENING_BRACE)
    this._event.origin.to.text(this._tracker.location).runtime()

    this.produce(this._event)

    return this
  }

  /**
  * Configure this event as a new ending tag event.
  *
  * @param configuration - Type, identifiers and classes of the resulting tag.
  * @param [line = '}'] - Line to use for computing the begining and the ending point of the event.
  *
  * @return This producer for chaining purposes.
  */
  public produceTagEnd (configuration : string, line : string = '}') : UnidocEventProducer {
    this._event.asTagEnd(configuration)
    this._event.index = this._index
    this._index += 1
    this._event.origin.clear()
    this._event.origin.from.text(this._tracker.location).runtime()
    this._tracker.nextString(line)
    this._event.origin.to.text(this._tracker.location).runtime()

    this.produce(this._event)

    return this
  }

  /**
  * @see BasicUnidocProducer.complete
  */
  public complete () : void {
    super.complete()
  }
}

export namespace UnidocEventProducer {
  export function create () : UnidocEventProducer {
    return new UnidocEventProducer()
  }

  export function forBuffer (buffer : UnidocEventBuffer) : UnidocEventProducer {
    const result : UnidocEventProducer = new UnidocEventProducer()

    result.addEventListener(UnidocProducerEvent.PRODUCTION, buffer.push.bind(buffer))
    result.addEventListener(UnidocProducerEvent.COMPLETION, buffer.fit.bind(buffer))

    return result
  }
}
