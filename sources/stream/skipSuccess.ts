import { UnidocProducer } from "./UnidocProducer"
import { UnidocSuccessSkipper } from "./UnidocSuccessSkipper"

/**
 * 
 */
export function skipSuccess<Produce>(producer: UnidocProducer<Produce>): UnidocProducer<Produce> {
  const skipper: UnidocSuccessSkipper<Produce> = UnidocSuccessSkipper.create()

  skipper.subscribe(producer)

  return skipper
}