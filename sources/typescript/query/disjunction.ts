export function disjunction (values : Iterable<boolean>) : boolean {
  for (let value of values) {
    if (value === true) {
      return true
    }
  }

  return false
}

disjunction.toString = function toString () : string {
  return 'or'
}
