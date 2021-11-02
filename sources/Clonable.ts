/**
 * A class that describe an instance that can return a deep-copy of itself. 
 */
export interface Clonable {
  /**
   * @return A deep-copy of this instance.
   */
  clone(): Clonable
}

export namespace Clonable {
  /**
   * 
   */
  interface Conciliation<Type extends Clonable> extends Clonable {
    /**
     * 
     */
    clone(): Type
  }

  /**
   * Return a copy of an undefined instance of a Clonable class.
   * 
   * @parameter An undefined instance of a Clonable class.
   * 
   * @return The given parameter as-is.
   */
  export function copy(toCopy: undefined): undefined
  /**
   * Return a copy of a null reference to an instance of a Clonable class.
   * 
   * @parameter An null reference to an instance of a Clonable class.
   * 
   * @return The given parameter as-is.
   */
  export function copy(toCopy: null): null
  /**
   * Deep-copy a given instance of a Clonable class.
   *
   * @param toCopy - An instance of a Clonable class to deep-copy.
   *
   * @return A deep-copy of the given instance.
   */
  export function copy<Target extends Clonable>(toCopy: Conciliation<Target>): Target
  /**
   * Deep-copy an instance of a copiable class if it is defined.
   * 
   * If the value to copy is null or undefined, this function will return it as-is.
   *
   * @param toCopy - An instance of a copiable class to deep-copy, undefined, or null.
   *
   * @return A copy of the given instance if it is defined, the given parameter otherwise.
   */
  export function copy<Target extends Clonable>(toCopy: Conciliation<Target> | null | undefined): Target | null | undefined
  // Implementation.
  export function copy<Target extends Clonable>(toCopy: Conciliation<Target> | null | undefined): Target | null | undefined {
    return toCopy == null ? toCopy : toCopy.clone()
  }
}