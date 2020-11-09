import { UnidocProducer } from '../producer/UnidocProducer'
import { UnidocProducerEvent } from '../producer/UnidocProducerEvent'
import { UnidocLocationTracker } from '../location/UnidocLocationTracker'

import { CodePoint } from '../symbol/CodePoint'

import { UnidocEvent } from './UnidocEvent'
import { UnidocEventProducer } from './UnidocEventProducer'

const DEFAULT_BLOCK_ENDING: string = '}'

export class TrackedUnidocEventProducer implements UnidocProducer<UnidocEvent> {
  private readonly _producer: UnidocEventProducer
  private readonly _tracker: UnidocLocationTracker

  /**
  * Instantiate a new unidoc event.
  */
  public constructor() {
    this._producer = new UnidocEventProducer()
    this._tracker = new UnidocLocationTracker()
  }

  /**
  * @see UnidocProducer.initialize
  */
  public initialize(): TrackedUnidocEventProducer {
    this._producer.initialize()
    return this
  }

  /**
  * Produce a new word event.
  *
  * @param content - Content of the event to produce.
  * @param [line = content] - Line to use for computing the begining and the ending point of the event.
  *
  * @return This producer for chaining purposes.
  */
  public produceWord(content: string, line: string = content): TrackedUnidocEventProducer {
    this._producer.from().text(this._tracker.location).runtime()
    this._tracker.nextString(line)
    this._producer.to().text(this._tracker.location).runtime()

    this._producer.produceWord(content)

    return this
  }

  /**
  * Produce a text.
  *
  * @param lines - Lines of text to produce.
  *
  * @return This producer for chaining purposes.
  */
  public produceText(...lines: string[]): TrackedUnidocEventProducer {
    return this.produceString(lines.join('\r\n'))
  }

  /**
  * Produce a line of text.
  *
  * @param line - Line of text to produce.
  *
  * @return This producer for chaining purposes.
  */
  public produceString(line: string): TrackedUnidocEventProducer {
    if (line.length > 0) {
      let offset: number = 0
      let spaces: boolean = CodePoint.isWhitespace(
        line.codePointAt(0) as CodePoint
      )

      for (let index = 1, size = line.length; index < size; ++index) {
        if (CodePoint.isWhitespace(line.codePointAt(index) as CodePoint) !== spaces) {
          if (spaces) {
            this.produceWhitespace(line.substring(offset, index))
          } else {
            this.produceWord(line.substring(offset, index))
          }

          offset = index
          spaces = !spaces
        }
      }

      if (spaces) {
        this.produceWhitespace(line.substring(offset))
      } else {
        this.produceWord(line.substring(offset))
      }
    }

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
  public produceWhitespace(content: string, line: string = content): TrackedUnidocEventProducer {
    this._producer.from().text(this._tracker.location).runtime()
    this._tracker.nextString(line)
    this._producer.to().text(this._tracker.location).runtime()

    this._producer.produceWhitespace(content)

    return this
  }

  /**
  * Configure this event as a new starting tag event.
  *
  * @param configuration - Type, identifiers and classes of the resulting tag.
  * @param [line = '\\' + configuration + '{'] - Line to use for computing the begining and the ending point of the event.
  *
  * @return This producer for chaining purposes.
  */
  public produceTagStart(configuration: string, line: string = '\\' + configuration + '{'): TrackedUnidocEventProducer {
    this._producer.from().text(this._tracker.location).runtime()
    this._tracker.nextString(line)
    this._producer.to().text(this._tracker.location).runtime()

    this._producer.produceTagStart(configuration)

    return this
  }

  /**
  * Configure this event as a new ending tag event.
  *
  * @param configuration - Type, identifiers and classes of the resulting tag.
  * @param [line = DEFAULT_BLOCK_ENDING] - Line to use for computing the begining and the ending point of the event.
  *
  * @return This producer for chaining purposes.
  */
  public produceTagEnd(configuration: string, line: string = DEFAULT_BLOCK_ENDING): TrackedUnidocEventProducer {
    this._producer.from().text(this._tracker.location).runtime()
    this._tracker.nextString(line)
    this._producer.to().text(this._tracker.location).runtime()

    this._producer.produceTagEnd(configuration)

    return this
  }

  public tag(configuration: string, definition: (this: TrackedUnidocEventProducer) => void): TrackedUnidocEventProducer {
    this.produceTagStart(configuration)
    definition.call(this)
    this.produceTagEnd(configuration)
    return this
  }

  /**
  * @see ListenableUnidocProducer.complete
  */
  public complete(): void {
    this._producer.complete()
  }

  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event: UnidocProducerEvent.ProductionEvent, listener: UnidocProducer.ProductionListener<UnidocEvent>): void
  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event: UnidocProducerEvent.CompletionEvent, listener: UnidocProducer.CompletionListener): void
  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event: UnidocProducerEvent.InitializationEvent, listener: UnidocProducer.InitializationListener): void
  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event: UnidocProducerEvent.FailureEvent, listener: UnidocProducer.FailureListener): void
  public addEventListener(event: UnidocProducerEvent, listener: any) {
    this._producer.addEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event: UnidocProducerEvent.ProductionEvent, listener: UnidocProducer.ProductionListener<UnidocEvent>): void
  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event: UnidocProducerEvent.CompletionEvent, listener: UnidocProducer.CompletionListener): void
  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event: UnidocProducerEvent.InitializationEvent, listener: UnidocProducer.InitializationListener): void
  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event: UnidocProducerEvent.FailureEvent, listener: UnidocProducer.FailureListener): void
  public removeEventListener(event: UnidocProducerEvent, listener: any) {
    this._producer.removeEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeAllEventListener
  */
  public removeAllEventListener(event: UnidocProducerEvent): void
  /**
  * @see UnidocProducer.removeAllEventListener
  */
  public removeAllEventListener(): void
  public removeAllEventListener(...parameters: [any?]) {
    this._producer.removeAllEventListener(...parameters)
  }
}

export namespace TrackedUnidocEventProducer {
  export function create(): TrackedUnidocEventProducer {
    return new TrackedUnidocEventProducer()
  }
}
