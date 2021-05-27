import { Observable } from 'rxjs'

export type Formatting<Input> = (source: Observable<Input>) => Observable<string>
