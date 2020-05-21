export namespace clone {
  export interface Clonable<T> {
    clone () : T
  }
}

export function clone <Input extends clone.Clonable<Input>> (clone : Input) : Input {
  return clone.clone()
}

clone.toString = function toString () : string {
  return 'clone'
}
