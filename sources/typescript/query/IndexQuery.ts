import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocQuery } from './UnidocQuery'
import { Sink } from './Sink'

export class IndexQuery implements UnidocQuery<UnidocEvent, number>
{
  /**
  * A listener called when a value is published by this query.
  */
  public output : Sink<number>

  /**
  * Current index.
  */
  private _current : number

  /**
  * Current opened tags.
  */
  private _tags : number[]

  public constructor () {
    this.output = Sink.NONE
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
        return this.output.next(this._tags.pop())
      case UnidocEventType.START_TAG:
        this._tags.push(this._current)
      default:
        const result : number = this._current
        this._current += 1
        return this.output.next(result)
    }
  }

  /**
  * @see UnidocQuery.complete
  */
  public complete () : void {
    this._current = 0
    this.output.complete()
  }

  /**
  * @see UnidocQuery.error
  */
  public error (error : Error) : void {
    this.output.error(error)
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
    this.output = Sink.NONE

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

    selector.output = this.output

    return selector
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return 'map:$index'
  }
}
