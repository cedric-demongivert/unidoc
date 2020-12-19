import { UnidocBlueprint } from '../../blueprint/UnidocBlueprint'
import { UnidocBuffer } from '../../buffer/UnidocBuffer'
import { UnidocValidationMessageProducer } from '../../validation/UnidocValidationMessageProducer'
import { NullUnidocValidationMessageProducer } from '../../validation/NullUnidocValidationMessageProducer'

import { UnidocBlueprintExecutionEvent } from './event/UnidocBlueprintExecutionEvent'

import { UnidocBlueprintValidationContext } from './UnidocBlueprintValidationContext'
import { UnidocState } from './UnidocState'

export class UnidocBlueprintValidationPass implements UnidocBlueprintValidationContext {
  /**
  *
  */
  public readonly event: UnidocBlueprintExecutionEvent

  /**
  *
  */
  public output: UnidocValidationMessageProducer

  /**
  *
  */
  public readonly events: UnidocBuffer<UnidocBlueprintExecutionEvent>


  /**
  *
  */
  public get blueprint(): UnidocBlueprint {
    return this.event.graph.blueprint
  }

  /**
  *
  */
  public get state(): UnidocState {
    return this.event.state
  }

  /**
  *
  */
  public constructor() {
    this.event = new UnidocBlueprintExecutionEvent()
    this.events = UnidocBuffer.create(UnidocBlueprintExecutionEvent.ALLOCATOR, 32)
    this.output = NullUnidocValidationMessageProducer.INSTANCE
  }

  public handle(event: UnidocBlueprintExecutionEvent): void {
    this.clear()
    this.event.copy(event)
  }

  /**
  *
  */
  public clear(): void {
    this.event.clear()
    this.state.clear()
    this.events.clear()
    this.output = NullUnidocValidationMessageProducer.INSTANCE
  }

  /**
  *
  */
  public enter(state: UnidocState): void {
    this.events.size += 1

    const event: UnidocBlueprintExecutionEvent = this.events.last

    event.asEnter(this.event.graph, state)
    event.ofBranch(this.event.branch)
  }

  /**
  *
  */
  public dive(state: UnidocState, blueprint: UnidocBlueprint): void {
    this.events.size += 1

    const event: UnidocBlueprintExecutionEvent = this.events.last

    event.asDive(this.event.graph, state, blueprint)
    event.ofBranch(this.event.branch)
  }

  /**
  *
  */
  public success(): void {
    this.events.size += 1

    const event: UnidocBlueprintExecutionEvent = this.events.last

    event.asSuccess(this.event.graph)
    event.ofBranch(this.event.branch)
  }

  /**
  *
  */
  public failure(): void {
    this.events.size += 1

    const event: UnidocBlueprintExecutionEvent = this.events.last

    event.asFailure(this.event.graph)
    event.ofBranch(this.event.branch)
  }

  /**
  *
  */
  public kill(): void {
    this.events.size += 1

    const event: UnidocBlueprintExecutionEvent = this.events.last

    event.asKill()
    event.ofBranch(this.event.branch)
  }

  /**
  *
  */
  public skip(): void {
    this.events.size += 1

    const event: UnidocBlueprintExecutionEvent = this.events.last

    event.asSkip(this.event.graph)
    event.ofBranch(this.event.branch)
  }
}
