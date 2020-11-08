import { UnidocSchemaType } from './UnidocSchemaType'
import { UnidocSchema } from './UnidocSchema'

/**
* @see UnidocSchema
* @see UnidocSchemaType.WHITESPACE
*/
export class UnidocWhitespaceSchema implements UnidocSchema {
  public readonly type: number

  public constructor() {
    this.type = UnidocSchemaType.WHITESPACE
  }
}

export namespace UnidocWhitespaceSchema {
  export const INSTANCE: UnidocWhitespaceSchema = new UnidocWhitespaceSchema()

  export function create(): UnidocWhitespaceSchema {
    return INSTANCE
  }
}
