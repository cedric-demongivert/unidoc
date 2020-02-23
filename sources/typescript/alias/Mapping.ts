import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { States } from './States'

const SYMBOLS : number = 27 // 26 english letters + minus symbol
const A : number = 'a'.codePointAt(0)
const Z : number = 'z'.codePointAt(0)
const MINUS : number = '-'.codePointAt(0)

// Symbols + parent
const RELATIONSHIPS : number = SYMBOLS + 1

/**
* Convert a unicode code point into an identifier symbol identifier.
*
* @param code - A unicode code point to convert.
*
* @return An identifier symbol related to the given code point if any, -1 if
*         the given code point is not a valid identifier symbol.
*/
function codePointToSymbol (code : number) : number {
  if (code >= A && code <= Z) {
    return code - A
  } else if (code === MINUS) {
    return 27
  } else {
    return -1
  }
}

/**
* A mapping of alias to a given type of values.
*/
export class Mapping<T> {
  /**
  * All existing states.
  */
  private _states : States

  /**
  * Number of Mapping into this dictionary.
  */
  private _size : number

  /**
  * Starting state.
  */
  private _start : number

  /**
  * Error state.
  */
  private _error : number

  /**
  * Relationships between each states.
  */
  private _relationships : Pack<number>

  /**
  * A list of termination of each existing states if any.
  */
  private _terminations : Pack<T>

  /**
  * Instantiate an empty alias dictionary.
  *
  * @param capacity - Number of states to pre-allocate in memory.
  */
  public constructor (capacity : number = 512) {
    this._states = new States(capacity)
    this._relationships = Pack.unsignedUpTo(capacity, capacity * RELATIONSHIPS)
    this._terminations = Pack.any(capacity)

    this._start = this._states.create()
    this._error = this._states.create()

    this._size = 0

    this._initialize(this._start)
    this._initialize(this._error)
  }

  /**
  * @return The capacity, in states, of this alias dictionary.
  */
  public get capacity () : number {
    return this._states.capacity
  }

  /**
  * @return The number of existing Mapping that currently exists into this
  *         dictionary.
  */
  public get size () : number {
    return this._size
  }

  /**
  * Initialize the given state.
  *
  * @param state - The state to initialize.
  */
  private _initialize (state : number) : void {
    const relationships : Pack<number> = this._relationships
    const error : number = this._error
    const start : number = state * RELATIONSHIPS
    const end : number = start + RELATIONSHIPS

    for (let index = start; index < end; ++index) {
      relationships.set(index, error)
    }

    this._terminations.set(state, undefined)
  }

  /**
  * Create and initialize a state.
  *
  * @param [parent = this._error] - Parent of the state to create.
  *
  * @return The new state.
  */
  private _create (parent : number = this._error) : number {
    const result : number = this._states.create()

    this._initialize(result)
    this._relationships.set(result * RELATIONSHIPS + SYMBOLS, parent)

    return result
  }

  /**
  * Return the parent of the given state.
  *
  * @param state - State from wich getting the parent.
  *
  * @return The parent state of the given state.
  */
  private _parent (state : number) : number {
    return this._relationships.get(state * RELATIONSHIPS + SYMBOLS)
  }

  /**
  * Return the value associated with the given alias.
  *
  * @param alias - An alias.
  *
  * @return The value associated with the given alias if exists,
  *         return undefined otherwise.
  */
  public get (alias : string) : T {
    const relationships : Pack<number> = this._relationships
    const error : number = this._error

    let state : number = this._start
    let size : number = alias.length

    for (let index = 0; index < size && state !== error; ++index) {
      state = relationships.get(
        state * RELATIONSHIPS + codePointToSymbol(alias.codePointAt(index))
      )
    }

    return this._terminations.get(state)
  }

  /**
  * Declare the given alias into this dictionary.
  *
  * @param alias - The alias to declare in this dictionary.
  * @param value - The value to attach to the given alias.
  */
  public declare (alias : string, value : T) : void {
    const relationships : Pack<number> = this._relationships
    const error : number = this._error

    let state : number = this._start
    let size : number = alias.length

    for (let index = 0; index < size; ++index) {
      const symbol : number = codePointToSymbol(alias.codePointAt(index))
      let next : number = relationships.get(state * RELATIONSHIPS + symbol)

      if (next === error) {
        next = this._create(state)
        relationships.set(state * RELATIONSHIPS + symbol, next)
      }

      state = next
    }

    if (this._terminations.get(state) === undefined) {
      this._size += 1
    }

    this._terminations.set(state, value)
  }

  /**
  * Return true if the given alias is into this dictionary.
  *
  * @param alias - An alias to search.
  *
  * @return True if the given alias exists into this dictionary.
  */
  public has (alias : string) : boolean {
    return this.get(alias) !== undefined
  }

  /**
  * Remove an alias from this dictionary.
  *
  * @param alias - An alias to delete.
  */
  public delete (alias : string) : void {
    const relationships : Pack<number> = this._relationships
    const terminations : Pack<T> = this._terminations
    const error : number = this._error
    const start : number = this._start

    let state : number = start
    let size : number = alias.length

    for (let index = 0; index < size && state !== error; ++index) {
      state = relationships.get(
        state * RELATIONSHIPS + codePointToSymbol(alias.codePointAt(index))
      )
    }

    if (terminations.get(state) === undefined) return

    this._size -= 1
    terminations.set(state, undefined)

    let index : number = alias.length - 1

    while (index >= 0 && this._isDeadState(state)) {
      let parent : number = this._parent(state)
      this._states.delete(state)
      relationships.set(
        state * RELATIONSHIPS + codePointToSymbol(alias.codePointAt(index)),
        error
      )

      state = parent
      index -= 1
    }
  }

  /**
  * Return true if the given state is dead (and must be removed).
  *
  * @param state - A state to assert.
  *
  * @return True if the given state is dead.
  */
  private _isDeadState (state : number) : boolean {
    return this._terminations.get(state) === undefined &&
           this._isTerminalState(state)
  }

  /**
  * Return true if the given state has no outgoing relationship.
  *
  * @param state - A state to assert.
  *
  * @return True if the given state has no outgoing relationship.
  */
  private _isTerminalState (state : number) : boolean {
    const relationships : Pack<number> = this._relationships
    const error : number = this._error

    const start : number = state * RELATIONSHIPS
    const end : number = start + SYMBOLS

    for (let index = start; index < end; ++index) {
      if (relationships.get(index) !== error) {
        return false
      }
    }

    return true
  }

  public reallocate (capacity : number) : void {
    this._states.reallocate(capacity)
  }

  public fit () : void {
    this._states.fit()
  }

  /**
  * Empty this dictionary of all its Mapping.
  */
  public clear () : void {
    this._states.clear()
    this._states.declare(this._start)
    this._states.declare(this._error)

    this._initialize(this._start)

    this._size = 0
  }
}

export namespace Mapping {

}
