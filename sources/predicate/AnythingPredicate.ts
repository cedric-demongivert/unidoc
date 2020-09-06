import { Predicate } from './Predicate'

export class AnythingPredicate<T> implements Predicate<T> {
  public validate (value : T) : boolean {
    return true
  }

  public toString () : string {
    return '$anything'
  }
}

export namespace AnythingPredicate {
  export const INSTANCE : AnythingPredicate<any> = new AnythingPredicate()
}
