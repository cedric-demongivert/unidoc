import { UnidocSymbols } from '../symbol'
import { UnidocURI } from '../origin'

import { UnidocImportResolver } from './UnidocImportResolver'
import { UnidocImport } from './UnidocImport'
import { UnidocResource } from './UnidocResource'
import { UnidocIteratorResource } from './UnidocIteratorResource'

/**
 * 
 */
export class UnidocFragmentResolver implements UnidocImportResolver {
  /**
   * 
   */
  private readonly _fragments: Map<string, string>

  /**
   * 
   */
  private readonly _uri: UnidocURI

  /**
   * 
   */
  public constructor() {
    this._fragments = new Map()
    this._uri = new UnidocURI()
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
  public resolve(value: UnidocImport): UnidocResource {
    const fragment: string | undefined = this._fragments.get(value.identifier)

    if (fragment == null) {
      throw new Error(
        'Unable to resolve import ' + value.toString() + ' because there is ' +
        'no fragment registered with the given name.'
      )
    } else {
      const uri: UnidocURI = this._uri
      uri.scheme = 'fragment'
      uri.identifier = value.identifier

      return new UnidocIteratorResource(uri, value, UnidocSymbols.fromString(fragment, uri.clone()))
    }
  }
}
