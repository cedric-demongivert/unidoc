import { UnidocLocation } from '../UnidocLocation'
import { CodePoint } from '../CodePoint'

import { UnidocLocationTrackerState } from './UnidocLocationTrackerState'

export class UnidocLocationTracker {
  public readonly location : UnidocLocation
  private _state : UnidocLocationTrackerState

  public constructor () {
    this.location = new UnidocLocation()
    this._state = UnidocLocationTrackerState.DEFAULT
  }

  public next (symbol : CodePoint) : void {
    switch (symbol) {
      case CodePoint.CARRIAGE_RETURN:
        this.location.add(1, 0, 1)
        this.location.column = 0
        this._state = UnidocLocationTrackerState.RETURN
        break
      case CodePoint.NEW_LINE:
        if (this._state === UnidocLocationTrackerState.RETURN) {
          this.location.add(0, 0, 1)
          this._state = UnidocLocationTrackerState.SYMBOL
        } else {
          this.location.add(1, 0, 1)
        }
        this.location.column = 0
        break
      default:
        this.location.add(0, 1, 1)
        this._state = UnidocLocationTrackerState.SYMBOL
        break
    }
  }

  public clear () : void {
    this.location.clear()
    this._state = UnidocLocationTrackerState.DEFAULT
  }

  public copy (toCopy : UnidocLocationTracker) : void {
    this.location.copy(toCopy.location)
    this._state = toCopy._state
  }

  public clone () : UnidocLocationTracker {
    const result : UnidocLocationTracker = new UnidocLocationTracker()
    result.copy(this)
    return result
  }

  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocLocationTracker) {
      return other.location.equals(this.location) &&
             other._state === this._state
    }

    return false
  }
}
