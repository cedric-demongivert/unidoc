import { DataObject } from "./DataObject"
import { Assignable } from "./Assignable"
import { Clearable } from "@cedric-demongivert/gl-tool-utils"

/**
 * 
 */
export class Optional<Value extends Clearable & Assignable<Value>> implements DataObject {
  /**
   * 
   */
  private readonly _value: Value

  /**
   * 
   */
  public defined: boolean

  /**
   * 
   */
  public get value(): Value | undefined {
    return this.defined ? this.value : undefined
  }

  /**
   * 
   */
  public constructor(value: Value, defined: boolean = true) {
    this._value = value.clone() as Value
    this.defined = defined
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): Optional<Value> {
    return new Optional(this._value, this.defined)
  }

  /**
   * @see Clearable.prototype.clear
   */
  public clear(): void {
    this._value.clear()
    this.defined = true
  }

  /**
   * 
   */
  public delete(): void {
    this.defined = false
  }

  /**
   * 
   */
  public set(value: Value | undefined): void {
    this.defined = value !== undefined
    if (this.defined) this.value.copy(value)
  }

  /**
   * @see Comparable.prototype.equals
   */
  public equals(other: unknown): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof Optional) {
      return this.defined === other.defined && (
        !this.defined || this._value.equals(other._value)
      )
    }

    return false
  }
}