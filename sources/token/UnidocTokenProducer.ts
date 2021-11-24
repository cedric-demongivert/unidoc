import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { UnidocPublisher } from '../stream/UnidocPublisher'
import { UnidocSequenceOrigin } from '../origin/UnidocSequenceOrigin'

import { UnidocToken } from './UnidocToken'
import { UnidocTokenType } from './UnidocTokenType'

/**
* A unidoc token producer.
*/
export class UnidocTokenProducer extends UnidocPublisher<UnidocToken> {
  /**
  * The token instance used for the emission of new tokens.
  */
  private readonly _token: UnidocToken

  /**
   * 
   */
  private _index: number

  /**
  * Instantiate a new unidoc token.
  *
  * @param [capacity = 16] - Initial capacity of the symbol buffer of this token.
  */
  public constructor() {
    super()

    this._token = new UnidocToken()
    this._index = 0
  }

  /**
  * @see ListenableUnidocProducer.initialize
  */
  public start(): void {
    this.output.start()
  }

  /**
   * 
   */
  public setOrigin(origin: UnidocSequenceOrigin): UnidocTokenProducer {
    this._token.origin.copy(origin)
    return this
  }

  /**
   * 
   */
  public withSymbols(symbols: Sequence<number>): UnidocTokenProducer {
    this._token.symbols.copy(symbols)
    return this
  }

  /**
   * 
   */
  public withType(type: UnidocTokenType): UnidocTokenProducer {
    this._token.type = type
    return this
  }

  /**
  * Produce an identifier token.
  *
  * @param value - Code points of the token to produce.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceIdentifier(value: string): UnidocTokenProducer {
    this._token.asIdentifier(value)

    this.produce(this._token)

    return this
  }

  /**
  * Produce a class token.
  *
  * @param value - Code points of the token to produce.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceClass(value: string): UnidocTokenProducer {
    this._token.asClass(value)

    this.produce(this._token)

    return this
  }

  /**
  * Produce a tag token.
  *
  * @param value - Code points of the token to produce.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceTag(value: string): UnidocTokenProducer {
    this._token.asTag(value)

    this.produce(this._token)

    return this
  }

  /**
  * Produce a block start token.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceBlockStart(): UnidocTokenProducer {
    this._token.asBlockStart()

    this.produce(this._token)

    return this
  }

  /**
  * Produce a block end token.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceBlockEnd(): UnidocTokenProducer {
    this._token.asBlockEnd()

    this.produce(this._token)

    return this
  }

  /**
  * Produce a space token.
  *
  * @param value - Code points of the token to produce.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceSpace(value: string): UnidocTokenProducer {
    this._token.asSpace(value)

    this.produce(this._token)

    return this
  }

  /**
  * Produce a newline token.
  *
  * @param [type = '\r\n'] - Type of new line to produce.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceNewline(type: string = '\r\n'): UnidocTokenProducer {
    this._token.asNewline(type)

    this.produce(this._token)

    return this
  }

  /**
  * Produce a word token.
  *
  * @param value - Code points of the token to produce.
  *
  * @return This producer instance for chaining purposes.
  */
  public produceWord(value: string): UnidocTokenProducer {
    this._token.asWord(value)

    this.produce(this._token)

    return this
  }

  /**
  * @see ListenableUnidocProducer.produce
  */
  public produce(token: UnidocToken = this._token): void {
    token.index = this._index
    this._index += 1

    this.output.next(token)
  }

  /**
  * @see ListenableUnidocProducer.complete
  */
  public success(): void {
    this.output.success()
  }

  /**
  * @see ListenableUnidocProducer.fail
  */
  public fail(error: Error): void {
    this.output.fail(error)
  }

  /**
   * 
   */
  public clear(): void {
    this._index = 0
    this._token.clear()
    this.off()
  }
}

export namespace UnidocTokenProducer {
  export function create(): UnidocTokenProducer {
    return new UnidocTokenProducer()
  }
}
