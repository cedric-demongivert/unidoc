import { UnidocEvent } from '../../../event/UnidocEvent'
import { EventStreamReducer } from './EventStreamReducer'

export class NullReducer implements EventStreamReducer<any, any>
{
  /**
  * @see EventStreamReducer.start
  */
  public start () : any {
    throw new Error('Unable to start a reduction with a null reducer.')
  }

  /**
  * @see EventStreamReducer.reduce
  */
  public reduce (state : any, event : UnidocEvent) : void {
    throw new Error('Unable to continue a reduction with a null reducer.')
  }

  /**
  * @see EventStreamReducer.complete
  */
  public complete (state : any) : any {
    throw new Error('Unable to complete a reduction with a null reducer.')
  }

  /**
  * @see EventStreamReducer.restart
  */
  public restart (state : any) : void {
    throw new Error('Unable to restart a reduction with a null reducer.')
  }

  /**
  * @see EventStreamReducer.bootstrap
  */
  public bootstrap (state : any) : void {
    throw new Error('Unable to bootstrap a reduction with a null reducer.')
  }

  /**
  * @see EventStreamReducer.map
  */
  public map <To> (mapper : (from : any) => To) : EventStreamReducer<any, To> {
    throw new Error('Unable to map a null reducer.')
  }
}

export namespace NullReducer {
  export type State = any

  export const INSTANCE : NullReducer = new NullReducer()
}
