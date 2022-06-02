import babel, { GeneratorResult } from '@babel/generator'

import { UnidocAutomatonFragment } from './UnidocAutomatonFragment'

/**
 * 
 */
export namespace UnidocAutomatonGenerator {
  /**
   * 
   */
  export function generate(builder: Function): GeneratorResult {
    return babel(UnidocAutomatonFragment.clazz(builder))
  }
}