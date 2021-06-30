import { Pack, Sequence } from '@cedric-demongivert/gl-tool-collection'
import { UnidocRangeOrigin } from 'sources/origin'
import { CodePoint } from 'sources/symbol'

import { UnidocOrigin } from '../origin/UnidocOrigin'

import { UnidocToken } from './UnidocToken'
import { UnidocTokenType } from './UnidocTokenType'

/**
* A unidoc token producer.
*/
export class UnidocTokenBuilder {
  /**
   * 
   */
  private readonly _token: UnidocToken

  /**
   * 
   */
  public get index(): number {
    return this._token.index
  }

  /**
   * 
   */
  public set index(value: number) {
    this._token.index = value
  }

  /**
   * 
   */
  public get type(): UnidocTokenType {
    return this._token.type
  }

  /**
   * 
   */
  public set type(value: UnidocTokenType) {
    this._token.type = value
  }

  /**
   * 
   */
  public get origin(): UnidocRangeOrigin {
    return this._token.origin
  }

  /**
   * 
   */
  public set origin(value: UnidocRangeOrigin) {
    this._token.origin.copy(value)
  }

  /**
   * 
   */
  public get from(): UnidocOrigin {
    return this._token.origin.from
  }

  /**
   * 
   */
  public set from(value: UnidocOrigin) {
    this._token.origin.from.copy(value)
  }

  /**
   * 
   */
  public get to(): UnidocOrigin {
    return this._token.origin.to
  }

  /**
   * 
   */
  public set to(value: UnidocOrigin) {
    this._token.origin.to.copy(value)
  }

  /**
   * 
   */
  public get symbols(): Pack<CodePoint> {
    return this._token.symbols
  }

  /**
   * 
   */
  public set symbols(sequence: Pack<CodePoint>) {
    this._token.symbols.copy(sequence)
  }

  /**
   * 
   */
  public constructor(capacity: number = 16) {
    this._token = new UnidocToken(capacity)
  }

  /**
   * 
   */
  public setOrigin(from: UnidocOrigin, to: UnidocOrigin = from): this {
    this._token.origin.from.copy(from)
    this._token.origin.to.copy(to)
    return this
  }

  /**
   * 
   */
  public setFrom(from: UnidocOrigin): this {
    this._token.origin.from.copy(from)
    return this
  }

  /**
   * 
   */
  public setTo(to: UnidocOrigin): this {
    this._token.origin.to.copy(to)
    return this
  }

  /**
   * 
   */
  public setSymbols(symbols: Sequence<number>): this {
    this._token.symbols.copy(symbols)
    return this
  }

  /**
   * 
   */
  public clearSymbols(): this {
    this._token.symbols.clear()
    return this
  }

  /**
   * 
   */
  public appendSymbols(symbols: Sequence<number>): this {
    this._token.symbols.concat(symbols)
    return this
  }

  /**
   * 
   */
  public appendSymbol(symbol: number): this {
    this._token.symbols.push(symbol)
    return this
  }

  /**
   * 
   */
  public setType(type: UnidocTokenType): this {
    this._token.type = type
    return this
  }

  /**
   * 
   */
  public setIndex(index: number): this {
    this._token.index = index
    return this
  }

  /**
   * 
   */
  public incrementIndex(): this {
    this._token.index += 1
    return this
  }

  /**
   * 
   */
  public decrementIndex(): this {
    this._token.index -= 1
    return this
  }

  /**
   * 
   */
  public asIdentifier(value: string): this {
    this._token.asIdentifier(value)
    return this
  }

  /**
   * 
   */
  public asClass(value: string): this {
    this._token.asClass(value)
    return this
  }

  /**
   * 
   */
  public asTag(value: string): this {
    this._token.asTag(value)
    return this
  }

  /**
   * 
   */
  public asBlockStart(): this {
    this._token.asBlockStart()
    return this
  }

  /**
   * 
   */
  public asBlockEnd(): this {
    this._token.asBlockEnd()
    return this
  }

  /**
   * 
   */
  public asSpace(value: string): this {
    this._token.asSpace(value)
    return this
  }

  /**
   * 
   */
  public asNewline(type: '\r\n' | '\r' | '\n' = '\r\n'): this {
    this._token.asNewline(type)
    return this
  }

  /**
   * 
   */
  public asWord(value: string): this {
    this._token.asWord(value)
    return this
  }

  /**
   * 
   */
  public get(): UnidocToken {
    return this._token
  }

  /**
   * 
   */
  public build(): UnidocToken {
    return this._token.clone()
  }

  /**
   * 
   */
  public clear(): void {
    this._token.clear()
  }
}

/**
 * 
 */
export namespace UnidocTokenBuilder {
  /**
   * 
   */
  export function create(): UnidocTokenBuilder {
    return new UnidocTokenBuilder()
  }
}
