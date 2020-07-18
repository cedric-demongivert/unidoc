import { UnidocEvent } from '../../../event/UnidocEvent'

import { HTMLEvent } from '../event/HTMLEvent'

import { HTMLFormatterEventType } from './HTMLFormatterEventType'
import { HTMLFormatter } from './HTMLFormatter'

export abstract class ListenableHTMLFormatter implements HTMLFormatter {
  /**
  * A set of listeners of the 'content' event.
  */
  private _contentListeners : Set<HTMLFormatter.ContentListener>

  /**
  * A set of listeners of the 'completion' event.
  */
  private _completionListeners : Set<HTMLFormatter.CompletionListener>

  /**
  * A set of listeners of the 'error' event.
  */
  private _errorListeners : Set<HTMLFormatter.ErrorListener>

  public constructor () {
    this._contentListeners = new Set<HTMLFormatter.ContentListener>()
    this._completionListeners = new Set<HTMLFormatter.CompletionListener>()
    this._errorListeners = new Set<HTMLFormatter.ErrorListener>()
  }

  /**
  * @see HTMLFormatter.start
  */
  public abstract start () : void

  /**
  * @see HTMLFormatter.next
  */
  public abstract next (event : HTMLEvent) : void

  /**
  * @see HTMLFormatter.complete
  */
  public abstract complete () : void

  /**
  * @see HTMLFormatter.reset
  */
  public abstract reset () : void

  /**
  * Publish a fragment of the resulting HTML document to this compiler
  * registered listeners.
  *
  * @param content - The fragment of symbols to publish.
  */
  protected publish (content : string) : void {
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
  * @see HTMLFormatter.clear
  */
  public clear () : void {
    this.clearEventListener('*')
  }

  /**
  * @see HTMLFormatter.addEventListener
  */
  public addEventListener (type : 'content', listener : HTMLFormatter.ContentListener) : void
  public addEventListener (type : 'completion', listener : HTMLFormatter.CompletionListener) : void
  public addEventListener (type : 'error', listener : HTMLFormatter.ErrorListener) : void
  public addEventListener (type : HTMLFormatterEventType, listener : any) : void {
    if (type === HTMLFormatterEventType.CONTENT) {
      this._contentListeners.add(listener)
    } else if (type === HTMLFormatterEventType.COMPLETION) {
      this._completionListeners.add(listener)
    } else if (type === HTMLFormatterEventType.ERROR) {
      this._errorListeners.add(listener)
    } else {
      throw new Error(
        'Unable to add the given listener for the "' + type +
        '" type of event because "' + type + '" is not a valid html formatter ' +
        'event type, valid event types are : ' +
        HTMLFormatterEventType.ALL.join(', ') + '.'
      )
    }
  }

  /**
  * @see HTMLFormatter.removeEventListener
  */
  public removeEventListener (type : 'token', listener : HTMLFormatter.ContentListener) : void
  public removeEventListener (type : 'completion', listener : HTMLFormatter.CompletionListener) : void
  public removeEventListener (type : 'error', listener : HTMLFormatter.ErrorListener) : void
  public removeEventListener (type : HTMLFormatterEventType, listener : any) : void {
    if (type === HTMLFormatterEventType.CONTENT) {
      this._contentListeners.delete(listener)
    } if (type === HTMLFormatterEventType.COMPLETION) {
      this._completionListeners.delete(listener)
    } else if (type === HTMLFormatterEventType.ERROR) {
      this._errorListeners.delete(listener)
    } else {
      throw new Error(
        'Unable to remove the given listener for the "' + type +
        '" type of event because "' + type + '" is not a valid html formatter ' +
        'event type, valid event types are : ' +
        HTMLFormatterEventType.ALL.join(', ') + '.'
      )
    }
  }

  /**
  * @see HTMLFormatter.clearEventListener
  */
  public clearEventListener (type : 'token') : void
  public clearEventListener (type : 'completion') : void
  public clearEventListener (type : 'error') : void
  public clearEventListener (type : '*') : void
  public clearEventListener (type : HTMLFormatterEventType | '*') : void {
    if (type === HTMLFormatterEventType.CONTENT) {
      this._contentListeners.clear()
    } if (type === HTMLFormatterEventType.COMPLETION) {
      this._completionListeners.clear()
    } else if (type === HTMLFormatterEventType.ERROR) {
      this._errorListeners.clear()
    } else if (type === '*') {
      this._contentListeners.clear()
      this._completionListeners.clear()
      this._errorListeners.clear()
    } else {
      throw new Error(
        'Unable to remove all existing listener for the "' + type +
        '" type of event because "' + type + '" is not a valid html formatter ' +
        'event type, valid event types are : *, ' +
        HTMLFormatterEventType.ALL.join(', ') + '.'
      )
    }
  }
}
