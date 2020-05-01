import { UnidocQuery } from './UnidocQuery'

export interface UnaryOperator<Input, Output> extends UnidocQuery<Output> {
  /**
  * Operand of this operator.
  */
  readonly operand : UnidocQuery<Input>
}
