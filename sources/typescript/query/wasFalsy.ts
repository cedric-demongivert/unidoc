/**
* Reduce the current state of a stream in such a way that the stream of outputs
* always return true after the first falsy value received.
*
* @param state - Current state of the output stream.
* @param value - Received value.
*
* @return True if the input stream emitted a falsy value, false otherwise.
*/
export function wasFalsy (state : boolean, value : boolean) : boolean {
  return state || !value
}

wasFalsy.toString = function toString () : string {
  return 'was falsy'
}
