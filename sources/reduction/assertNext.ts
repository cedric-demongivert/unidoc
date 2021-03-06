import { UnidocReduction } from './UnidocReduction'

/**
 *
 */
export function* assertNext(): UnidocReduction<void> {
  const current: UnidocReduction.Input = (yield UnidocReduction.CURRENT)

  if (!current.isNext()) {
    throw new Error(`Stream : expected to receive another element, but received ${current.toString()}.`)
  }
}