import { UnidocBuffer } from '../../buffer/UnidocBuffer'

import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocBlueprint } from '../../blueprint/UnidocBlueprint'
import { UnidocProducerEvent } from '../../producer/UnidocProducerEvent'
import { SubscribableUnidocConsumer } from '../../consumer/SubscribableUnidocConsumer'

import { UnidocValidationTreeManager } from '../../validation/UnidocValidationTreeManager'

import { UnidocValidator } from '../UnidocValidator'

import { UnidocBlueprintExecutionEvent } from './event/UnidocBlueprintExecutionEvent'

import { UnidocValidationGraph } from './UnidocValidationGraph'
import { UnidocBlueprintValidationExecutor } from './UnidocBlueprintValidationExecutor'

/*
function createStop(count: number): any {
  let index: number = 0
  let buffer: string[] = []
  return function stop(process?: UnidocBlueprintValidationProcess): void {
    index += 1
    if (process == null) {
      buffer.push('------------------------------------')
    } else if (process.states.size > 0) {
      buffer.push('executing ' + process.states.last.toString() + '...')
    } else {
      buffer.push('executing empty state...')
    }
    if (index >= count) {
      throw new Error(buffer.join('\r\n'))
    }
  }
}
*/

//const stop: any = createStop(200)

export class UnidocBlueprintValidator
  extends SubscribableUnidocConsumer<UnidocEvent>
  implements UnidocValidator {
  private _pass: UnidocBuffer<UnidocBlueprintExecutionEvent>
  private _graph: UnidocValidationGraph
  private _manager: UnidocValidationTreeManager
  private _executor: UnidocBlueprintValidationExecutor

  public constructor(capacity: number = 32) {
    super()
    this._pass = UnidocBuffer.create(UnidocBlueprintExecutionEvent.ALLOCATOR, capacity)
    this._graph = new UnidocValidationGraph()
    this._manager = new UnidocValidationTreeManager()
    this._executor = new UnidocBlueprintValidationExecutor(this._manager)
  }

  public handleInitialization(): void {
    this._pass.first.ofBranch(this._manager.initialize().branch)
  }

  public handleProduction(value: UnidocEvent): void {
    this.validate(value)
  }

  public handleCompletion(): void {
    this._executor.continue(this._pass)
    this._executor.complete(this._pass)

    this._pass.clear()
    this._manager.complete()
    this._graph.clear()
  }

  public handleFailure(error: Error): void {
    console.error(error)
  }

  public validate(event: UnidocEvent) {
    this._executor.continue(this._pass)
    this._executor.event(this._pass, event)
  }

  public execute(blueprint: UnidocBlueprint): void {
    this._graph.clear()
    this._pass.clear()
    this._manager.reset()

    this._graph.blueprint = blueprint

    this._pass.size += 1
    this._pass.first.asStart(this._graph)
  }

  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event: UnidocProducerEvent, listener: any): void {
    this._manager.addEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event: UnidocProducerEvent, listener: any): void {
    this._manager.removeEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeAllEventListener
  */
  public removeAllEventListener(...parameters: [any?]): void {
    this._manager.removeAllEventListener(...parameters)
  }
}
