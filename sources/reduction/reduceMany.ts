import { UnidocReducer } from './UnidocReducer'
import { UnidocReduction } from './UnidocReduction'

/**
*
*/
export function* reduceMany<Product>(reducer: UnidocReducer<Product | null>): UnidocReduction<Array<Product>> {
  const result: Array<Product> = []

  while (true) {
    const next: Product | null = yield* reducer()

    if (next === null) {
      return result
    }

    result.push(next)
  }
}
