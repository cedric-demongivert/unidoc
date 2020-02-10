import { UnidocEvent } from './UnidocEvent'
import { UnidocEventType } from './UnidocEventType'

const EMPTY_STRING : string = ''

export class UnidocWhitespaceEvent extends UnidocEvent {
  /**
  * The discovered whitespace.
  */
  public value : string

  /**
  * Instantiate a new whitespace unidoc event.
  */
  public constructor () {
    super(UnidocEventType.START_WHITESPACE)

    this.value = EMPTY_STRING
  }

  /**
  * Mark as a whitespace start.
  */
  public start () : void {
    this._type = UnidocEventType.START_WHITESPACE
  }

  /**
  * Mark as a whitespace end.
  */
  public end () : void {
    this._type = UnidocEventType.END_WHITESPACE
  }

  /**
  * Deep copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy (toCopy : UnidocWhitespaceEvent) : void {
    this.timestamp = toCopy.timestamp
    this.location  = toCopy.location
    this._type     = toCopy.type
    this.value     = toCopy.value
  }

  /**
  * @see UnidocEvent#reset
  */
  public reset () : void {
    super.reset()

    this.value = EMPTY_STRING
  }

  /**
  * @see UnidocEvent#clone
  */
  public clone () : UnidocWhitespaceEvent {
    return UnidocWhitespaceEvent.copy(this)
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    return this.timestamp + ' ' + UnidocEventType.toString(this._type) + ' ' +
           this.location.toString() + ' "' +
           this.value.replace(/\n/g, ':n')
                     .replace(/\r/g, ':r')
                     .replace(/ /g, ':s')
                     .replace(/\f/g, ':f')
                     .replace(/\t/g, ':t') +
           '"'
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) {
    return super.equals(other) &&
           other instanceof UnidocWhitespaceEvent &&
           other.value === this.value
  }
}

export namespace UnidocWhitespaceEvent {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (
    toCopy : UnidocWhitespaceEvent
  ) : UnidocWhitespaceEvent {
    const copy : UnidocWhitespaceEvent = new UnidocWhitespaceEvent()

    copy.copy(toCopy)

    return copy
  }
}
