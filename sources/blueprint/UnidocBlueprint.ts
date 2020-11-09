import { UnidocBlueprintType } from './UnidocBlueprintType'

import { UnidocAnyBlueprint } from './UnidocAnyBlueprint'
import { UnidocEndBlueprint } from './UnidocEndBlueprint'
import { UnidocManyBlueprint } from './UnidocManyBlueprint'
import { UnidocTagEndBlueprint } from './UnidocTagEndBlueprint'
import { UnidocTagStartBlueprint } from './UnidocTagStartBlueprint'
import { UnidocWhitespaceBlueprint } from './UnidocWhitespaceBlueprint'
import { UnidocWordBlueprint } from './UnidocWordBlueprint'

export interface UnidocBlueprint {
  /**
  * The underlying type of this instruction.
  */
  readonly type: UnidocBlueprintType
}

export namespace UnidocBlueprint {
  export type Any = UnidocAnyBlueprint
  export type End = UnidocEndBlueprint
  export type Many = UnidocManyBlueprint
  export type TagEnd = UnidocTagEndBlueprint
  export type TagStart = UnidocTagStartBlueprint
  export type Whitespace = UnidocWhitespaceBlueprint
  export type Word = UnidocWordBlueprint

  export const any = UnidocAnyBlueprint.create
  export const end = UnidocEndBlueprint.create
  export const many = UnidocManyBlueprint.create
  export const tagEnd = UnidocTagEndBlueprint.create
  export const tagStart = UnidocTagStartBlueprint.create
  export const whitespace = UnidocWhitespaceBlueprint.create
  export const word = UnidocWordBlueprint.create
}
