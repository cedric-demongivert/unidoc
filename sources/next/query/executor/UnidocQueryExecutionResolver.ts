import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { IdentifierSet } from '@cedric-demongivert/gl-tool-collection'

import { UnidocQuery } from '../UnidocQuery'
import { UnidocQueryState } from '../UnidocQueryState'
import { UnidocQueryRelationship } from '../UnidocQueryRelationship'
import { UnidocQueryCommand } from '../UnidocQueryCommand'

import { UnidocQueryExecution } from './UnidocQueryExecution'

export class UnidocQueryExecutionResolver {
  public readonly query : UnidocQuery

  private _status  : Pack<boolean>
  private _states  : Pack<UnidocQueryState>
  private _cursors : Pack<number>
  private _forgot  : IdentifierSet

  public resolveForgetAsContinue : boolean

  public constructor (query : UnidocQuery) {
    this.query    = query
    this._status  = Pack.any(query.states.capacity)
    this._states  = Pack.any(query.states.capacity)
    this._cursors = Pack.any(query.states.capacity)
    this._forgot  = IdentifierSet.allocate(query.states.capacity)
    this.resolveForgetAsContinue = false
  }

  /**
  * Start a new set of resolution.
  */
  public start () {
    const capacity : number = this.query.states.capacity

    if (this._status.capacity < capacity) {
      this._status.reallocate(capacity)
    }

    if (this._states.capacity < capacity) {
      this._states.reallocate(capacity)
    }

    if (this._cursors.capacity < capacity) {
      this._cursors.reallocate(capacity)
    }

    if (this._forgot.capacity < capacity) {
      this._forgot.reallocate(capacity)
    }

    this._status.size = this._status.capacity
    this._status.fill(false)

    this._status.clear()
    this._states.clear()
    this._cursors.clear()
    this._forgot.clear()
  }

  public markAsForget (state : UnidocQueryState) : void {
    this._forgot.add(state.identifier)
  }

  private prepareResolution (states : Iterable<UnidocQueryState>) : void {
    this._status.clear()
    this._states.clear()
    this._cursors.clear()

    for (const state of states) {
      this._status.set(state.identifier, true)
      this._states.push(state)
      this._cursors.push(0)
    }
  }

  public * forgot () : Iterable<UnidocQueryState> {
    for (const forget of this._forgot) {
      yield this.query.states.get(this.query.states.indexOf(forget))
    }
  }

  /**
  * Resolve the executions to add after an entering into the given states.
  */
  public * resolve (...states : UnidocQueryState[]) : Iterable<UnidocQueryExecution> {
    this.prepareResolution(states)

    for (const relationship of this.relationships()) {
      const execution : UnidocQueryExecution = new UnidocQueryExecution(relationship)
      const command : UnidocQueryCommand = execution.rule.next()

      switch (command) {
        case UnidocQueryCommand.AWAIT:
          yield execution
          break
        case UnidocQueryCommand.FORGET:
          if (!this.resolveForgetAsContinue) {
            this._forgot.add(execution.relationship.to.identifier)
            break
          }
        case UnidocQueryCommand.CONTINUE:
          if (relationship.from == relationship.to) {
            yield execution
          } else if (!this._status.get(relationship.to.identifier)) {
            this._states.push(relationship.to)
            this._cursors.push(0)
            this._status.set(relationship.to.identifier, true)
          }
          break
        case UnidocQueryCommand.DROP:
          break
        default:
          throw new Error(
            'Unhandled unidoc query command : ' +
            UnidocQueryCommand.toString(command) + '.'
          )
      }
    }
  }

  private * relationships () : Iterable<UnidocQueryRelationship> {
    while (this._states.size > 0) {
      const state : UnidocQueryState = this._states.last
      const cursor : number = this._cursors.last

      if (cursor >= state.outputs.size) {
        this._states.pop()
        this._cursors.pop()
      } else {
        this._cursors.set(this._cursors.size - 1, cursor + 1)
        yield state.outputs.get(cursor)
      }
    }
  }
}
