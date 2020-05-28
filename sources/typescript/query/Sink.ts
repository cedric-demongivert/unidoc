export interface Sink<Type> {
  /**
  * Called at the begining of the stream of values.
  */
  start () : void

  /**
  * Called with the next value available in the stream.
  *
  * @param value - The next available value in the stream.
  */
  next (value : Type) : void

  /**
  * Called when an error is raised.
  *
  * @param error - The error that was raised.
  */
  error (error : Error) : void

  /**
  * Called when the stream of values is complete.
  */
  complete () : void
}

export namespace Sink {
  export const NONE : Sink<any> = {
    start () : void {},
    next (value : any) : void {},
    error (error : Error) : void {},
    complete () : void {}
  }

  export const CONSOLE : Sink<any> = {
    start () : void { console.log(':start') },
    next (value : any) : void { console.log(value) },
    error (error : Error) : void { console.error(error) },
    complete () : void { console.log(':end') }
  }
}
