import { UnidocSchemaType } from './UnidocSchemaType'
import { UnidocSchema } from './UnidocSchema'

/**
* @see UnidocSchema
* @see UnidocSchemaType.EMPTY
*/
export class UnidocEmptySchema implements UnidocSchema {
  public readonly type: number

  public constructor() {
    this.type = UnidocSchemaType.EMPTY
  }
}

export namespace UnidocEmptySchema {
  export const INSTANCE: UnidocEmptySchema = new UnidocEmptySchema()

  export function create(): UnidocEmptySchema {
    return INSTANCE
  }
}
