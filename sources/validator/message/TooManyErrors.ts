import { UnidocValidationMessageType } from '../../validation/UnidocValidationMessageType'

export namespace TooManyErrors {
  export const TYPE: UnidocValidationMessageType = UnidocValidationMessageType.FAILURE
  export const CODE: string = 'standard:blueprint:error:too-many-errors'

  export namespace Data {
    export const BLUEPRINT: string = 'blueprint'
    export const RECOVERIES: string = 'recoveries'
  }
}
