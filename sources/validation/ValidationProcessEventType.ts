export type ValidationProcessEventType = number

export namespace ValidationProcessEventType {
  /**
  * Declare the begining of a sequence of validation.
  */
  export const START_SEQUENCE : ValidationProcessEventType = 0

  /**
  * Declare the termination of a sequence of validation.
  */
  export const END_SEQUENCE : ValidationProcessEventType = 1

  /**
  * Declare the validation of an event.
  */
  export const VALIDATION : ValidationProcessEventType = 2

  /**
  * Declare a message related to the last validation.
  */
  export const MESSAGE : ValidationProcessEventType = 3

  /**
  * Declare an error-recovery.
  */
  export const RECOVERY : ValidationProcessEventType = 4

  /**
  * Declare the begining of a validation forking point.
  */
  export const START_FORK : ValidationProcessEventType = 5

  /**
  * Declare the termination of a validation forking point.
  */
  export const END_FORK : ValidationProcessEventType = 6

  /**
  * Default value.
  */
  export const DEFAULT : ValidationProcessEventType = VALIDATION

  export const ALL : ValidationProcessEventType[] = [
    START_SEQUENCE,
    END_SEQUENCE,
    VALIDATION,
    MESSAGE,
    RECOVERY,
    START_FORK,
    END_FORK
  ]

  export function toString (value : ValidationProcessEventType) : string | undefined {
    switch (value) {
      case START_SEQUENCE : return 'START_SEQUENCE'
      case END_SEQUENCE   : return 'END_SEQUENCE'
      case VALIDATION     : return 'VALIDATION'
      case MESSAGE        : return 'MESSAGE'
      case RECOVERY       : return 'RECOVERY'
      case START_FORK     : return 'START_FORK'
      case END_FORK       : return 'END_FORK'
      default             : return undefined
    }
  }
}
