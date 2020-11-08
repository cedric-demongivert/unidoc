import { UnidocSchemaType } from './UnidocSchemaType'

import { UnidocContentSchema } from './UnidocContentSchema'
import { UnidocDisjunctionSchema } from './UnidocDisjunctionSchema'
import { UnidocSequenceSchema } from './UnidocSequenceSchema'
import { UnidocSetSchema } from './UnidocSetSchema'
import { UnidocTagSchema } from './UnidocTagSchema'
import { UnidocWhitespaceSchema } from './UnidocWhitespaceSchema'
import { UnidocWordSchema } from './UnidocWordSchema'
import { UnidocNammedSchema } from './UnidocNammedSchema'

/**
* A schema is a description of class of unidoc document.
*/
export interface UnidocSchema {
  /**
  * Number that describe the nature of the schema.
  */
  readonly type: UnidocSchemaType
}

export namespace UnidocSchema {
  export function content(): UnidocContentSchema {
    return UnidocContentSchema.INSTANCE
  }

  export function whitespace(): UnidocWhitespaceSchema {
    return UnidocWhitespaceSchema.INSTANCE
  }

  export function word(): UnidocWordSchema {
    return UnidocWordSchema.INSTANCE
  }

  export function tag(name: string = UnidocTagSchema.DEFAULT_TAG, schema: UnidocSchema = UnidocTagSchema.DEFAULT_SCHEMA): UnidocWordSchema {
    const result: UnidocTagSchema = new UnidocTagSchema()

    result.name = name
    result.schema = schema

    return result
  }

  export function nammed(name: string = UnidocNammedSchema.DEFAULT_NAME, content: UnidocSchema = UnidocNammedSchema.DEFAULT_SCHEMA): UnidocNammedSchema {
    const result: UnidocNammedSchema = new UnidocNammedSchema()

    result.name = name
    result.schema = content

    return result
  }

  export function disjunction(...values: UnidocSchema[]): UnidocDisjunctionSchema {
    const result: UnidocDisjunctionSchema = new UnidocDisjunctionSchema()

    for (const value of values) {
      result.schemas.push(value)
    }

    return result
  }

  export function sequence(...values: UnidocSchema[]): UnidocSequenceSchema {
    const result: UnidocSequenceSchema = new UnidocSequenceSchema()

    for (const value of values) {
      result.schemas.push(value)
    }

    return result
  }

  export function set(...values: UnidocSchema[]): UnidocSetSchema {
    const result: UnidocSetSchema = new UnidocSetSchema()

    for (const value of values) {
      result.schemas.push(value)
    }

    return result
  }
}
