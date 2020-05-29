import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocQueryState } from '../UnidocQueryState'
import { UnidocQueryRelationship } from '../UnidocQueryRelationship'
import { UnidocQueryFreeRelationship } from '../UnidocQueryFreeRelationship'

export const UNVISITED : number = 0
export const VISITED : number = 1
export const EMITTED : number = 2

export class UnidocQueryFreeRelationshipVisitor {
  private _status : Pack<number>
  private _states : Pack<UnidocQueryState>
  private _cursors : Pack<number>

  public constructor () {
    this._status = Pack.any(64)
    this._states = Pack.any(64)
    this._cursors = Pack.any(64)
  }

  public * visit (...states : UnidocQueryState[]) : Iterable<UnidocQueryState> {
    this.initialize(states)

    yield * this.iterate()

    this.clear()
  }

  private * iterate () : Iterable<UnidocQueryState> {
    while (this._states.size > 0) {
      const state : UnidocQueryState = this._states.last
      const cursor : number = this._cursors.last

      if (cursor >= state.outputs.size) {
        this._states.pop()
        this._cursors.pop()
      } else {
        this._cursors.set(this._cursors.size - 1, cursor + 1)
        const relationship : UnidocQueryRelationship = state.outputs.get(cursor)

        if (relationship instanceof UnidocQueryFreeRelationship) {
          const next : UnidocQueryState = relationship.to
          const status : number = this._status.get(next.identifier)

          switch (status) {
            case UNVISITED:
              this._states.push(next)
              this._cursors.push(0)
            case VISITED:
              yield next
              this._status.set(next.identifier, EMITTED)
            case EMITTED:
            default:
              break
          }
        }
      }
    }
  }

  public * visitWith (...states : UnidocQueryState[]) : Iterable<UnidocQueryState> {
    this.initialize(states)

    for (const state of states) {
      this._status.set(state.identifier, EMITTED)
      yield state
    }

    yield * this.iterate()

    this.clear()
  }

  public * visitWithout (...states : UnidocQueryState[]) : Iterable<UnidocQueryState> {
    this.initialize(states)

    for (const state of states) {
      this._status.set(state.identifier, EMITTED)
    }

    yield * this.iterate()

    this.clear()
  }

  private clear () : void {
    this._status.clear()
    this._states.clear()
    this._cursors.clear()
  }

  private initialize (states : UnidocQueryState[]) : void {
    const capacity : number = states[0].query.states.capacity

    if (this._status.capacity < capacity) {
      this._status.reallocate(capacity)
    }

    if (this._states.capacity < capacity) {
      this._states.reallocate(capacity)
    }

    if (this._cursors.capacity < capacity) {
      this._cursors.reallocate(capacity)
    }

    this._status.size = this._status.capacity
    this._status.fill(UNVISITED)

    for (const state of states) {
      this._status.set(state.identifier, VISITED)
      this._states.push(state)
      this._cursors.push(0)
    }
  }
}
