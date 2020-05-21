export function identity <Input> (value : Input) : Input {
  return value
}

identity.toString = function toString () : string {
  return 'identity'
}
