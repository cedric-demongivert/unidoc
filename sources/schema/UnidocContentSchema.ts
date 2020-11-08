import { UnidocSchemaType } from './UnidocSchemaType'
import { UnidocSchema } from './UnidocSchema'

/**
* @see UnidocSchema
* @see UnidocSchemaType.CONTENT
*/
export class UnidocContentSchema implements UnidocSchema {
  public readonly type: number

  public constructor() {
    this.type = UnidocSchemaType.CONTENT
  }
}

export namespace UnidocContentSchema {
  export const INSTANCE: UnidocContentSchema = new UnidocContentSchema()

  export function create(): UnidocContentSchema {
    return INSTANCE
  }
}
