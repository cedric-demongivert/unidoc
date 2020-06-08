export type UnidocQueryCommand = number

export namespace UnidocQueryCommand {
  /**
  * The AWAIT signal request the parent automaton to not
  */
  export const AWAIT : UnidocQueryCommand = 0

  /**
  * DROP is a signal that request to stop to execute the rule and to drop the
  * chain of event that leaded to
  */
  export const DROP : UnidocQueryCommand = 1

  /**
  * When a rule return CONTINUE the execution can update it's state.
  */
  export const CONTINUE : UnidocQueryCommand = 2

  /**
  * When a rule return FORGET the execution can continue
  */
  export const FORGET   : UnidocQueryCommand = 3

  export const ALL : UnidocQueryCommand[] = [
    AWAIT,
    DROP,
    CONTINUE,
    FORGET
  ]

  export function toString (value : UnidocQueryCommand) : string {
    switch (value) {
      case AWAIT    : return 'AWAIT'
      case DROP     : return 'DROP'
      case CONTINUE : return 'CONTINUE'
      case FORGET   : return 'FORGET'
      default       : return undefined
    }
  }
}
