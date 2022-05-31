import { UTF32String } from '../symbol/UTF32String'

import { UnidocPublisher } from '../stream/UnidocPublisher'

import { UnidocOrigin } from '../origin/UnidocOrigin'

import { UnidocEvent } from './UnidocEvent'
import { UnidocEventType } from './UnidocEventType'
import { UnidocEventBuilder } from './UnidocEventBuilder'
import { UnidocLayout } from '../origin/UnidocLayout'

export class UnidocEventProducer extends UnidocPublisher<UnidocEvent> {
  /**
   *
   */
  private readonly _event: UnidocEventBuilder

  /**
  * Instantiate a new unidoc event.
  */
  public constructor() {
    super()
    this._event = new UnidocEventBuilder()
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
  public event(): this {
    this._event.clear()
    return this
  }

  /**
   * 
   */
  public setType(type: UnidocEventType): this {
    this._event.setType(type)
    return this
  }

  /**
   * 
   */
  public setSymbols(symbols: UTF32String): this {
    this._event.setSymbols(symbols)
    return this
  }

  /**
   * 
   */
  public setIdentifier(identifier: UTF32String): this {
    this._event.setIdentifier(identifier)
    return this
  }

  /**
   * 
   */
  public setClasses(classes: Iterable<string>): this {
    this._event.setClasses(classes)
    return this
  }

  /**
   * 
   */
  public produce(event: UnidocEvent = this._event.get()): void {
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
  public setOrigin(origin: UnidocLayout): this {
    this._event.setOrigin(origin)
    return this
  }


  /**
   * Produce a new word event.
   *
   * @param content - Content of the event to produce.
   *
   * @return This producer for chaining purposes.
   */
  public produceWord(content: string): this {
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
  public produceWhitespace(content: string): this {
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
  public produceTagStart(configuration: string): this {
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
  public produceTagEnd(configuration: string): this {
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
