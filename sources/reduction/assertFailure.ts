import { UnidocReduction } from './UnidocReduction'

/**
 *
 */
export function* assertFailure(): UnidocReduction<void> {
  const current: UnidocReduction.Input = (yield UnidocReduction.CURRENT)

  if (!current.isFailure()) {
    throw new Error(`Stream : expected to receive failure, but received ${current.toString()}.`)
  }
}