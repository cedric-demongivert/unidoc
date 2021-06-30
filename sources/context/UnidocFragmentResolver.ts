import { UnidocOrigin } from '../origin/UnidocOrigin'
import { UnidocSymbolGenerator } from '../source/UnidocSymbolGenerator'

import { UnidocImportationResolver } from './UnidocImportationResolver'

import { UnidocImportation } from './UnidocImportation'
import { UnidocResource } from './UnidocResource'

/**
 * 
 */
export class UnidocFragmentResolver extends UnidocImportationResolver {
  /**
   * 
   */
  private readonly _fragments: Map<string, string>

  /**
   * 
   */
  public constructor() {
    super()
    this._fragments = new Map()
  }

  /**
   * 
   */
  public set(fragment: string, content: string): void {
    this._fragments.set(fragment, content)
  }

  /**
   * 
   */
  public async resolve(value: UnidocImportation): Promise<UnidocResource> {
    const fragment: string | undefined = this._fragments.get(value.resource)

    if (fragment == null) {
      throw new Error(
        'Unable to resolve fragment : ' + value.resource + ' because there is ' +
        'no fragment registered with the given name.'
      )
    } else {
      const resource: UnidocResource = new UnidocResource()

      resource.resource = 'fragment://' + value.resource
      resource.reader = UnidocSymbolGenerator.fromString(
        fragment, new UnidocOrigin().resource('fragment://' + value.resource)
      )
      resource.origin.copy(value)

      return resource
    }
  }
}
