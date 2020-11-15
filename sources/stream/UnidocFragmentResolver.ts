import { UnidocOrigin } from '../origin/UnidocOrigin'
import { UnidocSymbolReader } from '../reader/UnidocSymbolReader'

import { UnidocImportationResolver } from './UnidocImportationResolver'

export class UnidocFragmentResolver implements UnidocImportationResolver {
  private readonly _fragments: Map<string, string>

  public constructor() {
    this._fragments = new Map()
  }

  public set(fragment: string, content: string): void {
    this._fragments.set(fragment, content)
  }

  public async resolve(identifier: string): Promise<UnidocSymbolReader> {
    const fragment: string | undefined = this._fragments.get(identifier)
    if (fragment == null) {
      throw new Error(
        'Unable to resolve fragment : ' + identifier + ' because there is ' +
        'no fragment registered with the given name.'
      )
    } else {
      return UnidocSymbolReader.fromString(fragment, new UnidocOrigin().resource('fragment://' + identifier))
    }
  }

  public begin(identifier: string): void {
  }

  public end(identifier: string): void {
  }
}
