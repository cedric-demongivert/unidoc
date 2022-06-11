import { UnidocReduction } from './UnidocReduction'

/**
 *
 */
export function* assertStartOfAnyTag(): UnidocReduction<void> {
  const current: UnidocReduction.Input = (yield UnidocReduction.CURRENT)

  current.assertNext()
  current.value.assertStartOfAnyTag()
}