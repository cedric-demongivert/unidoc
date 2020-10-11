import { EventStreamReducer } from '../reducer/EventStreamReducer'
import { AnyReducer } from '../reducer/AnyReducer'

import { Schema } from './Schema'
import { ScalarSchema } from './ScalarSchema'
import { AnySchema } from './AnySchema'
import { ObjectSchema } from './ObjectSchema'
import { StreamSchema } from './StreamSchema'
import { SwitchSchema } from './SwitchSchema'

import { ScalarType } from './ScalarType'

export namespace SchemaReducer {
  const SCHEMA_REDUCER : AnyReducer<Schema<any>> = EventStreamReducer.any()

  const DOCUMENT_REDUCER : EventStreamReducer<any, Schema<any>> = (
    EventStreamReducer.unwrap(SCHEMA_REDUCER)
  )

  const SCALAR_REDUCER : EventStreamReducer<any, ScalarSchema<any>> = (
    EventStreamReducer.tags<number>({
      scalar: EventStreamReducer.token().map(ScalarType.fromString)
    }).map(ScalarSchema.create)
  )

  const ANY_REDUCER : EventStreamReducer<any, AnySchema<any>> = (
    EventStreamReducer.tags<Schema<any>[]>({
      any: EventStreamReducer.stream(SCHEMA_REDUCER)
    })
  ).map(AnySchema.createFromArray)

  const OBJECT_REDUCER : EventStreamReducer<any, ObjectSchema<any>> = (
    EventStreamReducer.tags<{ [key: string]: Schema<any> }>({
      object: EventStreamReducer.object({ '*': DOCUMENT_REDUCER })
    })
  ).map(ObjectSchema.create)

  const STREAM_REDUCER : EventStreamReducer<any, StreamSchema<any>> = (
    EventStreamReducer.tags<Schema<any>>({ stream: DOCUMENT_REDUCER })
  ).map(StreamSchema.create)

  const SWITCH_REDUCER : EventStreamReducer<any, SwitchSchema<any>> = (
    EventStreamReducer.tags<{ [key: string]: Schema<any> }>({
      'switch': EventStreamReducer.object({ '*': DOCUMENT_REDUCER })
    })
  ).map(SwitchSchema.create)

  SCHEMA_REDUCER.reducers.push(SCALAR_REDUCER)
  SCHEMA_REDUCER.reducers.push(ANY_REDUCER)
  SCHEMA_REDUCER.reducers.push(OBJECT_REDUCER)
  SCHEMA_REDUCER.reducers.push(STREAM_REDUCER)
  SCHEMA_REDUCER.reducers.push(SWITCH_REDUCER)


  export function document () : EventStreamReducer<any, Schema<any>> {
    return DOCUMENT_REDUCER
  }

  export function schema () : EventStreamReducer<any, Schema<any>> {
    return SCHEMA_REDUCER
  }

  export function tags () : EventStreamReducer<any, SwitchSchema<any>> {
    return SWITCH_REDUCER
  }

  export function stream () : EventStreamReducer<any, StreamSchema<any>> {
    return STREAM_REDUCER
  }

  export function object () : EventStreamReducer<any, ObjectSchema<any>> {
    return OBJECT_REDUCER
  }

  export function any () : EventStreamReducer<any, AnySchema<any>> {
    return ANY_REDUCER
  }

  export function scalar() : EventStreamReducer<any, ScalarSchema<any>> {
    return SCALAR_REDUCER
  }
}
