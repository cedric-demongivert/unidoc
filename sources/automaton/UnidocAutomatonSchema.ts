import { Set, NativeSet } from "@cedric-demongivert/gl-tool-collection"
import { DataObject } from "../DataObject"
import { Maps } from "../Maps"

/**
 * 
 */
export class UnidocAutomatonSchema implements DataObject<UnidocAutomatonSchema> {
  /**
   * 
   */
  public readonly startListeners: Set<string>

  /**
   * 
   */
  public readonly tagStartListeners: Set<string>

  /**
   * 
   */
  public readonly tagEndListeners: Set<string>

  /**
   * 
   */
  public readonly whitespaceListeners: Set<string>

  /**
   * 
   */
  public readonly wordListeners: Set<string>

  /**
   * 
   */
  public readonly eventListeners: Set<string>

  /**
   * 
   */
  public readonly failureListeners: Set<string>

  /**
   * 
   */
  public readonly successListeners: Set<string>

  /**
   * 
   */
  public resultProvider: string | undefined

  /**
   * 
   */
  public constructor() {
    this.startListeners = NativeSet.any()
    this.whitespaceListeners = NativeSet.any()
    this.wordListeners = NativeSet.any()
    this.eventListeners = NativeSet.any()
    this.successListeners = NativeSet.any()
    this.failureListeners = NativeSet.any()
    this.tagStartListeners = NativeSet.any()
    this.tagEndListeners = NativeSet.any()
    this.resultProvider = undefined
  }

  /**
   * @see Clearable.prototype.clear
   */
  public clear(): void {
    this.startListeners.clear()
    this.whitespaceListeners.clear()
    this.wordListeners.clear()
    this.eventListeners.clear()
    this.successListeners.clear()
    this.failureListeners.clear()
    this.tagStartListeners.clear()
    this.tagEndListeners.clear()
    this.resultProvider = undefined
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): UnidocAutomatonSchema {
    return new UnidocAutomatonSchema().copy(this)
  }

  /**
   * @see Comparable.prototype.equals
   */
  public equals(other: unknown): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocAutomatonSchema) {
      return (
        other.startListeners.equals(this.startListeners) &&
        other.whitespaceListeners.equals(this.whitespaceListeners) &&
        other.wordListeners.equals(this.wordListeners) &&
        other.eventListeners.equals(this.eventListeners) &&
        other.successListeners.equals(this.successListeners) &&
        other.failureListeners.equals(this.failureListeners) &&
        other.resultProvider === this.resultProvider
      )
    }

    return false
  }

  /**
   * @see Assignable.prototype.copy
   */
  public copy(toCopy: UnidocAutomatonSchema): this {
    this.startListeners.copy(toCopy.startListeners)
    this.whitespaceListeners.copy(toCopy.whitespaceListeners)
    this.wordListeners.copy(toCopy.wordListeners)
    this.eventListeners.copy(toCopy.eventListeners)
    this.successListeners.copy(toCopy.successListeners)
    this.failureListeners.copy(toCopy.failureListeners)
    this.tagStartListeners.copy(toCopy.tagStartListeners)
    this.tagEndListeners.copy(toCopy.tagEndListeners)
    this.resultProvider = toCopy.resultProvider

    return this
  }
}

/**
 * 
 */
export namespace UnidocAutomatonSchema {
  /**
   * 
   */
  export const SYMBOL: unique symbol = Symbol('@cedric-demongivert/unidoc/automaton-metadata')

  /**
   * 
   */
  export type Symbol = typeof SYMBOL

  /**
   * 
   */
  export function create(): UnidocAutomatonSchema {
    return new UnidocAutomatonSchema()
  }

  /**
   * 
   */
  export function get(type: Function): UnidocAutomatonSchema {
    const result: UnidocAutomatonSchema | undefined = type.prototype[SYMBOL]

    if (result == null) {
      return type.prototype[SYMBOL] = new UnidocAutomatonSchema()
    }

    return result
  }
}