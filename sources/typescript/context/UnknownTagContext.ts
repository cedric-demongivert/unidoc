import { TagContext } from './TagContext'

export class UnknownTagContext extends TagContext {
  /**
  * Deep copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy (toCopy : UnknownTagContext) : void {
    this.location = toCopy.location
    this.exiting = toCopy.exiting
    this.classes = toCopy.classes
    this.name = toCopy.name
    this.identifier = toCopy.identifier
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    let result : string = ''

    result += (this.exiting ? 'exiting' : 'entering')
    result += ' unidoc:tag:unknown '
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
    return super.equals(other) && other instanceof UnknownTagContext
  }
}

export namespace UnknownTagContext {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : UnknownTagContext) : UnknownTagContext {
    const copy : UnknownTagContext = new UnknownTagContext()

    copy.copy(toCopy)

    return copy
  }
}
