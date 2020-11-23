import { UnidocSelector } from '../selector/UnidocSelector'
import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocOnlyPredicate } from './UnidocOnlyPredicate'
import { UnidocAnyPredicate } from './UnidocAnyPredicate'
import { UnidocAnythingPredicate } from './UnidocAnythingPredicate'
import { UnidocMatchPredicate } from './UnidocMatchPredicate'
import { UnidocSelectionPredicate } from './UnidocSelectionPredicate'
import { UnidocConjunctionPredicate } from './UnidocConjunctionPredicate'
import { UnidocIsTagStartPredicate } from './UnidocIsTagStartPredicate'
import { UnidocIsTagEndPredicate } from './UnidocIsTagEndPredicate'
import { UnidocIsWordPredicate } from './UnidocIsWordPredicate'
import { UnidocIsWhitespacePredicate } from './UnidocIsWhitespacePredicate'

/**
*
*/
export interface UnidocPredicate<T> {
  /**
  *
  */
  test(value: T): boolean

  /**
  * @see Object.equals
  */
  equals(other: any): boolean

  /**
  * @see Object.toString
  */
  toString(): string
}

export namespace UnidocPredicate {
  /**
  *
  */
  export function is<Input, Output>(selector: UnidocSelector<Input, Output>, predicate: UnidocPredicate<Output>): UnidocPredicate<Input> {
    return new UnidocSelectionPredicate(selector, predicate)
  }

  /**
  *
  */
  export function isWhitespace(): UnidocPredicate<UnidocEvent> {
    return UnidocIsWhitespacePredicate.create()
  }

  /**
  *
  */
  export function isWord(): UnidocPredicate<UnidocEvent> {
    return UnidocIsWordPredicate.create()
  }

  /**
  *
  */
  export function isTagStart(): UnidocPredicate<UnidocEvent> {
    return UnidocIsTagStartPredicate.create()
  }

  /**
  *
  */
  export function isTagEnd(): UnidocPredicate<UnidocEvent> {
    return UnidocIsTagEndPredicate.create()
  }

  /**
  *
  */
  export function and<T>(...predicates: UnidocPredicate<T>[]): UnidocPredicate<T> {
    return new UnidocConjunctionPredicate(predicates)
  }

  /**
  *
  */
  export function only<T>(value: T): UnidocPredicate<T> {
    return new UnidocOnlyPredicate(value)
  }

  /**
  *
  */
  export function any<T>(...values: T[]): UnidocPredicate<T> {
    return new UnidocAnyPredicate(values)
  }

  /**
  *
  */
  export function anything<T>(): UnidocPredicate<T> {
    return UnidocAnythingPredicate.INSTANCE
  }

  /**
  *
  */
  export function match(regexp: RegExp): UnidocPredicate<string> {
    return new UnidocMatchPredicate(regexp)
  }
}
