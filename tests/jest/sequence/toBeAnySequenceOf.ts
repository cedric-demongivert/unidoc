/** eslint-env jest */

import { toSequenceString } from './toSequenceString'
import { count } from './count'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeAnySequenceOf(expectation: Iterable<any>): R;
    }
  }
}

function toBeAnySequenceOf(this: any, result: any, expectation: Iterable<any>): any {
  if (typeof result !== 'object' || result[Symbol.iterator] == null) {
    return {
      message: () => (
        'Expected sequence ' + this.utils.stringify(result) +
        ' to be equal to the sequence of elements ' +
        toSequenceString(expectation, this.utils.stringify) +
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
      if (expectationIteration.value === resultIteration.value && !matchs.has(resultIndex)) {
        matchs.add(resultIndex)
        contains = resultIndex
      }

      resultIndex += 1
    }

    if (contains < 0) {
      return {
        message: () => (
          'Expected sequence ' +
          toSequenceString(result, this.utils.stringify) +
          ' to be any sequence of elements ' +
          toSequenceString(expectation, this.utils.stringify) +
          ' but the expected element #' +
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
        toSequenceString(result, this.utils.stringify) +
        ' to be any sequence of elements ' +
        toSequenceString(expectation, this.utils.stringify) +
        ' but the given sequence does contain more elements than expected.'
      ),
      pass: false
    }
  }

  return {
    message: () => (
      'Expected sequence ' +
      toSequenceString(result, this.utils.stringify) +
      ' not to be any sequence of elements ' +
      toSequenceString(expectation, this.utils.stringify) +
      ' but it is.'
    ),
    pass: true
  }
}

expect.extend({ toBeAnySequenceOf })
