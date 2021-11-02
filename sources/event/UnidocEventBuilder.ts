import { UTF32String } from '../symbol/UTF32String'

import { UnidocOrigin } from '../origin/UnidocOrigin'
import { UnidocRangeOrigin } from '../origin/UnidocRangeOrigin'

import { UnidocBuilder } from '../UnidocBuilder'

import { UnidocEvent } from './UnidocEvent'
import { UnidocEventType } from './UnidocEventType'

/**
 * 
 */
export class UnidocEventBuilder implements UnidocBuilder<UnidocEvent, UnidocEventBuilder>{
  /**
  *
  */
  private readonly _event: UnidocEvent

  /**
   * 
   */
  public get index(): number {
    return this._event.index
  }

  /**
   * 
   */
  public set index(value: number) {
    this._event.index = value
  }

  /**
   * 
   */
  public get type(): UnidocEventType {
    return this._event.type
  }

  /**
   * 
   */
  public set type(value: UnidocEventType) {
    this._event.type = value
  }

  /**
   * 
   */
  public get origin(): UnidocRangeOrigin {
    return this._event.origin
  }

  /**
   * 
   */
  public set origin(value: UnidocRangeOrigin) {
    this._event.origin.copy(value)
  }

  /**
   * 
   */
  public get from(): UnidocOrigin {
    return this._event.origin.from
  }

  /**
   * 
   */
  public set from(value: UnidocOrigin) {
    this._event.origin.from.copy(value)
  }

  /**
   * 
   */
  public get to(): UnidocOrigin {
    return this._event.origin.to
  }

  /**
   * 
   */
  public set to(value: UnidocOrigin) {
    this._event.origin.to.copy(value)
  }

  /**
   * 
   */
  public get symbols(): UTF32String {
    return this._event.symbols
  }

  /**
   * 
   */
  public set symbols(sequence: UTF32String) {
    this._event.symbols.copy(sequence)
  }

  /**
   * 
   */
  public get tag(): string {
    return this._event.tag
  }

  /**
   * 
   */
  public set tag(value: string) {
    this._event.tag = value
  }

  /**
   * 
   */
  public get identifier(): string {
    return this._event.identifier
  }

  /**
   * 
   */
  public set identifier(value: string) {
    this._event.identifier = value
  }

  /**
   * 
   */
  public get classes(): Set<string> {
    return this._event.classes
  }

  /**
   * 
   */
  public set classes(value: Set<string>) {
    this._event.classes.clear()
    this._event.addClasses(value)
  }

  /**
  * Instantiate a new unidoc event.
  */
  public constructor() {
    this._event = new UnidocEvent()
  }

  /**
   * 
   */
  public setType(type: UnidocEventType): this {
    this._event.type = type
    return this
  }

  /**
   * 
   */
  public setSymbols(symbols: UTF32String): this {
    this._event.symbols.copy(symbols)
    return this
  }

  /**
   * 
   */
  public setTag(tag: string): this {
    this._event.tag = tag
    return this
  }

  /**
   * 
   */
  public setIdentifier(identifier: string): this {
    this._event.identifier = identifier
    return this
  }

  /**
   * 
   */
  public decrementIndex(): this {
    this._event.index -= 1
    return this
  }

  /**
   * 
   */
  public incrementIndex(): this {
    this._event.index += 1
    return this
  }

  /**
   * 
   */
  public setIndex(index: number): this {
    this._event.index = index
    return this
  }

  /**
   * 
   */
  public setClasses(classes: Iterable<string>): this {
    this._event.classes.clear()
    this._event.addClasses(classes)
    return this
  }

  /**
   * 
   */
  public setOrigin(from: UnidocOrigin, to: UnidocOrigin = from): this {
    this._event.origin.from.copy(from)
    this._event.origin.to.copy(to)
    return this
  }

  /**
   * 
   */
  public setTo(origin: UnidocOrigin): this {
    this._event.origin.to.copy(origin)
    return this
  }

  /**
   * 
   */
  public setFrom(origin: UnidocOrigin): this {
    this._event.origin.from.copy(origin)
    return this
  }

  /**
   * 
   */
  public asWord(content: string = ''): this {
    this._event.asWord(content)
    return this
  }

  /**
   * 
   */
  public asWhitespace(content: string = ''): this {
    this._event.asWhitespace(content)
    return this
  }

  /**
   * 
   */
  public asTagStart(configuration: string): this {
    this._event.asTagStart(configuration)
    return this
  }

  /**
   * 
   */
  public asTagEnd(configuration: string): this {
    this._event.asTagEnd(configuration)
    return this
  }

  /**
   * @see UnidocBuilder.get
   */
  public get(): UnidocEvent {
    return this._event
  }

  /**
   * @see UnidocBuilder.build
   */
  public build(): UnidocEvent {
    return this._event.clone()
  }

  /**
   * @see UnidocBuilder.build
   */
  public copy(toCopy: UnidocEvent | UnidocEventBuilder): this {
    this._event.copy(toCopy instanceof UnidocEventBuilder ? toCopy._event : toCopy)
    return this
  }

  /**
   * @see UnidocBuilder.clone
   */
  public clone(): UnidocEventBuilder {
    return new UnidocEventBuilder().copy(this)
  }

  /**
   * @see UnidocBuilder.clear
   */
  public clear(): this {
    this._event.clear()
    return this
  }

  /**
   * @see UnidocBuilder.equals 
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocEventBuilder) {
      return other._event.equals(this._event)
    }

    return false
  }
}

/**
 * 
 */
export namespace UnidocEventBuilder {
  /**
   * 
   */
  export function create(): UnidocEventBuilder {
    return new UnidocEventBuilder()
  }
}
