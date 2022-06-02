import * as types from '@babel/types'

/**
 * 
 */
export namespace UnidocAutomatonIdentifier {
  /**
   * 
   */
  export const error: types.Identifier = types.identifier('error')

  /**
   * 
   */
  export const builder: types.Identifier = types.identifier('builder')

  /**
   * 
   */
  export const start: types.Identifier = types.identifier('start')

  /**
   * 
   */
  export const constructor: types.Identifier = types.identifier('constructor')

  /**
   * 
   */
  export const next: types.Identifier = types.identifier('next')

  /**
   * 
   */
  export const handleNextWhitespace: types.Identifier = types.identifier('handleNextWhitespace')

  /**
   * 
   */
  export const handleNextWord: types.Identifier = types.identifier('handleNextWord')

  /**
   * 
   */
  export const success: types.Identifier = types.identifier('success')

  /**
   * 
   */
  export const failure: types.Identifier = types.identifier('failure')

  /**
   * 
   */
  export const _result: types.Identifier = types.identifier('_result')

  /**
   * 
   */
  export const event: types.Identifier = types.identifier('event')

  /**
   * 
   */
  export const eventType: types.MemberExpression = types.memberExpression(event, types.identifier('type'))

  /**
   * 
   */
  export const UnidocEventType: types.Identifier = types.identifier('UnidocEventType')

  /**
   * 
   */
  export const WHITESPACE: types.MemberExpression = types.memberExpression(UnidocEventType, types.identifier('WHITESPACE'))

  /**
   * 
   */
  export const WORD: types.MemberExpression = types.memberExpression(UnidocEventType, types.identifier('WORD'))

  /**
   * 
   */
  export const TAG_START: types.MemberExpression = types.memberExpression(UnidocEventType, types.identifier('TAG_START'))

  /**
   * 
   */
  export const TAG_END: types.MemberExpression = types.memberExpression(UnidocEventType, types.identifier('TAG_END'))

  /**
   * 
   */
  export namespace self {
    /**
     * 
     */
    export const builder: types.MemberExpression = types.memberExpression(
      types.thisExpression(),
      UnidocAutomatonIdentifier.builder
    )

    /**
     * 
     */
    export const start: types.MemberExpression = types.memberExpression(
      types.thisExpression(),
      UnidocAutomatonIdentifier.start
    )

    /**
     * 
     */
    export const next: types.MemberExpression = types.memberExpression(
      types.thisExpression(),
      UnidocAutomatonIdentifier.next
    )
    /**
     * 
     */
    export const success: types.MemberExpression = types.memberExpression(
      types.thisExpression(),
      UnidocAutomatonIdentifier.success
    )

    /**
     * 
     */
    export const failure: types.MemberExpression = types.memberExpression(
      types.thisExpression(),
      UnidocAutomatonIdentifier.failure
    )

    /**
     * 
     */
    export const _result: types.MemberExpression = types.memberExpression(
      types.thisExpression(),
      UnidocAutomatonIdentifier._result
    )
  }
}