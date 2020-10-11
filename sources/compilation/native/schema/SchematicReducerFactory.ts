import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { EventStreamReducer } from '../reducer/EventStreamReducer'
import { AnyReducer } from '../reducer/AnyReducer'
import { StreamReducer } from '../reducer/StreamReducer'
import { ObjectReducer } from '../reducer/ObjectReducer'
import { SwitchReducer } from '../reducer/SwitchReducer'
import { NullReducer } from '../reducer/NullReducer'

import { Schema } from './Schema'
import { SchemaType } from './SchemaType'
import { ScalarSchema } from './ScalarSchema'
import { ObjectSchema } from './ObjectSchema'
import { StreamSchema } from './StreamSchema'
import { SwitchSchema } from './SwitchSchema'
import { AnySchema } from './AnySchema'
import { ScalarType } from './ScalarType'

type NodeState = number

const PRISTINE : NodeState = 0
const VISITING : NodeState = 1
const RESOLVED : NodeState = 2
const HOLLOW : NodeState = 3

export class SchematicReducerFactory {
  private readonly _builds : Map<Schema<any>, EventStreamReducer<any, any>>
  private readonly _states : Map<Schema<any>, number>
  private readonly _stack : Pack<[Schema<any>, number]>

  public constructor (capacity : number = 32) {
    this._builds = new Map()
    this._states = new Map()
    this._stack = Pack.any(capacity)
  }

  public create <T> (schema : Schema<T>) : EventStreamReducer<any, T> {
    this._stack.push([schema, 0])
    this._states.set(schema, VISITING)

    this.resolve()

    const result : EventStreamReducer<any, T> = this._builds.get(schema) || NullReducer.INSTANCE

    this._builds.clear()
    this._states.clear()
    this._stack.clear()

    return result
  }

  private resolve () : void {
    while (this._stack.size > 0) {
      const current : Schema<any> = this._stack.last[0]
      const index : number = this._stack.last[1]

      switch (current.type) {
        case SchemaType.SCALAR:
          this.resolveScalar(current)
          break
        case SchemaType.OBJECT:
          this.resolveObject(current, index)
          break
        case SchemaType.STREAM:
          this.resolveStream(current)
          break
        case SchemaType.SWITCH:
          this.resolveSwitch(current, index)
          break
        case SchemaType.ANY:
          this.resolveAny(current, index)
          break
        default :
          throw new Error(
            'Unable to resolve schema ' + current + ' of type #' +
            current.type + ' (' + SchemaType.toString(current.type) + ') at ' +
            'index #' + index + ' because this factory does not define a ' +
            'procedure for resolving this kind of schema.'
          )
      }
    }
  }

  private resolveScalar (schema : ScalarSchema<any>) : void {
    if (this._states.get(schema) === RESOLVED) {
      return
    }

    switch (schema.description) {
      case ScalarType.FLOAT:
        this._builds.set(schema, EventStreamReducer.float())
        break
      case ScalarType.INTEGER:
        this._builds.set(schema, EventStreamReducer.integer())
        break
      case ScalarType.TOKEN:
        this._builds.set(schema, EventStreamReducer.token())
        break
      case ScalarType.TEXT:
        this._builds.set(schema, EventStreamReducer.text())
        break
      case ScalarType.DOUBLE:
      case ScalarType.BYTE:
      case ScalarType.SHORT:
      case ScalarType.LONG:
      default:
        throw new Error(
          'Unable to resolve scalar type #' + schema.description + ' (' +
          ScalarType.toString(schema.description) + ') because this factory ' +
          'does not declare a procedure for it.'
        )
    }

    this._states.set(schema, RESOLVED)
    this._stack.pop()
  }

