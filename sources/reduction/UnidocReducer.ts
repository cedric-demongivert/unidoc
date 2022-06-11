
import { Factory } from '@cedric-demongivert/gl-tool-utils'

import { UnidocReduction } from './UnidocReduction'

import { findTag as findTagReducer } from './findTag'
import { reduceMany as reduceManyReducer } from './reduceMany'
import { reduceTag as reduceTagReducer } from './reduceTag'
import { reduceText as reduceTextReducer } from './reduceText'
import { reduceToken as reduceTokenReducer } from './reduceToken'
import { reduceWhitespaces as reduceWhitespacesReducer } from './reduceWhitespaces'
import { reduceWords as reduceWordsReducer } from './reduceWords'
import { skipTag as skipTagReducer } from './skipTag'
import { skipText as skipTextReducer } from './skipText'
import { skipWhitespaces as skipWhitespacesReducer } from './skipWhitespaces'
import { skipWords as skipWordsReducer } from './skipWords'


/**
*
*/
export type UnidocReducer<Product> = Factory<UnidocReduction<Product>>

/**
*
*/
export namespace UnidocReducer {
  /**
   * 
   */
  export const findTag = findTagReducer

  /**
   * 
   */
  export const reduceMany = reduceManyReducer

  /**
   * 
   */
  export const reduceTag = reduceTagReducer

  /**
   * 
   */
  export const reduceText = reduceTextReducer

  /**
   * 
   */
  export const reduceToken = reduceTokenReducer

  /**
   * 
   */
  export const reduceWhitespaces = reduceWhitespacesReducer

  /**
   * 
   */
  export const reduceWords = reduceWordsReducer

  /**
   * 
   */
  export const skipTag = skipTagReducer

  /**
   * 
   */
  export const skipText = skipTextReducer

  /**
   * 
   */
  export const skipWhitespaces = skipWhitespacesReducer

  /**
   * 
   */
  export const skipWords = skipWordsReducer
}
