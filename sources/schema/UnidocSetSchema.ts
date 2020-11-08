import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocSchemaType } from './UnidocSchemaType'
import { UnidocSchema } from './UnidocSchema'

/**
* @see UnidocSchema
* @see UnidocSchemaType.SET
*/
export class UnidocSetSchema implements UnidocSchema {
  /**
  * @see UnidocSchema.type
  */
  public readonly type: UnidocSchemaType

  /**
  * A sequence that describe each content type that must be present.
  */
  public schemas: Pack<UnidocSchema>

  public constructor(capacity: number = 8) {
    this.type = UnidocSchemaType.SET
    this.schemas = Pack.any(capacity)
  }
}

export namespace UnidocSetSchema {
  export function create(): UnidocSetSchema {
    return new UnidocSetSchema()
  }
}
