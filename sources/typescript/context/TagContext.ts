import { Context } from './Context'

export class TagContext extends Context {
  public name : string
  private _classes : Set<string>
  public identifier : string

  /**
  * Instanciate a new unknown tag context.
  */
  public constructor () {
    super()
    this.name = undefined
    this.identifier = undefined
    this._classes = new Set<string>()
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
  * @param classes - An iterable over the classes of this tag.
  */
  public set classes (classes : Set<string>) {
    this._classes.clear()

    for (const clazz of classes) {
      this._classes.add(clazz)
    }
  }

  public clear () : void {
    super.clear()

    this.name = undefined
    this.identifier = undefined
    this._classes.clear()
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    let result : string = ''

    result += (this.exiting ? 'exiting' : 'entering')
    result += ' unidoc:tag '
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
    if (!super.equals(other)) return false

    if (other instanceof TagContext) {
      if (other.classes.size != this._classes.size) return false

      for (const clazz of other.classes) {
        if (!this._classes.has(clazz)) {
          return false
        }
      }

      return other.identifier === this.identifier &&
             other.name === this.name
    }

    return false
  }
}

export namespace TagContext {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : TagContext) : TagContext {
    return Object.getPrototypeOf(toCopy).constructor.copy(toCopy)
  }
}
