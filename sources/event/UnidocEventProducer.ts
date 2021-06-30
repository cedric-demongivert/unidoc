import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { CodePoint } from '../symbol/CodePoint'

import { UnidocPublisher } from '../stream/UnidocPublisher'

import { UnidocOrigin } from '../origin/UnidocOrigin'

import { UnidocEvent } from './UnidocEvent'
import { UnidocEventType } from './UnidocEventType'
import { UnidocEventBuilder } from './UnidocEventBuilder'

export class UnidocEventProducer extends UnidocPublisher<UnidocEvent> {
  /**
   *
   */
  private readonly _event: UnidocEventBuilder

  /**
   * 
   */
  private _index: number

  /**
  * Instantiate a new unidoc event.
  */
  public constructor() {
    super()
    this._event = new UnidocEventBuilder()
    this._index = 0
  }

  /**
   * 
   */
  public fail(error: Error): void {
    this.output.fail(error)
  }

  /**
   * 
   */
  public start(): void {
    this.output.start()
  }

  /**
   * 
   */
  public event(): UnidocEventProducer {
    this._event.clear()
    return this
  }

  /**
   * 
   */
  public setType(type: UnidocEventType): UnidocEventProducer {
    this._event.setType(type)
    return this
  }

  /**
   * 
   */
  public setSymbols(symbols: Sequence<CodePoint>): UnidocEventProducer {
    this._event.setSymbols(symbols)
    return this
  }

  /**
   * 
   */
  public setTag(tag: string): UnidocEventProducer {
    this._event.setTag(tag)
    return this
  }

  /**
   * 
   */
  public setIdentifier(identifier: string): UnidocEventProducer {
    this._event.setIdentifier(identifier)
    return this
  }

  /**
   * 
   */
  public setClasses(classes: Iterable<string>): UnidocEventProducer {
    this._event.setClasses(classes)
    return this
  }

  /**
   * 
   */
  public produce(event: UnidocEvent = this._event.get()): void {
    event.index = this._index
    this._index += 1

    this.output.next(event)
  }

  /**
   * 
   */
  public success(): void {
    this.output.success()
  }

  /**
   * 
   */
  public setOrigin(from: UnidocOrigin, to: UnidocOrigin = from): UnidocEventProducer {
    this._event.setOrigin(from, to)
    return this
  }

  /**
   * 
   */
  public setFrom(from: UnidocOrigin): UnidocEventProducer {
    this._event.setFrom(from)
    return this
  }

  /**
   * 
   */
  public setTo(to: UnidocOrigin): UnidocEventProducer {
    this._event.setTo(to)
    return this
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
    this.produce()

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
    this.produce()

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
    this.produce()

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
    this.produce()

    return this
  }

  /**
   * 
   */
  public tag(configuration: string, definition: (this: UnidocEventProducer) => void): UnidocEventProducer {
    this.produceTagStart(configuration)
    definition.call(this)
    this.produceTagEnd(configuration)
    return this
  }

  /**
   * 
   */
  public clear(): void {
    this._event.clear()
    this._index = 0
    this.off()
  }
}

/**
 * 
 */
export namespace UnidocEventProducer {
  /**
   * 
   */
  export function create(): UnidocEventProducer {
    return new UnidocEventProducer()
  }
}
