import { EventStreamReducer } from '../reducer/EventStreamReducer'
import { AnyReducer } from '../reducer/AnyReducer'

import { ScalarSchema } from './ScalarSchema'
import { AnySchema } from './AnySchema'
import { ObjectSchema } from './ObjectSchema'
import { StreamSchema } from './StreamSchema'
import { SwitchSchema } from './SwitchSchema'

import { SchemaType } from './SchemaType'

export type Schema<T> = {
  type: SchemaType,
  description: any
}

export namespace Schema {
  export const integer = ScalarSchema.integer
  export const float = ScalarSchema.float
  export const token = ScalarSchema.token
  export const text = ScalarSchema.text

  export const any = AnySchema.create
  export const object = ObjectSchema.create
  export const stream = StreamSchema.create
  export const tags = SwitchSchema.create

  /*
  const REDUCER : AnyReducer<Schema<any>> = EventStreamReducer.any()

  REDUCER.reducers.push(ScalarSchema.reducer())
  REDUCER.reducers.push(AnySchema.reducer())
  REDUCER.reducers.push(ObjectSchema.reducer())
  REDUCER.reducers.push(StreamSchema.reducer())
  REDUCER.reducers.push(SwitchSchema.reducer())

  export function reducer () : EventStreamReducer<any, Schema<any>> {
    return REDUCER
  }
  */
}
