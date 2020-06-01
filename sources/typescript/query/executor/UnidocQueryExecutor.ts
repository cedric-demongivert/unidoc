import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { CircularBuffer } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocQueryExecution } from './UnidocQueryExecution'

import { UnidocQuery } from '../UnidocQuery'
import { UnidocQueryCommand } from '../UnidocQueryCommand'
import { UnidocQueryState } from '../UnidocQueryState'
import { UnidocQueryRelationship } from '../UnidocQueryRelationship'
import { UnidocQueryExecutionResolver } from './UnidocQueryExecutionResolver'

export class UnidocQueryExecutor {
  public readonly query : UnidocQuery

  private _current : Pack<UnidocQueryExecution>
  private _next : Pack<UnidocQueryExecution>

  private _buffer : CircularBuffer<UnidocEvent>
  private _bufferOffset : number
  private _nextBufferOffset : number

  private _executionResolver : UnidocQueryExecutionResolver

  public constructor (query : UnidocQuery) {
    this.query = query
    this._buffer = CircularBuffer.fromPack(Pack.instance(UnidocEvent.ALLOCATOR, 32))
    this._bufferOffset = 0
    this._current = Pack.any(32)
    this._next = Pack.any(32)
    this._executionResolver = new UnidocQueryExecutionResolver(query)
  }

  /**
  * Start an execution.
  */
  public start () : void {
    this._current.clear()
    this._next.clear()
    this._buffer.clear()
    this._bufferOffset = 0
    this._nextBufferOffset = 0

    this._executionResolver.start()
    this._executionResolver.resolveForgetAsContinue = true

    for (const execution of this._executionResolver.resolve(this.query.input)) {
      this.emit(execution)
    }

    this.swap()
  }

  public next (event : UnidocEvent) : void {
    if (this._buffer.size === this._buffer.capacity) {
      this._buffer.reallocate(this._buffer.size * 2)
    }

    this._buffer.push(event)

    this._executionResolver.start()
    this._executionResolver.resolveForgetAsContinue = false

    this._nextBufferOffset = this._buffer.size + this._bufferOffset

    for (const execution of this._current) {
      this.resolve(execution, event)
    }

    this._executionResolver.resolveForgetAsContinue = true

    const offset : number = this._bufferOffset + this._buffer.size

    for (const execution of this._executionResolver.resolve(...this._executionResolver.forgot())) {
      execution.from = offset
      execution.to = offset
      this.emit(execution)
    }

    this.swap()
  }

  private resolve (execution : UnidocQueryExecution, event : UnidocEvent) : void {
    const command : UnidocQueryCommand = execution.rule.next()

    switch (command) {
      case UnidocQueryCommand.AWAIT:
        execution.to += 1
        this.emit(execution)
        break
      case UnidocQueryCommand.FORGET:
        this._executionResolver.markAsForget(execution.relationship.to)
        break
      case UnidocQueryCommand.CONTINUE:
        for (const next of this._executionResolver.resolve(execution.relationship.to)) {
          next.from = execution.from
          next.to = execution.to + 1

          this.emit(next)
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

  private emit (execution : UnidocQueryExecution) {
    this._next.push(execution)
    this._nextBufferOffset = Math.min(execution.from, this._bufferOffset)
  }

  private swap () : void {
    const tmp : Pack<UnidocQueryExecution> = this._current
    this._current = this._next
    this._next = tmp
    this._next.clear()

    while (this._bufferOffset != this._nextBufferOffset) {
      this._buffer.shift()
      this._bufferOffset += 1
    }
  }
}
