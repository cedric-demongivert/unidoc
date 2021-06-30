import { Observable } from 'rxjs'

/**
 * A formatting operator is an operator that transform a stream of events that follow a given standard into a stream of tokens.
 */
export type Formatting<Input> = (source: Observable<Input>) => Observable<string>
