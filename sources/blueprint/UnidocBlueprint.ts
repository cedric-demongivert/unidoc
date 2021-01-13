import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocSelector } from '../selector/UnidocSelector'
import { UnidocPredicate } from '../predicate/UnidocPredicate'

import { UnidocBlueprintType } from './UnidocBlueprintType'

import { UnidocDisjunctionBlueprint } from './UnidocDisjunctionBlueprint'
import { UnidocEndBlueprint } from './UnidocEndBlueprint'
import { UnidocEventBlueprint } from './UnidocEventBlueprint'
import { UnidocGroupBlueprint } from './UnidocGroupBlueprint'
import { UnidocLenientSequenceBlueprint } from './UnidocLenientSequenceBlueprint'
import { UnidocManyBlueprint } from './UnidocManyBlueprint'
import { UnidocSequenceBlueprint } from './UnidocSequenceBlueprint'
import { UnidocSetBlueprint } from './UnidocSetBlueprint'
import { UnidocTagBlueprint } from './UnidocTagBlueprint'

/**
* An unidoc document is a sequence of zero or more unidoc events. In other
* words, an unidoc document $d$ of length $n \in \setN$ is a sequence
* $d = (e_1, e_2, ..., e_n) \in \setE^n$ with $\setE$ the set of all possible
* unidoc events.
*
* We call $\setD$ the set of all possible unidoc document.
*
* We call a specification $s$ any application from the set of all possible
* unidoc document $\setD$ to the set of boolean values.
*
* We say that a specification $s$ match an unidoc document $d \in \setD$ or that
* an unidoc document $d \in \setD$ match a specification $s$ when $s(d) = true$.
*
* A class of unidoc document $C \subset \setD$ in respect to a specification $s$
* is the set that contains each unidoc document of $\setD$ that match $s$.
*
* A blueprint is the description of a specification, in other words, a blueprint
* is an application from an arbitrary set of values to the set of all possible
* unidoc specification.
*/
export interface UnidocBlueprint {
  /**
  * A number that identify the type of this blueprint.
  */
  readonly type: UnidocBlueprintType

  /**
  * @see Object.equals
  */
  equals(other: any, visited: Set<UnidocBlueprint>): boolean

  /**
  * @see Object.toString
  */
  toString(maxDepth?: number, visited?: Map<UnidocBlueprint, string>): string
}

export namespace UnidocBlueprint {
  /**
  *
  */
  export type Disjunction = UnidocDisjunctionBlueprint

  /**
  *
  */
  export type End = UnidocEndBlueprint

  /**
  *
  */
  export type Event = UnidocEventBlueprint

  /**
  *
  */
  export type LenientSequence = UnidocLenientSequenceBlueprint

  /**
  *
  */
  export type Many = UnidocManyBlueprint

  /**
  *
  */
  export type Sequence = UnidocSequenceBlueprint

  /**
  *
  */
  export type Set = UnidocSetBlueprint

  /**
  *
  */
  export type Tag = UnidocTagBlueprint

  /**
  *
  */
  export type Group = UnidocGroupBlueprint

  /**
  *
  */
  export function disjunction(...operands: UnidocBlueprint[]): UnidocDisjunctionBlueprint {
    const result: UnidocDisjunctionBlueprint = UnidocDisjunctionBlueprint.create()

    if (operands) {
      for (const operand of operands) {
        result.or(operand)
      }
    }

    return result
  }

  /**
  *
  */
  export const end = UnidocEndBlueprint.create

  /**
  *
  */
  export function event(predicate?: UnidocPredicate<UnidocEvent>): UnidocEventBlueprint {
    const result: UnidocEventBlueprint = UnidocEventBlueprint.create()

    if (predicate) result.thatMatch(predicate)

    return result
  }

  /**
  *
  */
  export function many(operand?: UnidocBlueprint): UnidocManyBlueprint {
    const result: UnidocManyBlueprint = UnidocManyBlueprint.create()

    if (operand) result.of(operand)

    return result
  }



  /**
  *
  */
  export function group(group: any, operand?: UnidocBlueprint): UnidocGroupBlueprint {
    const result: UnidocGroupBlueprint = UnidocGroupBlueprint.create()

    result.as(group)
    if (operand) result.of(operand)

    return result
  }

  /**
  *
  */
  export function optional(operand?: UnidocBlueprint): UnidocManyBlueprint {
    const result: UnidocManyBlueprint = UnidocManyBlueprint.create()

    result.optional()

    if (operand) result.of(operand)

    return result
  }

  /**
  *
  */
  export function sequence(...operands: UnidocBlueprint[]): UnidocSequenceBlueprint {
    const result: UnidocSequenceBlueprint = UnidocSequenceBlueprint.create()

    if (operands) {
      for (const operand of operands) {
        result.then(operand)
      }
    }

    return result
  }

