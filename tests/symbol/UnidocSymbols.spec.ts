/** eslint-env jest */

import { UnidocCoroutine } from '../../sources/stream/UnidocCoroutine'
import { UnidocSymbol } from '../../sources/symbol/UnidocSymbol'
import { UTF32String } from '../../sources/symbol/UTF32String'
import { UTF16String } from '../../sources/symbol'
import { UnidocSymbols } from '../../sources/symbol/UnidocSymbols'
import { UnidocOrigin } from '../../sources/origin/UnidocOrigin'

import '../matchers'

/**
 * 
 */
describe('UnidocSymbols', function () {
  /**
   * 
   */
  describe('#fromString', function () {
    /**
     * 
     */
    it('emits consecutive non-linebreaking symbols', function () {
      const origin: UnidocOrigin = UnidocSymbols.fromString.origin()

      UnidocCoroutine.feed<UnidocSymbol>(UnidocSymbols.fromString('abcde'), function* () {
        expect(yield).toBeStart()
        expect(yield).toBeNext(UnidocSymbol.fromString('a', origin.parseRange('from 0:0[0] to 1:0[1]')))
        expect(yield).toBeNext(UnidocSymbol.fromString('b', origin.parseRange('from 1:0[1] to 2:0[2]')))
        expect(yield).toBeNext(UnidocSymbol.fromString('c', origin.parseRange('from 2:0[2] to 3:0[3]')))
        expect(yield).toBeNext(UnidocSymbol.fromString('d', origin.parseRange('from 3:0[3] to 4:0[4]')))
        expect(yield).toBeNext(UnidocSymbol.fromString('e', origin.parseRange('from 4:0[4] to 5:0[5]')))
        expect(yield).toBeSuccess()
      })
    })

    /**
     * 
     */
    it('handle newlines', function () {
      const origin: UnidocOrigin = UnidocSymbols.fromString.origin()

      UnidocCoroutine.feed<UnidocSymbol>(UnidocSymbols.fromString('ab\n\ncd'), function* () {
        expect(yield).toBeStart()
        expect(yield).toBeNext(UnidocSymbol.fromString('a', origin.parseRange('from 0:0[0] to 1:0[1]')))
        expect(yield).toBeNext(UnidocSymbol.fromString('b', origin.parseRange('from 1:0[1] to 2:0[2]')))
        expect(yield).toBeNext(UnidocSymbol.fromString('\n', origin.parseRange('from 2:0[2] to 0:1[3]')))
        expect(yield).toBeNext(UnidocSymbol.fromString('\n', origin.parseRange('from 0:1[3] to 0:2[4]')))
        expect(yield).toBeNext(UnidocSymbol.fromString('c', origin.parseRange('from 0:2[4] to 1:2[5]')))
        expect(yield).toBeNext(UnidocSymbol.fromString('d', origin.parseRange('from 1:2[5] to 2:2[6]')))
        expect(yield).toBeSuccess()
      })
    })

    /**
     * 
     */
    it('handle carriage returns', function () {
      const origin: UnidocOrigin = UnidocSymbols.fromString.origin()

      UnidocCoroutine.feed<UnidocSymbol>(UnidocSymbols.fromString('ab\r\rcd'), function* () {
        expect(yield).toBeStart()
        expect(yield).toBeNext(UnidocSymbol.fromString('a', origin.parseRange('from 0:0[0] to 1:0[1]')))
        expect(yield).toBeNext(UnidocSymbol.fromString('b', origin.parseRange('from 1:0[1] to 2:0[2]')))
        expect(yield).toBeNext(UnidocSymbol.fromString('\r', origin.parseRange('from 2:0[2] to 0:1[3]')))
        expect(yield).toBeNext(UnidocSymbol.fromString('\r', origin.parseRange('from 0:1[3] to 0:2[4]')))
        expect(yield).toBeNext(UnidocSymbol.fromString('c', origin.parseRange('from 0:2[4] to 1:2[5]')))
        expect(yield).toBeNext(UnidocSymbol.fromString('d', origin.parseRange('from 1:2[5] to 2:2[6]')))
        expect(yield).toBeSuccess()
      })
    })

    /**
     * 
     */
    it('handle CL+RF sequence', function () {
      const origin: UnidocOrigin = UnidocSymbols.fromString.origin()

      UnidocCoroutine.feed<UnidocSymbol>(UnidocSymbols.fromString('ab\r\n\r\ncd'), function* () {
        expect(yield).toBeStart()
        expect(yield).toBeNext(UnidocSymbol.fromString('a', origin.parseRange('from 0:0[0] to 1:0[1]')))
        expect(yield).toBeNext(UnidocSymbol.fromString('b', origin.parseRange('from 1:0[1] to 2:0[2]')))
        expect(yield).toBeNext(UnidocSymbol.fromString('\r', origin.parseRange('from 2:0[2] to 0:1[3]')))
        expect(yield).toBeNext(UnidocSymbol.fromString('\n', origin.parseRange('from 0:1[3] to 0:1[4]')))
        expect(yield).toBeNext(UnidocSymbol.fromString('\r', origin.parseRange('from 0:1[4] to 0:2[5]')))
        expect(yield).toBeNext(UnidocSymbol.fromString('\n', origin.parseRange('from 0:2[5] to 0:2[6]')))
        expect(yield).toBeNext(UnidocSymbol.fromString('c', origin.parseRange('from 0:2[6] to 1:2[7]')))
        expect(yield).toBeNext(UnidocSymbol.fromString('d', origin.parseRange('from 1:2[7] to 2:2[8]')))
        expect(yield).toBeSuccess()
      })
    })
  })

  /**
   * 
   */
  describe('#fromUTF32String', function () {
    /**
     * 
     */
    it('emits consecutive non-linebreaking symbols', function () {
      const origin: UnidocOrigin = UnidocSymbols.fromUTF32String.origin()

      UnidocCoroutine.feed<UnidocSymbol>(
        UnidocSymbols.fromUTF32String(UTF32String.fromString('ab\n\ncd')),
        function* () {
          expect(yield).toBeStart()
          expect(yield).toBeNext(UnidocSymbol.fromString('a', origin.parseRange('from 0:0[0] to 1:0[1]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('b', origin.parseRange('from 1:0[1] to 2:0[2]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('\n', origin.parseRange('from 2:0[2] to 0:1[3]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('\n', origin.parseRange('from 0:1[3] to 0:2[4]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('c', origin.parseRange('from 0:2[4] to 1:2[5]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('d', origin.parseRange('from 1:2[5] to 2:2[6]')))
          expect(yield).toBeSuccess()
        }
      )
    })

    /**
     * 
     */
    it('handle newlines', function () {
      const origin: UnidocOrigin = UnidocSymbols.fromUTF32String.origin()

      UnidocCoroutine.feed<UnidocSymbol>(
        UnidocSymbols.fromUTF32String(UTF32String.fromString('ab\n\ncd')),
        function* () {
          expect(yield).toBeStart()
          expect(yield).toBeNext(UnidocSymbol.fromString('a', origin.parseRange('from 0:0[0] to 1:0[1]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('b', origin.parseRange('from 1:0[1] to 2:0[2]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('\n', origin.parseRange('from 2:0[2] to 0:1[3]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('\n', origin.parseRange('from 0:1[3] to 0:2[4]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('c', origin.parseRange('from 0:2[4] to 1:2[5]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('d', origin.parseRange('from 1:2[5] to 2:2[6]')))
          expect(yield).toBeSuccess()
        }
      )
    })

    /**
     * 
     */
    it('handle carriage returns', function () {
      const origin: UnidocOrigin = UnidocSymbols.fromUTF32String.origin()

      UnidocCoroutine.feed<UnidocSymbol>(
        UnidocSymbols.fromUTF32String(UTF32String.fromString('ab\r\rcd')),
        function* () {
          expect(yield).toBeStart()
          expect(yield).toBeNext(UnidocSymbol.fromString('a', origin.parseRange('from 0:0[0] to 1:0[1]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('b', origin.parseRange('from 1:0[1] to 2:0[2]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('\r', origin.parseRange('from 2:0[2] to 0:1[3]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('\r', origin.parseRange('from 0:1[3] to 0:2[4]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('c', origin.parseRange('from 0:2[4] to 1:2[5]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('d', origin.parseRange('from 1:2[5] to 2:2[6]')))
          expect(yield).toBeSuccess()
        }
      )
    })

    /**
     * 
     */
    it('handle CL+RF sequence', function () {
      const origin: UnidocOrigin = UnidocSymbols.fromUTF32String.origin()

      UnidocCoroutine.feed<UnidocSymbol>(
        UnidocSymbols.fromUTF32String(UTF32String.fromString('ab\r\n\r\ncd')),
        function* () {
          expect(yield).toBeStart()
          expect(yield).toBeNext(UnidocSymbol.fromString('a', origin.parseRange('from 0:0[0] to 1:0[1]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('b', origin.parseRange('from 1:0[1] to 2:0[2]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('\r', origin.parseRange('from 2:0[2] to 0:1[3]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('\n', origin.parseRange('from 0:1[3] to 0:1[4]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('\r', origin.parseRange('from 0:1[4] to 0:2[5]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('\n', origin.parseRange('from 0:2[5] to 0:2[6]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('c', origin.parseRange('from 0:2[6] to 1:2[7]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('d', origin.parseRange('from 1:2[7] to 2:2[8]')))
          expect(yield).toBeSuccess()
        }
      )
    })
  })

  /**
   * 
   */
  describe('#fromUTF16String', function () {
    /**
     * 
     */
    it('emits consecutive non-linebreaking symbols', function () {
      const origin: UnidocOrigin = UnidocSymbols.fromUTF16String.origin()

      UnidocCoroutine.feed<UnidocSymbol>(
        UnidocSymbols.fromUTF16String(UTF16String.fromString('ab\n\ncd')),
        function* () {
          expect(yield).toBeStart()
          expect(yield).toBeNext(UnidocSymbol.fromString('a', origin.parseRange('from 0:0[0] to 1:0[1]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('b', origin.parseRange('from 1:0[1] to 2:0[2]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('\n', origin.parseRange('from 2:0[2] to 0:1[3]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('\n', origin.parseRange('from 0:1[3] to 0:2[4]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('c', origin.parseRange('from 0:2[4] to 1:2[5]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('d', origin.parseRange('from 1:2[5] to 2:2[6]')))
          expect(yield).toBeSuccess()
        }
      )
    })

    /**
     * 
     */
    it('handle newlines', function () {
      const origin: UnidocOrigin = UnidocSymbols.fromUTF16String.origin()

      UnidocCoroutine.feed<UnidocSymbol>(
        UnidocSymbols.fromUTF16String(UTF16String.fromString('ab\n\ncd')),
        function* () {
          expect(yield).toBeStart()
          expect(yield).toBeNext(UnidocSymbol.fromString('a', origin.parseRange('from 0:0[0] to 1:0[1]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('b', origin.parseRange('from 1:0[1] to 2:0[2]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('\n', origin.parseRange('from 2:0[2] to 0:1[3]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('\n', origin.parseRange('from 0:1[3] to 0:2[4]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('c', origin.parseRange('from 0:2[4] to 1:2[5]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('d', origin.parseRange('from 1:2[5] to 2:2[6]')))
          expect(yield).toBeSuccess()
        }
      )
    })

    /**
     * 
     */
    it('handle carriage returns', function () {
      const origin: UnidocOrigin = UnidocSymbols.fromUTF16String.origin()

      UnidocCoroutine.feed<UnidocSymbol>(
        UnidocSymbols.fromUTF16String(UTF16String.fromString('ab\r\rcd')),
        function* () {
          expect(yield).toBeStart()
          expect(yield).toBeNext(UnidocSymbol.fromString('a', origin.parseRange('from 0:0[0] to 1:0[1]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('b', origin.parseRange('from 1:0[1] to 2:0[2]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('\r', origin.parseRange('from 2:0[2] to 0:1[3]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('\r', origin.parseRange('from 0:1[3] to 0:2[4]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('c', origin.parseRange('from 0:2[4] to 1:2[5]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('d', origin.parseRange('from 1:2[5] to 2:2[6]')))
          expect(yield).toBeSuccess()
        }
      )
    })

    /**
     * 
     */
    it('handle CL+RF sequence', function () {
      const origin: UnidocOrigin = UnidocSymbols.fromUTF16String.origin()

      UnidocCoroutine.feed<UnidocSymbol>(
        UnidocSymbols.fromUTF16String(UTF16String.fromString('ab\r\n\r\ncd')),
        function* () {
          expect(yield).toBeStart()
          expect(yield).toBeNext(UnidocSymbol.fromString('a', origin.parseRange('from 0:0[0] to 1:0[1]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('b', origin.parseRange('from 1:0[1] to 2:0[2]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('\r', origin.parseRange('from 2:0[2] to 0:1[3]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('\n', origin.parseRange('from 0:1[3] to 0:1[4]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('\r', origin.parseRange('from 0:1[4] to 0:2[5]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('\n', origin.parseRange('from 0:2[5] to 0:2[6]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('c', origin.parseRange('from 0:2[6] to 1:2[7]')))
          expect(yield).toBeNext(UnidocSymbol.fromString('d', origin.parseRange('from 1:2[7] to 2:2[8]')))
          expect(yield).toBeSuccess()
        }
      )
    })
  })
})
