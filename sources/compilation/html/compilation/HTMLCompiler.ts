import { UnidocEvent } from '../../../event/UnidocEvent'

import { HTMLEvent } from '../event/HTMLEvent'

import { HTMLCompilerEventType } from './HTMLCompilerEventType'

export interface HTMLCompiler {
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
  complete () : void

  /**
  * Update the state of this compiler in order to reuse-it on another stream.
  */
  reset () : void

  /**
  * Update the state of this compiler toke make it as if the compiler was just
  * instantiated.
  */
  clear () : void

  /**
  * Add the given listener to this compiler set of listeners.
  *
  * @param type - Type of event to listen to.
  * @param listener - A listener to call then the given type of event happens.
  */
  addEventListener (type : 'content', listener : HTMLCompiler.ContentListener) : void
  addEventListener (type : 'completion', listener : HTMLCompiler.CompletionListener) : void
  addEventListener (type : 'error', listener : HTMLCompiler.ErrorListener) : void
  addEventListener (type : HTMLCompilerEventType, listener : any) : void

  /**
  * Remove a registered event listener.
  *
  * @param type - Type of event to stop to listen to.
  * @param listener - A listener to remove.
  */
  removeEventListener (type : 'token', listener : HTMLCompiler.ContentListener) : void
  removeEventListener (type : 'completion', listener : HTMLCompiler.CompletionListener) : void
  removeEventListener (type : 'error', listener : HTMLCompiler.ErrorListener) : void
  removeEventListener (type : HTMLCompilerEventType, listener : any) : void

  /**
  * Remove all registered listeners for the given event type.
  *
  * @param type - Type of event to stop to listen to.
  */
  clearEventListener (type : 'token') : void
  clearEventListener (type : 'completion') : void
  clearEventListener (type : 'error') : void
  clearEventListener (type : '*') : void
  clearEventListener (type : HTMLCompilerEventType | '*') : void
}

export namespace HTMLCompiler {
  export type ContentListener = (content : HTMLEvent) => void
  export type CompletionListener = () => void
  export type ErrorListener = (error : Error) => void
}
