import { UnidocValidationMessageType } from '../../../validation/UnidocValidationMessageType'

export namespace UnexpectedContent {
  export const TYPE: UnidocValidationMessageType = UnidocValidationMessageType.ERROR
  export const CODE: string = 'standard:blueprint:error:unexpected-content'

  export namespace Data {
    export const BLUEPRINT: string = 'blueprint'
  }
}
