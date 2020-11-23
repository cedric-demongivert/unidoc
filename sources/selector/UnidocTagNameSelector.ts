import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocSelector } from './UnidocSelector'

export class UnidocTagNameSelector implements UnidocSelector<UnidocEvent, string> {
  public select(value: UnidocEvent): string {
    return value.tag
  }

  public toString(): string {
    return 'tag name'
  }

  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocTagNameSelector) {
      return true
    }

    return false
  }
}

export namespace UnidocTagNameSelector {
  export const INSTANCE: UnidocTagNameSelector = new UnidocTagNameSelector()

  export function create(): UnidocTagNameSelector {
    return INSTANCE
  }
}
