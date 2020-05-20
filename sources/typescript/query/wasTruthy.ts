/**
* Reduce the current state of a stream in such a way that the stream of outputs
* always return true after the first truthy value received.
*
* @param state - Initial state of the output stream.
* @param value - Received value.
*
* @return True if the input stream emitted a truthy value, false otherwise.
*/
export function wasTruthy (state : boolean, value : boolean) : boolean {
  return state || value
}

wasTruthy.toString = function toString () : string {
  return 'was truthy'
}
