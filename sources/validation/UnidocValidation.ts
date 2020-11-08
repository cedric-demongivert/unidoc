import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocValidationManager } from './UnidocValidationManager'
import { UnidocValidationMessage } from './UnidocValidationMessage'

export class UnidocValidation {
  /**
  * Parent manager of this validation object.
  */
  public manager: UnidocValidationManager

  /**
  * Index of the next event.
  */
  private process: number

  public constructor(manager: UnidocValidationManager, process: number) {
    this.manager = manager
    this.process = process
  }

  /**
  * Notify the begining of this process.
  */
  public start(): void {
    this.manager.start(this.process)
  }

  /**
  * Notify the termination of this process.
  */
  public end(): void {
    this.manager.end(this.process)
  }

  /**
  * Notify the validation of the given event by this process.
  *
  * @param event - The event that is validated.
  */
  public validate(event: UnidocEvent): void {
    this.manager.validate(this.process, event)
  }

  /**
  * Notify the publication of the given message by the given process.
  *
  * @param message - The message to publish.
  */
  public publish(message: UnidocValidationMessage): void {
    this.manager.publish(this.process, message)
  }

  /**
  * Fork this process and return a new process number.
  *
  * @return The identifier of the new sub-process.
  */
  public fork(): number {
    return this.manager.fork(this.process)
  }

  public as(manager: UnidocValidationManager, process: number): void {
    this.manager = manager
    this.process = process
  }
}
