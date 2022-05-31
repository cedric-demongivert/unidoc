import { Set, NativeSet, Group, Duplicator } from '@cedric-demongivert/gl-tool-collection'
import { UTF32String } from 'sources/symbol'
import { DataObject } from "../DataObject"
import { UnidocLayout } from "./UnidocLayout"

/**
 * 
 */
export class UnidocSection implements DataObject<UnidocSection> {
  /**
   * 
   */
  public readonly name: UTF32String

  /**
   * 
   */
  public readonly classes: Set<string>

  /**
   * 
   */
  public readonly identifier: UTF32String

  /**
   * 
   */
  public readonly origin: UnidocLayout

  /**
   * 
   */
  public constructor() {
    this.name = UTF32String.allocate(32)
    this.classes = NativeSet.any()
    this.identifier = UTF32String.allocate(32)
    this.origin = UnidocLayout.create()
  }

  /**
   * 
   */
  public setName(name: UTF32String): this {
    this.name.copy(name)
    return this
  }

  /**
   * 
   */
  public setClasses(classes: Group<string>): this {
    this.classes.copy(classes)
    return this
  }

  /**
   * 
   */
  public addClass(value: string): this {
    this.classes.add(value)
    return this
  }

  /**
   * 
   */
  public addClasses(classes: Iterable<string>): void {
    for (const clazz of classes) {
      this.classes.add(clazz)
    }
  }

  /**
   * 
   */
  public deleteClass(value: string): this {
    this.classes.delete(value)
    return this
  }

  /**
   * 
   */
  public clearClasses(value: string): this {
    this.classes.clear()
    return this
  }

  /**
   * 
   */
  public setIdentifier(identifier: UTF32String): this {
    this.identifier.copy(identifier)
    return this
  }

  /**
   * 
   */
  public deleteIdentifier(): this {
    this.identifier.clear()
    return this
  }

  /**
   * 
   */
  public setOrigin(origin: UnidocLayout): this {
    this.origin.copy(origin)
    return this
  }

  /**
   * @see Clearable.prototype.clear
   */
  public clear(): this {
    this.name.clear()
    this.classes.clear()
    this.identifier.clear()
    this.origin.clear()
    return this
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): UnidocSection {
    return new UnidocSection().copy(this)
  }

  /**
   * @see Assignable.prototype.copy
   */
  public copy(toCopy: UnidocSection): this {
    this.name.copy(toCopy.name)
    this.classes.copy(toCopy.classes)
    this.identifier.copy(toCopy.identifier)
    this.origin.copy(toCopy.origin)
    return this
  }

  /**
   * @see Comparable.prototype.equals
   */
  public equals(other: unknown): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocSection) {
      return (
        other.name.equals(this.name) &&
        other.identifier.equals(this.identifier) &&
        other.classes.equals(this.classes) &&
        other.origin.equals(this.origin)
      )
    }

    return false
  }

  /**
   * 
   */
  public toString(): string {
    let result: string = `${this.constructor.name} \\${this.name.toString()}`

    if (this.identifier.size > 0) {
      result += `#${this.identifier.toString()}`
    }

    for (const value of this.classes) {
      result += `.${value}`
    }

    return `${result} ${this.origin.toString()}`
  }
}

/**
 * 
 */
export namespace UnidocSection {
  /**
   * 
   */
  export const DEFAULT: Readonly<UnidocSection> = Object.freeze(new UnidocSection())

  /**
   * 
   */
  export function create(): UnidocSection {
    return new UnidocSection()
  }

  /**
   * 
   */
  export const DUPLICATOR: Duplicator<UnidocSection> = Duplicator.fromFactory(create)
}