import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocEventType } from '../../../event/UnidocEventType'

import { SubscribableUnidocConsumer } from '../../../consumer/SubscribableUnidocConsumer'
import { StaticUnidocProducer } from '../../../producer/StaticUnidocProducer'
import { UnidocProducerEvent } from '../../../producer/UnidocProducerEvent'

import { StreamTree } from '../StreamTree'

import { NativeCompiler } from './NativeCompiler'

export class StreamTreeCompiler extends SubscribableUnidocConsumer<UnidocEvent> implements NativeCompiler<StreamTree> {
  private _result: StreamTree
  private readonly _stack: Pack<StreamTree>
  private readonly _producer: StaticUnidocProducer<StreamTree>

  public constructor(capacity: number = 32) {
    super()

    this._producer = new StaticUnidocProducer()

    this._result = {
      tag: 'document',
      identifier: undefined,
      classes: [],
      content: []
    }

    this._stack = Pack.any(capacity)
  }

  /**
  * @see UnidocConsumer.handleInitialization
  */
  public handleInitialization(): void {
    this._result = {
      tag: 'document',
      identifier: undefined,
      classes: [],
      content: []
    }

    this._stack.push(this._result)
  }

  /**
  * @see UnidocConsumer.handleProduction
  */
  public handleProduction(event: UnidocEvent): void {
    switch (event.type) {
      case UnidocEventType.WHITESPACE:
        return this.handleWhitespace(event)
      case UnidocEventType.WORD:
        return this.handleWord(event)
      case UnidocEventType.START_TAG:
        return this.handleTagStart(event)
      case UnidocEventType.END_TAG:
        return this.handleTagEnd(event)
      default:
        throw new Error(
          'Unable to handle the given event of type #' + event.type + ' (' +
          UnidocEventType.toString(event.type) + ') because this compiler ' +
          'does not define a procedure for it.'
        )
    }
  }

  /**
  * @see UnidocConsumer.handleCompletion
  */
  public handleCompletion(): void {
    const result: any = this._result

    this._result = {
      tag: 'document',
      identifier: undefined,
      classes: [],
      content: []
    }

    this._stack.clear()

    this._producer.initialize()
    this._producer.produce(result)
    this._producer.complete()
  }

  /**
  * @see UnidocConsumer.handleFailure
  */
  public handleFailure(error: Error): void {
    console.error(error)
  }

  public handleWhitespace(event: UnidocEvent): void {
    const current: StreamTree = this._stack.last

    if (current.content.length === 0) {
      current.content.push(this.toWhitespaceTag(event))
    } else {
      const last: StreamTree.Node<any> = current.content[current.content.length - 1]

      if (last.tag === 'whitespace') {
        last.content += event.text
      } else {
        current.content.push(this.toWhitespaceTag(event))
      }
    }
  }

  private toWhitespaceTag(event: UnidocEvent): StreamTree.Node<string> {
    return {
      tag: 'whitespace',
      identifier: event.identifier,
      classes: [...event.classes],
      content: event.text
    }
  }

  public handleWord(event: UnidocEvent): void {
    const current: StreamTree = this._stack.last

    if (current.content.length === 0) {
      current.content.push(this.toWordTag(event))
    } else {
      const last: StreamTree.Node<any> = current.content[current.content.length - 1]

      if (last.tag === 'word') {
        last.content += event.text
      } else {
        current.content.push(this.toWordTag(event))
      }
    }
  }

  private toWordTag(event: UnidocEvent): StreamTree.Node<string> {
    return {
      tag: 'word',
      identifier: event.identifier,
      classes: [...event.classes],
      content: event.text
    }
  }

  public handleDocument(event: UnidocEvent): void {
    this._result.identifier = event.identifier
    this._result.classes = [...event.classes]
  }

  public handleTagStart(event: UnidocEvent): void {
    if (this._stack.size === 1 && event.tag === 'document') {
      this.handleDocument(event)
    } else {
      const current: StreamTree = this._stack.last
      const tag: StreamTree = {
        tag: event.tag,
        identifier: event.identifier,
        classes: [...event.classes],
        content: []
      }

      current.content.push(tag)
      this._stack.push(tag)
    }
  }

  public handleTagEnd(event: UnidocEvent): void {
    this._stack.pop()
  }

  /**
  * Update the state of this compiler in order to reuse-it on another stream.
  */
  public reset(): void {
    this._result = {
      tag: 'document',
      identifier: undefined,
      classes: [],
      content: []
    }
    this._stack.clear()
  }

  /**
  * Update the state of this compiler toke make it as if the compiler was just
  * instantiated.
  */
  public clear(): void {
    this._result = {
      tag: 'document',
      identifier: undefined,
      classes: [],
      content: []
    }
    this._stack.clear()
  }

  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event: UnidocProducerEvent, listener: any): void {
    this._producer.addEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event: UnidocProducerEvent, listener: any): void {
    this._producer.removeEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeAllEventListener
  */
  public removeAllEventListener(...parameters: [any?]): void {
    this._producer.removeAllEventListener(...parameters)
  }
}

export namespace StreamTreeCompiler {
}