  private resolveObject (schema : ObjectSchema<any>, index : number) : void {
    const state : NodeState = this._states.get(schema) || PRISTINE

    switch (state) {
      case RESOLVED:
        break
      case VISITING:
      case PRISTINE:
        this._builds.set(schema, EventStreamReducer.object())
        this._states.set(schema, HOLLOW)
        break
      case HOLLOW:
        const result : ObjectReducer<any> = this._builds.get(schema) as ObjectReducer<any>
        const keys : string[] = Object.keys(schema.description)
        const key : string = keys[index]
        const child : Schema<any> = schema.description[key]
        const childState : NodeState = this._states.get(child) || PRISTINE

        switch (childState) {
          case RESOLVED:
          case HOLLOW:
            result.reducers.set(key, this._builds.get(child) || NullReducer.INSTANCE)

            if (index + 1 === keys.length) {
              this._states.set(schema, RESOLVED)
              this._stack.pop()
            } else {
              this._stack.last[1] += 1
            }

            break
          case VISITING:
            throw new Error(
              'Unable to resolve schema ' + schema + ' at child ' + child +
              ' due to a potential infinite loop.'
            )
          case PRISTINE:
            this._stack.push([ child, 0 ])
            break
        }

        break
    }
  }

  private resolveStream (schema : StreamSchema<any>) : void {
    const state : NodeState = this._states.get(schema) || PRISTINE

    switch (state) {
      case RESOLVED:
        break
      case VISITING:
      case PRISTINE:
        this._builds.set(schema, EventStreamReducer.stream())
        this._states.set(schema, HOLLOW)
        break
      case HOLLOW:
        const result : StreamReducer<any> = this._builds.get(schema) as StreamReducer<any>
        const child : Schema<any> = schema.description
        const childState : NodeState = this._states.get(child) || PRISTINE

        switch (childState) {
          case RESOLVED:
          case HOLLOW:
            result.elementReducer = this._builds.get(child) || NullReducer.INSTANCE
            this._states.set(schema, RESOLVED)
            this._stack.pop()
            break
          case VISITING:
            throw new Error(
              'Unable to resolve schema ' + schema + ' at child ' + child +
              ' due to a potential infinite loop.'
            )
          case PRISTINE:
            this._stack.push([ child, 0 ])
            break
        }

        break
    }
  }

  private resolveSwitch (schema : SwitchSchema<any>, index : number) : void {
    const state : NodeState = this._states.get(schema) || PRISTINE

    switch (state) {
      case RESOLVED:
        break
      case VISITING:
      case PRISTINE:
        this._builds.set(schema, EventStreamReducer.tags())
        this._states.set(schema, HOLLOW)
        break
      case HOLLOW:
        const result : SwitchReducer<any> = this._builds.get(schema) as SwitchReducer<any>
        const keys : string[] = Object.keys(schema.description)
        const key : string = keys[index]
        const child : Schema<any> = schema.description[key]
        const childState : NodeState = this._states.get(child) || PRISTINE

        switch (childState) {
          case RESOLVED:
          case HOLLOW:
            result.reducers.set(key, this._builds.get(child) || NullReducer.INSTANCE)

            if (index + 1 === keys.length) {
              this._states.set(schema, RESOLVED)
              this._stack.pop()
            } else {
              this._stack.last[1] += 1
            }

            break
          case VISITING:
            throw new Error(
              'Unable to resolve schema ' + schema + ' at child ' + child +
              ' due to a potential infinite loop.'
            )
          case PRISTINE:
            this._stack.push([ child, 0 ])
            break
        }

        break
    }
  }

  private resolveAny (schema : AnySchema<any>, index : number) : void {
    const state : NodeState = this._states.get(schema) || PRISTINE

    switch (state) {
      case RESOLVED:
        break
      case VISITING:
      case PRISTINE:
        this._builds.set(schema, EventStreamReducer.any())
        this._states.set(schema, HOLLOW)
        break
      case HOLLOW:
        const result : AnyReducer<any> = this._builds.get(schema) as AnyReducer<any>
        const child : Schema<any> = schema.description[index]
        const childState : NodeState = this._states.get(child) || PRISTINE

        switch (childState) {
          case RESOLVED:
          case HOLLOW:
            result.reducers.set(index, this._builds.get(child) || NullReducer.INSTANCE)

            if (index + 1 === schema.description.length) {
              this._states.set(schema, RESOLVED)
              this._stack.pop()
            } else {
              this._stack.last[1] += 1
            }

            break
          case VISITING:
            throw new Error(
              'Unable to resolve schema ' + schema + ' at child ' + child +
              ' due to a potential infinite loop.'
            )
          case PRISTINE:
            this._stack.push([ child, 0 ])
            break
        }

        break
    }
  }
}
