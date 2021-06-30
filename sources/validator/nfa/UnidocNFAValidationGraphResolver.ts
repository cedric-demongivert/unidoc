import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocFunction } from '../../stream/UnidocFunction'

import { UnidocValidationMessageType } from '../../validation/UnidocValidationMessageType'

import { UnidocKissValidator } from '../kiss/UnidocKissValidator'
import { UnidocKissValidatorOutputType } from '../kiss/UnidocKissValidatorOutputType'

import { UnidocValidator } from '../UnidocValidator'

import { UnidocNFAValidationTree } from './UnidocNFAValidationTree'

import { UnidocNFAValidationState } from './UnidocNFAValidationState'
import { UnidocNFAValidationGraph } from './UnidocNFAValidationGraph'
import { UnidocNFAValidationRelationship } from './UnidocNFAValidationRelationship'
import { UnidocNFAValidationProcess } from './UnidocNFAValidationProcess'
import { UnidocObject } from 'sources/UnidocObject'
import { UnidocValidationEvent } from 'sources/validation'

// const LOGS: string[] = []

// function log(value: string) {
//   LOGS.push(value)
//
//   if (LOGS.length > 100) {
//     throw new Error(LOGS.join('\r\n'))
//   }
// }

export class UnidocNFAValidationGraphResolver extends UnidocFunction<UnidocEvent, UnidocValidationEvent> implements UnidocValidator {
  /**
  *
  */
  private _graph: UnidocNFAValidationGraph

  /**
  *
  */
  private _pendingStack: Pack<UnidocNFAValidationProcess>

  /**
  *
  */
  private _nextPendingStack: Pack<UnidocNFAValidationProcess>

  /**
  *
  */
  private readonly _matchs: Pack<UnidocNFAValidationProcess>

  /**
  *
  */
  private readonly _failures: Pack<UnidocNFAValidationProcess>

  /**
  *
  */
  private readonly _visited: Map<number, UnidocNFAValidationTree>

  /**
  *
  */
  private readonly _tree: UnidocNFAValidationTree

  /**
  *
  */
  private _current: UnidocEvent | undefined

  /**
   * 
   */
  private _index: number

  /**
   * 
   */
  private _batch: number

  /**
  *
  */
  public constructor() {
    super()
    this._graph = UnidocNFAValidationGraph.MATCH
    this._visited = new Map()
    this._pendingStack = Pack.any(16)
    this._nextPendingStack = Pack.any(16)
    this._matchs = Pack.any(16)
    this._failures = Pack.any(16)
    this._tree = new UnidocNFAValidationTree()
    this._current = undefined
    this._index = 0
    this._batch = 0
  }

  /**
  *
  */
  public validate(graph: UnidocNFAValidationGraph): void {
    this.reset()

    this._graph = graph
    const start: UnidocNFAValidationState = graph.start

    const origin: UnidocNFAValidationTree = this._tree.fork().asState(start)
    this._visited.set(start.identifier, origin)

    for (const relationship of start.outputs) {
      const process: UnidocNFAValidationProcess = UnidocNFAValidationProcess.ALLOCATOR.allocate()

      process.head.parent = origin
      process.process = relationship.validator()

      this._pendingStack.push(process)
    }
  }

  /**
  *
  */
  private isLeftBetterThanRight(left: UnidocNFAValidationTree, right: UnidocNFAValidationTree): boolean {
    let leftMessages: number[] = left.countMessages()
    let leftBatch: number = left.batch()
    let rightMessages: number[] = right.countMessages()
    let rightBatch: number = right.batch()

    if (leftBatch === rightBatch) {
      const size: number = UnidocValidationMessageType.ALL.length

      for (let index = 0; index < size; ++index) {
        const leftScore: number = leftMessages[size - index - 1]
        const rightScore: number = rightMessages[size - index - 1]

        if (leftScore === rightScore) {
          continue
        } else {
          return leftScore < rightScore
        }
      }

      return true
    } else {
      return leftBatch > rightBatch
    }
  }

  /**
  * @see SubscribableUnidocConsumer.start
  */
  public start(): void {
    //log('handle initialization')

    const pendingStack: Pack<UnidocNFAValidationProcess> = this._pendingStack
    const nextPendingStack: Pack<UnidocNFAValidationProcess> = this._nextPendingStack

    while (pendingStack.size > 0) {
      this.continueProcess(this._pendingStack.pop())
    }

    this._pendingStack = nextPendingStack
    this._nextPendingStack = pendingStack
    this._visited.clear()

    if (this._matchs.size > 0) {
      this.handleGraphMatch()
    } else if (this._pendingStack.size === 0) {
      this.handleGraphError()
    } else {
      this.dump()
    }
  }

