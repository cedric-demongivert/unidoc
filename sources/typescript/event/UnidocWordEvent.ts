import { UnidocEvent } from './UnidocEvent'
import { UnidocEventType } from './UnidocEventType'

const EMPTY_STRING : string = ''

export class UnidocWordEvent extends UnidocEvent {
  /**
  * The discovered word
  */
  public value : string

  /**
  * Instantiate a new content context.
  */
  public constructor () {
    super(UnidocEventType.START_WORD)

    this.value = EMPTY_STRING
  }

  /**
  * Mark as a word start.
  */
  public start () : void {
    this._type = UnidocEventType.START_WORD
  }

  /**
  * Mark as a word end.
  */
  public end () : void {
    this._type = UnidocEventType.END_WORD
  }

  /**
  * Deep copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy (toCopy : UnidocWordEvent) : void {
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
  public clone () : UnidocWordEvent {
    return UnidocWordEvent.copy(this)
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    return this.timestamp + ' ' + UnidocEventType.toString(this._type) + ' ' +
           this.location.toString() + ' "' + this.value + '"'
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) {
    return super.equals(other) &&
           other instanceof UnidocWordEvent &&
           other.value === this.value
  }
}

export namespace UnidocWordEvent {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : UnidocWordEvent) : UnidocWordEvent {
    const copy : UnidocWordEvent = new UnidocWordEvent()

    copy.copy(toCopy)

    return copy
  }
}
