import { DataObject } from "./DataObject"

/**
 * 
 */
export class Optional<Value extends DataObject<Value>> implements DataObject<Optional<Value>> {
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
    this._value = value.clone()
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
  public clear(): this {
    this._value.clear()
    this.defined = true
    return this
  }

  /**
   * 
   */
  public isDefined(): this is Optional.Defined<Value> {
    return this.defined
  }

  /**
   * 
   */
  public delete(): this {
    this.defined = false
    return this
  }

  /**
   * 
   */
  public copy(toCopy: Optional<Value>): this {
    this._value.copy(toCopy._value)
    this.defined = toCopy.defined
    return this
  }

  /**
   * 
   */
  public set(value: Value | undefined): void {
    if (value == null) {
      this._value.clear()
      this.defined = false
    } else {
      this._value.copy(value)
      this.defined = true
    }
  }

  /**
   * 
   */
  public get(): Value | undefined {
    return this.defined ? this._value : undefined
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

/**
 * 
 */
export namespace Optional {
  /**
   * 
   */
  export interface Defined<Element extends DataObject<Element>> extends Optional<Element> {
    /**
     * 
     */
    get(): Element
  }

  /**
   * 
   */
  export function create<Element extends DataObject<Element>>(value: Element, defined: boolean = true): Optional<Element> {
    return new Optional(value, defined)
  }
}