import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocPredicate } from './UnidocPredicate'

export class UnidocIsTagEndPredicate implements UnidocPredicate<UnidocEvent> {
  public test(value: UnidocEvent): boolean {
    return value.type === UnidocEventType.END_TAG
  }

  public toString(): string {
    return 'is end of tag'
  }

  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocIsTagEndPredicate) {
      return true
    }

    return false
  }
}

export namespace UnidocIsTagEndPredicate {
  export const INSTANCE: UnidocIsTagEndPredicate = new UnidocIsTagEndPredicate()

  export function create(): UnidocIsTagEndPredicate {
    return INSTANCE
  }
}
