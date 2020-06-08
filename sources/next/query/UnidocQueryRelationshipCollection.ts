import { IdentifierSet } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { Sequence } from '@cedric-demongivert/gl-tool-collection'
import { SequenceView } from '@cedric-demongivert/gl-tool-collection'
import { ReallocableCollection } from '@cedric-demongivert/gl-tool-collection'

import { UnidocQuery } from './UnidocQuery'
import { UnidocQueryRelationship } from './UnidocQueryRelationship'
import { UnidocQueryRelationshipCollectionIterator } from './UnidocQueryRelationshipCollectionIterator'

export class UnidocQueryRelationshipCollection
  implements Sequence<UnidocQueryRelationship>,
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
  * A pack with all existing relationships.
  */
  private readonly relationships : Pack<UnidocQueryRelationship>

  /**
  * Instantiate a relationship collection for a given query.
  */
  public constructor (query : UnidocQuery, capacity : number = 8) {
    this.query = query
    this.identifiers = IdentifierSet.allocate(capacity)
    this.relationships = Pack.any(capacity)
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
  public get last () : UnidocQueryRelationship {
    return this.relationships.get(this.identifiers.last)
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
  public get first () : UnidocQueryRelationship {
    return this.relationships.get(this.identifiers.first)
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
    this.relationships.reallocate(capacity)
  }

  /**
  * @see ReallocableCollection.fit
  */
  public fit () : void {
    this.identifiers.fit()
    this.relationships.reallocate(this.identifiers.capacity)
  }

  /**
  * @see Sequence.get
  */
  public get (index : number) : UnidocQueryRelationship {
    return this.relationships.get(this.identifiers.get(index))
  }

  /**
  * Add a relationship to this collection.
  *
  * @param relationship - The relationship to register into this collection.
  *
  * @return The identifier associated to the given relationship.
  */
  public add (relationship : UnidocQueryRelationship) : number {
    if (relationship.query !== this.query) {
      throw new Error(
        'Unable to add the relationship ' + relationship + ' to this ' +
        'collection of relationships because the given relationship was ' +
        'instantiated for another unidoc query.'
      )
    }

    if (relationship.identifier == null) {
      const identifier : number = this.identifiers.next()
      this.relationships.set(identifier, relationship)
      return identifier
    } else {
      if (!this.identifiers.has(relationship.identifier)) {
        this.identifiers.add(relationship.identifier)
        this.relationships.set(relationship.identifier, relationship)
      } else if (this.relationships.get(relationship.identifier) !== relationship) {
        throw new Error(
          'Unable to add the relationship ' + relationship + ' to this ' +
          'collection of relationships because the given relationship ' +
          'identifier was already allocated for another relationship of this ' +
          'unidoc query.'
        )
      }

      return relationship.identifier
    }
  }

  /**
  * Declare or return a new state.
  *
  * @param [identifier] - Identifier of the state to get or create.
  *
  * @return The requested state.
  */
  public relationship (identifier? : number) : UnidocQueryRelationship {
    if (identifier == null) {
      return new UnidocQueryRelationship(this.query)
    } else if (this.identifiers.has(identifier)) {
      return this.relationships.get(identifier)
    } else {
      return new UnidocQueryRelationship(this.query, identifier)
    }
  }

  /**
  * @see Sequence.indexOf
  */
  public indexOf (element : number) : number
  public indexOf (element : UnidocQueryRelationship) : number
  public indexOf (element : UnidocQueryRelationship | number) : number {
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
  public has (element : UnidocQueryRelationship) : boolean
  public has (element : UnidocQueryRelationship | number) : boolean {
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
  public clone () : Sequence<UnidocQueryRelationship> {
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
  public iterator () : UnidocQueryRelationshipCollectionIterator {
    const iterator : UnidocQueryRelationshipCollectionIterator = new UnidocQueryRelationshipCollectionIterator()
    iterator.parent = this
    return iterator
  }

  /**
  * @see Sequence.view
  */
  public view () : Sequence<UnidocQueryRelationship> {
    return SequenceView.wrap(this)
  }

  /**
  * @see Sequence[Symbol.iterator]
  */
  public * [Symbol.iterator](): Iterator<UnidocQueryRelationship> {
    yield * this.relationships
  }
}
