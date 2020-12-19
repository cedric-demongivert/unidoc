/** eslint-env jest */

import { toSequenceString } from './toSequenceString'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeTheSequence(expectation: Iterable<any>): R;
    }
  }
}

function toBeTheSequence(this: any, result: any, expectation: Iterable<any>): any {
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
  let expectationIteration: IteratorResult<any>
  let expectationIndex: number = 0

  const resultIterator: Iterator<any> = result[Symbol.iterator]()
  let resultIteration: IteratorResult<any>

  while (!(expectationIteration = expectationIterator.next()).done) {
    resultIteration = resultIterator.next()

    if (resultIteration.done || resultIteration.value !== expectationIteration.value) {
      return {
        message: () => (
          'Expected sequence ' +
          toSequenceString(result) +
          ' to be the sequence of elements ' +
          toSequenceString(expectation) +
          ' but elements at index #' +
          expectationIndex + ' does not match.'
        ),
        pass: false
      }
    }

    expectationIndex += 1
  }

  if (!resultIterator.next().done) {
    return {
      message: () => (
        'Expected sequence ' +
        toSequenceString(result) +
        ' to be the sequence of elements ' +
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
      ' not to be the sequence of elements ' +
      toSequenceString(expectation) +
      ' but it is.'
    ),
    pass: true
  }
}

expect.extend({ toBeTheSequence })
