import { UnidocValidationMessageType } from '../../validation/UnidocValidationMessageType'

export namespace PreferredContent {
  export const TYPE: UnidocValidationMessageType = UnidocValidationMessageType.WARNING
  export const CODE: string = 'standard:blueprint:warning:preffered-content'

  export namespace Data {
    export const BLUEPRINT: string = 'blueprint'
  }
}
