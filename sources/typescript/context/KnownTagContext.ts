import { Tag } from '@library/tag/Tag'

import { TagContext } from './TagContext'


export class KnownTagContext extends TagContext {
  public type : Tag

  /**
  * Instantiate a new known tag context.
  */
  public constructor () {
    super()
    this.type = 0
  }

  /**
  * Deep copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy (toCopy : KnownTagContext) : void {
    this.location = toCopy.location
    this.exiting = toCopy.exiting
    this.classes = toCopy.classes
    this.name = toCopy.name
    this.identifier = toCopy.identifier
    this.type = toCopy.type
  }

  /**
  * @see Context#clear
  */
  public clear () : void {
    super.clear()

    this.type = 0
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    let result : string = ''

    result += this.exiting ? 'exiting' : 'entering'
    result += ' unidoc:tag:'
    result += this.type
    result += ' '
    result += this.name

    if (this.identifier != null) {
      result += '#'
      result += this.identifier
    }

    if (this.classes.size > 0) {
      for (const clazz of this.classes) {
        result += '.'
        result += clazz
      }
    }

    result += ' '
    result += this.location.toString()

    return result
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) {
    return super.equals(other) && other instanceof KnownTagContext
  }
}

export namespace KnownTagContext {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : KnownTagContext) : KnownTagContext {
    const copy : KnownTagContext = new KnownTagContext()

    copy.copy(toCopy)

    return copy
  }
}
