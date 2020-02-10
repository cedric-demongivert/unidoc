import { Context } from './Context'

export class WhitespaceContext extends Context {
  public value : string

  /**
  * Instantiate a new content context.
  */
  public constructor () {
    super()
    this.value = undefined
  }

  /**
  * Deep copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy (toCopy : WhitespaceContext) : void {
    this.value = toCopy.value
    this.location = toCopy.location
    this.exiting = toCopy.exiting
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    return (this.exiting ? 'exiting' : 'entering') +
    ` unidoc:whitespace ${this.location.toString()}`
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) {
    return super.equals(other) &&
           other instanceof WhitespaceContext &&
           other.value === this.value
  }
}

export namespace WhitespaceContext {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : WhitespaceContext) : WhitespaceContext {
    const copy : WhitespaceContext = new WhitespaceContext()

    copy.copy(toCopy)

    return copy
  }
}
