import { UnidocBlueprint } from './UnidocBlueprint'

export interface UnidocSequentialBlueprint extends UnidocBlueprint {
  /**
  * The blueprint that describe the content that must follow this one.
  */
  next: UnidocBlueprint

  /**
  * Update the blueprint that describe the content that must follow this one and
  * return this instance for chaining purposes.
  *
  * @param value - The new description of the content that must follow this one.
  *
  * @return This blueprint instance for chaining purposes.
  */
  then(value: UnidocBlueprint): UnidocSequentialBlueprint
}
