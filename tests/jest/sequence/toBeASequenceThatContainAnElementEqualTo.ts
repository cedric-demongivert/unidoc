/** eslint-env jest */

import { toSequenceString } from './toSequenceString'
import { equals } from './equals'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeASequenceThatContainAnElementEqualTo(expectation: any): R
    }
  }
}

function toBeASequenceThatContainAnElementEqualTo(this: any, result: any, expectation: any): any {
  if (typeof result !== 'object' || result[Symbol.iterator] == null) {
    return {
      message: () => (
        'Expected ' + this.utils.stringify(result) +
        ' to be equal to the sequence of elements ' +
        toSequenceString(expectation, this.utils.stringify) +
        ' but the given value is not iterable.'
      ),
      pass: false
    }
  }

  const iterator: Iterator<any> = result[Symbol.iterator]()
  let iteration: IteratorResult<any>
  let index: number = 0

  while (!(iteration = iterator.next()).done) {
    if (equals(iteration.value, expectation) || this.equals(iteration.value, expectation)) {
      return {
        message: () => (
          'Expected sequence ' +
          toSequenceString(result, this.utils.stringify) +
          ' not to contain any element equal to ' +
          this.utils.stringify(expectation) + ' but such an element exists ' +
          'in the given sequence at index #' + index + '.'
        ),
        pass: true
      }
    }

    index += 1
  }

  return {
    message: () => (
      'Expected sequence ' +
      toSequenceString(result, this.utils.stringify) +
      ' to contain an element equal to ' +
      this.utils.stringify(expectation) + ' but such an element does not ' +
      'exists in the given sequence.'
    ),
    pass: false
  }
}

expect.extend({ toBeASequenceThatContainAnElementEqualTo })
