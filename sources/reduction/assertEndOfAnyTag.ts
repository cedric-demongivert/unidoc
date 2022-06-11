import { UnidocReduction } from './UnidocReduction'

/**
 *
 */
export function* assertEndOfAnyTag(): UnidocReduction<void> {
  const current: UnidocReduction.Input = (yield UnidocReduction.CURRENT)

  if (!current.isNext()) {
    throw new Error(`Stream : expected to receive another element, but received ${current.toString()}.`)
  }

  if (!current.value.isEndOfAnyTag()) {
    throw new Error(`${current.value.stringifyLocation()} : expected to receive end of any tag, but received ${current.value.stringifyContent()}.`)
  }

  current.value.assertEndOfAnyTag()
}