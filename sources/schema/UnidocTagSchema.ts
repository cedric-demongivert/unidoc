import { UnidocSchemaType } from './UnidocSchemaType'
import { UnidocSchema } from './UnidocSchema'

import { UnidocEmptySchema } from './UnidocEmptySchema'

export class UnidocTagSchema implements UnidocSchema {
  /**
  * @see UnidocSchema.type
  */
  public readonly type: UnidocSchemaType

  /**
  * Expected tag.
  */
  public name: string

  /**
  * A schema of the content of the tag.
  */
  public schema: UnidocSchema

  public constructor() {
    this.type = UnidocSchemaType.TAG
    this.name = UnidocTagSchema.DEFAULT_TAG
    this.schema = UnidocTagSchema.DEFAULT_SCHEMA
  }
}

export namespace UnidocTagSchema {
  export const DEFAULT_TAG: string = 'block'
  export const DEFAULT_SCHEMA: UnidocSchema = UnidocEmptySchema.INSTANCE

  export function create(): UnidocTagSchema {
    return new UnidocTagSchema()
  }
}
