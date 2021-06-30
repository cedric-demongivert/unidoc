import { Observable } from 'rxjs'

/**
 * A compilation operator is an operator that transform a stream of events from a given standard into a stream of events
 * that follows another standard.
 */
export type Compilation<Input, Output> = (source: Observable<Input>) => Observable<Output>
