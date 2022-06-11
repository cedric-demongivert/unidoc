import { UTF32String } from '../symbol'

import { UnidocReduction } from './UnidocReduction'

/**
*
*/
export function* reduceToken(): UnidocReduction<string | null> {
  let current: UnidocReduction.Input = yield UnidocReduction.CURRENT

  while (current.isNext() && current.value.isWhitespace()) {
    current = yield UnidocReduction.NEXT
  }

  if (!current.isNext() || !current.value.isWord()) {
    return null
  }

  const buffer: UTF32String = UTF32String.DUPLICATOR.allocate()

  do {
    buffer.concat(current.value.symbols)
    current = yield UnidocReduction.NEXT
  } while ((current.isNext() && current.value.isWord()))

  const result: string = buffer.toString()
  UTF32String.DUPLICATOR.free(buffer)
  return result
}