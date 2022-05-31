import { equals, toString } from '@cedric-demongivert/gl-tool-utils'
import { Duplicator } from '@cedric-demongivert/gl-tool-collection'

import { DataObject } from '../DataObject'
import { UnidocElementType } from "./UnidocElementType"

/**
 * 
 */
export class UnidocElement<Output = any> implements DataObject<UnidocElement<Output>> {
  /**
   * 
   */
  public value: Readonly<Output> | Error | undefined

  /**
   * 
   */
  public type: UnidocElementType

  /**
   * 
   */
  public constructor(type: UnidocElementType = UnidocElementType.DEFAULT, value?: Readonly<Output> | Error | undefined) {
    this.value = value
    this.type = type
  }

  /**
   * 
   */
  public asStart(): this {
    this.type = UnidocElementType.START
    this.value = undefined
    return this
  }

  /**
   * 
   */
  public asNext(value: Readonly<Output>): this {
    this.type = UnidocElementType.NEXT
    this.value = value
    return this
  }

  /**
   * 
   */
  public asSuccess(): this {
    this.type = UnidocElementType.SUCCESS
    this.value = undefined
    return this
  }

  /**
   * 
   */
  public asFailure(error: Error): this {
    this.type = UnidocElementType.FAILURE
    this.value = error
    return this
  }

  /**
   * 
   */
  public isStart(): boolean {
    return this.type === UnidocElementType.START
  }

  /**
   * 
   */
  public isNext(): boolean {
    return this.type === UnidocElementType.NEXT
  }

  /**
   * 
   */
  public isSuccess(): boolean {
    return this.type === UnidocElementType.SUCCESS
  }

  /**
   * 
   */
  public isFailure(): boolean {
    return this.type === UnidocElementType.FAILURE
  }

  /**
   * 
   */
  public setType(type: UnidocElementType): this {
    this.type = type
    return this
  }

  /**
   * 
   */
  public setValue(value: Readonly<Output> | Error | undefined): this {
    this.value = value
    return this
  }

  /**
   * @see Clearable.prototype.clear
   */
  public clear(): this {
    this.type = UnidocElementType.DEFAULT
    this.value = undefined
    return this
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): UnidocElement<Output> {
    return new UnidocElement<Output>(this.type, this.value)
  }

  /**
   * @see Comparable.prototype.equals
   */
  public equals(other: unknown): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocElement) {
      return (
        other.type === this.type && (
          other.type === UnidocElementType.START ||
          other.type === UnidocElementType.SUCCESS ||
          equals(other.value, this.value)
        )
      )
    }

    return false
  }

  /**
   * @see Assignable.prototype.copy
   */
  public copy(toCopy: UnidocElement<Output>): this {
    this.type = toCopy.type
    this.value = toCopy.value
    return this
  }

  /**
   * @see Object.prototype.toString
   */
  public toString(): string {
    return (
      `${this.constructor.name} ${UnidocElementType.toString(this.type)}` + (
        this.type === UnidocElementType.NEXT || this.type === UnidocElementType.FAILURE ? ` ${toString(this.value)}` : ''
      )
    )
  }
}

/**
 * 
 */
export namespace UnidocElement {
  /**
   * 
   */
  export const START: Readonly<UnidocElement<any>> = Object.freeze(new UnidocElement().setType(UnidocElementType.START))

  /**
   * 
   */
  export function start<Output>(): Readonly<UnidocElement<Output>> {
    return START
  }

  /**
   * 
   */
  export function next<Output>(value: Output): UnidocElement<Output> {
    return new UnidocElement(UnidocElementType.NEXT, value)
  }

  /**
   * 
   */
  export const SUCCESS: Readonly<UnidocElement<any>> = Object.freeze(new UnidocElement().setType(UnidocElementType.SUCCESS))

  /**
   * 
   */
  export function success<Output>(): Readonly<UnidocElement<Output>> {
    return SUCCESS
  }

  /**
   * 
   */
  export function failure<Output>(error: Error): UnidocElement<Output> {
    return new UnidocElement<Output>(UnidocElementType.FAILURE, error)
  }

  /**
   * 
   */
  export function create<Output>(type: UnidocElementType = UnidocElementType.DEFAULT, value?: Readonly<Output> | Error | undefined): UnidocElement<Output> {
    return new UnidocElement()
  }

  /**
   * 
   */
  export const DUPLICATOR: Duplicator<UnidocElement> = Duplicator.fromFactory(create)

  /**
   * 
   */
  export function is(instance: unknown): instance is UnidocElement {
    return instance instanceof UnidocElement
  }
}