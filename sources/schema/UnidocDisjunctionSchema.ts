import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocSchemaType } from './UnidocSchemaType'
import { UnidocSchema } from './UnidocSchema'

/**
* @see UnidocSchema
* @see UnidocSchemaType.DISJUNCTION
*/
export class UnidocDisjunctionSchema implements UnidocSchema {
  /**
  * @see UnidocSchema.type
  */
  public readonly type: UnidocSchemaType

  /**
  * A sequence that describe each valid content type.
  */
  public schemas: Pack<UnidocSchema>

  public constructor(capacity: number = 8) {
    this.type = UnidocSchemaType.NAMMED
    this.schemas = Pack.any(capacity)
  }
}

export namespace UnidocDisjunctionSchema {
  export function create(): UnidocDisjunctionSchema {
    return new UnidocDisjunctionSchema()
  }
}
