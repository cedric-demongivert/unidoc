import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { CircularBuffer } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocQueryExecution } from './UnidocQueryExecution'

import { UnidocQuery } from '../UnidocQuery'
import { UnidocQueryFreeRelationship } from '../UnidocQueryFreeRelationship'

import { UnidocQueryFreeRelationshipVisitor } from './UnidocQueryFreeRelationshipVisitor'
import { UnidocQueryExecutionResult } from './UnidocQueryExecutionResult'

export class UnidocQueryExecutor {
  public readonly query : UnidocQuery

  private _current : Pack<UnidocQueryExecution>
  private _next : Pack<UnidocQueryExecution>

  private _buffer : CircularBuffer<UnidocEvent>
  private _bufferOffset : number
  private _nextBufferOffset : number

  private _freeRelationshipVisitor : UnidocQueryFreeRelationshipVisitor

  public constructor (query : UnidocQuery) {
    this.query = query
    this._buffer = CircularBuffer.fromPack(Pack.instance(UnidocEvent.ALLOCATOR, 32))
    this._bufferOffset = 0
    this._current = Pack.any(32)
    this._next = Pack.any(32)
    this._freeRelationshipVisitor = new UnidocQueryFreeRelationshipVisitor()
  }

  public initialize () : void {
    this._current.clear()
    this._next.clear()

    for (const state of this._freeRelationshipVisitor.visitWith(this.query.initial)) {
      for (const relationship of state.outputs) {
        if (!(relationship instanceof UnidocQueryFreeRelationship)) {
          const execution : UnidocQueryExecution = UnidocQueryExecution.create(relationship)
          execution.from = 0
          execution.to = 0

          this._current.push(execution)
        }
      }
    }
  }

  public start () : void {
    this._nextBufferOffset = this._buffer.size + this._bufferOffset

    for (const execution of this._current) {
      this.resolve(execution, execution.start())
    }

    this.swap()
  }

  public next (event : UnidocEvent) : void {
    if (this._buffer.size === this._buffer.capacity) {
      this._buffer.reallocate(this._buffer.size * 2)
    }

    this._buffer.push(event)

    this._nextBufferOffset = this._buffer.size + this._bufferOffset

    for (const execution of this._current) {
      this.resolve(execution, execution.next(event))
    }

    this.swap()
  }

  public end () : void {
    this._nextBufferOffset = this._buffer.size + this._bufferOffset

    for (const execution of this._current) {
      this.resolve(execution, execution.start())
    }

    this.swap()
  }

  private resolve (execution : UnidocQueryExecution, result : UnidocQueryExecutionResult) : void {
    switch (result) {
      case UnidocQueryExecutionResult.DROP:
        break
      case UnidocQueryExecutionResult.NEXT:
        this.handleNext(execution)
        break
      case UnidocQueryExecutionResult.KEEP:
        execution.to = this._buffer.size + this._bufferOffset
        this.emit(execution)
        break
      default:
        throw new Error(
          'Unhandled query execution result code : ' + result + '.'
        )
    }
  }

  private handleNext (execution : UnidocQueryExecution) {
    for (const state of this._freeRelationshipVisitor.visitWith(execution.relationship.to)) {
      for (const relationship of state.outputs) {
        if (!(relationship instanceof UnidocQueryFreeRelationship)) {
          const execution : UnidocQueryExecution = UnidocQueryExecution.create(relationship)
          execution.from = execution.from
          execution.to = this._buffer.size + this._bufferOffset

          this.emit(execution)
        }
      }
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
