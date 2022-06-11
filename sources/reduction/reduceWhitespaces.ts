import { UTF32String } from '../symbol'

import { UnidocReduction } from './UnidocReduction'

/**
*
*/
export function* reduceWhitespaces(): UnidocReduction<string | null> {
  let current: UnidocReduction.Input = yield UnidocReduction.CURRENT

  if (!current.isNext() || !current.value.isWhitespace()) {
    return null
  }

  const buffer: UTF32String = UTF32String.DUPLICATOR.allocate()

  do {
    buffer.concat(current.value.symbols)
    current = yield UnidocReduction.NEXT
  } while ((current.isNext() && current.value.isWhitespace()))

  const result: string = buffer.toString()
  UTF32String.DUPLICATOR.free(buffer)
  return result
}