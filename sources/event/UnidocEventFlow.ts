import { UnidocOrigin } from '../origin/UnidocOrigin'
import { UnidocPath } from '../origin/UnidocPath'
import { UnidocSection } from '../origin/UnidocSection'
import { UnidocTracker } from '../origin/UnidocTracker'
import { UnidocURI } from '../origin/UnidocURI'

import { UTF32CodeUnit } from '../symbol/UTF32CodeUnit'

import { UnidocEvent } from './UnidocEvent'
import { UnidocEventType } from './UnidocEventType'

/**
 * 
 */
const DEFAULT_BLOCK_ENDING: string = '}'

const STATE_WORD: number = 0
const STATE_SPACE: number = 1

function getState(unit: UTF32CodeUnit): number {
  switch (unit) {
    case UTF32CodeUnit.VERTICAL_TABULATION:
    case UTF32CodeUnit.FORM_FEED:
    case UTF32CodeUnit.LINE_SEPARATOR:
    case UTF32CodeUnit.PARAGRAPH_SEPARATOR:
    case UTF32CodeUnit.NEXT_LINE:
    case UTF32CodeUnit.CARRIAGE_RETURN:
    case UTF32CodeUnit.SPACE:
    case UTF32CodeUnit.HORIZONTAL_TABULATION:
    case UTF32CodeUnit.FORM_FEED:
      return STATE_SPACE
    default:
      return STATE_WORD
  }
}

/**
 * 
 */
export class UnidocEventFlow {
  /**
   * 
   */
  private readonly _tracker: UnidocTracker

  /**
   * 
   */
  private readonly _event: UnidocEvent

  /**
   * 
   */
  private readonly _origin: UnidocOrigin

  /**
   * 
   */
  private readonly _path: UnidocPath

  /**
   * Instantiate a new unidoc event.
   */
  public constructor(source: UnidocURI = UnidocEventFlow.SOURCE) {
    this._event = new UnidocEvent()
    this._tracker = new UnidocTracker()
    this._event.origin.origins.size = 1
    this._origin = this._event.origin.origins.first
    this._path = new UnidocPath()

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
  public thenWord(content: string, line: string = content): UnidocEvent {
    const event: UnidocEvent = this._event
    const origin: UnidocOrigin = this._origin
    const tracker: UnidocTracker = this._tracker

    origin.fromLocation(tracker.location)
    tracker.nextString(line)
    origin.toLocation(tracker.location)

    this.updatePath()

    return event.asWord(content)
  }

  /**
   * 
   */
  public * thenText(value: string): IterableIterator<UnidocEvent> {
    if (value.length <= 0) return this

    let offset: number = 0
    let cursor: number = 0
    let state: number | undefined = STATE_WORD

    this.updatePath()

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
            yield this.thenWhitespace(value.substring(offset, cursor))
            offset = cursor
          }
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
        yield this.thenWhitespace(value.substring(offset, cursor))
        break
    }

    return this
  }

  /**
   * 
   */
  public thenWhitespace(content: string, line: string = content): UnidocEvent {
    const event: UnidocEvent = this._event
    const origin: UnidocOrigin = this._origin
    const tracker: UnidocTracker = this._tracker

    origin.fromLocation(tracker.location)
    tracker.nextString(line)
    origin.toLocation(tracker.location)

    this.updatePath()

    return event.asWhitespace(content)
  }

  /**
   * 
   */
  public thenTagStart(configuration: string, line: string = '\\' + configuration + '{'): UnidocEvent {
    const event: UnidocEvent = this._event
    const origin: UnidocOrigin = this._origin
    const tracker: UnidocTracker = this._tracker
    const path: UnidocPath = this._path

    origin.fromLocation(tracker.location)
    tracker.nextString(line)
    origin.toLocation(tracker.location)

    event.asTagStart(configuration)

    this.updatePath()

    path.push(UnidocSection.DEFAULT)

    const section: UnidocSection = path.last
    section.setClasses(event.classes)
    section.setIdentifier(event.identifier)
    section.setName(event.symbols)
    section.setOrigin(event.origin)

    return event.asTagStart(configuration)
  }

  /**
   * 
   */
  public thenTagEnd(line: string = DEFAULT_BLOCK_ENDING): UnidocEvent {
    const event: UnidocEvent = this._event
    const origin: UnidocOrigin = this._origin
    const tracker: UnidocTracker = this._tracker
    const path: UnidocPath = this._path

    origin.fromLocation(tracker.location)
    tracker.nextString(line)
    origin.toLocation(tracker.location)

    const section: UnidocSection = path.last

    event.setType(UnidocEventType.END_TAG)
    event.setIdentifier(section.identifier)
    event.setSymbols(section.name)
    event.setClasses(section.classes)

    path.delete(path.size - 1)

    this.updatePath()

    return event
  }

  /**
   * 
   */
  private updatePath(): this {
    const eventPath: UnidocPath = this._event.path
    const path: UnidocPath = this._path

    while (eventPath.size < path.size) {
      eventPath.push(path.get(eventPath.size))
    }

    if (eventPath.size > path.size) {
      eventPath.size = path.size
    }

    return this
  }

  /**
   * 
   */
  public skip(line: string): this {
    this._tracker.nextString(line)
    return this
  }
}

/**
 * 
 */
export namespace UnidocEventFlow {
  /**
   * 
   */
  export const SOURCE: Readonly<UnidocURI> = Object.freeze(UnidocURI.runtime('UnidocEventFlow'))

  /**
   * 
   */
  export function origin(): UnidocOrigin {
    return UnidocOrigin.create().setSource(SOURCE)
  }


  /**
   * 
   */
  export function create(): UnidocEventFlow {
    return new UnidocEventFlow()
  }
}
