import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocEventType } from '../../../event/UnidocEventType'

import { Schema } from '../Schema'
import { SchemaType } from '../SchemaType'

import { NativeCompiler } from './NativeCompiler'
import { NumberScalarCompiler } from './NumberScalarCompiler'
import { StringScalarCompiler } from './StringScalarCompiler'

export class SchemaCompiler<T> implements NativeCompiler<T> {
  private _schema : Schema<T>
  private readonly _dataStack : Pack<any>
  private readonly _typeStack : Pack<Schema<any>>

  private readonly _numberScalarCompiler : NumberScalarCompiler
  private readonly _stringScalarCompiler : StringScalarCompiler
  private _scalarCompiler : NativeCompiler<any>

  public constructor (schema : Schema<T>, capacity : number = 32) {
    this._schema = schema
    this._dataStack = Pack.any(capacity)
    this._typeStack = Pack.any(capacity)

    this._numberScalarCompiler = new NumberScalarCompiler()
    this._stringScalarCompiler = new StringScalarCompiler()
    this._scalarCompiler = this._numberScalarCompiler
  }

  /**
  * Notify the begining of the stream of event that describe the document to
  * compile.
  */
  public start () : void {
    this._dataStack.clear()
    this._typeStack.clear()
  }

  /**
  * Notify that a new event was published into the stream of event that describe
  * the document to compile.
  *
  * @param event - An event to process.
  */
  public next (event : UnidocEvent) : void {
    if (this._typeStack.size === 0) {
      this.handleNextStartingEvent(event)
      return
    }

    const schema : Schema<any> = this._typeStack.last

    switch (schema.type) {
      case SchemaType.SCALAR :
        return this.handleNextScalarEvent(event)
      case SchemaType.STREAM :
        return this.handleNextStreamEvent(event)
      case SchemaType.SWITCH :
        return this.handleNextSwitchEvent(event)
      case SchemaType.OBJECT :
        return this.handleNextObjectEvent(event)
      default :
        throw new Error(
          'Unable to handle the event ' + event.toString() + ' as an event ' +
          'of a stream that contains an instance described by a schema of ' +
          'type #' + schema.type + ' (' + SchemaType.toString(schema.type) +
          ') because this compiler does not declare any procedure to handle ' +
          'streams that describe instances of this type of schema.'
        )
    }
  }

