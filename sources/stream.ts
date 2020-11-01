import { Observable } from 'rxjs'

import { UnidocProducer } from './UnidocProducer'
import { RxJSUnidocOutput } from '../consumer/RxJSUnidocOutput'

export function stream<T>(producer: UnidocProducer<T>): Observable<T> {
  const output: RxJSUnidocOutput<T> = new RxJSUnidocOutput()
  output.subscribe(producer)
  return output.observable
}
