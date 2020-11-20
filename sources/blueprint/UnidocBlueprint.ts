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
  export const anything = UnidocAnythingBlueprint.create
  export const end = UnidocEndBlueprint.create
  export const tagEnd = UnidocTagEndBlueprint.create
  export const tagStart = UnidocTagStartBlueprint.create
  export const whitespace = UnidocWhitespaceBlueprint.create
  export const word = UnidocWordBlueprint.create

  export function set(...elements: UnidocBlueprint[]): UnidocSetBlueprint {
    const result: UnidocSetBlueprint = UnidocSetBlueprint.create()

    if (elements.length > 0) {
      for (let index = 0; index < elements.length; ++index) {
        result.ofContent(elements[index])
      }
    }

    return result
  }

  export function many(element?: UnidocBlueprint): UnidocManyBlueprint {
    const result: UnidocManyBlueprint = UnidocManyBlueprint.create()

    if (element) {
      result.ofContent(element)
    }

    return result
  }

  export function optional(element?: UnidocBlueprint): UnidocManyBlueprint {
    const result: UnidocManyBlueprint = UnidocManyBlueprint.create()

    result.optional()

    if (element) {
      result.ofContent(element)
    }

    return result
  }

  export function any(...elements: UnidocBlueprint[]): UnidocAnyBlueprint {
    const result: UnidocAnyBlueprint = UnidocAnyBlueprint.create()

    if (elements.length > 0) {
      for (let index = 0; index < elements.length; ++index) {
        result.ofContent(elements[index])
      }
    }

    return result
  }

  export function sequence(): UnidocBlueprint
  export function sequence(...elements: UnidocSequentialBlueprint[]): UnidocSequentialBlueprint
  export function sequence(...elements: UnidocSequentialBlueprint[]): UnidocSequentialBlueprint | UnidocBlueprint {
    if (elements.length > 0) {
      const result: UnidocSequentialBlueprint = elements[0]

      for (let index = 1; index < elements.length; ++index) {
        UnidocSequentialBlueprint.last(elements[index - 1]).then(elements[index])
      }

      return result
    } else {
      return UnidocBlueprint.end()
    }
  }

  export namespace sequence {
    export function lenient(...elements: UnidocBlueprint[]): UnidocLenientSequenceBlueprint {
      const result: UnidocLenientSequenceBlueprint = UnidocLenientSequenceBlueprint.create()

      if (elements.length > 0) {
        for (let index = 0; index < elements.length; ++index) {
          result.ofContent(elements[index])
        }
      }

      return result
    }
  }
}
