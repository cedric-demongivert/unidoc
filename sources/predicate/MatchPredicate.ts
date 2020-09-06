import { Predicate } from './Predicate'

export class MatchPredicate implements Predicate<string> {
  public readonly regexp : RegExp

  public constructor (regexp : RegExp) {
    this.regexp = regexp
  }

  public validate (value : string) : boolean {
    return this.regexp.test(value)
  }

  public toString () : string {
    return '$match(' + this.regexp.toString() + ')'
  }
}
