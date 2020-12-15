import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocBuffer } from '../../buffer/UnidocBuffer'

import { UnidocEvent } from '../../event/UnidocEvent'
import { UnidocBlueprint } from '../../blueprint/UnidocBlueprint'
import { UnidocValidationTreeManager } from '../../validation/UnidocValidationTreeManager'

import { UnidocBlueprintValidationHandlers } from './handler/UnidocBlueprintValidationHandlers'
import { UnidocBlueprintExecutionEvent } from './event/UnidocBlueprintExecutionEvent'
import { UnidocBlueprintExecutionEventType } from './event/UnidocBlueprintExecutionEventType'

import { UnidocValidationNode } from './UnidocValidationNode'
import { UnidocValidationGraph } from './UnidocValidationGraph'
import { UnidocState } from './UnidocState'
import { UnidocBlueprintValidationPass } from './UnidocBlueprintValidationPass'

export class UnidocBlueprintValidationExecutor {
  /**
  *
  */
  private readonly _tree: UnidocValidationTreeManager

  /**
  *
  */
  private _pending: UnidocBuffer<UnidocBlueprintExecutionEvent>

  /**
  *
  */
  private readonly _pass: UnidocBlueprintValidationPass

  private _completion: boolean

  public constructor(tree: UnidocValidationTreeManager) {
    this._tree = tree
    this._pending = UnidocBuffer.create(UnidocBlueprintExecutionEvent.ALLOCATOR, 32)
    this._pass = new UnidocBlueprintValidationPass()
    this._completion = false
  }

  private dump(value = this._pending): void {
    let result: string = '['

    if (this._pending.size > 0) {
      result += '\r\n  > '
      result += this._pending.get(0)

      for (let index = 1; index < this._pending.size; ++index) {
        result += ',\r\n  . '
        result += this._pending.get(index)
      }

      result += '\r\n'
    }

    result += ']'

    console.log(result)
  }

  public continue(source: UnidocBuffer<UnidocBlueprintExecutionEvent>): void {
    this._pending.copy(source)
    source.clear()

    //console.log('------------------------ CONTINUE')
    while (this._pending.size > 0) {
      //this.dump()
      const resolving: UnidocBlueprintExecutionEvent = this._pending.get(0)

      switch (resolving.type) {
        case UnidocBlueprintExecutionEventType.ENTER:
          this.resolveEnter(resolving)
          break
        case UnidocBlueprintExecutionEventType.SUCCESS:
          this.resolveSuccess(resolving)
          break
        case UnidocBlueprintExecutionEventType.FAILURE:
          this.resolveFailure(resolving)
          break
        case UnidocBlueprintExecutionEventType.SKIP:
          this.resolveSkip(resolving)
          break
        case UnidocBlueprintExecutionEventType.EVENT:
          source.push(resolving)
          break
        case UnidocBlueprintExecutionEventType.ACCEPT_EVERYTHING:
          source.clear()
          source.push(resolving)
          this._pending.clear()
          return
        case UnidocBlueprintExecutionEventType.DIVE:
          this.resolveDive(resolving)
          break
        case UnidocBlueprintExecutionEventType.START:
          this.resolveStart(resolving)
          break
        default:
          throw new Error(
            'Unable to resolve execution event of type #' + resolving.type +
            ' (' + UnidocBlueprintExecutionEventType.toString(resolving.type) +
            ') because no procedure exists in order to resolve this type of ' +
            'execution event.'
          )
      }

      this._pending.warp(0)
    }
  }

  public event(source: Pack<UnidocBlueprintExecutionEvent>, event: UnidocEvent): void {
    this._pending.copy(source)
    source.clear()

    //console.log('------------------------ EVENT')
    while (this._pending.size > 0) {
      //this.dump()
      const resolving: UnidocBlueprintExecutionEvent = this._pending.get(0)

      switch (resolving.type) {
        case UnidocBlueprintExecutionEventType.ENTER:
        case UnidocBlueprintExecutionEventType.SUCCESS:
        case UnidocBlueprintExecutionEventType.FAILURE:
        case UnidocBlueprintExecutionEventType.DIVE:
        case UnidocBlueprintExecutionEventType.START:
        case UnidocBlueprintExecutionEventType.SKIP:
          source.push(resolving)
          break
        case UnidocBlueprintExecutionEventType.EVENT:
          this.resolveEvent(resolving, event)
          break
        case UnidocBlueprintExecutionEventType.ACCEPT_EVERYTHING:
          source.clear()
          source.push(resolving)
          this.acceptEvent(resolving, event)
          this._pending.clear()
          return
        default:
          throw new Error(
            'Unable to resolve execution event of type #' + resolving.type +
            ' (' + UnidocBlueprintExecutionEventType.toString(resolving.type) +
            ') because no procedure exists in order to resolve this type of ' +
            'execution event.'
          )
      }

      this._pending.warp(0)
    }
  }

