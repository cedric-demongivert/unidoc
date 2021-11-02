import { Clearable } from "./Clearable"
import { Clonable } from "./Clonable"
import { Comparable } from "./Comparable"
import { Copiable } from "./Copiable"
import { DefaultConstructible } from "./DefaultConstructible"

/**
 * A class that describe an instance designed for representing and manipulating of data.
 */
export interface DataObject extends Clearable, Clonable, Comparable, Copiable, DefaultConstructible {
  /**
   * @see Clonable.clone
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
  export const clear: typeof Clearable.clear = Clearable.clear

  /**
   * @see Clonable.copy
   */
  export const copy: typeof Clonable.copy = Clonable.copy

  /**
   * @see Comparable.equals
   */
  export const equals: typeof Comparable.equals = Comparable.equals

  /**
   * @see Copiable.move
   */
  export const move: typeof Copiable.move = Copiable.move

  /**
   * @see DefaultConstructible.create
   */
  export const create: typeof DefaultConstructible.create = DefaultConstructible.create
}

