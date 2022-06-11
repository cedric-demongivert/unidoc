import { UnidocReduction } from './UnidocReduction'

/**
 *
 */
export function* assertText(): UnidocReduction<void> {
  const current: UnidocReduction.Input = (yield UnidocReduction.CURRENT)

  if (!current.isNext()) {
    throw new Error(`Stream : expected to receive another element, but received ${current.toString()}.`)
  }

  if (!current.value.isText()) {
    throw new Error(`${current.value.stringifyLocation()} : expected to receive text, but received ${current.value.stringifyContent()}.`)
  }
}