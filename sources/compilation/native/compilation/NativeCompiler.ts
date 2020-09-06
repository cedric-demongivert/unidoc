import { UnidocEvent } from '../../../event/UnidocEvent'

export interface NativeCompiler<T> {
  /**
  * Notify the begining of the stream of event that describe the document to
  * compile.
  */
  start () : void

  /**
  * Notify that a new event was published into the stream of event that describe
  * the document to compile.
  *
  * @param event - An event to process.
  */
  next (event : UnidocEvent) : void

  /**
  * Notify the termination of the stream of event that describe the document to
  * compile.
  */
  complete () : T

  /**
  * Update the state of this compiler toke make it as if the compiler was just
  * instantiated.
  */
  clear () : void
}

export namespace JSONCompiler {
}
