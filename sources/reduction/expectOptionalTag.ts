import { UTF32String } from '../symbol'

import { UnidocReduction } from './UnidocReduction'
import { UnidocReducer } from './UnidocReducer'

import { reduceTag } from './reduceTag'

/**
 *
 */
export function* expectOptionalTag<Product>(name: UTF32String, reducer: UnidocReducer<Product>): UnidocReduction<Product | null> {
  const current: UnidocReduction.Input = yield UnidocReduction.CURRENT

  if (!current.isNext() || !current.value.isStartOfAnyTag()) {
    return null
  }

  if (!current.value.symbols.equals(name)) {
    throw new Error(
      `${current.value.stringifyLocation()} : expected optional "${name.toString()}" tag, ` +
      `but received "${current.value.symbols.toString()}" tag.`
    )
  }

  return yield* reduceTag(reducer)
}

/**
 *
 */
export namespace optionalTag {
  /**
   *
   */
  export function* content<Product>(name: UTF32String, reducer: UnidocReducer<Product>): UnidocReduction<Product | null> {
    const current: UnidocReduction.Input = yield UnidocReduction.CURRENT

    if (!current.isNext() || !current.value.isStartOfAnyTag()) {
      return null
    }

    if (!current.value.symbols.equals(name)) {
      throw new Error(
        `${current.value.stringifyLocation()} : expected optional "${name.toString()}" tag, ` +
        `but received "${current.value.symbols.toString()}" tag.`
      )
    }

    return yield* reduceTag.content(reducer)
  }
}
