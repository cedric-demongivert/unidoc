import { UnidocEvent } from '../../event/UnidocEvent'
import { UnidocEventType } from '../../event/UnidocEventType'

import { ValidationReducer } from '../ValidationReducer'
import { ValidationState } from '../ValidationState'

import { TagReducerState } from './TagReducerState'
import { NullReducer } from './NullReducer'

export class TagReducer implements ValidationReducer<TagReducer.State> {
  public tag : string

  /**
  * Instantiate a new content validation reducer.
  *
  * @param [contentReducer = NullReducer.INSTANCE] - The reducer to use for validating the content of the next available tag.
  */
  public constructor () {

  }

  /**
  * @see ValidationReducer.start
  */
  public start () : TagReducer.State {
    return {
      state: TagReducerState.BEFORE_TAG,
      depth: 0,
      value: null
    }
  }

  /*
  * @see ValidationReducer.reduce
  */
  public reduce (state : TagReducer.State, event : UnidocEvent) : void {
    switch (state.state) {
      case TagReducerState.BEFORE_TAG:
        return this.reduceBeforeContent(state, event)
      case TagReducerState.WITHIN_TAG:
        return this.reduceWithinContent(state, event)
      case TagReducerState.AFTER_TAG:
        if (event.type === UnidocEventType.WHITESPACE) {
          return
        }

        throw new Error(
          'Unable to reduce the event ' + event.toString() + ' in state #' +
          state.state + ' (' + TagReducerState.toString(state.state) +
          ') because this reducer does not expect to receive new events ' +
          'after the last closing tag event.'
        )
      default:
        throw new Error(
          'Unable to reduce the event ' + event.toString() + ' in state #' +
          state.state + ' (' + TagReducerState.toString(state.state) +
          ') because this reducer does not declare a procedure for this.'
        )
    }
  }

  public reduceBeforeContent (state : TagReducer.State, event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.START_TAG:
        state.state = TagReducerState.WITHIN_TAG
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
          state.state + ' (' + TagReducerState.toString(state.state) +
          ') because a content reducer expects to receive the root tag ' +
          'opening and ending events.'
        )
    }
  }

  public reduceWithinContent (state : TagReducer.State, event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.END_TAG:
        state.depth -= 1

        if (state.depth === 0) {
          state.state = TagReducerState.AFTER_TAG
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
  public complete (_state : TagReducer.State) : void {

  }

  /**
  * @see ValidationReducer.restart
  */
  public restart (state : TagReducer.State) : void {
    state.depth = 0
    state.state = TagReducerState.BEFORE_TAG
  }

  /**
  * @see ValidationReducer.state
  */
  public state (state : TagReducer.State) : ValidationState {
    switch (state.state) {
      case TagReducerState.BEFORE_TAG:
        return ValidationState.NEUTRAL
      case TagReducerState.WITHIN_TAG:
      case TagReducerState.AFTER_TAG:
        return this.contentReducer.state(state.value)
      default:
        throw new Error(
          'Unable to handle content reducer state #' + state.state + ' (' +
          TagReducerState.toString(state.state) + ') because no ' +
          'procedure exists for this particular state.'
        )
    }
  }
}

export namespace TagReducer {
  export type State = {
    state: TagReducerState,
    depth: number,
    value: any
  }
}
