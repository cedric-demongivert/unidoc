import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocEventType } from '../../../event/UnidocEventType'

import { NativeCompiler } from './NativeCompiler'

const EMPTY_STRING : string = ''

export class StringScalarCompiler implements NativeCompiler<string> {
  private _chain : string
  private _whitespaces : boolean

  public constructor () {
    this._chain = EMPTY_STRING
    this._whitespaces = false
  }

  /**
  * Notify the begining of the stream of event that describe the document to
  * compile.
  */
  public start () : void {
    this._chain = EMPTY_STRING
    this._whitespaces = false
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
        this._whitespaces = this._chain.length > 0
        return
      case UnidocEventType.WORD:
        if (this._whitespaces) {
          this._chain += ' '
          this._whitespaces = false
        }

        this._chain += event.text
        return
      default:
        throw new Error(
          'Unable to compile the given event of type #' + event.type + ' (' +
          UnidocEventType.toString(event.type) + ') because streams that ' +
          'encode a scalar string must only contains whitespaces and words.'
        )
    }
  }

  /**
  * Notify the termination of the stream of event that describe the document to
  * compile.
  */
  public complete () : string {
    const result : string = this._chain
    this._chain = EMPTY_STRING
    this._whitespaces = false
    return result
  }

  /**
  * Update the state of this compiler toke make it as if the compiler was just
  * instantiated.
  */
  public clear () : void {
    this._chain = EMPTY_STRING
    this._whitespaces = false
  }
}

export namespace NumberScalarCompiler {
}
