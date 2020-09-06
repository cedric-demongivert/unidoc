import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocEventType } from '../../../event/UnidocEventType'

import { NativeCompiler } from './NativeCompiler'
import { NumberScalarCompilerState } from './NumberScalarCompilerState'

const EMPTY_STRING : string = ''

export class NumberScalarCompiler implements NativeCompiler<number> {
  private _state : NumberScalarCompilerState
  private _chain : string
  private _parse : (x : string) => number

  public constructor (parser : (x : string) => number = parseFloat) {
    this._state = NumberScalarCompilerState.DEFAULT
    this._chain = EMPTY_STRING
    this._parse = parser
  }

  public setParser (parser : (x : string) => number) : void {
    this._parse = parser
  }

  /**
  * Notify the begining of the stream of event that describe the document to
  * compile.
  */
  public start () : void {
    this._state = NumberScalarCompilerState.DEFAULT
    this._chain = EMPTY_STRING
  }

  /**
  * Notify that a new event was published into the stream of event that describe
  * the document to compile.
  *
  * @param event - An event to process.
  */
  public next (event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.WHITESPACE:
        return this.handleWhitespace(event)
      case UnidocEventType.WORD:
        return this.handleWord(event)
      default:
        throw new Error(
          'Unable to compile the given event of type #' + event.type + ' (' +
          UnidocEventType.toString(event.type) + ') because streams that ' +
          'encode a scalar number must only contains whitespaces and words.'
        )
    }
  }

  public handleWhitespace (event : UnidocEvent) : void {
    switch (this._state) {
      case NumberScalarCompilerState.BEFORE_CONTENT:
      case NumberScalarCompilerState.AFTER_CONTENT:
        return
      case NumberScalarCompilerState.WITHIN_CONTENT:
        this._state = NumberScalarCompilerState.AFTER_CONTENT
        return
      default:
        throw new Error(
          'Unable to handle the event ' + event.toString() + ' in state #' +
          this._state + ' (' + NumberScalarCompilerState.toString(this._state) +
          ') because this compiler does not declare a procedure to follow in ' +
          'this state.'
        )
    }
  }

  public handleWord (event : UnidocEvent) : void {
    switch (this._state) {
      case NumberScalarCompilerState.BEFORE_CONTENT:
        this._state = NumberScalarCompilerState.WITHIN_CONTENT
      case NumberScalarCompilerState.WITHIN_CONTENT:
        this._chain += event.text
        return
      case NumberScalarCompilerState.AFTER_CONTENT:
        throw new Error(
          'Unable to handle the event ' + event.toString() + ' because ' +
          'streams that encode a scalar number must only contains one ' +
          'sequence of words.'
        )
      default:
        throw new Error(
          'Unable to handle the event ' + event.toString() + ' in state #' +
          this._state + ' (' + NumberScalarCompilerState.toString(this._state) +
          ') because this compiler does not declare a procedure to follow in ' +
          'this state.'
        )
    }
  }

  /**
  * Notify the termination of the stream of event that describe the document to
  * compile.
  */
  public complete () : number {
    const result : number = this._parse(this._chain)
    this._chain = EMPTY_STRING
    this._state = NumberScalarCompilerState.DEFAULT
    return result
  }

  /**
  * Update the state of this compiler toke make it as if the compiler was just
  * instantiated.
  */
  public clear () : void {
    this._chain = EMPTY_STRING
    this._state = NumberScalarCompilerState.DEFAULT
  }
}

export namespace NumberScalarCompiler {
}
