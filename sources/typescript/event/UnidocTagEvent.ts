import { UnidocEvent } from './UnidocEvent'
import { UnidocEventType } from './UnidocEventType'

const EMPTY_ALIAS : string = ''

/**
* An event emitted when the parser enter or exit a tag structure.
*/
export class UnidocTagEvent extends UnidocEvent {
  /**
  * The alias of the discovered tag.
  */
  public alias : string

  /**
  * The tag type, may be undefined if the tag was not recognized.
  */
  public tag : number

  /**
  * Classes of this tag.
  */
  private _classes : Set<string>

  /**
  * Identifier of this tag, may be undefined
  */
  public identifier : string

  /**
  * Instantiate a new tag event.
  */
  public constructor () {
    super(UnidocEventType.START_TAG)

    this.alias      = EMPTY_ALIAS
    this.tag        = undefined
    this.identifier = undefined
    this._classes   = new Set<string>()
  }

  /**
  * @return The classes associated to this tag.
  */
  public get classes () : Set<string> {
    return this._classes
  }

  /**
  * Update the classes associated to this tag.
  *
  * @param classes - The new set of classes of this tag.
  */
  public set classes (classes : Set<string>) {
    this._classes.clear()

    for (const clazz of classes) {
      this._classes.add(clazz)
    }
  }

  /**
  * Mark as a tag start.
  */
  public start () : void {
    this._type = UnidocEventType.START_TAG
  }

  /**
  * Mark as a tag end.
  */
  public end () : void {
    this._type = UnidocEventType.END_TAG
  }

  /**
  * Deep copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy (toCopy : UnidocTagEvent) : void {
    this.timestamp  = toCopy.timestamp
    this._type      = toCopy.type
    this.location   = toCopy.location
    this.alias      = toCopy.alias
    this.tag        = toCopy.tag
    this.identifier = toCopy.identifier
    this.classes    = toCopy.classes
  }

  /**
  * @see UnidocEvent#clone
  */
  public clone () : UnidocTagEvent {
    return UnidocTagEvent.copy(this)
  }

  /**
  * @see UnidocEvent#clear
  */
  public reset () : void {
    super.reset()

    this.alias      = EMPTY_ALIAS
    this.tag        = undefined
    this.identifier = undefined

    this._classes.clear()
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    let result : string = ''

    result += this.timestamp
    result += ' '
    result += UnidocEventType.toString(this.type)
    result += ' '
    result += this.location.toString()
    result += ' "'
    result += this.alias
    result += '" as '
    result += (this.tag == null ? 'unknown' : this.tag)

    if (this.identifier != null) {
      result += ' #'
      result += this.identifier
    }

    if (this.classes.size > 0) {
      result += ' '
      for (const clazz of this.classes) {
        result += '.'
        result += clazz
      }
    }

    return result
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) {
    if (!super.equals(other)) return false

    if (other instanceof UnidocTagEvent) {
      if (other.classes.size != this._classes.size) return false

      for (const clazz of other.classes) {
        if (!this._classes.has(clazz)) {
          return false
        }
      }

      return other.identifier === this.identifier &&
             other.alias === this.alias &&
             other.tag === this.tag
    }

    return false
  }
}

export namespace UnidocTagEvent {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : UnidocTagEvent) : UnidocTagEvent {
    const copy : UnidocTagEvent = new UnidocTagEvent()

    copy.copy(toCopy)

    return copy
  }
}
