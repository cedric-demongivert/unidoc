import { UnidocQuery } from './UnidocQuery'

export interface UnaryOperator<Input, Output> {
  /**
  * Operand of this operator.
  */
  readonly operand : UnidocQuery<Input, Output>
}
