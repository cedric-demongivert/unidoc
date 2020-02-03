import { UnidocLocation } from '@library/UnidocLocation'

import { Step as TypescriptMongolienStep } from './Step'
import { Text as TypescriptMongolienText } from './Text'
import { Block as TypescriptMongolienBlock } from './Block'
import { Element as TypescriptMongolienElement } from './Element'

export namespace UnidocPath {
  export import Step = TypescriptMongolienStep
  export import Text = TypescriptMongolienText
  export import Block = TypescriptMongolienBlock
  export import Element = TypescriptMongolienElement
}

/**
* A path in a unidoc document.
*/
export class UnidocPath {
  /**
  * Instantiate a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  public static copy (toCopy : UnidocPath) : UnidocPath {
    const result : UnidocPath = new UnidocPath()

    result.copy(toCopy)

    return result
  }

  /**
  * Step in the path.
  */
  private _steps : UnidocPath.Step[]

  /**
  * Instantiate a new empty path.
  */
  public constructor () {
    this._steps = []
  }

  /**
  * @return The number of element in this path.
  */
  public get size () : number {
    return this._steps.length
  }

  /**
  * Return the nth element of this path.
  *
  * @param index - Index of the element to get.
  *
  * @return The element at the requested index.
  */
  public get (index : number) : UnidocPath.Step {
    return this._steps[index]
  }

  /**
  * Replace an element of this path.
  *
  * @param index - Index of the element to replace.
  * @param step - New element to set at the given location.
  */
  public set (index : number, step : UnidocPath.Step) : void {
    this._steps[index] = step
  }

  /**
  * Append the given element at the end of the path.
  *
  * @param step - New element to append at the end of the path.
  */
  public push (step : UnidocPath.Step) : void {
    this._steps.push(step)
  }

  /**
  * Concat the given path at the end of this path.
  *
  * All concatenated elements will be deep-copied.
  *
  * @param toConcat - A path to append at the end of this path.
  */
  public concat (toConcat : UnidocPath) : void {
    for (const element of toConcat._steps) {
      this._steps.push(Step.copy(element))
    }
  }

  /**
  * Delete the elements in the given range.
  *
  * @param from - Index of the first element to delete.
  * @param [length = 1] - Number of elements to delete.
  */
  public delete (from : number, length : number = 1) : void {
    this._steps.splice(from, from + length)
  }

  /**
  * Update this path to keep only the given subpath.
  *
  * @param from - Index of the first element to keep.
  * @param length - Number of elements to keep.
  */
  public subpath (from : number, length : number) : void {
    for (let index = from, end = from + length; index < end; ++index) {
      this._steps[index - from] = this._steps[index]
    }

    this._steps.length = length
  }

  /**
  * Copy the given path.
  *
  * @param toCopy - A path instance to copy.
  */
  public copy (toCopy : UnidocPath) : void {
    this._steps.length = 0
    this.concat(toCopy)
  }

  /**
  * Empty this path.
  */
  public clear () : void {
    this._steps.length = 0
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    const result : string[] = []

    for (const step of this._steps) {
      result.push(step.toString())
    }

    return result.join(' > ')
  }

  /**
  * Append a text element to this path.
  *
  * @param location - Location of the text element to append.
  */
  public text (location : UnidocLocation) : void {
    this._steps.push(new Text(location))
  }

  /**
  * Append a block element to this path.
  *
  * @param options - Options of the block element to append.
  */
  public block (builder : UnidocPath.Block.Builder) : void {
    this._steps.push(new Block(builder))
  }

  /**
  * Append an element to this path.
  *
  * @param options - Options of the element to append.
  */
  public element (builder : UnidocPath.Element.Builder) : void {
    this._steps.push(new Element(builder))
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocPath) {
      if (other.size !== this._steps.length) {
        return false
      }

      for (let index = 0, length = other.size; index < length; ++index) {
        if (!this._steps[index].equals(other.get(index))) {
          return false
        }
      }

      return true
    }
  }

  /**
  * @see Symbol.iterator
  */
  public * [Symbol.iterator] () : Iterator<UnidocPath.Step> {
    yield * this._steps
  }
}
