import { UnidocValidationMessageProducer } from './UnidocValidationMessageProducer'

export class NullUnidocValidationMessageProducer implements UnidocValidationMessageProducer {
  public prepareNewMessage(): UnidocValidationMessageProducer {
    throw new Error("Method not implemented.")
  }

  public setMessageType(type: number): UnidocValidationMessageProducer {
    throw new Error("Method not implemented.")
  }

  public setMessageCode(code: string): UnidocValidationMessageProducer {
    throw new Error("Method not implemented.")
  }

  public setMessageData(key: string, data: any): UnidocValidationMessageProducer {
    throw new Error("Method not implemented.")
  }

  public produce(): UnidocValidationMessageProducer {
    throw new Error("Method not implemented.")
  }

  public beginGroup(group: any): UnidocValidationMessageProducer {
    throw new Error("Method not implemented.")
  }

  public endGroup(group: any): UnidocValidationMessageProducer {
    throw new Error("Method not implemented.")
  }

  public addEventListener(event: any, listener: any) {
    throw new Error("Method not implemented.")
  }

  public removeEventListener(event: any, listener: any) {
    throw new Error("Method not implemented.")
  }

  public removeAllEventListener(event?: any) {
    throw new Error("Method not implemented.")
  }
}

export namespace NullUnidocValidationMessageProducer {
  export const INSTANCE: NullUnidocValidationMessageProducer = new NullUnidocValidationMessageProducer()
}
