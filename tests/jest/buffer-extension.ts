/** eslint-env jest */

import { UnidocBuffer } from '../../sources/buffer/UnidocBuffer'

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchBuffer(expectation: UnidocBuffer<any>): R;
    }
  }
}

expect.extend({
  toMatchBuffer(result: UnidocBuffer<any>, expectation: UnidocBuffer<any>): any {
    try {
      UnidocBuffer.expect(result, expectation)
      return {
        message: () => `Expected ${UnidocBuffer.toString(result)} not to match ${UnidocBuffer.toString(expectation)}.`,
        pass: true
      }
    } catch (error) {
      return {
        message: () => `Expected ${UnidocBuffer.toString(result)} to match ${UnidocBuffer.toString(expectation)}. (${error.message})`,
        pass: false
      }
    }
  }
})
