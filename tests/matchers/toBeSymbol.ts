import chalk from 'chalk'

import { UnidocSymbol, UTF32CodeUnit } from '../../sources/symbol'
import { UnicodeTablePrinter } from './UnicodeTablePrinter'
import { UnidocOrigin } from '../../sources/origin/UnidocOrigin';

/**
 * 
 */
declare global {
  /**
   * 
   */
  namespace jest {
    /**
     * 
     */
    interface Matchers<R> {
      /**
       * 
       */
      toBeSymbol(symbol: UTF32CodeUnit): R;

      /**
       * 
       */
      toBeSymbol(origin: UnidocOrigin, symbol: UTF32CodeUnit): R;

      /**
       * 
       */
      toBeSymbol(symbol: UnidocSymbol): R;
    }
  }
}

/**
 * 
 */
function createNullMessage(this: jest.MatcherContext, received: null | undefined) {
  return (
    `Expected value to be an instance of ${UnidocSymbol.constructor.name} but ` +
    `received ${this.utils.printReceived(received)} instead.`
  )
}

/**
 * 
 */
function createNotAnObjectMessage(this: jest.MatcherContext, received: unknown) {
  return (
    `Expected value to be an instance of ${UnidocSymbol.constructor.name} but ` +
    `received an instance of ${typeof received} instead.`
  )
}

/**
 * 
 */
function createNotASymbolMessage(this: jest.MatcherContext, received: object) {
  return (
    `Expected value to be an instance of ${UnidocSymbol.constructor.name} but ` +
    `received an instance of ${received.constructor.name} instead.`
  )
}

/**
 * 
 */
function createDifferentSymbolMessage(this: jest.MatcherContext, received: UnidocSymbol, expected: UnidocSymbol) {
  const printer: UnicodeTablePrinter = new UnicodeTablePrinter(3)

  printer.pushValues('property', 'received', 'expected')
  printer.tint(undefined)

  printer.pushValues('code', UTF32CodeUnit.toDebugString(received.code), UTF32CodeUnit.toDebugString(expected.code))
  printer.tint(received.code === expected.code ? chalk.green : chalk.red)

  printer.pushValues('range', received.origin.range.toString(), expected.origin.range.toString())
  printer.tint(received.origin.range.equals(expected.origin.range) ? chalk.green : chalk.red)

  printer.pushValues('source', received.origin.source.toString(), expected.origin.source.toString())
  printer.tint(received.origin.source.equals(expected.origin.source) ? chalk.green : chalk.red)

  return (
    `Expected ${received.toString()} to be ${expected.toString()} but there is notable differences :\r\n` +
    `${printer.head(0)}\r\n` +
    `${printer.after(1)}\r\n` +
    `${printer.head(0)}`
  )
}

/**
 * 
 */
function createEqualSymbolMessage(this: jest.MatcherContext, received: UnidocSymbol, expected: UnidocSymbol) {
  return `Expected ${received.toString()} not to be ${expected.toString()}.`
}

/**
 * 
 */
export function toBeSymbol(this: jest.MatcherContext, received: unknown, origin: UnidocOrigin, symbol: UTF32CodeUnit): jest.CustomMatcherResult
/**
 * 
 */
export function toBeSymbol(this: jest.MatcherContext, received: unknown, expected: UTF32CodeUnit): jest.CustomMatcherResult
/**
 * 
 */
export function toBeSymbol(this: jest.MatcherContext, received: unknown, expected: UnidocSymbol): jest.CustomMatcherResult
/**
 * 
 */
export function toBeSymbol(this: jest.MatcherContext, received: unknown, ...parameters: any[]): jest.CustomMatcherResult {
  if (parameters.length > 1) {
    return implementation.call(this, received, new UnidocSymbol(parameters[0], parameters[1]))
  } else {
    if (parameters[0] instanceof UnidocSymbol) {
      return implementation.call(this, received, parameters[0])
    } else {
      return implementation.call(this, received, new UnidocSymbol(parameters[0]))
    }
  }

}

function implementation(this: jest.MatcherContext, received: unknown, expected: UnidocSymbol) {
  if (received == null) {
    return { pass: false, message: createNullMessage.bind(this, received) }
  }

  if (typeof received !== 'object') {
    return { pass: false, message: createNotAnObjectMessage.bind(this, received, expected) }
  }

  if (!UnidocSymbol.is(received)) {
    return { pass: false, message: createNotASymbolMessage.bind(this, received, expected) }
  }

  if (!received.equals(expected)) {
    return { pass: false, message: createDifferentSymbolMessage.bind(this, received, expected) }
  }

  return { pass: true, message: createEqualSymbolMessage.bind(this, received, expected) }
}

if (typeof global === 'object' && 'expect' in global) {
  expect.extend({ toBeSymbol })
}