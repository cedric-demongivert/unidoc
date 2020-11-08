import { UnidocSchemaType } from './UnidocSchemaType'
import { UnidocSchema } from './UnidocSchema'

import { UnidocEmptySchema } from './UnidocEmptySchema'

/**
* @see UnidocSchema
* @see UnidocSchemaType.NAMMED
*/
export class UnidocNammedSchema implements UnidocSchema {
  /**
  * @see UnidocSchema.type
  */
  public readonly type: UnidocSchemaType

  /**
  * Name to assign to the requested schema.
  */
  public name: string

  /**
  * The schema that have a name.
  */
  public schema: UnidocSchema

  /**
  * Instanciate a new nammed schema.
  */
  public constructor() {
    this.type = UnidocSchemaType.NAMMED
    this.name = UnidocNammedSchema.DEFAULT_NAME
    this.schema = UnidocNammedSchema.DEFAULT_SCHEMA
  }
}

export namespace UnidocNammedSchema {
  export const DEFAULT_NAME: string = 'unnamed'
  export const DEFAULT_SCHEMA: UnidocSchema = UnidocEmptySchema.INSTANCE

  /**
  * Instantiate a new reference UnidocSchema.
  *
  * @param name- Name of the UnidocSchema to reference.
  *
  * @return A reference UnidocSchema instance.
  */
  export function create(): UnidocNammedSchema {
    return new UnidocNammedSchema()
  }
}
