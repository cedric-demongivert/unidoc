import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { CodePoint } from '../symbol/CodePoint'

import { ListenableUnidocProducer } from '../producer/ListenableUnidocProducer'

import { UnidocOrigin } from '../origin/UnidocOrigin'

import { UnidocEvent } from './UnidocEvent'
import { UnidocEventType } from './UnidocEventType'

export class UnidocEventProducer extends ListenableUnidocProducer<UnidocEvent> {
  private readonly _event: UnidocEvent
  private _index: number

  /**
  * Instantiate a new unidoc event.
  */
  public constructor() {
    super()
    this._event = new UnidocEvent()
    this._event.origin.from.runtime()
    this._event.origin.to.runtime()
    this._index = 0
  }

  /**
  * @see ListenableUnidocProducer.fail
  */
  public fail(error: Error): void {
    super.fail(error)
  }

  /**
  * @see ListenableUnidocProducer.initialize
  */
  public initialize(): void {
    super.initialize()
  }

  public withType(type: UnidocEventType): UnidocEventProducer {
    this._event.type = type
    return this
  }

  public withSymbols(symbols: Sequence<CodePoint>): UnidocEventProducer {
    this._event.symbols.copy(symbols)
    return this
  }

  public withTag(tag: string): UnidocEventProducer {
    this._event.tag = tag
    return this
  }

  public withIdentifier(identifier: string): UnidocEventProducer {
    this._event.identifier = identifier
    return this
  }

  public withClasses(classes: Iterable<string>): UnidocEventProducer {
    this._event.classes.clear()
    this._event.addClasses(classes)
    return this
  }

  public at(origin: UnidocOrigin): UnidocEventProducer {
    this._event.origin.from.copy(origin)
    this._event.origin.to.copy(origin)
    return this
  }

  public from(): UnidocOrigin
  public from(origin: UnidocOrigin): UnidocEventProducer
  public from(origin?: UnidocOrigin): UnidocOrigin | UnidocEventProducer {
    if (origin) {
      this._event.origin.from.copy(origin)
      return this
    } else {
      this._event.origin.from.clear()
      return this._event.origin.from
    }
  }

  public to(): UnidocOrigin
  public to(origin: UnidocOrigin): UnidocEventProducer
  public to(origin?: UnidocOrigin): UnidocOrigin | UnidocEventProducer {
    if (origin) {
      this._event.origin.to.copy(origin)
      return this
    } else {
      this._event.origin.to.clear()
      return this._event.origin.to
    }
  }

  /**
  * Produce a new word event.
  *
  * @param content - Content of the event to produce.
  *
  * @return This producer for chaining purposes.
  */
  public produceWord(content: string): UnidocEventProducer {
    this._event.asWord(content)

    this.produce(this._event)

    return this
  }

  /**
  * Produce a new whitespace event.
  *
  * @param content - Content of the resulting event.
  *
  * @return This producer for chaining purposes.
  */
  public produceWhitespace(content: string): UnidocEventProducer {
    this._event.asWhitespace(content)

    this.produce(this._event)

    return this
  }

  /**
  * Configure this event as a new starting tag event.
  *
  * @param configuration - Type, identifiers and classes of the resulting tag.
  *
  * @return This producer for chaining purposes.
  */
  public produceTagStart(configuration: string): UnidocEventProducer {
    this._event.asTagStart(configuration)

    this.produce(this._event)

    return this
  }

  /**
  * Configure this event as a new ending tag event.
  *
  * @param configuration - Type, identifiers and classes of the resulting tag.
  *
  * @return This producer for chaining purposes.
  */
  public produceTagEnd(configuration: string): UnidocEventProducer {
    this._event.asTagEnd(configuration)

    this.produce(this._event)

    return this
  }

  public tag(configuration: string, definition: (this: UnidocEventProducer) => void): UnidocEventProducer {
    this.produceTagStart(configuration)
    definition.call(this)
    this.produceTagEnd(configuration)
    return this
  }

  /**
  * @see ListenableUnidocProducer.produce
  */
  public produce(event: UnidocEvent = this._event): void {
    event.index = this._index
    this._index += 1

    super.produce(event)
  }

  /**
  * @see ListenableUnidocProducer.complete
  */
  public complete(): void {
    super.complete()
  }

  public clear(): void {
    this._event.clear()
    this._index = 0
    this.removeAllEventListener()
  }
}

export namespace UnidocEventProducer {
  export function create(): UnidocEventProducer {
    return new UnidocEventProducer()
  }
}
