import { UnidocEvent } from '../../event/UnidocEvent'

import { ValidationState } from '../ValidationState'
import { ValidationReducer } from '../ValidationReducer'

export class NullReducer implements ValidationReducer<null> {
  /**
  * @see ValidationReducer.start
  */
  public start () : null {
    throw new Error('Unable to start a null reducer.')
  }

  /**
  * @see ValidationReducer.reduce
  */
  public reduce (_state : null, event : UnidocEvent) : void {
    throw new Error(
      'Unable to reduce event ' + event.toString() + ' with a null reducer.'
    )
  }

  /**
  * @see ValidationReducer.complete
  */
  public complete (_state : null) : void {
    throw new Error('Unable to complete a null reducer.')
  }

  /**
  * @see ValidationReducer.state
  */
  public state (_state : null) : ValidationState {
    throw new Error('Unable to map the state of a null reducer.')
  }

  /**
  * @see ValidationReducer.restart
  */
  public restart (_state : null) : void {
    throw new Error('Unable to restart a null reducer.')
  }
}

export namespace NullReducer {
  export const INSTANCE : NullReducer = new NullReducer()
}
