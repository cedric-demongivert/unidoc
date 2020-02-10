import { Context } from './Context'

export class WordContext extends Context {
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
  public copy (toCopy : WordContext) : void {
    this.value = toCopy.value
    this.location = toCopy.location
    this.exiting = toCopy.exiting
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    return (this.exiting ? 'exiting' : 'entering') +
    ` unidoc:word "${this.value}" ${this.location.toString()}`
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) {
    return super.equals(other) &&
           other instanceof WordContext &&
           other.value === this.value
  }
}

export namespace WordContext {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : WordContext) : WordContext {
    const copy : WordContext = new WordContext()

    copy.copy(toCopy)

    return copy
  }
}
