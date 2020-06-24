import { HTMLEvent } from '../event/HTMLEvent'

import { HTMLFormatterEventType } from './HTMLFormatterEventType'

export interface HTMLFormatter {
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
  next (event : HTMLEvent) : void

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
  addEventListener (type : 'content', listener : HTMLFormatter.ContentListener) : void
  addEventListener (type : 'completion', listener : HTMLFormatter.CompletionListener) : void
  addEventListener (type : 'error', listener : HTMLFormatter.ErrorListener) : void
  addEventListener (type : HTMLFormatterEventType, listener : any) : void

  /**
  * Remove a registered event listener.
  *
  * @param type - Type of event to stop to listen to.
  * @param listener - A listener to remove.
  */
  removeEventListener (type : 'token', listener : HTMLFormatter.ContentListener) : void
  removeEventListener (type : 'completion', listener : HTMLFormatter.CompletionListener) : void
  removeEventListener (type : 'error', listener : HTMLFormatter.ErrorListener) : void
  removeEventListener (type : HTMLFormatterEventType, listener : any) : void

  /**
  * Remove all registered listeners for the given event type.
  *
  * @param type - Type of event to stop to listen to.
  */
  clearEventListener (type : 'token') : void
  clearEventListener (type : 'completion') : void
  clearEventListener (type : 'error') : void
  clearEventListener (type : '*') : void
  clearEventListener (type : HTMLFormatterEventType | '*') : void
}

export namespace HTMLFormatter {
  export type ContentListener = (content : string) => void
  export type CompletionListener = () => void
  export type ErrorListener = (error : Error) => void
}
