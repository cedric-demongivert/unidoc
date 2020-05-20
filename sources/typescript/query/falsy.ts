/**
* A function that always return false.
*
* @param value - Any value.
*
* @return False.
*/
export function falsy (value : any) : boolean {
  return false
}

falsy.toString = function toString () : string {
  return 'falsy'
}
