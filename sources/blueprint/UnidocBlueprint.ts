import { UnidocBlueprintType } from './UnidocBlueprintType'

import { UnidocAnyBlueprint } from './UnidocAnyBlueprint'
import { UnidocAnythingBlueprint } from './UnidocAnythingBlueprint'
import { UnidocEndBlueprint } from './UnidocEndBlueprint'
import { UnidocLenientSequenceBlueprint } from './UnidocLenientSequenceBlueprint'
import { UnidocManyBlueprint } from './UnidocManyBlueprint'
import { UnidocSetBlueprint } from './UnidocSetBlueprint'
import { UnidocTagEndBlueprint } from './UnidocTagEndBlueprint'
import { UnidocTagStartBlueprint } from './UnidocTagStartBlueprint'
import { UnidocWhitespaceBlueprint } from './UnidocWhitespaceBlueprint'
import { UnidocWordBlueprint } from './UnidocWordBlueprint'

/**
* A blueprint is a specification that describe a class of unidoc document.
*/
export interface UnidocBlueprint {
  /**
  * A number that identify the type of this blueprint.
  */
  readonly type: UnidocBlueprintType
}

export namespace UnidocBlueprint {
  export type Any = UnidocAnyBlueprint
  export type Anything = UnidocAnythingBlueprint
  export type End = UnidocEndBlueprint
  export type LenientSequence = UnidocLenientSequenceBlueprint
  export type Many = UnidocManyBlueprint
  export type Set = UnidocSetBlueprint
  export type TagEnd = UnidocTagEndBlueprint
  export type TagStart = UnidocTagStartBlueprint
  export type Whitespace = UnidocWhitespaceBlueprint
  export type Word = UnidocWordBlueprint

  export const any = UnidocAnyBlueprint.create
  export const anything = UnidocAnythingBlueprint.create
  export const end = UnidocEndBlueprint.create
  export const lienientSequence = UnidocLenientSequenceBlueprint.create
  export const many = UnidocManyBlueprint.create
  export const set = UnidocSetBlueprint.create
  export const tagEnd = UnidocTagEndBlueprint.create
  export const tagStart = UnidocTagStartBlueprint.create
  export const whitespace = UnidocWhitespaceBlueprint.create
  export const word = UnidocWordBlueprint.create
}
