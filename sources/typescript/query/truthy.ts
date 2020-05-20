/**
* A function that always return true.
*
* @param value - Any value.
*
* @return True.
*/
export function truthy (value : any) : boolean {
  return true
}

truthy.toString = function toString () : string {
  return 'truthy'
}
