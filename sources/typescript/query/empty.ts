/**
* A function that always return null.
*
* @param value - Any value.
*
* @return False.
*/
export function empty <Output> (value : any) : Output {
  return null
}

empty.toString = function toString () : string {
  return 'none'
}
