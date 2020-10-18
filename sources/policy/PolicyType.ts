export type PolicyType = number

export namespace PolicyType {
  export const TAG       : PolicyType = 0
  export const ANYTHING  : PolicyType = 1
  export const NAMMED    : PolicyType = 2

  export const ALL : PolicyType[] = [
    TAG,
    ANYTHING,
    NAMMED
  ]

  export function toString (type : PolicyType) : string | undefined {
    switch (type) {
      case TAG       : return 'TAG'
      case ANYTHING  : return 'ANYTHING'
      case NAMMED    : return 'NAMMED'
      default        : return undefined
    }
  }
}
