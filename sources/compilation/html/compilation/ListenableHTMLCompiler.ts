import { UnidocEvent } from '../../../event/UnidocEvent'

import { HTMLEvent } from '../event/HTMLEvent'

import { HTMLCompilerEventType } from './HTMLCompilerEventType'
import { HTMLCompiler } from './HTMLCompiler'

export abstract class ListenableHTMLCompiler implements HTMLCompiler {
  /**
  * A set of listeners of the 'content' event.
  */
  private _contentListeners : Set<HTMLCompiler.ContentListener>

  /**
  * A set of listeners of the 'completion' event.
  */
  private _completionListeners : Set<HTMLCompiler.CompletionListener>

  /**
  * A set of listeners of the 'error' event.
  */
  private _errorListeners : Set<HTMLCompiler.ErrorListener>

  public constructor () {
    this._contentListeners = new Set<HTMLCompiler.ContentListener>()
    this._completionListeners = new Set<HTMLCompiler.CompletionListener>()
    this._errorListeners = new Set<HTMLCompiler.ErrorListener>()
  }

  /**
  * @see HTMLCompiler.start
  */
  public abstract start () : void

  /**
  * @see HTMLCompiler.next
  */
  public abstract next (event : UnidocEvent) : void

  /**
  * @see HTMLCompiler.complete
  */
  public abstract complete () : void

  /**
  * @see HTMLCompiler.reset
  */
  public abstract reset () : void

  /**
  * Publish a fragment of the resulting HTML document to this compiler
  * registered listeners.
  *
  * @param content - The fragment of symbols to publish.
  */
  protected publish (content : HTMLEvent) : void {
    for (const listener of this._contentListeners) {
      listener(content)
    }
  }

  /**
  * Publish an error to this compiler registered listeners.
  *
  * @param error - The error to publish.
  */
  protected publishError (error : Error) : void {
    for (const listener of this._errorListeners) {
      listener(error)
    }
  }

  /**
  * Publish a completion event to this compiler registered listeners.
  */
  protected publishCompletion () : void {
    for (const listener of this._completionListeners) {
      listener()
    }
  }

  /**
  * @see HTMLCompiler.clear
  */
  public clear () : void {
    this.clearEventListener('*')
  }

  /**
  * @see HTMLCompiler.addEventListener
  */
  public addEventListener (type : 'content', listener : HTMLCompiler.ContentListener) : void
  public addEventListener (type : 'completion', listener : HTMLCompiler.CompletionListener) : void
  public addEventListener (type : 'error', listener : HTMLCompiler.ErrorListener) : void
  public addEventListener (type : HTMLCompilerEventType, listener : any) : void {
    if (type === HTMLCompilerEventType.CONTENT) {
      this._contentListeners.add(listener)
    } else if (type === HTMLCompilerEventType.COMPLETION) {
      this._completionListeners.add(listener)
    } else if (type === HTMLCompilerEventType.ERROR) {
      this._errorListeners.add(listener)
    } else {
      throw new Error(
        'Unable to add the given listener for the "' + type +
        '" type of event because "' + type + '" is not a valid html compiler ' +
        'event type, valid event types are : ' +
        HTMLCompilerEventType.ALL.join(', ') + '.'
      )
    }
  }

  /**
  * @see HTMLCompiler.removeEventListener
  */
  public removeEventListener (type : 'token', listener : HTMLCompiler.ContentListener) : void
  public removeEventListener (type : 'completion', listener : HTMLCompiler.CompletionListener) : void
  public removeEventListener (type : 'error', listener : HTMLCompiler.ErrorListener) : void
  public removeEventListener (type : HTMLCompilerEventType, listener : any) : void {
    if (type === HTMLCompilerEventType.CONTENT) {
      this._contentListeners.delete(listener)
    } if (type === HTMLCompilerEventType.COMPLETION) {
      this._completionListeners.delete(listener)
    } else if (type === HTMLCompilerEventType.ERROR) {
      this._errorListeners.delete(listener)
    } else {
      throw new Error(
        'Unable to remove the given listener for the "' + type +
        '" type of event because "' + type + '" is not a valid html compiler ' +
        'event type, valid event types are : ' +
        HTMLCompilerEventType.ALL.join(', ') + '.'
      )
    }
  }

  /**
  * @see HTMLCompiler.clearEventListener
  */
  public clearEventListener (type : 'token') : void
  public clearEventListener (type : 'completion') : void
  public clearEventListener (type : 'error') : void
  public clearEventListener (type : '*') : void
  public clearEventListener (type : HTMLCompilerEventType | '*') : void {
    if (type === HTMLCompilerEventType.CONTENT) {
      this._contentListeners.clear()
    } if (type === HTMLCompilerEventType.COMPLETION) {
      this._completionListeners.clear()
    } else if (type === HTMLCompilerEventType.ERROR) {
      this._errorListeners.clear()
    } else if (type === '*') {
      this._contentListeners.clear()
      this._completionListeners.clear()
      this._errorListeners.clear()
    } else {
      throw new Error(
        'Unable to remove all existing listener for the "' + type +
        '" type of event because "' + type + '" is not a valid html compiler ' +
        'event type, valid event types are : *, ' +
        HTMLCompilerEventType.ALL.join(', ') + '.'
      )
    }
  }
}
