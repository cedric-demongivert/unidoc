import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocPath } from '../path/UnidocPath'

import { UnidocEvent } from './UnidocEvent'

/**
* @todo Merge into unidoc event with the addition of an origin field and class.
*/
export class ParsedUnidocEvent extends UnidocEvent {
  /**
  * Begining location of the event into the parsed document.
  */
  public readonly from : UnidocPath

  /**
  * Ending location of the event into the parsed document.
  */
  public readonly to : UnidocPath

  /**
  * Instantiate a new parsed unidoc event.
  */
  public constructor () {
    super()
    this.from = new UnidocPath()
    this.to = new UnidocPath()
  }

  /**
  * Deep copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy (toCopy : UnidocEvent) : void {
    super.copy(toCopy)

    if (toCopy instanceof ParsedUnidocEvent) {
      this.from.copy(toCopy.from)
      this.to.copy(toCopy.to)
    }
  }

  /**
  * @return A deep copy of this event.
  */
  public clone () : ParsedUnidocEvent {
    const result : ParsedUnidocEvent = new ParsedUnidocEvent()
    result.copy(this)
    return result
  }

  /**
  * Reset this event instance in order to reuse it.
  */
  public clear () : void {
    super.clear()
    this.from.clear()
    this.to.clear()
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    let result : string = ''

    result += 'from '
    result += this.from
    result += ' to '
    result += this.to
    result += ' : '
    result += super.toString()

    return result
  }

  /**
  * @see Object.equals
  */
  public equals (other : any) : boolean {
    if (!super.equals(other)) return false

    if (other instanceof ParsedUnidocEvent) {
      return other.from.equals(this.from) &&
             other.to.equals(this.to)
    }

    return false
  }
}

export namespace ParsedUnidocEvent {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : UnidocEvent) : UnidocEvent
  export function copy (toCopy : ParsedUnidocEvent) : ParsedUnidocEvent
  export function copy (toCopy : null) : null
  export function copy (toCopy : undefined) : undefined
  export function copy (toCopy : ParsedUnidocEvent | UnidocEvent | null | undefined) : ParsedUnidocEvent | UnidocEvent | null | undefined {
    return toCopy == null ? toCopy : toCopy.clone()
  }

  export const ALLOCATOR : Allocator<ParsedUnidocEvent> = {
    /**
    * @see Allocator.copy
    */
    allocate () : ParsedUnidocEvent {
      return new ParsedUnidocEvent()
    },

    /**
    * @see Allocator.copy
    */
    copy (source : ParsedUnidocEvent, destination : ParsedUnidocEvent) : void {
      destination.copy(source)
    },

    /**
    * @see Allocator.clear
    */
    clear (instance : ParsedUnidocEvent) : void {
      instance.clear()
    }
  }

  export function equals (left? : UnidocEvent, right? : UnidocEvent) : boolean {
    return left == null ? left == right : left.equals(right)
  }
}
