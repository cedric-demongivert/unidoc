import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocSchemaType } from './UnidocSchemaType'
import { UnidocSchema } from './UnidocSchema'

/**
* @see UnidocSchema
* @see UnidocSchemaType.SEQUENCE
*/
export class UnidocSequenceSchema implements UnidocSchema {
  /**
  * @see UnidocSchema.type
  */
  public readonly type: UnidocSchemaType

  /**
  * A sequence that describe each content type that must be present.
  */
  public schemas: Pack<UnidocSchema>

  public constructor(capacity: number = 8) {
    this.type = UnidocSchemaType.SEQUENCE
    this.schemas = Pack.any(capacity)
  }
}

export namespace UnidocSequenceSchema {
  export function create(): UnidocSequenceSchema {
    return new UnidocSequenceSchema()
  }
}
