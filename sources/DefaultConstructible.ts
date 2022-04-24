/**
 * A class of objects that can be instantiated without parameters.
 */
export interface DefaultConstructible {

}

/**
 * 
 */
export namespace DefaultConstructible {
  /**
   * 
   */
  export interface Constructor<Target> {
    /**
     * 
     */
    new(): Target
  }


  /**
   * Instantiates a default constructible object.
   * 
   * @parameter defaultConstructibleClass - A default constructible class.
   * 
   * @return An instance of the given class.
   */
  export function create<Target>(defaultConstructibleClass: Constructor<Target>): Target {
    return new defaultConstructibleClass()
  }
}