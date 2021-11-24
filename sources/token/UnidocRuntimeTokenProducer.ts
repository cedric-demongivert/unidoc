import { UnidocPublisher } from '../stream/UnidocPublisher'
import { UnidocProducerEvent } from '../stream/UnidocProducerEvent'

import { UnidocTracker } from '../origin/UnidocTracker'
import { UnidocOrigin } from '../origin/UnidocOrigin'
import { UnidocParser } from '../parser/UnidocParser'
import { UTF32CodeUnit } from '../symbol/UTF32CodeUnit'

import { UnidocToken } from './UnidocToken'
import { UnidocTokenBuffer } from './UnidocTokenBuffer'
import { UnidocTokenBuilder } from './UnidocTokenBuilder'
import { UnidocURI } from '../origin/UnidocURI'
import { UnidocAuthority } from '../origin/UnidocAuthority'

const DEFAULT_OPENING_BLOCK_LINE: string = '{'
const DEFAULT_CLOSING_BLOCK_LINE: string = '}'

const STATE_WORD: number = 0
const STATE_SPACE: number = 1
const STATE_CARRIAGE_RETURN: number = 2
const STATE_NEWLINE: number = 3

function getState(unit: UTF32CodeUnit): number {
  switch (unit) {
    case UTF32CodeUnit.VERTICAL_TABULATION:
    case UTF32CodeUnit.FORM_FEED:
    case UTF32CodeUnit.LINE_SEPARATOR:
    case UTF32CodeUnit.PARAGRAPH_SEPARATOR:
    case UTF32CodeUnit.NEXT_LINE:
      return STATE_NEWLINE
    case UTF32CodeUnit.CARRIAGE_RETURN:
      return STATE_CARRIAGE_RETURN
    case UTF32CodeUnit.SPACE:
    case UTF32CodeUnit.HORIZONTAL_TABULATION:
    case UTF32CodeUnit.FORM_FEED:
      return STATE_SPACE
    default:
      return STATE_WORD
  }
}

/**
* A unidoc token.
*/
export class UnidocRuntimeTokenProducer extends UnidocPublisher<UnidocToken> {
  /**
   * 
   */
  private readonly _tracker: UnidocTracker

  /**
   * 
   */
  private readonly _token: UnidocTokenBuilder

  /**
   * 
   */
  private readonly _origin: UnidocOrigin

  /**
   * 
   */
  public readonly name: string

  /**
  * Instantiate a new unidoc token.
  *
  * @param [name: string = UnidocRuntimeTokenProducer.DEFAULT_NAME]
  */
  public constructor(name: string = UnidocRuntimeTokenProducer.DEFAULT_NAME) {
    super()
    this._token = new UnidocTokenBuilder()
    this._token.origin.push(UnidocRuntimeTokenProducer.origin())
    this._origin = this._token.origin.origins.last
    this._tracker = new UnidocTracker()
    this.name = name
  }

  /**
   * 
   */
  public fromSource(uri: UnidocURI): this {
    this._origin.source.copy(uri)
    return this
  }

