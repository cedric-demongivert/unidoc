import { IdentifierSet } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { Sequence } from '@cedric-demongivert/gl-tool-collection'
import { SequenceView } from '@cedric-demongivert/gl-tool-collection'
import { ReallocableCollection } from '@cedric-demongivert/gl-tool-collection'

import { UnidocQuery } from './UnidocQuery'
import { UnidocQueryState } from './UnidocQueryState'
import { UnidocQueryStateCollectionIterator } from './UnidocQueryStateCollectionIterator'

export class UnidocQueryStateCollection
  implements Sequence<UnidocQueryState>,
             ReallocableCollection
{
  /**
  * This collection parent query.
  */
  public readonly query : UnidocQuery

  /**
  * A set of all allocated identifiers.
  */
  private readonly identifiers : IdentifierSet

  /**
  * A pack with all existing states.
  */
  private readonly states : Pack<UnidocQueryState>

  /**
  * Instantiate a state collection for a given query.
  */
  public constructor (query : UnidocQuery, capacity : number = 8) {
    this.query = query
    this.identifiers = IdentifierSet.allocate(capacity)
    this.states = Pack.any(capacity)
  }

  /**
  * @see ReallocableCollection.capacity
  */
  public get capacity () : number {
    return this.identifiers.capacity
  }

  /**
  * @see Sequence.size
  */
  public get size () : number {
    return this.identifiers.size
  }

  /**
  * @see Sequence.last
  */
  public get last () : UnidocQueryState {
    return this.states.get(this.identifiers.last)
  }

  /**
  * @see Sequence.lastIndex
  */
  public get lastIndex () : number {
    return this.identifiers.lastIndex
  }

  /**
  * @see Sequence.first
  */
  public get first () : UnidocQueryState {
    return this.states.get(this.identifiers.first)
  }

  /**
  * @see Sequence.firstIndex
  */
  public get firstIndex () : number {
    return this.identifiers.firstIndex
  }

  /**
  * @see ReallocableCollection.reallocate
  */
  public reallocate (capacity : number) : void {
    this.identifiers.reallocate(capacity)
    this.states.reallocate(capacity)
  }

  /**
  * @see ReallocableCollection.fit
  */
  public fit () : void {
    this.identifiers.fit()
    this.states.reallocate(this.identifiers.capacity)
  }

  /**
  * @see Sequence.get
  */
  public get (index : number) : UnidocQueryState {
    return this.states.get(this.identifiers.get(index))
  }

  /**
  * Add a state to this collection.
  *
  * @param state - The state to register into this collection.
  *
  * @return The identifier associated to the given state.
  */
  public add (state : UnidocQueryState) : number {
    if (state.query !== this.query) {
      throw new Error(
        'Unable to add the state ' + state + ' to this collection of states ' +
        'because the given state was instantiated for another unidoc query.'
      )
    }

    if (state.identifier == null) {
      const identifier : number = this.identifiers.next()
      this.states.set(identifier, state)
      return identifier
    } else {
      if (!this.identifiers.has(state.identifier)) {
        this.identifiers.add(state.identifier)
        this.states.set(state.identifier, state)
      } else if (this.states.get(state.identifier) !== state) {
        throw new Error(
          'Unable to add the state ' + state + ' to this collection of states ' +
          'because the given state identifier was already allocated for ' +
          'another state of this unidoc query.'
        )
      }

      return state.identifier
    }
  }

  /**
  * Declare or return a new state.
  *
  * @param [identifier] - Identifier of the state to get or create.
  *
  * @return The requested state.
  */
  public state (identifier? : number) : UnidocQueryState {
    if (identifier == null) {
      return new UnidocQueryState(this.query)
    } else if (this.identifiers.has(identifier)) {
      return this.states.get(identifier)
    } else {
      return new UnidocQueryState(this.query, identifier)
    }
  }

  /**
  * @see Sequence.indexOf
  */
  public indexOf (element : number) : number
  public indexOf (element : UnidocQueryState) : number
  public indexOf (element : UnidocQueryState | number) : number {
    if (typeof element === 'number') {
      return this.identifiers.indexOf(element)
    } else if (element.query === this.query) {
      return this.identifiers.indexOf(element.identifier)
    } else {
      return -1
    }
  }

  /**
  * @see Sequence.has
  */
  public has (element : number) : boolean
  public has (element : UnidocQueryState) : boolean
  public has (element : UnidocQueryState | number) : boolean {
    if (typeof element === 'number') {
      return this.identifiers.has(element)
    } else if (element.query === this.query) {
      return this.identifiers.has(element.identifier)
    } else {
      return false
    }
  }

  /**
  * @see Sequence.clone
  */
  public clone () : Sequence<UnidocQueryState> {
    throw new Error('UnidocQuery collection\'s are not clonable.')
  }

  /**
  * @see Sequence.equals
  */
  public equals (other : any) : boolean {
    return other === this
  }

  /**
  * @see Sequence.iterator
  */
  public iterator () : UnidocQueryStateCollectionIterator {
    const iterator : UnidocQueryStateCollectionIterator = new UnidocQueryStateCollectionIterator()
    iterator.parent = this
    return iterator
  }

  /**
  * @see Sequence.view
  */
  public view () : Sequence<UnidocQueryState> {
    return SequenceView.wrap(this)
  }

  /**
  * @see Sequence[Symbol.iterator]
  */
  public * [Symbol.iterator](): Iterator<UnidocQueryState> {
    yield * this.states
  }
}
