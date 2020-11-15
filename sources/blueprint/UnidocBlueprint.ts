import { UnidocBlueprintType } from './UnidocBlueprintType'

import { UnidocAnyBlueprint } from './UnidocAnyBlueprint'
import { UnidocAnythingBlueprint } from './UnidocAnythingBlueprint'
import { UnidocEndBlueprint } from './UnidocEndBlueprint'
import { UnidocLenientSequenceBlueprint } from './UnidocLenientSequenceBlueprint'
import { UnidocManyBlueprint } from './UnidocManyBlueprint'
import { UnidocSetBlueprint } from './UnidocSetBlueprint'
import { UnidocTagBlueprint } from './UnidocTagBlueprint'
import { UnidocTagEndBlueprint } from './UnidocTagEndBlueprint'
import { UnidocTagStartBlueprint } from './UnidocTagStartBlueprint'
import { UnidocWhitespaceBlueprint } from './UnidocWhitespaceBlueprint'
import { UnidocWordBlueprint } from './UnidocWordBlueprint'
import { UnidocSequentialBlueprint } from './UnidocSequentialBlueprint'

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
  export type Tag = UnidocTagBlueprint
  export type TagEnd = UnidocTagEndBlueprint
  export type TagStart = UnidocTagStartBlueprint
  export type Whitespace = UnidocWhitespaceBlueprint
  export type Word = UnidocWordBlueprint

  export const tag = UnidocTagBlueprint.create
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

  export function sequence(): UnidocBlueprint
  export function sequence(...elements: UnidocSequentialBlueprint[]): UnidocSequentialBlueprint
  export function sequence(...elements: UnidocSequentialBlueprint[]): UnidocSequentialBlueprint | UnidocBlueprint {
    if (elements.length > 0) {
      const result: UnidocSequentialBlueprint = elements[0]

      for (let index = 1; index < elements.length; ++index) {
        elements[index - 1].then(elements[index])
      }

      return result
    } else {
      return UnidocBlueprint.end()
    }
  }
}
