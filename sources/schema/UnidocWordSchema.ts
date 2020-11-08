import { UnidocSchemaType } from './UnidocSchemaType'
import { UnidocSchema } from './UnidocSchema'

/**
* @see UnidocSchema
* @see UnidocSchemaType.WORD
*/
export class UnidocWordSchema implements UnidocSchema {
  public readonly type: number

  public constructor() {
    this.type = UnidocSchemaType.WORD
  }
}

export namespace UnidocWordSchema {
  export const INSTANCE: UnidocWordSchema = new UnidocWordSchema()

  export function create(): UnidocWordSchema {
    return INSTANCE
  }
}
