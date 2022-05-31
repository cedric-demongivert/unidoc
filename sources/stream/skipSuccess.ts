import { UnidocProducer } from "./UnidocProducer"
import { UnidocSuccessSkipper } from "./UnidocSuccessSkipper"

/**
 * 
 */
export function skipSuccess<Product>(producer: UnidocProducer<Product>): UnidocProducer<Product> {
  const skipper: UnidocSuccessSkipper<Product> = UnidocSuccessSkipper.create()

  skipper.subscribe(producer)

  return skipper
}