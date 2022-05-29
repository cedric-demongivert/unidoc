/**
 * 
 */
export interface Assignable<Source> {
  /**
   * 
   */
  copy(toCopy: Source): this
}

/**
 * 
 */
export namespace Assignable {
  /**
   * 
   */
  export function assign<Source, Target extends Assignable<Source>>(origin: Source, destination: Target): Target {
    return destination.copy(origin)
  }
}