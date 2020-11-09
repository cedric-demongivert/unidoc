import { UnidocBlueprint } from './UnidocBlueprint'

export interface UnidocSequentialBlueprint extends UnidocBlueprint {
  /**
  * The blueprint that describe the content that must follow this one.
  */
  next: UnidocBlueprint

  /**
  * Update the blueprint that describe the content that must follow this one and
  * return the given instance.
  *
  * @param value - The new description of the content that must follow this one.
  *
  * @return The given parameter for chaining purposes.
  */
  then<T extends UnidocBlueprint>(value: T): T
}