  private handleNextStartingEvent (event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.WHITESPACE:
      case UnidocEventType.WORD:
      case UnidocEventType.END_TAG:
        return
      case UnidocEventType.START_TAG:
        return this.handleStartOf(event, this._schema)
      default:
        throw new Error(
          'Unable to handle the given starting event of type #' + event.type +
          ' (' + UnidocEventType.toString(event.type) + ') because this ' +
          'compiler does not define a procedure for it.'
        )
    }
  }

  private handleStartOf (event : UnidocEvent, schema : Schema<any>) : void {
    this._dataStack.push(SchemaType.make(schema.type))
    this._typeStack.push(schema)

    switch (schema.type) {
      case SchemaType.SCALAR :
        return this.handleStartOfScalar(event, schema)
      case SchemaType.SWITCH :
        return this.handleStartOfSwitch(event, schema)
      case SchemaType.OBJECT :
      case SchemaType.STREAM :
        return
      default :
        throw new Error(
          'Unable to handle the start of a schema of type #' +
          schema.type + ' (' + SchemaType.toString(schema.type) +
          ') because this compiler does not declare any procedure to handle ' +
          'the begining of this type of schema.'
        )
    }
  }

  private handleStartOfScalar (event : UnidocEvent, schema : Schema<any>) : void {
    if (schema.description === 'float') {
      this._numberScalarCompiler.setParser(parseFloat)
      this._numberScalarCompiler.start()
      this._scalarCompiler = this._numberScalarCompiler
    } else if (schema.description === 'integer') {
      this._numberScalarCompiler.setParser(parseInt)
      this._numberScalarCompiler.start()
      this._scalarCompiler = this._numberScalarCompiler
    } else if (schema.description === 'string') {
      this._stringScalarCompiler.start()
      this._scalarCompiler = this._stringScalarCompiler
    } else {
      this.handleStartOf(event, schema.description)
    }
  }

  private handleStartOfSwitch (event : UnidocEvent, schema : Schema<any>) : void {
    const description : any = schema.description

    if (event.tag in description) {
      this.handleStartOf(event, description[event.tag])
    } else if ('$default' in description) {
      this.handleStartOf(event, description['$default'])
    } else {
      throw new Error(
        'Unable to handle event ' + event.toString() + ' because no ' +
        'the type of tag that it describe ' + event.tag + ' is not ' +
        'allowed into the given schema.'
      )
    }
  }

  private handleNextStreamEvent (event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.WHITESPACE:
      case UnidocEventType.WORD:
        return
      case UnidocEventType.START_TAG:
        this.handleStartOf(event, this._typeStack.last.description)
        return
      case UnidocEventType.END_TAG:
        this.resolve(event)
        return
      default:
        throw new Error(
          'Unable to handle the given scalar event of type #' + event.type +
          ' (' + UnidocEventType.toString(event.type) + ') because this ' +
          'compiler does not define a procedure for it.'
        )
    }
  }

  private handleNextObjectEvent (event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.WHITESPACE:
      case UnidocEventType.WORD:
        return
      case UnidocEventType.START_TAG:
        const description : any = this._typeStack.last.description

        if (event.tag in description) {
          this.handleStartOf(event, description[event.tag])
        } else if ('$default' in description) {
          this.handleStartOf(event, description['$default'])
        } else {
          throw new Error(
            'Unable to handle event ' + event.toString() + ' because no ' +
            'the type of tag that it describe ' + event.tag + ' is not ' +
            'allowed into the given schema.'
          )
        }

        return
      case UnidocEventType.END_TAG:
        this.resolve(event)
        return
      default:
        throw new Error(
          'Unable to handle the given object event of type #' + event.type +
          ' (' + UnidocEventType.toString(event.type) + ') because this ' +
          'compiler does not define a procedure for it.'
        )
    }
  }

  private handleNextSwitchEvent (event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.WHITESPACE:
      case UnidocEventType.WORD:
        return
      case UnidocEventType.START_TAG:
        this.handleStartOfSwitch(event, this._typeStack.last)
        return
      case UnidocEventType.END_TAG:
        this.resolve(event)
        return
      default:
        throw new Error(
          'Unable to handle the given switch event of type #' + event.type +
          ' (' + UnidocEventType.toString(event.type) + ') because this ' +
          'compiler does not define a procedure for it.'
        )
    }
  }

  private handleNextScalarEvent (event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.WHITESPACE:
      case UnidocEventType.WORD:
      case UnidocEventType.START_TAG:
        this._scalarCompiler.next(event)
        return
      case UnidocEventType.END_TAG:
        const schema : Schema<any> = this._typeStack.last

        if (typeof schema.description === 'string') {
          this._dataStack.set(
            this._dataStack.lastIndex,
            this._scalarCompiler.complete()
          )
        }

        this.resolve(event)
        return
      default:
        throw new Error(
          'Unable to handle the given scalar event of type #' + event.type +
          ' (' + UnidocEventType.toString(event.type) + ') because this ' +
          'compiler does not define a procedure for it.'
        )
    }
  }

  private resolve (event : UnidocEvent) : void {
    const value : any = this._dataStack.pop()
    this._typeStack.pop()

    if (this._typeStack.size === 0) {
      this._dataStack.push(value)
      return
    }

    const schema : Schema<any> = this._typeStack.last

    switch (schema.type) {
      case SchemaType.SCALAR :
        this._dataStack.set(this._dataStack.lastIndex, value)
        return
      case SchemaType.STREAM :
        this._dataStack.last.push(value)
        return
      case SchemaType.SWITCH :
        this._dataStack.set(this._dataStack.lastIndex, value)
        this.resolve(event)
        return
      case SchemaType.OBJECT :
        this._dataStack.last[event.tag] = value
        return
      default :
        throw new Error(
          'Unable to handle the event ' + event.toString() + ' as an event ' +
          'of a stream that contains an instance described by a schema of ' +
          'type #' + schema.type + ' (' + SchemaType.toString(schema.type) +
          ') because this compiler does not declare any procedure to handle ' +
          'streams that describe instances of this type of schema.'
        )
    }
  }

  /**
  * Notify the termination of the stream of event that describe the document to
  * compile.
  */
  public complete () : T {
    const result : T = this._dataStack.last
    this._dataStack.clear()
    this._typeStack.clear()
    return result
  }

  /**
  * Update the state of this compiler toke make it as if the compiler was just
  * instantiated.
  */
  public clear () : void {
    this._dataStack.clear()
    this._typeStack.clear()
  }
}

export namespace JSONCompiler {
}
