import { UnidocEvent } from './UnidocEvent'
import { UnidocEventType } from './UnidocEventType'

export class UnidocBlockEvent extends UnidocEvent {
  /**
  * Classes of the block.
  */
  private _classes : Set<string>

  /**
  * Identifier of the block, may be undefined.
  */
  public identifier : string

  /**
  * Instanciate a new block event.
  */
  public constructor () {
    super(UnidocEventType.START_BLOCK)

    this.identifier = undefined
    this._classes   = new Set<string>()
  }

  /**
  * @return The classes associated to this block.
  */
  public get classes () : Set<string> {
    return this._classes
  }

  /**
  * Update the classes associated to this block.
  *
  * @param classes - The new set of classes of this block.
  */
  public set classes (classes : Set<string>) {
    this._classes.clear()

    for (const clazz of classes) {
      this._classes.add(clazz)
    }
  }

  /**
  * Mark as a block start.
  */
  public start () : void {
    this._type = UnidocEventType.START_BLOCK
  }

  /**
  * Mark as a block end.
  */
  public end () : void {
    this._type = UnidocEventType.END_BLOCK
  }

  /**
  * @see UnidocEvent#clone
  */
  public clone () : UnidocBlockEvent {
    return UnidocBlockEvent.copy(this)
  }

  /**
  * Deep copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy (toCopy : UnidocBlockEvent) : void {
    this.timestamp  = toCopy.timestamp
    this.location   = toCopy.location
    this._type      = toCopy.type
    this.classes    = toCopy.classes
    this.identifier = toCopy.identifier
  }

  /**
  * @see UnidocEvent#reset
  */
  public reset () : void {
    super.reset()

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

    if (other instanceof UnidocBlockEvent) {
      if (other.classes.size != this._classes.size) return false

      for (const clazz of other.classes) {
        if (!this._classes.has(clazz)) {
          return false
        }
      }

      return other.identifier === this.identifier
    }

    return false
  }
}

export namespace UnidocBlockEvent {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : UnidocBlockEvent) : UnidocBlockEvent {
    const copy : UnidocBlockEvent = new UnidocBlockEvent()

    copy.copy(toCopy)

    return copy
  }
}
