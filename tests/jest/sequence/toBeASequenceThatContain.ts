/** eslint-env jest */

import { toSequenceString } from './toSequenceString'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeASequenceThatContain(expectation: any): R;
    }
  }
}

function toBeASequenceThatContain(this: any, result: any, expectation: any): any {
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

  const iterator: Iterator<any> = result[Symbol.iterator]()
  let iteration: IteratorResult<any>
  let index: number = 0

  while (!(iteration = iterator.next()).done) {
    if (iteration.value === expectation) {
      return {
        message: () => (
          'Expected sequence ' +
          toSequenceString(result) +
          ' not to contain element ' + this.utils.stringify(expectation) +
          ' but this element exists in the given sequence at index #' + index +
          '.'
        ),
        pass: true
      }
    }

    index += 1
  }

  return {
    message: () => (
      'Expected sequence ' +
      toSequenceString(result) +
      ' to contain element ' + this.utils.stringify(expectation) +
      ' but this element does not exists in the given sequence.'
    ),
    pass: false
  }
}

expect.extend({ toBeASequenceThatContain })
