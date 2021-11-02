/**
 * A class that describe instances that can be compared to any type of object.
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
   * 
   * The equals method for class Object implements the most discriminating possible equivalence relation on objects; that is, for any non-null
   * reference values x and y, this method returns true if and only if x and y refer to the same object (x == y has the value true).
   */
  equals(other: any): boolean
}

/**
 * 
 */
export namespace Comparable {
  /**
   * Special case. 
   */
  export function equals(left: null | undefined, right: Comparable): false
  /**
   * Special case. 
   */
  export function equals(left: Comparable, right: null | undefined): false
  /**
   * Special case. 
   */
  export function equals(left: null, right: undefined): false
  /**
   * Special case. 
   */
  export function equals(left: undefined, right: null): false
  /**
   * Special case. 
   */
  export function equals(left: undefined, right: undefined): true
  /**
   * Special case. 
   */
  export function equals(left: null, right: null): true
  /**
   * Return true if the given comparable instances are equals.
   * 
   * If both left and right are nullable values, the comparison will 
   * be made with the strict equality operator.
   *
   * @param left - The comparable instance to use as a left operand, or a null value.
   * @param right - The comparable instance to use as a right operand, or a null value.
   *
   * @return True if both operands are equals.
   */
  export function equals(left: Comparable | null | undefined, right: Comparable | null | undefined): boolean
  // Implementation
  export function equals(left: Comparable | null | undefined, right: Comparable | null | undefined): boolean {
    return left == null ? left === right : left.equals(right)
  }
}