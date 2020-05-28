import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocQuery } from './UnidocQuery'
import { Sink } from './Sink'

export class ChildIndexQuery implements UnidocQuery<UnidocEvent, number>
{
  /**
  * A listener called when a value is published by this query.
  */
  public output : Sink<number>

  /**
  * State stack.
  */
  private readonly _stack : number[]

  public constructor () {
    this.output = Sink.NONE
    this._stack = [0]
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
        this._stack.push(0)
        return this.output.next(this._stack[this._stack.length - 2])
      case UnidocEventType.END_TAG:
        this._stack.pop()
      default:
        const result : number = this._stack[this._stack.length - 1]
        this._stack[this._stack.length - 1] += 1
        return this.output.next(result)
    }
  }

  /**
  * @see UnidocQuery.complete
  */
  public complete () : void {
    this._stack.length = 1
    this._stack[0] = 0
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
    this._stack.length = 1
    this._stack[0] = 0
  }

  /**
  * @see UnidocQuery.clear
  */
  public clear () : void {
    this.output = Sink.NONE

    this._stack.length = 1
    this._stack[0] = 0
  }

  /**
  * @see UnidocQuery.clone
  */
  public clone () : ChildIndexQuery {
    const selector : ChildIndexQuery = new ChildIndexQuery()

    selector._stack.length = 0

    for (const value of this._stack) {
      selector._stack.push(value)
    }

    selector.output = this.output

    return selector
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return 'map:$child-index'
  }
}
