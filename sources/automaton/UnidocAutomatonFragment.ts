import * as types from '@babel/types'

import { Set } from '@cedric-demongivert/gl-tool-collection'

import { UnidocAutomaton } from './UnidocAutomaton'
import { UnidocAutomatonIdentifier } from './UnidocAutomatonIdentifier'
import { UnidocAutomatonSchema } from './UnidocAutomatonSchema'

/**
 * 
 */
const NO_PARAMETERS: any[] = []

/**
 * 
 */
const EVENT: types.Identifier[] = [UnidocAutomatonIdentifier.event]

/**
 * 
 */
const ERROR: types.Identifier[] = [UnidocAutomatonIdentifier.error]

/**
 * 
 */
const KIND_METHOD: 'method' = 'method'

/**
 * 
 */
const KIND_CONST: 'const' = 'const'

/**
 * 
 */
const KIND_CONSTRUCTOR: 'constructor' = 'constructor'

/**
 * 
 */
export namespace UnidocAutomatonFragment {
  /**
   * 
   */
  export function clazz(builder: Function): types.ClassDeclaration {
    const schema: UnidocAutomatonSchema = UnidocAutomatonSchema.get(builder)
    const body: types.ClassMethod[] = []
    const handleNextWhitespaceMethod: types.ClassMethod | undefined = handleNextWhitespace(schema)

    body.push(constructor(builder))
    if (handleNextWhitespaceMethod) body.push(handleNextWhitespaceMethod)

    return types.classDeclaration(
      types.identifier(builder.name + 'Automaton'),
      types.identifier(UnidocAutomaton.name),
      types.classBody(body)
    )
  }

  /**
   * 
   */
  export function handleNextWhitespace(schema: UnidocAutomatonSchema): types.ClassMethod | undefined {
    const listeners: Set<string> = schema.whitespaceListeners

    if (listeners.size < 1) return undefined

    const statements: types.Statement[] = []
    const builder: types.Expression = listeners.size === 1 ? UnidocAutomatonIdentifier.self.builder : UnidocAutomatonIdentifier.builder

    if (listeners.size > 1) {
      statements.push(bind(UnidocAutomatonIdentifier.self.builder, UnidocAutomatonIdentifier.builder))
    }

    for (const listener of listeners) {
      statements.push(call(types.memberExpression(builder, types.identifier(listener)), EVENT))
    }

    return types.classMethod(KIND_METHOD, UnidocAutomatonIdentifier.handleNextWhitespace, EVENT, types.blockStatement(statements))
  }

  /**
   * 
   */
  export function start(value: Function): types.ClassMethod {
    const schema: UnidocAutomatonSchema = UnidocAutomatonSchema.get(value)
    const statements: types.Statement[] = []

    for (const listener of schema.startListeners) {
      statements.push(call(
        types.memberExpression(UnidocAutomatonIdentifier.self.builder, types.identifier(listener)),
        NO_PARAMETERS
      ))
    }

    return types.classMethod(
      KIND_METHOD, UnidocAutomatonIdentifier.start, NO_PARAMETERS, types.blockStatement(statements)
    )
  }

  /**
   * 
   */
  export function failure(value: Function): types.ClassMethod {
    const schema: UnidocAutomatonSchema = UnidocAutomatonSchema.get(value)
    const statements: types.Statement[] = []

    for (const listener of schema.failureListeners) {
      statements.push(call(
        types.memberExpression(UnidocAutomatonIdentifier.self.builder, types.identifier(listener)),
        ERROR
      ))
    }

    return types.classMethod(
      KIND_METHOD, UnidocAutomatonIdentifier.failure, ERROR, types.blockStatement(statements)
    )
  }

  /**
   * 
   */
  export function success(value: Function): types.ClassMethod {
    const schema: UnidocAutomatonSchema = UnidocAutomatonSchema.get(value)
    const statements: types.Statement[] = []

    for (const listener of schema.successListeners) {
      statements.push(call(
        types.memberExpression(UnidocAutomatonIdentifier.self.builder, types.identifier(listener)),
        NO_PARAMETERS
      ))
    }

    if (schema.resultProvider != null) {
      statements.push(
        assign(
          UnidocAutomatonIdentifier.self._result,
          types.callExpression(
            types.memberExpression(UnidocAutomatonIdentifier.self.builder, types.identifier(schema.resultProvider)),
            NO_PARAMETERS
          )
        )
      )
    }

    return types.classMethod(
      KIND_METHOD, UnidocAutomatonIdentifier.success, NO_PARAMETERS, types.blockStatement(statements)
    )
  }