  /**
  * @see SubscribableUnidocConsumer.next
  */
  public next(value: UnidocEvent): void {
    //log('handle production of ' + value.toString())
    this.dumpFailures()

    const pendingStack: Pack<UnidocNFAValidationProcess> = this._pendingStack
    const nextPendingStack: Pack<UnidocNFAValidationProcess> = this._nextPendingStack
    this._current = value

    while (pendingStack.size > 0) {
      this.continueProcess(this._pendingStack.pop())
    }

    this._pendingStack = nextPendingStack
    this._nextPendingStack = pendingStack
    this._visited.clear()

    if (this._matchs.size > 0) {
      this.handleGraphMatch()
    } else if (this._pendingStack.size === 0) {
      this.handleGraphError()
    } else {
      this.dump()
    }
  }

  /**
  *
  */
  private continueProcess(process: UnidocNFAValidationProcess): void {
    //log('  continue process ' + this._graph.relationships.get(process.relationship).toString())
    const validator: UnidocKissValidator = process.process
    const current: UnidocEvent | undefined = this._current

    let output: UnidocKissValidator.Result = current ? validator.next(current) : validator.next()

    while (!output.done) {
      //log('    handling ' + output.value.toString())
      switch (output.value.type) {
        case UnidocKissValidatorOutputType.CURRENT:
          if (current) {
            output = validator.next(current)
            break
          }
        case UnidocKissValidatorOutputType.NEXT:
          this._nextPendingStack.push(process)
          return
        case UnidocKissValidatorOutputType.EMIT:
          process.push(output.value.event)

          if (output.value.event.isMessage() && output.value.event.message.isFailure()) {
            this._failures.push(process)
            return
          } else {
            output = validator.next()
          }
          break
        case UnidocKissValidatorOutputType.MATCH:
          this.handleProcessMatch(process)
          output = validator.next(undefined)
          break
        case UnidocKissValidatorOutputType.END:
          throw new Error(
            'Unable to continue a validation process because it\'s related ' +
            'KISS validator yielded an end signal. An end signal must only ' +
            'be returned as it will explicitely stop the occuring validation ' +
            'process.'
          )
        default:
          throw new Error(
            'Unable to handle kiss validator output of type ' +
            UnidocKissValidatorOutputType.toDebugString(output.value.type) +
            ' because no procedure was defined for that.'
          )
      }
    }

    if (output.value.isMatch()) {
      this.handleProcessMatch(process)
    } else if (output.value.isEnd()) {
      this._failures.push(process)
    } else {
      throw new Error(
        'Unable to continue a validation process because it\'s related ' +
        'KISS validator ended without returning a match nor an end signal.'
      )
    }
  }

  /**
  * @see SubscribableUnidocConsumer.success
  */
  public success(): void {
    //log('handle completion')
    this.dumpFailures()

    const pendingStack: Pack<UnidocNFAValidationProcess> = this._pendingStack
    this._current = undefined

    while (pendingStack.size > 0) {
      this.terminateProcess(this._pendingStack.pop())
    }

    if (this._matchs.size > 0) {
      this.dumpFailures()
      this.handleGraphMatch()
    } else {
      this.handleGraphError()
    }
  }

  /**
  *
  */
  private dumpFailures(): void {
    //log('  dumping failures')
    const failures: Pack<UnidocNFAValidationProcess> = this._failures

    //log('   ' + this._tree.children.size)

    while (failures.size > 0) {
      //log('    dumping process ' + this._graph.relationships.get(failures.last.relationship).toString())
      UnidocNFAValidationProcess.ALLOCATOR.free(failures.pop())
    }

    //log('   ' + this._tree.children.size)
  }

  /**
  *
  */
  private handleGraphMatch(): void {
    //log('handling graph match')
    let bestMatch: UnidocNFAValidationProcess = this._matchs.pop()

    while (this._matchs.size > 0) {
      const challenger: UnidocNFAValidationProcess = this._matchs.pop()

      if (this.isLeftBetterThanRight(challenger.head, bestMatch.head)) {
        UnidocNFAValidationProcess.ALLOCATOR.free(bestMatch)
        bestMatch = challenger
      } else {
        UnidocNFAValidationProcess.ALLOCATOR.free(challenger)
      }
    }

    //log('  ' + bestMatch.head.toString())

    // for (const element of bestMatch.head.up()) {
    //   //log('  ' + element.toString())
    // }

    this.dump()
    this.output.success()

    bestMatch.head.parent = null
    UnidocNFAValidationProcess.ALLOCATOR.free(bestMatch)
  }

  /**
  *
  */
  private handleGraphError(): void {
    //log('handling graph error')
    const failures: Pack<UnidocNFAValidationProcess> = this._failures

    if (failures.size > 0) {
      let bestMatch: UnidocNFAValidationProcess = failures.pop()

      while (failures.size > 0) {
        const challenger: UnidocNFAValidationProcess = failures.pop()

        if (this.isLeftBetterThanRight(challenger.head, bestMatch.head)) {
          UnidocNFAValidationProcess.ALLOCATOR.free(bestMatch)
          bestMatch = challenger
        } else {
          UnidocNFAValidationProcess.ALLOCATOR.free(challenger)
        }
      }

      this.dump()
      this.output.success()

      bestMatch.head.parent = null
      UnidocNFAValidationProcess.ALLOCATOR.free(bestMatch)
    } else {
      this.dump()
      this.output.success()
    }
  }

