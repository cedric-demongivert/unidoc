
import { UnidocLayout } from "../origin"
import { UTF32String } from "../symbol"
import { UnidocFunction } from "../stream"
import { UnidocEvent } from "../event"

/**
 * 
 */
const DOCUMENT_TAG: UTF32String = UTF32String.fromString('document')

/**
 * Automatically wrap an unidoc event stream into a root "document" tag if none are emitted.
 */
export class DocumentWrapper extends UnidocFunction<UnidocEvent>
{
  /**
   * 
   */
  private readonly _event: UnidocEvent

  /**
   * 
   */
  private readonly _location: UnidocLayout

  /**
   * 
   */
  private _first: boolean

  /**
   * 
   */
  public constructor() {
    super()
    this._event = new UnidocEvent()
    this._location = new UnidocLayout()
    this._first = true
  }

  /**
   * @see UnidocConsumer.prototype.start
   */
  public start(): void {
    this.output.start()
  }

  /**
   * @see UnidocConsumer.prototype.next
   */
  public next(value: UnidocEvent): void {
    if (this._first) {
      this.handleFirstEvent(value)
    } else {
      this.output.next(value)
    }
  }

  /**
   * 
   */
  private handleFirstEvent(value: UnidocEvent): void {
    const event: UnidocEvent = this._event

    this._first = false

    if (value.isStartOfAnyTag() && value.symbols.equals(DOCUMENT_TAG)) {
      event.classes.copy(value.classes)
      event.identifier.copy(value.identifier)
      event.origin.endOf(value.origin)
      return this.output.next(value)
    }
  }

  /**
   * @see UnidocConsumer.prototype.success
   */
  public success(): void {

  }

  /**
   * @see UnidocConsumer.prototype.failure
   */
  public failure(error: Error): void {
    this.output.fail(error)
  }
}
