import { UnidocOrigin, UnidocTracker, UnidocURI, UnidocLocation } from '../origin'
import { UTF32CodeUnit } from '../symbol'

import { UnidocToken } from './UnidocToken'

const DEFAULT_OPENING_BLOCK_TEXT: string = '{'
const DEFAULT_CLOSING_BLOCK_TEXT: string = '}'

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
* An unidoc token token.
*/
export class UnidocTokenFlow {
  /**
   * 
   */
  private readonly _token: UnidocToken

  /**
   * 
   */
  private readonly _tracker: UnidocTracker

  /**
   * 
   */
  private readonly _origin: UnidocOrigin

  /**
   * 
   */
  public constructor(source: UnidocURI = UnidocTokenFlow.SOURCE, capacity: number = 16) {
    this._token = new UnidocToken(capacity)
    this._tracker = new UnidocTracker()

    const token: UnidocToken = this._token

    token.origin.origins.push(UnidocOrigin.DEFAULT)
    this._origin = token.origin.origins.first
    this._origin.setSource(source)
  }

  /**
   * 
   */
  public setSource(source: UnidocURI): this {
    this._origin.setSource(source)
    return this
  }

  /**
   * 
   */
  public setLocation(location: UnidocLocation): this {
    this._tracker.location.copy(location)
    return this
  }

  /**
   * 
   */
  public thenIdentifier(value: string, representation: string = value): UnidocToken {
    const token: UnidocToken = this._token
    const origin: UnidocOrigin = this._origin
    const tracker: UnidocTracker = this._tracker

    origin.fromLocation(tracker.location)
    tracker.nextString(representation)
    origin.toLocation(tracker.location)

    return token.asIdentifier(value)
  }

  /**
   * 
   */
  public thenClass(value: string, representation: string = value): UnidocToken {
    const token: UnidocToken = this._token
    const origin: UnidocOrigin = this._origin
    const tracker: UnidocTracker = this._tracker

    origin.fromLocation(tracker.location)
    tracker.nextString(representation)
    origin.toLocation(tracker.location)

    return token.asClass(value)
  }

  /**
   * 
   */
  public thenTag(value: string, representation: string = value): UnidocToken {
    const token: UnidocToken = this._token
    const origin: UnidocOrigin = this._origin
    const tracker: UnidocTracker = this._tracker

    origin.fromLocation(tracker.location)
    tracker.nextString(representation)
    origin.toLocation(tracker.location)

    return token.asTag(value)
  }

  /**
   * 
   */
  public thenBlockStart(text: string = DEFAULT_OPENING_BLOCK_TEXT): UnidocToken {
    const token: UnidocToken = this._token
    const origin: UnidocOrigin = this._origin
    const tracker: UnidocTracker = this._tracker

    origin.fromLocation(tracker.location)
    tracker.nextString(text)
    origin.toLocation(tracker.location)

    return token.asBlockStart()
  }

  /**
   * 
   */
  public thenBlockEnd(text: string = DEFAULT_CLOSING_BLOCK_TEXT): UnidocToken {
    const token: UnidocToken = this._token
    const origin: UnidocOrigin = this._origin
    const tracker: UnidocTracker = this._tracker

    origin.fromLocation(tracker.location)
    tracker.nextString(text)
    origin.toLocation(tracker.location)

    return token.asBlockEnd()
  }

  /**
   * 
   */
  public thenSpace(value: string, text: string = value): UnidocToken {
    const token: UnidocToken = this._token
    const origin: UnidocOrigin = this._origin
    const tracker: UnidocTracker = this._tracker

    origin.fromLocation(tracker.location)
    tracker.nextString(text)
    origin.toLocation(tracker.location)

    return token.asSpace(value)
  }

  /**
   * 
   */
  public thenNewline(type: string, text: string = type): UnidocToken {
    const token: UnidocToken = this._token
    const origin: UnidocOrigin = this._origin
    const tracker: UnidocTracker = this._tracker

    origin.fromLocation(tracker.location)
    tracker.nextString(text)
    origin.toLocation(tracker.location)

    return token.asNewline(type)
  }

  /**
   * 
   */
  public thenWord(value: string, text: string = value): UnidocToken {
    const token: UnidocToken = this._token
    const origin: UnidocOrigin = this._origin
    const tracker: UnidocTracker = this._tracker

    origin.fromLocation(tracker.location)
    tracker.nextString(text)
    origin.toLocation(tracker.location)

    return token.asWord(value)
  }

  /**
   * 
   */
  public * thenText(value: string): IterableIterator<UnidocToken> {
    if (value.length <= 0) return this

    let offset: number = 0
    let cursor: number = 1
    let state: number | undefined = STATE_WORD

    for (const unit of UTF32CodeUnit.fromString(value)) {
      const nextState: number = getState(unit)

      switch (state) {
        case STATE_WORD:
          if (nextState !== state) {
            yield this.thenWord(value.substring(offset, cursor))
            offset = cursor
          }
          break
        case STATE_SPACE:
          if (nextState !== state) {
            yield this.thenSpace(value.substring(offset, cursor))
            offset = cursor
          }
          break
        case STATE_CARRIAGE_RETURN:
          if (nextState !== STATE_NEWLINE) {
            yield this.thenNewline(value.substring(offset, cursor))
            offset = cursor
          }
          break
        case STATE_NEWLINE:
          yield this.thenNewline(value.substring(offset, cursor))
          offset = cursor
          break
      }

      cursor += 1
      state = nextState
    }

    switch (state) {
      case STATE_WORD:
        yield this.thenWord(value.substring(offset, cursor))
        break
      case STATE_SPACE:
        yield this.thenSpace(value.substring(offset, cursor))
        break
      case STATE_CARRIAGE_RETURN:
        yield this.thenNewline(value.substring(offset, cursor))
        break
      case STATE_NEWLINE:
        yield this.thenNewline(value.substring(offset, cursor))
        break
    }

    return this
  }
}

/**
 * 
 */
export namespace UnidocTokenFlow {
  /**
   * 
   */
  export const SOURCE: Readonly<UnidocURI> = Object.freeze(UnidocURI.runtime('UnidocTokenFlow'))

  /**
   * 
   */
  export function origin(): UnidocOrigin {
    return UnidocOrigin.create().setSource(SOURCE)
  }

  /**
   * 
   */
  export function create(): UnidocTokenFlow {
    return new UnidocTokenFlow()
  }
}
