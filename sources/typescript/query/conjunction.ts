export function conjunction (values : Iterable<boolean>) : boolean {
  for (let value of values) {
    if (value === false) {
      return false
    }
  }

  return true
}

conjunction.toString = function toString () : string {
  return 'and'
}
