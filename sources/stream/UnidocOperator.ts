import { UnidocProducer } from "./UnidocProducer"

/**
 * 
 */
export type UnidocOperator<Input, Output> = (input: UnidocProducer<Input>) => UnidocProducer<Output>

/**
 * 
 */
export namespace UnidocOperator {
  /**
   * 
   */
  export function identity<Input>(input: UnidocProducer<Input>): UnidocProducer<Input> {
    return input
  }
}