  /**
  * Produce an identifier token.
  *
  * @param value - Code points of the token to produce.
  * @param [line = value] - The line of text associated with the token.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceIdentifier(value: string, line: string = value): UnidocRuntimeTokenProducer {
    const token: UnidocTokenBuilder = this._token
    const origin: UnidocOrigin = this._origin
    const tracker: UnidocTracker = this._tracker

    origin.fromLocation(tracker.location)
    tracker.nextString(line)
    origin.toLocation(tracker.location)

    token.asIdentifier(value)

    this.output.next(token.get())

    token.incrementIndex()

    return this
  }

  /**
  * Produce a class token.
  *
  * @param value - Code points of the token to produce.
  * @param [line = value] - The line of text associated with the token.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceClass(value: string, line: string = value): UnidocRuntimeTokenProducer {
    const token: UnidocTokenBuilder = this._token
    const origin: UnidocOrigin = this._origin
    const tracker: UnidocTracker = this._tracker

    origin.fromLocation(tracker.location)
    tracker.nextString(line)
    origin.toLocation(tracker.location)

    token.asClass(value)

    this.output.next(token.get())

    token.incrementIndex()

    return this
  }

  /**
  * Produce a tag token.
  *
  * @param value - Code points of the token to produce.
  * @param [line = value] - The line of text associated with the token.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceTag(value: string, line: string = value): UnidocRuntimeTokenProducer {
    const token: UnidocTokenBuilder = this._token
    const origin: UnidocOrigin = this._origin
    const tracker: UnidocTracker = this._tracker

    origin.fromLocation(tracker.location)
    tracker.nextString(line)
    origin.toLocation(tracker.location)

    token.asTag(value)

    this.output.next(token.get())

    token.incrementIndex()

    return this
  }

  /**
  * Produce a block start token.
  *
  * @param [line = DEFAULT_OPENING_BLOCK_LINE] - The line of text associated with the token.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceBlockStart(line: string = DEFAULT_OPENING_BLOCK_LINE): UnidocRuntimeTokenProducer {
    const token: UnidocTokenBuilder = this._token
    const origin: UnidocOrigin = this._origin
    const tracker: UnidocTracker = this._tracker

    origin.fromLocation(tracker.location)
    tracker.nextString(line)
    origin.toLocation(tracker.location)

    token.asBlockStart()

    this.output.next(token.get())

    token.incrementIndex()

    return this
  }

  /**
  * Produce a block end token.
  *
  * @param [line = DEFAULT_CLOSING_BLOCK_LINE] - The line of text associated with the token.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceBlockEnd(line: string = DEFAULT_CLOSING_BLOCK_LINE): UnidocRuntimeTokenProducer {
    const token: UnidocTokenBuilder = this._token
    const origin: UnidocOrigin = this._origin
    const tracker: UnidocTracker = this._tracker

    origin.fromLocation(tracker.location)
    tracker.nextString(line)
    origin.toLocation(tracker.location)

    token.asBlockEnd()

    this.output.next(token.get())

    token.incrementIndex()

    return this
  }

  /**
  * Produce a space token.
  *
  * @param value - Code points of the token to produce.
  * @param [line = value] - The line of text associated with the token.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceSpace(value: string, line: string = value): UnidocRuntimeTokenProducer {
    const token: UnidocTokenBuilder = this._token
    const origin: UnidocOrigin = this._origin
    const tracker: UnidocTracker = this._tracker

    origin.fromLocation(tracker.location)
    tracker.nextString(line)
    origin.toLocation(tracker.location)

    token.asSpace(value)

    this.output.next(token.get())

    token.incrementIndex()

    return this
  }

  /**
  * Produce a newline token.
  *
  * @param [type = '\r\n'] - Type of new line to produce.
  * @param [line = type] - The line of text associated with the token.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceNewline(type: string, line: string = type): UnidocRuntimeTokenProducer {
    const token: UnidocTokenBuilder = this._token
    const origin: UnidocOrigin = this._origin
    const tracker: UnidocTracker = this._tracker

    origin.fromLocation(tracker.location)
    tracker.nextString(line)
    origin.toLocation(tracker.location)

    token.asNewline(type)

    this.output.next(token.get())

    token.incrementIndex()

    return this
  }

  /**
  * Produce a word token.
  *
  * @param value - Code points of the token to produce.
  * @param [line = value] - The line of text associated with the token.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceWord(value: string, line: string = value): UnidocRuntimeTokenProducer {
    const token: UnidocTokenBuilder = this._token
    const origin: UnidocOrigin = this._origin
    const tracker: UnidocTracker = this._tracker

    origin.fromLocation(tracker.location)
    tracker.nextString(line)
    origin.toLocation(tracker.location)

    token.asWord(value)

    this.output.next(token.get())

    token.incrementIndex()

    return this
  }

  /**
  * Produce all extractable word, space and newline tokens of the given string.
  *
  * @param value - The string to split into word, space and newline tokens.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceString(value: string): UnidocRuntimeTokenProducer {
    if (value.length <= 0) return this

    let offset: number = 0
    let cursor: number = 1
    let state: number | undefined = STATE_WORD

    for (const unit of UTF32CodeUnit.fromString(value)) {
      const nextState: number = getState(unit)

      switch (state) {
        case STATE_WORD:
          if (nextState !== state) {
            this.produceWord(value.substring(offset, cursor))
            offset = cursor
          }
          break
        case STATE_SPACE:
          if (nextState !== state) {
            this.produceSpace(value.substring(offset, cursor))
            offset = cursor
          }
          break
        case STATE_CARRIAGE_RETURN:
          if (nextState !== STATE_NEWLINE) {
            this.produceNewline(value.substring(offset, cursor))
            offset = cursor
          }
          break
        case STATE_NEWLINE:
          this.produceNewline(value.substring(offset, cursor))
          offset = cursor
          break
      }

      cursor += 1
      state = nextState
    }

    switch (state) {
      case STATE_WORD:
        this.produceWord(value.substring(offset, cursor))
        break
      case STATE_SPACE:
        this.produceSpace(value.substring(offset, cursor))
        break
      case STATE_CARRIAGE_RETURN:
        this.produceNewline(value.substring(offset, cursor))
        break
      case STATE_NEWLINE:
        this.produceNewline(value.substring(offset, cursor))
        break
    }

    return this
  }

  /**
   * 
   */
  public success(): void {
    this.output.success()
  }
}

/**
 * 
 */
export namespace UnidocRuntimeTokenProducer {
  /**
   * 
   */
  export const URI: Readonly<UnidocURI> = Object.freeze(new UnidocURI('memory').setAuthority(UnidocAuthority.LOOPBACK).pushPath('UnidocRuntimeTokenProducer'))

  /**
   * 
   */
  export function origin(): UnidocOrigin {
    return UnidocOrigin.create(URI)
  }

  /**
   * 
   */
  export const DEFAULT_NAME: string = UnidocRuntimeTokenProducer.name

  /**
   * 
   */
  export function create(): UnidocRuntimeTokenProducer {
    return new UnidocRuntimeTokenProducer()
  }

  /**
   * 
   */
  export function forBuffer(buffer: UnidocTokenBuffer): UnidocRuntimeTokenProducer {
    const result: UnidocRuntimeTokenProducer = new UnidocRuntimeTokenProducer()

    result.on(UnidocProducerEvent.NEXT, buffer.push.bind(buffer))
    result.on(UnidocProducerEvent.SUCCESS, buffer.fit.bind(buffer))

    return result
  }

  /**
   * 
   */
  export function forParser(parser: UnidocParser): UnidocRuntimeTokenProducer {
    const result: UnidocRuntimeTokenProducer = new UnidocRuntimeTokenProducer()

    result.on(UnidocProducerEvent.NEXT, parser.next.bind(parser))
    result.on(UnidocProducerEvent.SUCCESS, parser.success.bind(parser))

    return result
  }
}
