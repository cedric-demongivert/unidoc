import { Comparable } from "./Comparable"

/**
 * A class that allows it's instance to deeply-copy the state of its siblings.
 * 
 * A copiable instance is also a comparable one as a copy instance must be equal to it's model.
 */
export interface Copiable extends Comparable {
  /**
   * Deep-copy the inner state of another instance of the same type.
   *
   * @param toCopy - Another instance to copy.
   *
   * @return This instance, for chaining purposes.
   */
  copy(toCopy: any): this
}

/**
 * 
 */
export namespace Copiable {
  /**
   * Assign the state of a Copiable instance to another instance of the same type.
   * 
   * @parameter origin - An instance of a Copiable class to use as a model.
   * @parameter destination - An instance of a Copiable class to update in order to make it equal to the origin instance.
   * 
   * @return The updated destination instance.
   */
  export function move<Target extends Copiable>(origin: Target, destination: Target): Target {
    return destination.copy(origin)
  }
}