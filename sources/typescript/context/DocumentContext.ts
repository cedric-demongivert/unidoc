import { Context } from './Context'

export class DocumentContext extends Context {
  /**
  * Deep copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy (toCopy : DocumentContext) : void {
    this.location = toCopy.location
    this.exiting = toCopy.exiting
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    return (this.exiting ? 'exiting' : 'entering') +
    ` unidoc:document ${this.location.toString()}`
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) {
    return super.equals(other) && other instanceof Document
  }
}

export namespace DocumentContext {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : DocumentContext) : DocumentContext {
    const copy : DocumentContext = new DocumentContext()

    copy.copy(toCopy)

    return copy
  }
}
