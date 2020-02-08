import { Tag } from '@library/tag/Tag'

import { Alias } from '@library/alias/Alias'
import { Location } from '@library/Location'

import { Context } from './Context'

export class BlockContext extends  Context {
  private _classes : Set<string>
  public identifier : string

  /**
  * Instanciate a new block context.
  */
  public constructor () {
    super()
    this.identifier = undefined
    this._classes = new Set<string>()
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
  * @param classes - An iterable over the classes of this block.
  */
  public set classes (classes : Set<string>) {
    this._classes.clear()

    for (const clazz of classes) {
      this._classes.add(clazz)
    }
  }

  /**
  * Deep copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy (toCopy : BlockContext) : void {
    this.location = toCopy.location
    this.exiting = toCopy.exiting
    this.classes = toCopy.classes
    this.identifier = toCopy.identifier
  }

  /**
  * @see Context#clear
  */
  public clear () : void {
    super.clear()

    this.identifier = undefined
    this._classes.clear()
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    let result : string = ''

    result += (this.exiting ? 'exiting' : 'entering')
    result += ' unidoc:block '

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

    if (other instanceof BlockContext) {
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

export namespace BlockContext {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : BlockContext) : BlockContext {
    const copy : BlockContext = new BlockContext()

    copy.copy(toCopy)

    return copy
  }
}
