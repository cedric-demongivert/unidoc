import { Pack, Sequence } from '@cedric-demongivert/gl-tool-collection'

import { CodePoint } from '../symbol/CodePoint'

import { UnidocOrigin } from '../origin/UnidocOrigin'
import { UnidocRangeOrigin } from '../origin/UnidocRangeOrigin'

import { UnidocEvent } from './UnidocEvent'
import { UnidocEventType } from './UnidocEventType'

/**
 * 
 */
export class UnidocEventBuilder {
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
  public get symbols(): Pack<CodePoint> {
    return this._event.symbols
  }

  /**
   * 
   */
  public set symbols(sequence: Pack<CodePoint>) {
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
  public setSymbols(symbols: Sequence<CodePoint>): this {
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
   * 
   */
  public get(): UnidocEvent {
    return this._event
  }

  /**
   * 
   */
  public build(): UnidocEvent {
    return this._event.clone()
  }

  /**
   * 
   */
  public clear(): void {
    this._event.clear()
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
