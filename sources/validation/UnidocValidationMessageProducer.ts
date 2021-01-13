import { UnidocValidationMessageType } from './UnidocValidationMessageType'

export interface UnidocValidationMessageProducer {
  prepareNewMessage(): UnidocValidationMessageProducer
  setMessageType(type: UnidocValidationMessageType): UnidocValidationMessageProducer
  setMessageCode(code: string): UnidocValidationMessageProducer
  setMessageData(key: string, data: any): UnidocValidationMessageProducer
  beginGroup(group: any): UnidocValidationMessageProducer
  endGroup(group: any): UnidocValidationMessageProducer
  produce(): UnidocValidationMessageProducer
}
