import { UnidocEvent } from './UnidocEvent'
import { UnidocEventType } from './UnidocEventType'

export class UnidocDocumentEvent extends UnidocEvent {
  /**
  * Instantiate a new unidoc document event.
  */
  public constructor () {
    super(UnidocEventType.START_DOCUMENT)
  }

  /**
  * Mark as a document start.
  */
  public start () : void {
    this._type = UnidocEventType.START_DOCUMENT
  }

  /**
  * Mark as a document end.
  */
  public end () : void {
    this._type = UnidocEventType.END_DOCUMENT
  }

  /**
  * @see UnidocEvent#clone
  */
  public clone () : UnidocDocumentEvent {
    return UnidocDocumentEvent.copy(this)
  }

  /**
  * Deep copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy (toCopy : UnidocDocumentEvent) : void {
    this.timestamp = toCopy.timestamp
    this.location  = toCopy.location
    this._type     = toCopy.type
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) {
    return super.equals(other) && other instanceof UnidocDocumentEvent
  }
}

export namespace UnidocDocumentEvent {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : UnidocDocumentEvent) : UnidocDocumentEvent {
    const copy : UnidocDocumentEvent = new UnidocDocumentEvent()

    copy.copy(toCopy)

    return copy
  }
}
