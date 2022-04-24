/**
 * A class of objects that are comparable to other objects.
 */
export interface Comparable {
  /**
   * An equivalent to the Java Object.equals method :
   * 
   * Indicates whether some other object is "equal to" this one.
   * 
   * The equals method implements an equivalence relation on non-null object references:
   *   - It is reflexive: for any non-null reference value x, x.equals(x) should return true.
   *   - It is symmetric: for any non-null reference values x and y, x.equals(y) should return true if and only if y.equals(x) returns true.
   *   - It is transitive: for any non-null reference values x, y, and z, if x.equals(y) returns true and y.equals(z) returns true, then x.equals(z) should return true.
   *   - It is consistent: for any non-null reference values x and y, multiple invocations of x.equals(y) consistently return true or consistently return false, provided no information used in equals comparisons on the objects is modified.
   *   - For any non-null reference value x, x.equals(null) should return false.
   *   - For any non-null reference value x, x.equals(undefined) should return false.
   */
  equals(other: any): boolean
}

/**
 * 
 */
export namespace Comparable {
  /**
   * Compares a null or undefined reference with a reference to a comparable object.
   * 
   * @param left - A null or undefined reference.
   * @param right - A reference to a comparable object.
   * 
   * @return Always false.
   */
  export function equals(left: null | undefined, right: Comparable): false
  /**
   * Compares a reference to a comparable object with a null or undefined reference.
   * 
   * @param left - A reference to a comparable object.
   * @param right - A null or undefined reference.
   * 
   * @return Always false.
   */
  export function equals(left: Comparable, right: null | undefined): false
  /**
   * Compares a null reference with an undefined reference.
   * 
   * @param left - A null reference.
   * @param right - An undefined reference.
   * 
   * @return Always false.
   */
  export function equals(left: null, right: undefined): false
  /**
   * Compares an undefined reference with a null reference.
   * 
   * @param left - An undefined reference.
   * @param right - A null reference.
   * 
   * @return Always false.
   */
  export function equals(left: undefined, right: null): false
  /**
   * Compares two undefined references.
   * 
   * @param left - An undefined reference.
   * @param right - An undefined reference.
   * 
   * @return Always true.
   */
  export function equals(left: undefined, right: undefined): true
  /**
   * Compares two null references.
   * 
   * @param left - A null reference.
   * @param right - A null reference.
   * 
   * @return Always true.
   */
  export function equals(left: null, right: null): true
  /**
   * Returns true if the references refer to "equal" objects as defined by the Comparable.equals method.
   * 
   * If both operands are null or undefined references, this method will compare them with the strict equality operator.
   *
   * @param left - A reference to a comparable instance, or a null or undefined reference.
   * @param right - A reference to a comparable instance, or a null or undefined reference.
   *
   * @return True if the references refer to "equal" objects as defined by the Comparable.equals method.
   */
  export function equals(left: Comparable | null | undefined, right: Comparable | null | undefined): boolean
  export function equals(left: Comparable | null | undefined, right: Comparable | null | undefined): boolean {
    return left == null ? left === right : left.equals(right)
  }
}