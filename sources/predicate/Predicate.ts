import { OnlyPredicate } from './OnlyPredicate'
import { AnyPredicate } from './AnyPredicate'
import { AnythingPredicate } from './AnythingPredicate'
import { MatchPredicate } from './MatchPredicate'

export interface Predicate<T> {
  validate (value : T) : boolean
}

export namespace Predicate {
  export function only <T> (value : T) : Predicate<T> {
    return new OnlyPredicate(value)
  }

  export function any <T> (...values : T[]) : Predicate<T> {
    return new AnyPredicate(values)
  }

  export function anything <T> () : Predicate<T> {
    return AnythingPredicate.INSTANCE
  }

  export function match (regexp : RegExp) : Predicate<string> {
    return new MatchPredicate(regexp)
  }
}
