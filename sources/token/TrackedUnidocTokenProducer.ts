import { UnidocProducer } from '../producer/UnidocProducer'
import { UnidocProducerEvent } from '../producer/UnidocProducerEvent'
import { UnidocLocationTracker } from '../location/UnidocLocationTracker'
import { UnidocParser } from '../parser/UnidocParser'
import { CodePoint } from '../symbol/CodePoint'

import { UnidocTokenProducer } from './UnidocTokenProducer'
import { UnidocToken } from './UnidocToken'
import { UnidocTokenBuffer } from './UnidocTokenBuffer'

const DEFAULT_OPENING_BLOCK_LINE: string = '{'
const DEFAULT_CLOSING_BLOCK_LINE: string = '}'

const STATE_WORD: number = 0
const STATE_SPACE: number = 1
const STATE_CARRIAGE_RETURN: number = 2
const STATE_NEWLINE: number = 3

function getState(codePoint: CodePoint): number {
  switch (codePoint) {
    case CodePoint.NEW_LINE:
      return STATE_NEWLINE
    case CodePoint.CARRIAGE_RETURN:
      return STATE_CARRIAGE_RETURN
    case CodePoint.SPACE:
    case CodePoint.TABULATION:
    case CodePoint.FORM_FEED:
      return STATE_SPACE
    default:
      return STATE_WORD
  }
}

/**
* A unidoc token.
*/
export class TrackedUnidocTokenProducer implements UnidocProducer<UnidocToken> {
  private readonly _producer: UnidocTokenProducer
  private readonly _tracker: UnidocLocationTracker

  /**
  * Instantiate a new unidoc token.
  *
  * @param [capacity = 16] - Initial capacity of the symbol buffer of this token.
  */
  public constructor() {
    this._producer = new UnidocTokenProducer()
    this._tracker = new UnidocLocationTracker()
  }

  /**
  * Produce an identifier token.
  *
  * @param value - Code points of the token to produce.
  * @param [line = value] - The line of text associated with the token.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceIdentifier(value: string, line: string = value): TrackedUnidocTokenProducer {
    this._producer.from().text(this._tracker.location).runtime()
    this._tracker.nextString(line)
    this._producer.to().text(this._tracker.location).runtime()

    this._producer.produceIdentifier(value)

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
  public produceClass(value: string, line: string = value): TrackedUnidocTokenProducer {
    this._producer.from().text(this._tracker.location).runtime()
    this._tracker.nextString(line)
    this._producer.to().text(this._tracker.location).runtime()

    this._producer.produceClass(value)

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
  public produceTag(value: string, line: string = value): TrackedUnidocTokenProducer {
    this._producer.from().text(this._tracker.location).runtime()
    this._tracker.nextString(line)
    this._producer.to().text(this._tracker.location).runtime()

    this._producer.produceTag(value)

    return this
  }

  /**
  * Produce a block start token.
  *
  * @param [line = DEFAULT_OPENING_BLOCK_LINE] - The line of text associated with the token.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceBlockStart(line: string = DEFAULT_OPENING_BLOCK_LINE): TrackedUnidocTokenProducer {
    this._producer.from().text(this._tracker.location).runtime()
    this._tracker.nextString(line)
    this._producer.to().text(this._tracker.location).runtime()

    this._producer.produceBlockStart()

    return this
  }

  /**
  * Produce a block end token.
  *
  * @param [line = DEFAULT_CLOSING_BLOCK_LINE] - The line of text associated with the token.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceBlockEnd(line: string = DEFAULT_CLOSING_BLOCK_LINE): TrackedUnidocTokenProducer {
    this._producer.from().text(this._tracker.location).runtime()
    this._tracker.nextString(line)
    this._producer.to().text(this._tracker.location).runtime()

    this._producer.produceBlockEnd()

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
  public produceSpace(value: string, line: string = value): TrackedUnidocTokenProducer {
    this._producer.from().text(this._tracker.location).runtime()
    this._tracker.nextString(line)
    this._producer.to().text(this._tracker.location).runtime()

    this._producer.produceSpace(value)

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
  public produceNewline(type: '\r\n' | '\r' | '\n' = '\r\n', line: string = type): TrackedUnidocTokenProducer {
    this._producer.from().text(this._tracker.location).runtime()
    this._tracker.nextString(line)
    this._producer.to().text(this._tracker.location).runtime()

    this._producer.produceNewline(type)

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
  public produceWord(value: string, line: string = value): TrackedUnidocTokenProducer {
    this._producer.from().text(this._tracker.location).runtime()
    this._tracker.nextString(line)
    this._producer.to().text(this._tracker.location).runtime()

    this._producer.produceWord(value)

    return this
  }

  /**
  * Produce all extractable word, space and newline tokens of the given string.
  *
  * @param value - The string to split into word, space and newline tokens.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceString(value: string): TrackedUnidocTokenProducer {
    if (value.length > 0) {
      let offset: number = 0
      let cursor: number = 1
      let state: number = getState(value.codePointAt(0) as CodePoint)

      while (cursor < value.length) {
        const nextState: number = getState(value.codePointAt(cursor) as CodePoint)

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
              this.produceNewline(value.substring(offset, cursor) as '\r')
              offset = cursor
            }
            break
          case STATE_NEWLINE:
            this.produceNewline(value.substring(offset, cursor) as '\n' | '\r\n')
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
          this.produceNewline(value.substring(offset, cursor) as '\r')
          break
        case STATE_NEWLINE:
          this.produceNewline(value.substring(offset, cursor) as '\n' | '\r\n')
          break
      }
    }

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
  public addEventListener(event: number, listener: UnidocProducer.ProductionListener<UnidocToken>): void
  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event: number, listener: UnidocProducer.CompletionListener): void
  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event: number, listener: UnidocProducer.InitializationListener): void
  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event: number, listener: UnidocProducer.FailureListener): void
  public addEventListener(event: any, listener: any) {
    this._producer.addEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event: number, listener: UnidocProducer.ProductionListener<UnidocToken>): void
  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event: number, listener: UnidocProducer.CompletionListener): void
  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event: number, listener: UnidocProducer.InitializationListener): void
  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event: number, listener: UnidocProducer.FailureListener): void
  public removeEventListener(event: any, listener: any) {
    this._producer.removeEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeAllEventListener
  */
  public removeAllEventListener(event: number): void
  /**
  * @see UnidocProducer.removeAllEventListener
  */
  public removeAllEventListener(): void
  public removeAllEventListener(...params: [any?]) {
    this._producer.removeAllEventListener(...params)
  }
}

export namespace TrackedUnidocTokenProducer {
  export function create(): TrackedUnidocTokenProducer {
    return new TrackedUnidocTokenProducer()
  }

  export function forBuffer(buffer: UnidocTokenBuffer): TrackedUnidocTokenProducer {
    const result: TrackedUnidocTokenProducer = new TrackedUnidocTokenProducer()

    result.addEventListener(UnidocProducerEvent.PRODUCTION, buffer.push.bind(buffer))
    result.addEventListener(UnidocProducerEvent.COMPLETION, buffer.fit.bind(buffer))

    return result
  }

  export function forParser(parser: UnidocParser): TrackedUnidocTokenProducer {
    const result: TrackedUnidocTokenProducer = new TrackedUnidocTokenProducer()

    result.addEventListener(UnidocProducerEvent.PRODUCTION, parser.next.bind(parser))
    result.addEventListener(UnidocProducerEvent.COMPLETION, parser.complete.bind(parser))

    return result
  }
}
