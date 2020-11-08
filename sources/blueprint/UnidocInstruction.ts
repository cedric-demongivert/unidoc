import { UnidocInstructionType } from './UnidocInstructionType'

import { UnidocAnyInstruction } from './UnidocAnyInstruction'
import { UnidocEndInstruction } from './UnidocEndInstruction'
import { UnidocEndManyInstruction } from './UnidocEndManyInstruction'
import { UnidocStartManyInstruction } from './UnidocStartManyInstruction'
import { UnidocTagEndInstruction } from './UnidocTagEndInstruction'
import { UnidocTagStartInstruction } from './UnidocTagStartInstruction'
import { UnidocWhitespaceInstruction } from './UnidocWhitespaceInstruction'
import { UnidocWordInstruction } from './UnidocWordInstruction'

export interface UnidocInstruction {
  /**
  * The underlying type of this instruction.
  */
  readonly type: UnidocInstructionType

  /**
  * @see Object.equals
  */
  equals(other: any): boolean

  /**
  * @see Object.toString
  */
  toString(): string
}

export namespace UnidocInstruction {
  export type Any = UnidocAnyInstruction
  export type End = UnidocEndInstruction
  export type EndMany = UnidocEndManyInstruction
  export type StartMany = UnidocStartManyInstruction
  export type TagEnd = UnidocTagEndInstruction
  export type TagStart = UnidocTagStartInstruction
  export type Whitespace = UnidocWhitespaceInstruction
  export type Word = UnidocWordInstruction

  export const any = UnidocAnyInstruction.create
  export const end = UnidocEndInstruction.create
  export const endMany = UnidocEndManyInstruction.create
  export const startMany = UnidocStartManyInstruction.create
  export const tagEnd = UnidocTagEndInstruction.create
  export const tagStart = UnidocTagStartInstruction.create
  export const whitespace = UnidocWhitespaceInstruction.create
  export const word = UnidocWordInstruction.create
}