  public complete(source: Pack<UnidocBlueprintExecutionEvent>): void {
    this._pending.copy(source)
    source.clear()
    this._completion = true

    //console.log('------------------------ COMPLETE')
    while (this._pending.size > 0) {
      //this.dump()
      const resolving: UnidocBlueprintExecutionEvent = this._pending.get(0)

      switch (resolving.type) {
        case UnidocBlueprintExecutionEventType.ENTER:
          this.resolveEnter(resolving)
          break
        case UnidocBlueprintExecutionEventType.SUCCESS:
          this.resolveSuccess(resolving)
          break
        case UnidocBlueprintExecutionEventType.FAILURE:
          this.resolveFailure(resolving)
          break
        case UnidocBlueprintExecutionEventType.SKIP:
          this.resolveSkip(resolving)
          break
        case UnidocBlueprintExecutionEventType.EVENT:
          this.resolveCompletion(resolving)
          break
        case UnidocBlueprintExecutionEventType.ACCEPT_EVERYTHING:
          this.acceptCompletion(resolving)
          this._pending.clear()
          this._completion = false
          return
        case UnidocBlueprintExecutionEventType.DIVE:
          this.resolveDive(resolving)
          break
        case UnidocBlueprintExecutionEventType.START:
          this.resolveStart(resolving)
          break
        default:
          throw new Error(
            'Unable to resolve execution event of type #' + resolving.type +
            ' (' + UnidocBlueprintExecutionEventType.toString(resolving.type) +
            ') because no procedure exists in order to resolve this type of ' +
            'execution event.'
          )
      }

      this._pending.warp(0)
    }

    this._completion = false
  }


  private resolveFailure(event: UnidocBlueprintExecutionEvent): void {
    const graph: UnidocValidationGraph = event.graph
    const pass: UnidocBlueprintValidationPass = this._pass

    if (graph.parent && graph.parent.parent) {
      event.graph = graph.parent.parent
      event.state.copy(graph.parent.state)

      pass.handle(event)
      pass.output = this._tree.getManagerOf(event.branch)

      UnidocBlueprintValidationHandlers.get(event.graph.blueprint).onFailure(pass)

      if (pass.events.size > 0) {
        this.resolvePass(pass)

        // Removing unused graph ?
      } else {
        throw new Error(
          'Illegal behavior : an handler does nothing on dive failure.'
        )
      }
    } else {
      this._tree.terminate(event.branch)
    }
  }

  private resolveSuccess(event: UnidocBlueprintExecutionEvent): void {
    const graph: UnidocValidationGraph = event.graph
    const pass: UnidocBlueprintValidationPass = this._pass

    if (graph.parent && graph.parent.parent) {
      event.graph = graph.parent.parent
      event.state.copy(graph.parent.state)

      pass.handle(event)
      pass.output = this._tree.getManagerOf(event.branch)

      UnidocBlueprintValidationHandlers.get(event.graph.blueprint).onSuccess(pass)

      if (pass.events.size > 0) {
        this.resolvePass(pass)

        // Removing unused graph ?
      } else {
        throw new Error(
          'Illegal behavior : an handler does nothing on dive success.'
        )
      }
    } else if (!this._completion) {
      this._pending.size += 1
      this._pending.last.asAcceptEverything()
      this._pending.last.ofBranch(event.branch)
    }
  }

  private resolveSkip(event: UnidocBlueprintExecutionEvent): void {
    const graph: UnidocValidationGraph = event.graph
    const pass: UnidocBlueprintValidationPass = this._pass

    if (graph.parent && graph.parent.parent) {
      event.graph = graph.parent.parent
      event.state.copy(graph.parent.state)

      pass.handle(event)
      pass.output = this._tree.getManagerOf(event.branch)

      UnidocBlueprintValidationHandlers.get(event.graph.blueprint).onSkip(pass)

      if (pass.events.size > 0) {
        this.resolvePass(pass)

        // Removing unused graph ?
      } else {
        throw new Error(
          'Illegal behavior : an handler does nothing on dive skip.'
        )
      }
    } else if (!this._completion) {
      this._pending.size += 1
      this._pending.last.asAcceptEverything()
      this._pending.last.ofBranch(event.branch)
    }
  }

  private resolveStart(event: UnidocBlueprintExecutionEvent): void {
    const graph: UnidocValidationGraph = event.graph
    const pass: UnidocBlueprintValidationPass = this._pass

    pass.handle(event)
    pass.output = this._tree.getManagerOf(event.branch)

    UnidocBlueprintValidationHandlers.get(graph.blueprint).onStart(pass)

    if (pass.events.size > 0) {
      this.resolvePass(pass)
    } else {
      throw new Error(
        'Illegal behavior : an handler does nothing on graph initialization.'
      )
    }
  }

