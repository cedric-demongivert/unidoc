import { Observable } from 'rxjs'
import { Subscriber } from 'rxjs'

import { UnidocQuery } from './UnidocQuery'

type Operator<In, Out> = (source : Observable<In>) => Observable<Out>

/**
* Transform a stream of event into a stream of query result.
*
* @param query - A query to use.
*
* @return An operator that transform a stream of events to a stream of query result.
*/
export function query <Input, Output> (query : UnidocQuery<Input, Output>) : Operator<Input, Output> {
  return function (input : Observable<Input>) : Observable<Output> {
    return new Observable<Output>(
      function (subscriber : Subscriber<Output>) {
        query.addEventListener('next', subscriber.next.bind(subscriber))
        query.addEventListener('complete', subscriber.complete.bind(subscriber))

        query.start()

        input.subscribe(
          query.next.bind(query),
          query.complete.bind(query),
          subscriber.error.bind(subscriber)
        )
      }
    )
  }
}