  export namespace sequence {
    /**
    *
    */
    export function lenient(...operands: UnidocBlueprint[]): UnidocLenientSequenceBlueprint {
      const result: UnidocLenientSequenceBlueprint = UnidocLenientSequenceBlueprint.create()

      if (operands) {
        for (const operand of operands) {
          result.then(operand)
        }
      }

      return result
    }
  }

  /**
  *
  */
  export function set(...operands: UnidocBlueprint[]): UnidocSetBlueprint {
    const result: UnidocSetBlueprint = UnidocSetBlueprint.create()

    if (operands) {
      for (const operand of operands) {
        result.with(operand)
      }
    }

    return result
  }

  /**
  *
  */
  export const tag = UnidocTagBlueprint.create

  export function tagStart(parameter: string | UnidocPredicate<string>): UnidocBlueprint {
    return event(
      UnidocPredicate.and(
        UnidocPredicate.isTagStart(),
        UnidocPredicate.is(
          UnidocSelector.tagName(),
          typeof parameter === 'string' ? UnidocPredicate.only(parameter) : parameter
        )
      )
    )
  }

  export function tagEnd(parameter: string | UnidocPredicate<string>): UnidocBlueprint {
    return event(
      UnidocPredicate.and(
        UnidocPredicate.isTagEnd(),
        UnidocPredicate.is(
          UnidocSelector.tagName(),
          typeof parameter === 'string' ? UnidocPredicate.only(parameter) : parameter
        )
      )
    )
  }

  const WORD: UnidocBlueprint = event(UnidocPredicate.isWord())
  const WHITESPACE: UnidocBlueprint = event(UnidocPredicate.isWhitespace())
  const WHITESPACES: UnidocBlueprint = UnidocBlueprint.many(WHITESPACE)

  export function word(): UnidocBlueprint {
    return WORD
  }

  export function whitespace(): UnidocBlueprint {
    return WHITESPACE
  }

  export function whitespaces(): UnidocBlueprint {
    return WHITESPACES
  }

  export function whitespaced(content: UnidocBlueprint): UnidocBlueprint {
    return UnidocBlueprint.sequence(
      WHITESPACES,
      content,
      WHITESPACES
    )
  }

  export namespace whitespaced {
    export function head(content: UnidocBlueprint): UnidocBlueprint {
      return UnidocBlueprint.sequence(
        WHITESPACES,
        content
      )
    }

    export function tail(content: UnidocBlueprint): UnidocBlueprint {
      return UnidocBlueprint.sequence(
        content,
        WHITESPACES
      )
    }

    /**
    *
    */
    export function disjunction(...operands: UnidocBlueprint[]): UnidocBlueprint {
      const result: UnidocDisjunctionBlueprint = UnidocDisjunctionBlueprint.create()

      if (operands) {
        for (const operand of operands) {
          result.or(operand)
        }
      }

      return UnidocBlueprint.sequence(
        WHITESPACES,
        result
      )
    }

    /**
    *
    */
    export function many(operand: UnidocBlueprint): UnidocBlueprint {
      const result: UnidocManyBlueprint = UnidocManyBlueprint.create()

      if (operand) {
        result.of(
          UnidocBlueprint.sequence(
            WHITESPACES,
            operand
          )
        )
      }

      return result
    }

    /**
    *
    */
    export function optional(operand: UnidocBlueprint): UnidocBlueprint {
      const result: UnidocManyBlueprint = UnidocManyBlueprint.create()

      result.optional()

      if (operand) {
        result.of(
          UnidocBlueprint.sequence(
            WHITESPACES,
            operand
          )
        )
      }

      return result
    }

    /**
    *
    */
    export function sequence(...operands: UnidocBlueprint[]): UnidocBlueprint {
      const result: UnidocSequenceBlueprint = UnidocSequenceBlueprint.create()

      if (operands) {
        for (const operand of operands) {
          result.then(
            UnidocBlueprint.sequence(
              WHITESPACES,
              operand
            )
          )
        }
      }

      return result
    }

    export namespace sequence {
      /**
      *
      */
      export function lenient(...operands: UnidocBlueprint[]): UnidocBlueprint {
        const result: UnidocLenientSequenceBlueprint = UnidocLenientSequenceBlueprint.create()

        if (operands) {
          for (const operand of operands) {
            result.then(
              UnidocBlueprint.sequence(
                WHITESPACES,
                operand
              )
            )
          }
        }

        return result
      }
    }

    /**
    *
    */
    export function set(...operands: UnidocBlueprint[]): UnidocBlueprint {
      const result: UnidocSetBlueprint = UnidocSetBlueprint.create()

      if (operands) {
        for (const operand of operands) {
          result.with(
            UnidocBlueprint.sequence(
              WHITESPACES,
              operand
            )
          )
        }
      }

      return result
    }
  }
}
