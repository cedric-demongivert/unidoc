import { UnidocEvent } from '../event/UnidocEvent'

import { AtCompletion } from './AtCompletion'
import { Children } from './Children'
import { Conjunction } from './Conjunction'
import { Disjunction } from './Disjunction'
import { False } from './False'
import { HasMoreTagOfTypeThan } from './HasMoreTagOfTypeThan'
import { HasLessTagOfTypeThan } from './HasLessTagOfTypeThan'
import { HasOnlyTagsOfType } from './HasOnlyTagsOfType'
import { HasTagOfAnyType } from './HasTagOfAnyType'
import { HasTagOfType } from './HasTagOfType'
import { HasWhitespace } from './HasWhitespace'
import { HasWord } from './HasWord'
import { InTagOfType } from './InTagOfType'
import { Negation } from './Negation'
import { Sequence } from './Sequence'
import { This } from './This'
import { True } from './True'

export interface UnidocAssertion {
  /**
  * Return true if the assertion is truthy, false if the assertion is falsy.
  */
  readonly state : boolean

  /**
  * Handle the next available event.
  *
  * @param event - The next available event to handle.
  *
  * @return The resulting state of this assertion.
  */
  next (event : UnidocEvent) : boolean

  /**
  * Handle a stream of event completion.
  *
  * @return The resulting state of this assertion.
  */
  complete () : boolean

  /**
  * Reset this assertion.
  *
  * @return The resulting state of this assertion.
  */
  reset () : boolean

  /**
  * @return A deep-copy of this assertion.
  */
  clone () : UnidocAssertion

  /**
  * @see Object.toString
  */
  toString () : string
}

export namespace UnidocAssertion {
  export function and (...operands : UnidocAssertion[]) : Conjunction {
    return new Conjunction(operands)
  }

  export function or (...operands : UnidocAssertion[]) : Disjunction {
    return new Disjunction(operands)
  }

  export function then (...operands : UnidocAssertion[]) : Sequence {
    return new Sequence(operands)
  }

  export function not (operand : UnidocAssertion) : Negation {
    return new Negation(operand)
  }

  export function current (operand : UnidocAssertion) : This {
    return new This(operand)
  }

  export function children (operand : UnidocAssertion) : Children {
    return new Children(operand)
  }

  export function falsy () : False {
    return new False()
  }

  export function atCompletion (operand : UnidocAssertion) : AtCompletion {
    return new AtCompletion(operand)
  }

  export function hasLessTagOfTypeThan (type : string, ceil : number) : HasLessTagOfTypeThan {
    return new HasLessTagOfTypeThan(type, ceil)
  }

  export function hasMoreTagOfTypeThan (type : string, floor : number) : HasMoreTagOfTypeThan {
    return new HasMoreTagOfTypeThan(type, floor)
  }

  export function hasOnlyTagsOfType (types : Iterable<string>) : HasOnlyTagsOfType {
    return new HasOnlyTagsOfType(types)
  }

  export function hasTagOfAnyType () : HasTagOfAnyType {
    return new HasTagOfAnyType()
  }

  export function hasTagOfType (type : string) : HasTagOfType {
    return new HasTagOfType(type)
  }

  export function inTagOfType (type : string) : InTagOfType {
    return new InTagOfType(type)
  }

  export function hasWhitespace () : HasWhitespace {
    return new HasWhitespace()
  }

  export function hasWord () : HasWord {
    return new HasWord()
  }

  export function truthy () : True {
    return new True()
  }
}
