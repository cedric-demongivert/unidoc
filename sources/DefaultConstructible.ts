/**
 * A class that describe an object that can be instantiated without any parameter.
 * 
 * A default constructible class MUST define a constructor that can be called without any parameter.
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
   * Instantiate a default constructible object.
   * 
   * @parameter clazz - A default constructible class.
   * 
   * @return An instance of the given class.
   */
  export function create<Target>(clazz: Constructor<Target>): Target {
    return new clazz()
  }
}