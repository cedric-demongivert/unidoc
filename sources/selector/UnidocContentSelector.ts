import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocSelector } from './UnidocSelector'

export class UnidocContentSelector implements UnidocSelector<UnidocEvent, string> {
  public select(value: UnidocEvent): string {
    return value.text
  }

  public toString(): string {
    return 'content'
  }

  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocContentSelector) {
      return true
    }

    return false
  }
}

export namespace UnidocContentSelector {
  export const INSTANCE: UnidocContentSelector = new UnidocContentSelector()

  export function create(): UnidocContentSelector {
    return INSTANCE
  }
}
