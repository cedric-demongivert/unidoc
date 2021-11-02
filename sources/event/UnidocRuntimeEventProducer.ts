import { UnidocPublisher } from '../stream/UnidocPublisher'
import { UnidocLocationTracker } from '../location/UnidocLocationTracker'

import { UTF32CodeUnit } from '../symbol/UTF32CodeUnit'

import { UnidocEvent } from './UnidocEvent'
import { UnidocEventBuilder } from './UnidocEventBuilder'

/**
 * 
 */
const DEFAULT_BLOCK_ENDING: string = '}'

/**
 * 
 */
export class UnidocRuntimeEventProducer extends UnidocPublisher<UnidocEvent> {
  /**
   * 
   */
  private readonly _tracker: UnidocLocationTracker

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
    this._tracker = new UnidocLocationTracker()
  }

  /**
   * 
   */
  public start(): this {
    this.output.start()
    return this
  }

  /**
   * 
   */
  public fail(error: Error): this {
    this.output.fail(error)
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
  public produceWord(content: string, line: string = content): this {
    const event: UnidocEventBuilder = this._event

    event.from.clear()
    event.to.clear()

    event.from.text(this._tracker.location).runtime()
    this._tracker.nextString(line)
    event.to.text(this._tracker.location).runtime()

    event.asWord(content)

    this.output.next(event.get())

    event.incrementIndex()

    return this
  }

  /**
  * Produce a text.
  *
  * @param lines - Lines of text to produce.
  *
  * @return This producer for chaining purposes.
  */
  public produceText(...lines: string[]): this {
    return this.produceString(lines.join('\r\n'))
  }

  /**
  * Produce a line of text.
  *
  * @param line - Line of text to produce.
  *
  * @return This producer for chaining purposes.
  */
  public produceString(line: string): this {
    if (line.length > 0) {
      let offset: number = 0
      let spaces: boolean = UTF32CodeUnit.isWhitespace(line.codePointAt(0)!)

      /**
       * @TODO REPLACE UTF32CODEUNIT BY UTF16CODEUNIT, PROBLEM AHEAD
       */
      for (let index = 1, size = line.length; index < size; ++index) {
        if (UTF32CodeUnit.isWhitespace(line.codePointAt(index)!) !== spaces) {
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
  public produceWhitespace(content: string, line: string = content): this {
    const event: UnidocEventBuilder = this._event

    event.from.clear()
    event.to.clear()

    event.from.text(this._tracker.location).runtime()
    this._tracker.nextString(line)
    event.to.text(this._tracker.location).runtime()

    event.asWhitespace(content)

    this.output.next(event.get())

    event.incrementIndex()

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
  public produceTagStart(configuration: string, line: string = '\\' + configuration + '{'): this {
    const event: UnidocEventBuilder = this._event

    event.from.clear()
    event.to.clear()

    event.from.text(this._tracker.location).runtime()
    this._tracker.nextString(line)
    event.to.text(this._tracker.location).runtime()

    event.asTagStart(configuration)

    this.output.next(event.get())

    event.incrementIndex()

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
  public produceTagEnd(configuration: string, line: string = DEFAULT_BLOCK_ENDING): this {
    const event: UnidocEventBuilder = this._event

    event.from.clear()
    event.to.clear()

    event.from.text(this._tracker.location).runtime()
    this._tracker.nextString(line)
    event.to.text(this._tracker.location).runtime()

    event.asTagEnd(configuration)

    this.output.next(event.get())

    event.incrementIndex()

    return this
  }

  /**
   * 
   */
  public produceTag(configuration: string, definition: (this: this) => void): this {
    this.produceTagStart(configuration)
    definition.call(this)
    this.produceTagEnd(configuration)
    return this
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
  public clear(): this {
    this._event.clear()
    this._tracker.clear()
    this.off()

    return this
  }
}

/**
 * 
 */
export namespace UnidocRuntimeEventProducer {
  /**
   * 
   */
  export function create(): UnidocRuntimeEventProducer {
    return new UnidocRuntimeEventProducer()
  }
}
