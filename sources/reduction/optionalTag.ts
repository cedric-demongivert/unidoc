import { UTF32String } from '../symbol'

import { UnidocReduction } from './UnidocReduction'
import { UnidocReducer } from './UnidocReducer'

import { reduceTag } from './reduceTag'

/**
 *
 */
export function* optionalTag<Product>(name: UTF32String, reducer: UnidocReducer<Product>): UnidocReduction<Product | null> {
  const current: UnidocReduction.Input = yield UnidocReduction.CURRENT

  if (!current.isNext() || !current.value.isStartOfAnyTag()) {
    return null
  }

  if (!current.value.symbols.equals(name)) {
    throw new Error(`Expected optional "${name.toString()}" tag, but received ${current.value.toString()}.`)
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
      throw new Error(`Expected optional "${name.toString()}" tag, but received ${current.value.toString()}.`)
    }

    return yield* reduceTag.content(reducer)
  }
}