  private resolveDive(event: UnidocBlueprintExecutionEvent): void {
    const graph: UnidocValidationGraph = event.graph
    const state: UnidocState = event.state

    const blueprint: UnidocBlueprint | null = event.blueprint
    const node: UnidocValidationNode | undefined = graph.get(state)

    if (blueprint == null) {
      throw new Error(
        'Illegal event : a dive event instance must have a reference to a ' +
        'blueprint instance.'
      )
    }

    if (node == undefined) {
      const subgraph: UnidocValidationGraph = new UnidocValidationGraph()
      subgraph.blueprint = blueprint
      subgraph.parent = graph.create(state)

      this._pending.size += 1
      const next: UnidocBlueprintExecutionEvent = this._pending.last
      next.ofBranch(event.branch)
      next.asStart(subgraph)
    } else if (node.requireContent().blueprint !== blueprint) {
      throw new Error(
        'Illegal behavior : an handler try to dive into multiple different ' +
        'blueprints into the same validation graph state.'
      )
    } else {
      this._pending.size += 1
      const next: UnidocBlueprintExecutionEvent = this._pending.last
      next.ofBranch(event.branch)
      next.asStart(node.requireContent())
    }
  }

  private resolveEnter(event: UnidocBlueprintExecutionEvent): void {
    const graph: UnidocValidationGraph = event.graph
    const state: UnidocState = event.state
    const node: UnidocValidationNode | undefined = graph.get(event.state)

    if (node == undefined) {
      const node: UnidocValidationNode = graph.create(state)
      const pass: UnidocBlueprintValidationPass = this._pass

      node.branch.copy(event.branch)

      pass.handle(event)
      pass.output = this._tree.getManagerOf(node.branch)

      UnidocBlueprintValidationHandlers.get(graph.blueprint).onEnter(pass)

      if (pass.events.size > 0) {
        this.resolvePass(pass)
        node.delete()
      } else {
        this._pending.size += 1
        this._pending.last.asEvent(node.requireParent(), node.state)
        this._pending.last.ofBranch(event.branch)
      }
    } else if (!node.branch.equals(event.branch)) {
      this._tree.merge(event.branch, node.branch)
    }
  }

  private resolveEvent(event: UnidocBlueprintExecutionEvent, element: UnidocEvent): void {
    const graph: UnidocValidationGraph = event.graph
    const node: UnidocValidationNode | undefined = graph.get(event.state)

    if (node == undefined) {
      throw new Error(
        'Illegal state : unexisting state is waiting for an event to occur.'
      )
    } else {
      this._tree.getManagerOf(node.branch).validate(element)

      const pass: UnidocBlueprintValidationPass = this._pass

      pass.handle(event)
      pass.output = this._tree.getManagerOf(node.branch)

      UnidocBlueprintValidationHandlers.get(graph.blueprint).onEvent(pass, element)

      if (pass.events.size > 0) {
        this.resolvePass(pass)
        node.delete()
      } else {
        throw new Error(
          'Illegal behavior : an handler did nothing after the ' +
          'reception of an event.'
        )
      }
    }
  }

  private acceptEvent(event: UnidocBlueprintExecutionEvent, element: UnidocEvent): void {
    this._tree.getManagerOf(event.branch).validate(element)
  }

  private resolveCompletion(event: UnidocBlueprintExecutionEvent): void {
    const graph: UnidocValidationGraph = event.graph
    const node: UnidocValidationNode | undefined = graph.get(event.state)

    if (node == undefined) {
      throw new Error(
        'Illegal state : unexisting state is waiting for an event to occur.'
      )
    } else {
      this._tree.getManagerOf(node.branch).documentCompletion()

      const pass: UnidocBlueprintValidationPass = this._pass

      pass.handle(event)
      pass.output = this._tree.getManagerOf(node.branch)

      UnidocBlueprintValidationHandlers.get(graph.blueprint).onCompletion(pass)

      if (pass.events.size > 0) {
        this.resolvePass(pass)
        node.delete()
      } else {
        throw new Error(
          'Illegal behavior : an handler did nothing after the ' +
          'reception of an event.'
        )
      }
    }
  }

  private acceptCompletion(event: UnidocBlueprintExecutionEvent): void {
    this._tree.getManagerOf(event.branch).documentCompletion()
  }

  private resolvePass(pass: UnidocBlueprintValidationPass): void {
    const events: UnidocBuffer<UnidocBlueprintExecutionEvent> = pass.events

    this._pending.push(events.get(0))

    for (let index = 1, size = events.size; index < size; ++index) {
      const event: UnidocBlueprintExecutionEvent = events.get(index)
      event.ofBranch(this._tree.fork(event.branch).branch)
      this._pending.push(event)
    }
  }
}
