import { PolicyType } from './PolicyType'
import { Policy } from './Policy'

export class DocumentPolicy implements Policy {
  public readonly type : PolicyType
  public readonly rules : Map<string, Policy>
  public readonly document : Policy

  public constructor (rules : Map<string, Policy>) {
    this.type = PolicyType.DOCUMENT

    if (!rules.has('document')) {
      throw new Error(
        'Unable to instantiate a document policy without a document rule ' +
        'that act as an entry point.'
      )
    }

    this.document = rules.get('document') as Policy
    this.rules = new Map(rules)
  }
}

export namespace DocumentPolicy {
  export function create (rules : Map<string, Policy>) : DocumentPolicy
  export function create (rules : { [key: string] : Policy }) : DocumentPolicy
  export function create (rules : Map<string, Policy> | { [key: string] : Policy }) : DocumentPolicy {
    if (rules instanceof Map) {
      return new DocumentPolicy(rules)
    } else {
      const result : Map<string, Policy> = new Map()

      for (const key of Object.keys(rules)) {
        result.set(key, rules[key])
      }

      return new DocumentPolicy(result)
    }
  }
}
