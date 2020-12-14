/** eslint-env jest */

import { toSequenceString } from './toSequenceString'
import { equals } from './equals'

declare global {
  namespace jest {
    interface Matchers<R> {
      toEqualTheSequence(expectation: Iterable<any>): R
    }
  }
}

function toEqualTheSequence(this: any, result: any, expectation: Iterable<any>): any {
  if (typeof result !== 'object' || result[Symbol.iterator] == null) {
    return {
      message: () => (
        'Expected ' + this.utils.stringify(result) +
        ' to be equal to the sequence of elements ' +
        toSequenceString(expectation, this.utils.stringify(expectation)) +
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

    if (
      resultIteration.done || (
        !equals(resultIteration.value, expectationIteration.value) &&
        !this.equals(resultIteration.value, expectationIteration.value)
      )
    ) {
      return {
        message: () => (
          'Expected sequence ' +
          toSequenceString(result, this.utils.stringify) +
          ' to be equal to the sequence of elements ' +
          toSequenceString(expectation, this.utils.stringify) +
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
        toSequenceString(result, this.utils.stringify) +
        ' to be equal to the sequence of elements ' +
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
      ' not to be equal to the sequence of elements ' +
      toSequenceString(expectation, this.utils.stringify) +
      ' but it is.'
    ),
    pass: true
  }
}

expect.extend({ toEqualTheSequence })
