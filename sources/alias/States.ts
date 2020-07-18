import { View } from '@cedric-demongivert/gl-tool-collection'
import { IdentifierSet } from '@cedric-demongivert/gl-tool-collection'

/**
* A collection of states.
*/
export class States {
  /**
  * Collection of states.
  */
  private _states : IdentifierSet

  /**
  * A readonly view over the existing states.
  */
  private _view : View<number>

  /**
  * Instantiate a new collection of states.
  *
  * @param capacity - Number of states to allocate.
  */
  public constructor (capacity : number) {
    this._states = IdentifierSet.allocate(capacity)
    this._view = View.wrap(this._states)
  }

  /**
  * @return A readonly view over each existing states.
  */
  public get states () : View<number> {
    return this._view
  }

  /**
  * @return The current maximum number of states that can be stored.
  */
  public get capacity () : number {
    return this._states.capacity
  }

  /**
  * Update the capacity of this collection.
  *
  * @param capacity - The new maximum number of states to be able to store.
  */
  public reallocate (capacity : number) : void {
    this._states.reallocate(capacity)
  }

  public fit () : void {
    this._states.fit()
  }

  /**
  * Allocate a new state.
  *
  * @return The new state that was allocated.
  */
  public create () : number {
    if (this._states.capacity === this._states.size) {
      this._states.reallocate(this._states.capacity * 2)
    }

    return this._states.next()
  }

  /**
  * Allocate a specific state.
  *
  * @param state - The state to allocate.
  */
  public declare (state : number) : void {
    this._states.add(state)
  }

  /**
  * Destroy an existing state.
  *
  * @param state - A state to destroy.
  */
  public delete (state : number) : void {
    this._states.delete(state)
  }

  public clear () : void {
    this._states.clear()
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof States) {
      return other._states.equals(this._states)
    }

    return false
  }
}