  /**
   * 
   */
  export function call(callee: types.Expression, parameters: types.Expression[]): types.Statement {
    return types.expressionStatement(types.callExpression(callee, parameters))
  }

  /**
   * 
   */
  export function assign(left: types.LVal, right: types.Expression): types.Statement {
    return types.expressionStatement(types.assignmentExpression('=', left, right))
  }

  /**
   * 
   */
  export function instantiate(value: string, parameters: types.Expression[]): types.NewExpression {
    return types.newExpression(types.identifier(value), parameters)
  }

  /**
   * 
   */
  export function constructor(value: Function): types.ClassMethod {
    const statements: types.Statement[] = [
      call(types.super(), NO_PARAMETERS),
      assign(UnidocAutomatonIdentifier.self.builder, instantiate(value.name, NO_PARAMETERS)),
      assign(UnidocAutomatonIdentifier.self._result, types.nullLiteral())
    ]

    return types.classMethod(KIND_CONSTRUCTOR, UnidocAutomatonIdentifier.constructor, NO_PARAMETERS, types.blockStatement(statements))
  }

  /**
   * 
   */
  export function bind(left: types.Expression, right: types.Identifier): types.Statement {
    return types.variableDeclaration(
      KIND_CONST, [
      types.variableDeclarator(right, left)
    ]
    )
  }

  /**
   * 
   */
  export function next(value: Function): types.ClassMethod {
    const schema: UnidocAutomatonSchema = UnidocAutomatonSchema.get(value)

    const statements: types.Statement[] = [
      bind(UnidocAutomatonIdentifier.self.builder, UnidocAutomatonIdentifier.builder)
    ]

    for (const listener of schema.eventListeners) {
      statements.push(call(
        types.memberExpression(UnidocAutomatonIdentifier.builder, types.identifier(listener)),
        EVENT
      ))
    }

    statements.push(nextSwitch(value))

    return types.classMethod(KIND_CONSTRUCTOR, UnidocAutomatonIdentifier.next, NO_PARAMETERS, types.blockStatement(statements))
  }

  /**
   * 
   */
  function nextWhitespaceCase(value: Function): types.SwitchCase {
    const schema: UnidocAutomatonSchema = UnidocAutomatonSchema.get(value)

    const statements: types.Statement[] = []

    for (const listener of schema.whitespaceListeners) {
      statements.push(call(
        types.memberExpression(UnidocAutomatonIdentifier.builder, types.identifier(listener)),
        EVENT
      ))
    }

    /*for (const listener of schema.content) {
      statements.push(call(
        types.memberExpression(UnidocAutomatonIdentifier.builder, types.identifier(listener)),
        EVENT
      ))
    }*/

    statements.push(types.breakStatement())

    return types.switchCase(UnidocAutomatonIdentifier.WHITESPACE, statements)
  }



  /**
   * 
   */
  function nextWordCase(value: Function): types.SwitchCase {
    const schema: UnidocAutomatonSchema = UnidocAutomatonSchema.get(value)

    const statements: types.Statement[] = []

    for (const listener of schema.wordListeners) {
      statements.push(call(
        types.memberExpression(UnidocAutomatonIdentifier.builder, types.identifier(listener)),
        EVENT
      ))
    }

    /*for (const listener of schema.content) {
      statements.push(call(
        types.memberExpression(UnidocAutomatonIdentifier.builder, types.identifier(listener)),
        EVENT
      ))
    }*/

    statements.push(types.breakStatement())

    return types.switchCase(UnidocAutomatonIdentifier.WORD, statements)
  }

  /**
   * 
   */
  function nextSwitch(value: Function): types.Statement {
    return types.switchStatement(
      UnidocAutomatonIdentifier.eventType,
      [
        nextWhitespaceCase(value),
        nextWordCase(value)
      ]
    )
  }

}