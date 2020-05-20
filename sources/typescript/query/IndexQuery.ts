import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { AtomicQuery } from './AtomicQuery'
import { UnidocQuery } from './UnidocQuery'
import { nothing } from './nothing'

export class IndexQuery
  implements UnidocQuery<UnidocEvent, number>,
             AtomicQuery<number>
{
  /**
  * A listener called when a value is published by this query.
  */
  public resultListener : UnidocQuery.ResultListener<number>

  /**
  * A listener called when the output stream of this query reach it's end.
  */
  public completionListener : UnidocQuery.CompletionListener

  /**
  * Current index.
  */
  private _current : number

  /**
  * Current opened tags.
  */
  private _tags : number[]

  public constructor () {
    this.resultListener = nothing
    this.completionListener = nothing
    this._current = 0
    this._tags = []
  }

  /**
  * @see UnidocQuery.start
  */
  public start () : void {

  }

  /**
  * @see UnidocQuery.next
  */
  public next (event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.END_TAG:
        return this.resultListener(this._tags.pop())
      case UnidocEventType.START_TAG:
        this._tags.push(this._current)
      default:
        const result : number = this._current
        this._current += 1
        return this.resultListener(result)
    }
  }

  /**
  * @see UnidocQuery.complete
  */
  public complete () : void {
    this._current = 0
    this.completionListener()
  }

  /**
  * @see UnidocQuery.reset
  */
  public reset () : void {
    this._tags.length = 0
    this._current = 0
  }

  /**
  * @see UnidocQuery.clear
  */
  public clear () : void {
    this.resultListener = nothing
    this.completionListener = nothing

    this._tags.length = 0
    this._current = 0
  }

  /**
  * @see UnidocQuery.clone
  */
  public clone () : IndexQuery {
    const selector : IndexQuery = new IndexQuery()

    selector._current = this._current

    for (const value of this._tags) {
      selector._tags.push(value)
    }

    selector.resultListener = this.resultListener
    selector.completionListener = this.completionListener

    return selector
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return '$index'
  }
}
