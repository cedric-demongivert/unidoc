import { UnidocSchemaType } from './UnidocSchemaType'
import { UnidocSchema } from './UnidocSchema'

import { UnidocEmptySchema } from './UnidocEmptySchema'

/**
* @see UnidocSchema
* @see UnidocSchemaType.MANY
*/
export class UnidocManySchema implements UnidocSchema {
  /**
  * @see UnidocSchema.type
  */
  public readonly type: UnidocSchemaType

  /**
  * Minimum number of instances that must be present.
  */
  public minimum: number

  /**
  * Maximum number of instances that must be present.
  */
  public maximum: number

  /**
  * Type of content to accept multiple times.
  */
  public schema: UnidocSchema

  /**
  * Instanciate a new nammed schema.
  */
  public constructor() {
    this.type = UnidocSchemaType.NAMMED
    this.minimum = 0
    this.maximum = Number.POSITIVE_INFINITY
    this.schema = UnidocEmptySchema.INSTANCE
  }
}

export namespace UnidocManySchema {
  export function create(): UnidocManySchema {
    return new UnidocManySchema()
  }
}
