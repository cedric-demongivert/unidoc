import { UnidocReduction } from './UnidocReduction'

/**
 *
 */
export function* assertSuccess(): UnidocReduction<void> {
  const current: UnidocReduction.Input = (yield UnidocReduction.CURRENT)

  if (!current.isSuccess()) {
    throw new Error(`Stream : expected to receive success, but received ${current.toString()}.`)
  }
}