import { Clearable } from "./Clearable"
import { Clonable } from "./Clonable"
import { Comparable } from "./Comparable"
import { Copiable } from "./Copiable"
import { DataObject } from "./DataObject"
import { DefaultConstructible } from "./DefaultConstructible"

export interface UnidocBuilder<Value, Builder> extends Clearable, Clonable<Builder>, Comparable, Copiable<Builder | Value>, DefaultConstructible {
  /**
   * Build a new instance in accordance with the configuration of this builder.
   * 
   * @return A new instance in accordance with the configuration of this builder.
   */
  build(): Value

  /**
   * Return an underlying singleton instance that is equivalent to the configuration of this builder.
   * 
   * This method will not allocate any new memory, but may result in problems as the returned instance
   * must be always the same one.
   * 
   * @return An underlying singleton instance that is equivalent to the configuration of this builder.
   */
  get(): Value
}