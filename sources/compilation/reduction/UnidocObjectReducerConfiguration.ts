import { UnidocValidationReducer } from './UnidocValidationReducer'

export type UnidocObjectReducerConfiguration = {
  [key: string]: UnidocValidationReducer<any, any>
}
