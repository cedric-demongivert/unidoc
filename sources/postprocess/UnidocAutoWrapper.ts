
import { UnidocLayout, UnidocOrigin, UnidocPath, UnidocSection, UnidocURI } from "../origin"
import { UTF32String } from "../symbol"
import { UnidocFunction } from "../stream"
import { UnidocEvent, UnidocEventType } from "../event"
import { UnidocAutoWrapperState } from "./UnidocAutoWrapperState"

/**
 * 
 */
const DOCUMENT_TAG: UTF32String = UTF32String.fromString('document')

/**
 * Automatically wrap an unidoc event stream into a root "document" tag if none are emitted.
 */
export class UnidocAutoWrapper extends UnidocFunction<UnidocEvent>
{
  /**
   * 
   */
  private readonly _leadingSpaces: UnidocEvent

  /**
   * 
   */
  private readonly _event: UnidocEvent

  /**
   * 
   */
  private readonly _section: UnidocSection

  /**
   * 
   */
  private _state: UnidocAutoWrapperState

  /**
   * 
   */
  public constructor() {
    super()
    this._leadingSpaces = new UnidocEvent()
    this._leadingSpaces.type = UnidocEventType.WHITESPACE
    this._event = new UnidocEvent()
    this._section = new UnidocSection()
    this._state = UnidocAutoWrapperState.LEADING_WHITESPACES
  }

  /**
   * @see UnidocConsumer.prototype.start
   */
  public start(): void {
    this.output.start()

    this._leadingSpaces.clear()
    this._leadingSpaces.type = UnidocEventType.WHITESPACE
    this._event.clear()
    this._section.clear()
    this._section.name.copy(DOCUMENT_TAG)
    this._state = UnidocAutoWrapperState.LEADING_WHITESPACES
  }

  /**
   * @see UnidocConsumer.prototype.next
   */
  public next(value: UnidocEvent): void {
    switch (this._state) {
      case UnidocAutoWrapperState.LEADING_WHITESPACES:
        return this.handleLeadingWhitespace(value)
      case UnidocAutoWrapperState.DOCUMENT:
        return this.handleDocument(value)
      case UnidocAutoWrapperState.JUST_CLOSED:
        return this.handleJustClosed(value)
      case UnidocAutoWrapperState.STREAM:
        return this.handleStream(value)
      default:
        throw new Error(
          `Unable to handle next event ${value.toString()} in state ${UnidocAutoWrapperState.toDebugString(this._state)} ` +
          'as this unidoc function does not define such a procedure.'
        )
    }
  }

  /**
   * 
   */
  private handleLeadingWhitespace(value: UnidocEvent): void {
    if (value.isWhitespace()) {
      this._leadingSpaces.symbols.concat(value.symbols)
      this._leadingSpaces.origin.concat(value.origin)
      return
    }

    if (value.isStartOfAnyTag() && value.symbols.equals(DOCUMENT_TAG)) {
      this._leadingSpaces.clear()

      const section: UnidocSection = this._section
      section.setClasses(value.classes)
      section.setIdentifier(value.identifier)
      section.setOrigin(value.origin)

      this._state = UnidocAutoWrapperState.DOCUMENT

      this._event.origin.endOf(value.origin)
      this.output.next(value)
      return
    }

    this._state = UnidocAutoWrapperState.STREAM

    const event: UnidocEvent = this._event

    event.type = UnidocEventType.START_TAG
    event.origin.startOf(this._leadingSpaces.origin)
    event.setSymbols(DOCUMENT_TAG)

    this._section.setOrigin(event.origin)

    this.output.next(event)

    event.path.push(this._section)

    this.next(this._leadingSpaces)
    this.next(value)
  }

  /**
   * 
   */
  private handleDocument(value: UnidocEvent): void {
    if (value.path.size === 0) {
      this._state = UnidocAutoWrapperState.JUST_CLOSED
      this._event.copy(value)
      return
    }

    this._event.origin.endOf(value.origin)
    this.output.next(value)
  }

  /**
   * 
   */
  private handleJustClosed(value: UnidocEvent): void {
    this._state = UnidocAutoWrapperState.STREAM
    this._event.path.push(this._section)
    this.next(value)
  }

