import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocPredicate } from './UnidocPredicate'

export class UnidocIsWhitespacePredicate implements UnidocPredicate<UnidocEvent> {
  public test(value: UnidocEvent): boolean {
    return value.type === UnidocEventType.WHITESPACE
  }

  public toString(): string {
    return 'is whitespace'
  }

  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocIsWhitespacePredicate) {
      return true
    }

    return false
  }
}

export namespace UnidocIsWhitespacePredicate {
  export const INSTANCE: UnidocIsWhitespacePredicate = new UnidocIsWhitespacePredicate()

  export function create(): UnidocIsWhitespacePredicate {
    return INSTANCE
  }
}
