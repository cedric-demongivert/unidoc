import { Observable } from 'rxjs'

export type Compilation<Input, Output> = (source : Observable<Input>) => Observable<Output>
