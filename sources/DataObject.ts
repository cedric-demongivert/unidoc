import { Clearable, Clonable, Comparable } from "@cedric-demongivert/gl-tool-utils"
import { DefaultConstructible } from "./DefaultConstructible"

/**
 * A class of objects designed for representing and manipulating data.
 */
export interface DataObject extends Clearable, Clonable, Comparable, DefaultConstructible {
  /**
   * @see Clonable.prototype.clone
   */
  clone(): DataObject
}

/**
 * 
 */
export namespace DataObject {
  /**
   * 
   */
  export type Constructor<Target extends DataObject> = new () => Target

  /**
   * @see Clearable.clear
   */
  export const clear = Clearable.clear

  /**
   * @see Clonable.copy
   */
  export const copy = Clonable.copy

  /**
   * @see Comparable.equals
   */
  export const equals = Comparable.equals

  /**
   * @see DefaultConstructible.create
   */
  export const create = DefaultConstructible.create
}

