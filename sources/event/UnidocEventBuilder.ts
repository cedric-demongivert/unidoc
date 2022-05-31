import { Set } from '@cedric-demongivert/gl-tool-collection'

import { UTF32String } from '../symbol/UTF32String'

import { UnidocLayout } from '../origin/UnidocLayout'

import { UnidocBuilder } from '../UnidocBuilder'

import { UnidocEvent } from './UnidocEvent'
import { UnidocEventType } from './UnidocEventType'
import { UnidocPath } from '../origin/UnidocPath'

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
  public get origin(): UnidocLayout {
    return this._event.origin
  }

  /**
   * 
   */
  public set origin(value: UnidocLayout) {
    this._event.origin.copy(value)
  }

  /**
   * 
   */
  public get path(): UnidocPath {
    return this._event.path
  }

  /**
   * 
   */
  public set path(path: UnidocPath) {
    this._event.path.copy(path)
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
  public get identifier(): UTF32String {
    return this._event.identifier
  }

  /**
   * 
   */
  public set identifier(value: UTF32String) {
    this._event.identifier.copy(value)
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
    this._event.classes.copy(value)
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
  public setIdentifier(identifier: UTF32String): this {
    this._event.identifier.copy(identifier)
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
  public setOrigin(origin: UnidocLayout): this {
    this._event.origin.copy(origin)
    return this
  }

  /**
   * 
   */
  public setPath(path: UnidocPath): this {
    this._event.path.copy(path)
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