  /**
  *
  */
  private dump(): void {
    const tree: UnidocNFAValidationTree = this._tree

    while (tree.children.size === 1) {
      const next: UnidocNFAValidationTree = tree.children.first

      if (next.isHead()) {
        return
      } else if (next.isEvent()) {
        this.emit(next.event)
      }

      next.delete()
      UnidocNFAValidationTree.ALLOCATOR.free(next)
    }
  }

  /**
  *
  */
  private terminateProcess(process: UnidocNFAValidationProcess): void {
    //log('  terminating process ' + this._graph.relationships.get(process.relationship).toString())
    const validator: UnidocKissValidator = process.process

    let output: UnidocKissValidator.Result = validator.next()

    while (!output.done) {
      //log('    handling ' + output.value.toString())
      switch (output.value.type) {
        case UnidocKissValidatorOutputType.CURRENT:
          output = validator.next(undefined)
          break
        case UnidocKissValidatorOutputType.NEXT:
          throw new Error(
            'Unable to terminate a validation process because it\'s related ' +
            'KISS validator requested the next available event after the ' +
            'reception of the end of document.'
          )
        case UnidocKissValidatorOutputType.EMIT:
          process.push(output.value.event)

          if (output.value.event.isMessage() && output.value.event.message.isFailure()) {
            this._failures.push(process)
            return
          } else {
            output = validator.next()
          }
          break
        case UnidocKissValidatorOutputType.MATCH:
          this.handleProcessMatch(process)
          output = validator.next()
          break
        case UnidocKissValidatorOutputType.END:
          throw new Error(
            'Unable to terminate a validation process because it\'s related ' +
            'KISS validator yielded an end signal. An end signal must only ' +
            'be returned as it will explicitely stop the occuring validation ' +
            'process.'
          )
        default:
          throw new Error(
            'Unable to handle kiss validator output of type ' +
            UnidocKissValidatorOutputType.toDebugString(output.value.type) +
            ' because no procedure was defined for that.'
          )
      }
    }

    if (output.value.isMatch()) {
      this.handleProcessMatch(process)
    } else if (output.value.isEnd()) {
      this._failures.push(process)
    } else {
      throw new Error(
        'Unable to terminate a validation process because it\'s related ' +
        'KISS validator ended without returning a match nor an end signal.'
      )
    }
  }

  /**
  * @see SubscribableUnidocConsumer.failure
  */
  public failure(error: Error): void {
    this.output.fail(error)
  }

  /**
  *
  */
  private handleProcessMatch(process: UnidocNFAValidationProcess): void {
    //log('    handle matching of process ' + this._graph.relationships.get(process.relationship).toString())
    const state: UnidocNFAValidationState = this._graph.relationships.get(process.relationship).to

    if (state.isMatch()) {
      this._matchs.push(process)
      return
    }

    let origin: UnidocNFAValidationTree | undefined = this._visited.get(state.identifier)

    if (origin) {
      if (!process.head.isUpward(origin)) {
        //log('      merging ' + this._graph.relationships.get(process.relationship).toString())
        const originParent: UnidocNFAValidationTree = origin.parent!
        const processParent: UnidocNFAValidationTree = process.head.parent!
        process.head.parent = null

        if (this.isLeftBetterThanRight(processParent, originParent)) {
          origin.parent = processParent
          UnidocNFAValidationTree.cut(originParent)
        }
      }

      //log('      dumping ' + this._graph.relationships.get(process.relationship).toString())
      UnidocNFAValidationProcess.ALLOCATOR.free(process)
    } else {
      origin = process.head.parent!.fork().asState(state)
      this._visited.set(state.identifier, origin)

      for (let index = 1; index < state.outputs.size; ++index) {
        const relationship: UnidocNFAValidationRelationship = state.outputs.get(index)
        const process: UnidocNFAValidationProcess = UnidocNFAValidationProcess.ALLOCATOR.allocate()

        process.head.parent = origin
        process.relationship = relationship.identifier
        process.process = relationship.validator()

        this._pendingStack.push(process)
        //log('      forking ' + relationship.toString())
      }

      const relationship: UnidocNFAValidationRelationship = state.outputs.get(0)

      process.head.parent = origin
      process.relationship = relationship.identifier
      process.process = relationship.validator()

      this._pendingStack.push(process)
      //log('      forking ' + relationship.toString())
    }
  }

  /**
   * 
   */
  private emit(value: UnidocValidationEvent): void {
    if (value.isValidation() || value.isDocumentCompletion()) {
      this._batch += 1
    }

    value.setIndex(this._index)
    value.setBatch(this._batch)

    this.output.next(value)

    this._index += 1
  }

  /**
  *
  */
  public reset(): void {
    this._matchs.clear()
    this._visited.clear()
    this._pendingStack.clear()
    UnidocNFAValidationTree.trash(this._tree)
    this._current = undefined
    this.off()
  }
}

export namespace UnidocNFAValidationGraphResolver {
  /**
  *
  */
  // export function dump(): void {
  //   console.//log(LOGS.join('\r\n'))
  // }
}
