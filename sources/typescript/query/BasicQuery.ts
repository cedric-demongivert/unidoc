import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocQuery } from './UnidocQuery'

export abstract class BasicQuery<Output> implements UnidocQuery<Output> {
  private readonly _completionListeners : Set<UnidocQuery.CompletionListener>
  private readonly _emissionListeners : Set<UnidocQuery.NextListener<Output>>

  public constructor () {
    this._completionListeners = new Set<UnidocQuery.CompletionListener>()
    this._emissionListeners = new Set<UnidocQuery.NextListener<Output>>()
  }

  /**
  * @see UnidocQuery.start
  */
  public abstract start () : void

  /**
  * @see UnidocQuery.next
  */
  public abstract next (event : UnidocEvent) : void

  /**
  * @see UnidocQuery.complete
  */
  public abstract complete () : void

  /**
  * @see UnidocQuery.addEventListener
  */
  public addEventListener (type : 'next', listener : UnidocQuery.NextListener<Output>) : void
  public addEventListener (type : 'complete', listener : UnidocQuery.CompletionListener) : void
  public addEventListener (type : any, listener : any) : void {
    if (type === 'next') {
      this._emissionListeners.add(listener)
    } else if (type === 'complete') {
      this._completionListeners.add(listener)
    } else {
      throw new Error(
        'Unable to add the given listener for the "' + type +
        '" type of event because "' + type + '" is not a valid unidoc query ' +
        'event type, valid event types are : ' +
        ['next', 'complete'].join(', ') + '.'
      )
    }
  }

  /**
  * @see UnidocQuery.removeEventListener
  */
  public removeEventListener (type : 'next', listener : UnidocQuery.NextListener<Output>) : void
  public removeEventListener (type : 'complete', listener:  UnidocQuery.CompletionListener) : void
  public removeEventListener (type : any, listener : any) : void {
    if (type === 'next') {
      this._emissionListeners.delete(listener)
    } else if (type === 'complete') {
      this._completionListeners.delete(listener)
    } else {
      throw new Error(
        'Unable to delete the given listener for the "' + type +
        '" type of event because "' + type + '" is not a valid unidoc query ' +
        'event type, valid event types are : ' +
        ['next', 'complete'].join(', ') + '.'
      )
    }
  }

  /**
  * @see UnidocQuery.removeAllEventListener
  */
  public removeAllEventListener (type : 'next') : void
  public removeAllEventListener (type : 'complete') : void
  public removeAllEventListener (type : '*') : void
  public removeAllEventListener (type : any) : void {
    if (type === 'next') {
      this._emissionListeners.clear()
    } else if (type === 'complete') {
      this._completionListeners.clear()
    } else if (type === '*') {
      this._emissionListeners.clear()
      this._completionListeners.clear()
    } else {
      throw new Error(
        'Unable to clear all existing listeners for the "' + type +
        '" type of event because "' + type + '" is not a valid unidoc query ' +
        'event type, valid event types are : ' +
        ['next', 'complete', '*'].join(', ') + '.'
      )
    }
  }

  /**
  * Emit a value.
  *
  * @param value - The value to emit.
  */
  protected emit (value : Output) : void {
    for (const emissionListener of this._emissionListeners) {
      emissionListener(value)
    }
  }

  /**
  * Emit a completion event for the current stream.
  */
  protected emitCompletion () : void {
    for (const completionListener of this._completionListeners) {
      completionListener()
    }
  }

  /**
  * Copy the given query state.
  *
  * @param toCopy - A query to copy.
  */
  public copy (toCopy : BasicQuery<Output>) : void {
    this._emissionListeners.clear()
    this._completionListeners.clear()

    for (const emissionListener of toCopy._emissionListeners) {
      this._emissionListeners.add(emissionListener)
    }

    for (const completionListener of toCopy._completionListeners) {
      this._completionListeners.add(completionListener)
    }
  }

  /**
  * @see UnidocQuery.reset
  */
  public abstract reset () : void

  /**
  * @see UnidocQuery.clone
  */
  public abstract clone () : BasicQuery<Output>

  /**
  * @see UnidocQuery.toString
  */
  public abstract toString () : string
}
