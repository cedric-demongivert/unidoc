
import { UnidocPath, UnidocSection } from "../origin"
import { UnidocFunction } from "../stream"
import { UnidocEvent, UnidocEventType } from "../event"

/**
 * Automatically close unclosed tags.
 */
export class UnidocAutoCloser extends UnidocFunction<UnidocEvent>
{
  /**
   * 
   */
  private readonly _path: UnidocPath

  /**
   * 
   */
  private readonly _event: UnidocEvent

  /**
   * 
   */
  public constructor() {
    super()
    this._event = new UnidocEvent()
    this._path = this._event.path
  }

  /**
   * @see UnidocConsumer.prototype.start
   */
  public start(): void {
    this.output.start()
    this._event.clear()
  }

  /**
   * @see UnidocConsumer.prototype.next
   */
  public next(value: UnidocEvent): void {
    const path: UnidocPath = this._path

    if (value.isStartOfAnyTag()) {
      path.push(UnidocSection.DEFAULT)

      path.last.setClasses(value.classes)
        .setIdentifier(value.identifier)
        .setName(value.symbols)
        .setOrigin(value.origin)
    }

    if (value.isEndOfAnyTag()) {
      path.delete(path.size - 1)
    }

    this._event.origin.endOf(value.origin)

    this.output.next(value)
  }

  /**
   * @see UnidocConsumer.prototype.success
   */
  public success(): void {
    const path: UnidocPath = this._path
    const event: UnidocEvent = this._event

    event.type = UnidocEventType.END_TAG

    while (path.size > 0) {
      const last: UnidocSection = path.last

      event.setClasses(last.classes)
      event.setIdentifier(last.identifier)
      event.setSymbols(last.name)

      path.delete(path.size - 1)

      this.output.next(event)
    }

    this.output.success()
  }

  /**
   * @see UnidocConsumer.prototype.failure
   */
  public failure(error: Error): void {
    this.output.fail(error)
  }

  /**
   * @see Clearable.prototype.clear
   */
  public clear(): this {
    this.off()
    this._event.clear()
    return this
  }
}

/**
 * 
 */
export namespace UnidocAutoCloser {
  /**
   * 
   */
  export function create(): UnidocAutoCloser {
    return new UnidocAutoCloser()
  }
}