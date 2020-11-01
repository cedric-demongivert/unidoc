import { Observable } from 'rxjs'
import { Subscriber } from 'rxjs'

import { SubscribableUnidocConsumer } from './SubscribableUnidocConsumer'

export class RxJSUnidocOutput<T> extends SubscribableUnidocConsumer<T> {
  public readonly observable: Observable<T>

  private readonly _subscribers: Set<Subscriber<T>>

  public constructor() {
    super()

    this.handleRxSubscription = this.handleRxSubscription.bind(this)

    this._subscribers = new Set()
    this.observable = new Observable(this.handleRxSubscription)
  }

  public handleRxSubscription(subscriber: Subscriber<T>): void {
    this._subscribers.add(subscriber)
  }

  public handleInitialization(): void { }

  public handleProduction(value: T): void {
    for (const subscriber of this._subscribers) {
      subscriber.next(value)
    }
  }

  public handleCompletion(): void {
    for (const subscriber of this._subscribers) {
      subscriber.complete()
    }
  }
  public handleFailure(error: Error): void {
    for (const subscriber of this._subscribers) {
      subscriber.error(error)
    }
  }
}
