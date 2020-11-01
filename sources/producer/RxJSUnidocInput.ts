import { Observable } from 'rxjs'
import { Subscription } from 'rxjs'

import { ListenableUnidocProducer } from './ListenableUnidocProducer'

export class RxJSUnidocInput<T> extends ListenableUnidocProducer<T> {
  private readonly _observable: Observable<T>
  private _subscription: Subscription | null

  private _first: boolean

  public constructor(observable: Observable<T>) {
    super()

    this._observable = observable
    this._first = true

    this.produce = this.produce.bind(this)
    this.fail = this.fail.bind(this)
    this.complete = this.complete.bind(this)

    this._subscription = this._observable.subscribe(
      this.produce,
      this.fail,
      this.complete
    )
  }

  public produce(value: T): void {
    if (this._first) {
      this.initialize()
      this._first = false
    }

    super.produce(value)
  }

  public unsubscribe(): void {
    if (this._subscription) {
      this._subscription.unsubscribe()
      this._subscription = null
    }
  }

  public subscribe(): void {
    if (this._subscription == null) {
      this._subscription = this._observable.subscribe(
        this.produce,
        this.fail,
        this.complete
      )
    }
  }
}
