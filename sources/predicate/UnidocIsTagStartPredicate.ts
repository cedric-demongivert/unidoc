import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocPredicate } from './UnidocPredicate'

export class UnidocIsTagStartPredicate implements UnidocPredicate<UnidocEvent> {
  public test(value: UnidocEvent): boolean {
    return value.type === UnidocEventType.START_TAG
  }

  public toString(): string {
    return 'is start of tag'
  }

  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocIsTagStartPredicate) {
      return true
    }

    return false
  }
}

export namespace UnidocIsTagStartPredicate {
  export const INSTANCE: UnidocIsTagStartPredicate = new UnidocIsTagStartPredicate()

  export function create(): UnidocIsTagStartPredicate {
    return INSTANCE
  }
}
