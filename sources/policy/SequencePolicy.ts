import { Sequence } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { PolicyType } from './PolicyType'
import { Policy } from './Policy'

export class SequencePolicy implements Policy {
  public readonly type : PolicyType
  public readonly lenient : boolean
  public readonly content : Sequence<Policy>

  protected constructor (lenient : boolean, ...policies : Policy[]) {
    this.type = PolicyType.SEQUENCE
    this.lenient = lenient

    const content : Pack<Policy> = Pack.any(policies.length)
    for (const policy of policies) {
      content.push(policy)
    }

    this.content = content.view()
  }
}

export namespace SequencePolicy {
  export class Lenient extends SequencePolicy {
    public constructor (...policies : Policy[]) {
      super(true, ...policies)
    }
  }

  export namespace Lenient {
    export function create (...content : Policy[]) : SequencePolicy.Lenient {
      return new Lenient(...content)
    }
  }

  export class Strict extends SequencePolicy {
    public constructor (...policies : Policy[]) {
      super(false, ...policies)
    }
  }

  export namespace Strict {
    export function create (...content : Policy[]) : SequencePolicy.Strict {
      return new Strict(...content)
    }
  }
}
