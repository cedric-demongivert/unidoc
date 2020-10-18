import { UnidocEvent } from '../../event/UnidocEvent'
import { UnidocEventType } from '../../event/UnidocEventType'

import { ValidationReducer } from '../ValidationReducer'
import { ValidationState } from '../ValidationState'

import { ContentReducerState } from './ContentReducerState'
import { NullReducer } from './NullReducer'

export class ContentReducer implements ValidationReducer<ContentReducer.State> {
  public contentReducer : ValidationReducer<any>

  /**
  * Instantiate a new content validation reducer.
  *
  * @param [contentReducer = NullReducer.INSTANCE] - The reducer to use for validating the content of the next available tag.
  */
  public constructor (contentReducer : ValidationReducer<any> = NullReducer.INSTANCE) {
    this.contentReducer = contentReducer
  }

  /**
  * @see ValidationReducer.start
  */
  public start () : ContentReducer.State {
    return {
      state: ContentReducerState.BEFORE_CONTENT,
      depth: 0,
      value: null
    }
  }

  /*
  * @see ValidationReducer.reduce
  */
  public reduce (state : ContentReducer.State, event : UnidocEvent) : void {
    switch (state.state) {
      case ContentReducerState.BEFORE_CONTENT:
        return this.reduceBeforeContent(state, event)
      case ContentReducerState.WITHIN_CONTENT:
        return this.reduceWithinContent(state, event)
      case ContentReducerState.AFTER_CONTENT:
        if (event.type === UnidocEventType.WHITESPACE) {
          return
        }

        throw new Error(
          'Unable to reduce the event ' + event.toString() + ' in state #' +
          state.state + ' (' + ContentReducerState.toString(state.state) +
          ') because this reducer does not expect to receive new events ' +
          'after the last closing tag event.'
        )
      default:
        throw new Error(
          'Unable to reduce the event ' + event.toString() + ' in state #' +
          state.state + ' (' + ContentReducerState.toString(state.state) +
          ') because this reducer does not declare a procedure for this.'
        )
    }
  }

  public reduceBeforeContent (state : ContentReducer.State, event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.START_TAG:
        state.state = ContentReducerState.WITHIN_CONTENT
        state.depth = 1

        if (state.value == null) {
          state.value = this.contentReducer.start()
        } else {
          this.contentReducer.restart(state.value)
        }

        return
      case UnidocEventType.WHITESPACE:
        return
      default:
        throw new Error(
          'Unable to reduce the event ' + event.toString() + ' in state #' +
          state.state + ' (' + ContentReducerState.toString(state.state) +
          ') because a content reducer expects to receive the root tag ' +
          'opening and ending events.'
        )
    }
  }

  public reduceWithinContent (state : ContentReducer.State, event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.END_TAG:
        state.depth -= 1

        if (state.depth === 0) {
          state.state = ContentReducerState.AFTER_CONTENT
          this.contentReducer.complete(state.value)
        } else {
          this.contentReducer.reduce(state.value, event)
        }

        break
      case UnidocEventType.START_TAG:
        state.depth += 1
      default:
        this.contentReducer.reduce(state.value, event)
        break
    }
  }

  /**
  * @see ValidationReducer.complete
  */
  public complete (_state : ContentReducer.State) : void {

  }

  /**
  * @see ValidationReducer.restart
  */
  public restart (state : ContentReducer.State) : void {
    state.depth = 0
    state.state = ContentReducerState.BEFORE_CONTENT
  }

  /**
  * @see ValidationReducer.state
  */
  public state (state : ContentReducer.State) : ValidationState {
    switch (state.state) {
      case ContentReducerState.BEFORE_CONTENT:
        return ValidationState.NEUTRAL
      case ContentReducerState.WITHIN_CONTENT:
      case ContentReducerState.AFTER_CONTENT:
        return this.contentReducer.state(state.value)
      default:
        throw new Error(
          'Unable to handle content reducer state #' + state.state + ' (' +
          ContentReducerState.toString(state.state) + ') because no ' +
          'procedure exists for this particular state.'
        )
    }
  }
}

export namespace ContentReducer {
  export type State = {
    state: ContentReducerState,
    depth: number,
    value: any
  }
}
