import { DataObject } from '../DataObject'
import { UnidocAutomatonSchema } from './UnidocAutomatonSchema'

/**
 * 
 */
export interface UnidocBuilder<Value> extends DataObject<UnidocBuilder<Value>> {
  /**
   * 
   */
  readonly [UnidocAutomatonSchema.SYMBOL]?: UnidocAutomatonSchema | undefined
}