import { UnidocValidationMessageType } from '../../validation/UnidocValidationMessageType'

export namespace TooManyContent {
  export const TYPE: UnidocValidationMessageType = UnidocValidationMessageType.ERROR
  export const CODE: string = 'standard:blueprint:error:too-many-content'

  export namespace Data {
    export const BLUEPRINT: string = 'blueprint'
  }

  export namespace Strict {
    export const TYPE: UnidocValidationMessageType = UnidocValidationMessageType.FAILURE
    export const CODE: string = 'standard:blueprint:failure:too-many-content'

    export namespace Data {
      export const BLUEPRINT: string = 'blueprint'
    }
  }
}
