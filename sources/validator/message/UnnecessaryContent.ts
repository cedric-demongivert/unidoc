import { UnidocValidationMessageType } from '../../validation/UnidocValidationMessageType'

export namespace UnnecessaryContent {
  export const TYPE: UnidocValidationMessageType = UnidocValidationMessageType.ERROR
  export const CODE: string = 'standard:blueprint:error:unnecessary-content'

  export namespace Data {
    export const BLUEPRINT: string = 'blueprint'
  }
}
