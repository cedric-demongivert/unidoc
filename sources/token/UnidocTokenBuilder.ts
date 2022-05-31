import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { UnidocOrigin, UnidocLayout } from '../origin'
import { UnidocSymbol, UTF32CodeUnit, UTF32String } from '../symbol'

import { UnidocBuilder } from '../UnidocBuilder'

import { UnidocToken } from './UnidocToken'
import { UnidocTokenType } from './UnidocTokenType'

/**
* An unidoc token builder.
*/
export class UnidocTokenBuilder implements UnidocBuilder<UnidocToken, UnidocTokenBuilder> {
  /**
   * 
   */
  private readonly _token: UnidocToken

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
  public get origin(): UnidocLayout {
    return this._token.origin
  }

  /**
   * 
   */
  public set origin(value: UnidocLayout) {
    this._token.origin.copy(value)
  }

  /**
   * 
   */
  public get symbols(): UTF32String {
    return this._token.symbols
  }

  /**
   * 
   */
  public set symbols(sequence: UTF32String) {
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
  public setOrigin(origin: UnidocLayout): this {
    this._token.origin.copy(origin)
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
  public appendUTF32String(symbols: UTF32String, origin: UnidocLayout): this {
    this._token.symbols.concat(symbols)
    this._token.origin.concat(origin)
    return this
  }

  /**
   * 
   */
  public appendUTF32Unit(symbol: UTF32CodeUnit, origin: UnidocOrigin): this {
    this._token.symbols.push(symbol)
    this._token.origin.push(origin)
    return this
  }

  /**
   * 
   */
  public appendSymbol(symbol: UnidocSymbol): this {
    this._token.symbols.push(symbol.code)
    this._token.origin.push(symbol.origin)
    return this
  }

  /**
   * 
   */
  public appendString(symbol: string, origin: UnidocLayout): this {
    this._token.symbols.concatString(symbol)
    this._token.origin.concat(origin)
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
  public asNewline(type: string = '\r\n'): this {
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
   * @see UnidocBuilder.copy
   */
  public copy(toCopy: UnidocToken | UnidocTokenBuilder): this {
    this._token.copy(toCopy instanceof UnidocTokenBuilder ? toCopy._token : toCopy)
    return this
  }

  /**
   * @see UnidocBuilder.copy
   */
  public clone(): UnidocTokenBuilder {
    return UnidocTokenBuilder.create().copy(this)
  }

  /**
   * @see UnidocBuilder.get
   */
  public get(): UnidocToken {
    return this._token
  }

  /**
   * @see UnidocBuilder.build
   */
  public build(): UnidocToken {
    return this._token.clone()
  }

  /**
   * @see UnidocBuilder.clear
   */
  public clear(): this {
    this._token.clear()
    return this
  }

  /**
   * @see UnidocBuilder.equals 
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocTokenBuilder) {
      return other._token.equals(this._token)
    }

    return false
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
