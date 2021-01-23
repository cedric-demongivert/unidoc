import { UnidocValidationMessageType } from '../../validation/UnidocValidationMessageType'

export namespace ExpectedContent {
  export const TYPE: UnidocValidationMessageType = UnidocValidationMessageType.FAILURE
  export const CODE: string = 'standard:blueprint:failure:expected-content'

  export namespace Data {
    export const BLUEPRINT: string = 'blueprint'
  }
}
