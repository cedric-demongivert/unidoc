/** eslint-env jest */

import { toSequenceString } from './toSequenceString'
import { equals } from './equals'
import { count } from './count'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeAnySequenceOfElementsEqualsTo(expectation: Iterable<any>): R;
    }
  }
}

function toBeAnySequenceOfElementsEqualsTo(this: any, result: any, expectation: Iterable<any>): any {
  if (typeof result !== 'object' || result[Symbol.iterator] == null) {
    return {
      message: () => (
        'Expected ' + this.utils.stringify(result) +
        ' to be equal to the sequence of elements ' +
        toSequenceString(expectation) +
        ' but the given value is not iterable.'
      ),
      pass: false
    }
  }

  const expectationIterator: Iterator<any> = expectation[Symbol.iterator]()
  const matchs: Set<number> = new Set()
  let expectationIteration: IteratorResult<any>
  let expectationIndex: number = 0

  while (!(expectationIteration = expectationIterator.next()).done) {
    const resultIterator: Iterator<any> = result[Symbol.iterator]()
    let resultIteration: IteratorResult<any>
    let resultIndex: number = 0
    let contains: number = -1

    while (contains < 0 && !(resultIteration = resultIterator.next()).done) {
      if (
        (
          equals(expectationIteration.value, resultIteration.value) ||
          this.equals(expectationIteration.value, resultIteration.value)
        ) && !matchs.has(resultIndex)
      ) {
        matchs.add(resultIndex)
        contains = resultIndex
      }

      resultIndex += 1
    }

    if (contains < 0) {
      return {
        message: () => (
          'Expected sequence ' +
          toSequenceString(result) +
          ' to be any sequence of elements equals to ' +
          toSequenceString(expectation) +
          ' but an equivalent of element #' +
          expectationIndex + ' does not appear in the given sequence.'
        ),
        pass: false
      }
    }

    expectationIndex += 1
  }

  if (matchs.size != count(result)) {
    return {
      message: () => (
        'Expected sequence ' +
        toSequenceString(result) +
        ' to be any sequence of elements equals to ' +
        toSequenceString(expectation) +
        ' but the given sequence does contain more elements than expected.'
      ),
      pass: false
    }
  }

  return {
    message: () => (
      'Expected sequence ' +
      toSequenceString(result) +
      ' not to be any sequence of elements equals to ' +
      toSequenceString(expectation) +
      ' but it is.'
    ),
    pass: true
  }
}

expect.extend({ toBeAnySequenceOfElementsEqualsTo })
