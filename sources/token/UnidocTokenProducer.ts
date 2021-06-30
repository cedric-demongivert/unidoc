import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { UnidocPublisher } from '../stream/UnidocPublisher'

import { UnidocOrigin } from '../origin/UnidocOrigin'

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
    this._token.origin.from.runtime()
    this._token.origin.to.runtime()
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
  public at(origin: UnidocOrigin): UnidocTokenProducer {
    this._token.origin.from.copy(origin)
    this._token.origin.to.copy(origin)
    return this
  }

  /**
   * 
   */
  public from(): UnidocOrigin

  /**
   * 
   */
  public from(origin: UnidocOrigin): UnidocTokenProducer

  public from(origin?: UnidocOrigin): UnidocOrigin | UnidocTokenProducer {
    if (origin) {
      this._token.origin.from.copy(origin)
      return this
    } else {
      this._token.origin.from.clear()
      return this._token.origin.from
    }

  }

  /**
   * 
   */
  public to(): UnidocOrigin

  /**
   * 
   */
  public to(origin: UnidocOrigin): UnidocTokenProducer

  public to(origin?: UnidocOrigin): UnidocOrigin | UnidocTokenProducer {
    if (origin) {
      this._token.origin.to.copy(origin)
      return this
    } else {
      this._token.origin.to.clear()
      return this._token.origin.to
    }
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
  public produceNewline(type: '\r\n' | '\r' | '\n' = '\r\n'): UnidocTokenProducer {
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
