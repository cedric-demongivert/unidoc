import { UnidocElement } from '../stream'

import { UnidocReduction } from './UnidocReduction'
import { UnidocReducer } from './UnidocReducer'

/**
*
*/
export function* reduceTag<Product>(reducer: UnidocReducer<Product>): UnidocReduction<Product | null> {
  let current: UnidocReduction.Input = yield UnidocReduction.CURRENT

  if (!current.isNext() || !current.value.isStartOfAnyTag()) {
    return null
  }

  const reduction: UnidocReduction<Product> = reducer()
  const depth: number = current.value.path.size

  let result: UnidocReduction.Result<Product> = UnidocReduction.push(UnidocElement.start(), reduction)

  do {
    if (!result.done) result = UnidocReduction.push(current, reduction)

    current = yield UnidocReduction.NEXT
  } while (current.isNext() && current.value.path.size > depth)

  if (!result.done) result = UnidocReduction.push(current, reduction)

  if (!current.isTermination()) {
    yield UnidocReduction.NEXT
    if (!result.done) result = UnidocReduction.push(UnidocElement.success(), reduction)
  }

  if (!result.done) {
    throw new Error(
      `Unable to finalize the reduction of a tag because the underlying process as not finished yet, ` +
      `please look at your reducer logic, all reducers must stop after the reception of a success event.`
    )
  }

  return result.value
}

/**
*
*/
export namespace reduceTag {
  /**
  *
  */
  export function* content<Product>(reducer: UnidocReducer<Product>): UnidocReduction<Product | null> {
    let current: UnidocReduction.Input = yield UnidocReduction.CURRENT

    if (!current.isNext() || !current.value.isStartOfAnyTag()) {
      return null
    }

    const reduction: UnidocReduction<Product> = reducer()
    const depth: number = current.value.path.size

    let result: UnidocReduction.Result<Product> = UnidocReduction.push(UnidocElement.start(), reduction)
    current = yield UnidocReduction.NEXT

    while (current.isNext() && current.value.path.size > depth) {
      if (!result.done) result = UnidocReduction.push(current, reduction)

      current = yield UnidocReduction.NEXT
    }

    if (!current.isTermination()) {
      yield UnidocReduction.NEXT
      if (!result.done) result = UnidocReduction.push(UnidocElement.success(), reduction)
    }

    if (!result.done) {
      throw new Error(
        `Unable to finalize the reduction of a tag because the underlying process as not finished yet, ` +
        `please look at your reducer logic, all reducers must stop after the reception of a success event.`
      )
    }

    return result.value
  }
}
