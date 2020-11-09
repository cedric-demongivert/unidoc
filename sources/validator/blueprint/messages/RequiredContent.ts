import { UnidocValidationMessageType } from '../../../validation/UnidocValidationMessageType'

export namespace RequiredContent {
  export const TYPE: UnidocValidationMessageType = UnidocValidationMessageType.ERROR
  export const CODE: string = 'standard:blueprint:error:required-content'

  export namespace Data {
    export const BLUEPRINT: string = 'blueprint'
  }
}
