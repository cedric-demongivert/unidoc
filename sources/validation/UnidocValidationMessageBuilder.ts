import { UnidocValidationMessage } from './UnidocValidationMessage'
import { UnidocValidationMessageType } from './UnidocValidationMessageType'

export class UnidocValidationMessageBuilder {
  /**
  *
  */
  private message: UnidocValidationMessage

  /**
  *
  */
  public constructor() {
    this.message = new UnidocValidationMessage()
  }

  /**
  *
  */
  public setData(key: string, value: any): UnidocValidationMessageBuilder {
    this.message.setData(key, value)
    return this
  }

  /**
  *
  */
  public setCode(code: string): UnidocValidationMessageBuilder {
    this.message.setCode(code)
    return this
  }

  /**
  *
  */
  public setType(type: UnidocValidationMessageType): UnidocValidationMessageBuilder {
    this.message.setType(type)
    return this
  }

  /**
  *
  */
  public asVerbose(): UnidocValidationMessageBuilder {
    this.message.asVerbose()
    return this
  }

  /**
  *
  */
  public asInformation(): UnidocValidationMessageBuilder {
    this.message.asInformation()
    return this
  }

  /**
  *
  */
  public asWarning(): UnidocValidationMessageBuilder {
    this.message.asWarning()
    return this
  }

  /**
  *
  */
  public asError(): UnidocValidationMessageBuilder {
    this.message.asError()
    return this
  }

  /**
  *
  */
  public asFailure(): UnidocValidationMessageBuilder {
    this.message.asFailure()
    return this
  }

  /**
  *
  */
  public build(): UnidocValidationMessage {
    return this.message.clone()
  }

  /**
  *
  */
  public get(): UnidocValidationMessage {
    return this.message
  }

  /**
  *
  */
  public configure(message: UnidocValidationMessage): void {
    message.copy(this.message)
  }

  /**
  *
  */
  public clear(): void {
    this.message.clear()
  }

  /**
  *
  */
  public copy(toCopy: UnidocValidationMessageBuilder | UnidocValidationMessage): UnidocValidationMessageBuilder {
    if (toCopy instanceof UnidocValidationMessageBuilder) {
      this.message.copy(toCopy.message)
    } else {
      this.message.copy(toCopy)
    }

    return this
  }

  /**
  *
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocValidationMessageBuilder) {
      return other.message.equals(this.message)
    }

    return false
  }
}

export namespace UnidocValidationMessageBuilder {
  /**
  *
  */
  export const INSTANCE: UnidocValidationMessageBuilder = new UnidocValidationMessageBuilder()

  /**
  *
  */
  export function create(): UnidocValidationMessageBuilder {
    return new UnidocValidationMessageBuilder()
  }

  /**
  *
  */
  export function get(): UnidocValidationMessageBuilder {
    return INSTANCE
  }
}
