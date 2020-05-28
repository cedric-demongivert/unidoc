import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocQuery } from './UnidocQuery'
import { Sink } from './Sink'

export class DepthQuery implements UnidocQuery<UnidocEvent, number>
{
  /**
  * A listener called when a value is published by this query.
  */
  public output : Sink<number>

  /**
  * Current depth.
  */
  private _depth : number

  public constructor () {
    this.output = Sink.NONE
    this._depth = 0
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
      case UnidocEventType.START_TAG:
        this._depth += 1
        return this.output.next(this._depth - 1)
      case UnidocEventType.END_TAG:
        this._depth -= 1
      default:
        return this.output.next(this._depth)
    }
  }

  /**
  * @see UnidocQuery.complete
  */
  public complete () : void {
    this._depth = 0
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
    this._depth = 0
  }

  /**
  * @see UnidocQuery.clear
  */
  public clear () : void {
    this.output = Sink.NONE
    this._depth = 0
  }

  /**
  * @see UnidocQuery.clone
  */
  public clone () : DepthQuery {
    const selector : DepthQuery = new DepthQuery()

    selector._depth = this._depth
    selector.output = this.output

    return selector
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return 'map:$depth'
  }
}
