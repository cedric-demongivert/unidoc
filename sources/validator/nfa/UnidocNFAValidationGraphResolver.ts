import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocKissValidator } from '../kiss/UnidocKissValidator'
import { UnidocKissValidatorOutput } from '../kiss/UnidocKissValidatorOutput'
import { UnidocKissValidatorOutputType } from '../kiss/UnidocKissValidatorOutputType'

import { UnidocNFAValidationTree } from './UnidocNFAValidationTree'

import { UnidocNFAValidationState } from './UnidocNFAValidationState'
import { UnidocNFAValidationGraph } from './UnidocNFAValidationGraph'
import { UnidocNFAValidationProcess } from './UnidocNFAValidationProcess'

export class UnidocNFAValidationGraphResolver {
  /**
  *
  */
  private _graph: UnidocNFAValidationGraph

  /**
  *
  */
  private readonly _processStack: Pack<UnidocNFAValidationProcess>

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
  private _current: UnidocEvent | null

  /**
  *
  */
  public constructor(graph: UnidocNFAValidationGraph) {
    this._graph = graph
    this._visited = new Map()
    this._processStack = Pack.any(16)
    this._tree = new UnidocNFAValidationTree()
    this._current = null
  }

  /**
  *
  */
  public useGraph(graph: UnidocNFAValidationGraph): void {
    this._graph = graph
    this._visited.clear()
    this._processStack.clear()
    UnidocNFAValidationTree.trash(this._tree)
  }

  /**
  *
  */
  public enter(state: UnidocNFAValidationState): void {
    if (state.graph !== this._graph) {
      throw new Error(
        'Unable to enter into the given state because the given state does ' +
        'not belong to the resolved graph.'
      )
    }

    if (this._visited.get(state.identifier) == null) {
      const origin: UnidocNFAValidationTree = this.getBestValidationBranch().fork().asState(state)

      for (const relationship of state.outputs) {
        const node: UnidocNFAValidationTree = origin.fork()
        const process: UnidocNFAValidationProcess = UnidocNFAValidationProcess.ALLOCATOR.allocate()

        process.branch = node
        process.process = relationship.validator()

        this._processStack.push(process)
      }

      this._visited.set(state.identifier, origin)
    }
  }

  /**
  *
  */
  private onStart(process: UnidocNFAValidationProcess): void {
    const validator: UnidocKissValidator = process.process

    let output: UnidocKissValidatorOutput = validator.next().value

    while (true) {
      switch (output.type) {
        case UnidocKissValidatorOutputType.CURRENT:
          if (this._current) {
            output = validator.next(this._current).value
          } else {
            return
          }
          break
        case UnidocKissValidatorOutputType.NEXT:
          return
        case UnidocKissValidatorOutputType.EMIT:
          this.onEmission(process, output.event)
          output = validator.next().value
          break
        case UnidocKissValidatorOutputType.END:

        case UnidocKissValidatorOutputType.MATCH:

        default:
          throw new Error(
            'Unable to handle kiss validator output of type ' +
            UnidocKissValidatorOutputType.toDebugString(output.type) + ' ' +
            'because no procedure was defined for that.'
          )
      }
    }
  }

  private onEmission(process: any, event: any): void {

  }

  /**
  *
  */
  private getBestValidationBranch(): UnidocNFAValidationTree {
    let result: UnidocNFAValidationTree = this._tree
    let resultMessages: number[] = result.countMessages()
    let resultBatch: number = result.batch()
    let challengerMessages: number[] = []

    const messages: number = resultMessages.length

    for (const challenger of this._processStack) {
      const challengerBatch: number = challenger.branch!.batch()

      if (challengerBatch === resultBatch) {
        challenger.branch!.countMessages(challengerMessages)

        for (let index = 0; index < messages; ++index) {
          const challengerScore: number = challengerMessages[messages - index - 1]
          const resultScore: number = resultMessages[messages - index - 1]

          if (challengerScore > resultScore) {
            break
          } else if (challengerScore < resultScore) {
            result = challenger.branch!
            const tmp: number[] = resultMessages
            resultMessages = challengerMessages
            challengerMessages = tmp
            resultBatch = challengerBatch
            break
          }
        }
      } else if (challengerBatch > resultBatch) {
        result = challenger.branch!
        resultMessages = challenger.branch!.countMessages(resultMessages)
        resultBatch = challengerBatch
      }
    }

    return result
  }

  /**
  *
  */
  public validate(event: UnidocEvent): void {

  }

  /**
  *
  */
  public reset(): void {
    this._visited.clear()
    this._processStack.clear()
    UnidocNFAValidationTree.trash(this._tree)
  }
}

export namespace UnidocNFAValidationGraphResolver {

}