  /**
   * 
   */
  private handleStream(value: UnidocEvent): void {
    const event: UnidocEvent = this._event
    const valuePath: UnidocPath = value.path
    const eventPath: UnidocPath = event.path

    while (valuePath.size + 1 > eventPath.size) {
      eventPath.push(valuePath.get(eventPath.size - 1))
    }

    if (valuePath.size + 1 < eventPath.size) {
      eventPath.size = valuePath.size + 1
    }

    event.type = value.type
    event.setClasses(value.classes)
    event.setIdentifier(value.identifier)
    event.setOrigin(value.origin)
    event.setSymbols(value.symbols)

    this.output.next(event)
  }

  /**
   * @see UnidocConsumer.prototype.success
   */
  public success(): void {
    switch (this._state) {
      case UnidocAutoWrapperState.LEADING_WHITESPACES:
        return this.handleLeadingWhitespaceSuccess()
      case UnidocAutoWrapperState.JUST_CLOSED:
        return this.handleJustClosedSuccess()
      case UnidocAutoWrapperState.STREAM:
      case UnidocAutoWrapperState.DOCUMENT:
        return this.handleUnclosedSuccess()
      default:
        throw new Error(
          `Unable to handle success in state ${UnidocAutoWrapperState.toDebugString(this._state)} ` +
          'as this unidoc function does not define such a procedure.'
        )
    }
  }

  /**
   * 
   */
  private handleLeadingWhitespaceSuccess(): void {
    const leadingSpaces: UnidocEvent = this._leadingSpaces

    if (leadingSpaces.symbols.size === 0) {
      const event: UnidocEvent = this._event

      event.type = UnidocEventType.START_TAG
      event.origin.startOf(UnidocAutoWrapper.LAYOUT)
      event.setSymbols(DOCUMENT_TAG)

      this.output.next(event)

      event.type = UnidocEventType.END_TAG
      event.origin.endOf(UnidocAutoWrapper.LAYOUT)

      this.output.next(event)
      this.output.success()
      return
    }

    const event: UnidocEvent = this._event
    const section: UnidocSection = this._section

    event.type = UnidocEventType.START_TAG
    event.origin.startOf(leadingSpaces.origin)
    event.setSymbols(DOCUMENT_TAG)

    section.setOrigin(event.origin)

    this.output.next(event)

    leadingSpaces.path.push(section)

    this.output.next(leadingSpaces)

    event.type = UnidocEventType.END_TAG
    event.origin.endOf(leadingSpaces.origin)
    event.setSymbols(DOCUMENT_TAG)

    this.output.next(event)
    this.output.success()
  }

  /**
   * 
   */
  private handleJustClosedSuccess(): void {
    this.output.next(this._event)
    this.output.success()
  }

  /**
   * 
   */
  private handleUnclosedSuccess(): void {
    const event: UnidocEvent = this._event
    const section: UnidocSection = this._section

    event.type = UnidocEventType.END_TAG
    event.setSymbols(section.name)
    event.setIdentifier(section.identifier)
    event.setClasses(section.classes)
    event.origin.reduceToEnd()
    event.path.clear()

    this.output.next(event)
    this.output.success()
  }

  /**
   * @see UnidocConsumer.prototype.failure
   */
  public failure(error: Error): void {
    this.output.failure(error)
  }

  /**
   * @see Clearable.prototype.clear
   */
  public clear(): this {
    this.off()
    this._leadingSpaces.clear()
    this._leadingSpaces.type = UnidocEventType.WHITESPACE
    this._event.clear()
    this._section.clear()
    this._state = UnidocAutoWrapperState.LEADING_WHITESPACES
    return this
  }
}

/**
 * 
 */
export namespace UnidocAutoWrapper {
  /**
   * 
   */
  export function create(): UnidocAutoWrapper {
    return new UnidocAutoWrapper()
  }

  /**
   * 
   */
  export const SOURCE: Readonly<UnidocURI> = Object.freeze(UnidocURI.runtime(UnidocAutoWrapper))

  /**
   * 
   */
  export const ORIGIN: Readonly<UnidocOrigin> = Object.freeze(UnidocOrigin.atCoordinates(0, 0, 0).setSource(SOURCE))

  /**
   * 
   */
  export const LAYOUT: Readonly<UnidocLayout> = Object.freeze(UnidocLayout.create().push(ORIGIN))
}