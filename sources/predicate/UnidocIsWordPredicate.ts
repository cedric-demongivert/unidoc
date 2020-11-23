import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocPredicate } from './UnidocPredicate'

export class UnidocIsWordPredicate implements UnidocPredicate<UnidocEvent> {
  public test(value: UnidocEvent): boolean {
    return value.type === UnidocEventType.WORD
  }

  public toString(): string {
    return 'is word'
  }

  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocIsWordPredicate) {
      return true
    }

    return false
  }
}

export namespace UnidocIsWordPredicate {
  export const INSTANCE: UnidocIsWordPredicate = new UnidocIsWordPredicate()

  export function create(): UnidocIsWordPredicate {
    return INSTANCE
  }
}
