/** eslint-env jest */

import { UnidocParser } from '../sources/typescript/parser/UnidocParser'
import { UnidocParserState } from '../sources/typescript/parser/UnidocParserState'
import { UnidocToken } from '../sources/typescript/token/UnidocToken'
import { UnidocLocation } from '../sources/typescript/UnidocLocation'
import { UnidocTokenBuffer } from '../sources/typescript/token/UnidocTokenBuffer'
import { UnidocEventBuffer } from '../sources/typescript/event/UnidocEventBuffer'


describe('UnidocParser', function () {
  describe('document recognition', function () {
    it('emit a document starting event at the first token reception', function () {
      const parser : UnidocParser = new UnidocParser()
      const output : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      output.listen(parser)

      parser.next(UnidocToken.newline(UnidocLocation.ZERO, '\r\n'))

      expectation.documentStart(UnidocLocation.ZERO)

      expect(_ => expectation.assert(output)).not.toThrow()
    })

    it('emit a document ending event at completion', function () {
      const parser : UnidocParser = new UnidocParser()
      const output : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      output.listen(parser)

      parser.next(UnidocToken.newline(UnidocLocation.ZERO, '\r\n'))
      parser.complete()

      expectation.documentStart(UnidocLocation.ZERO)
      expectation.documentEnd(new UnidocLocation(1, 0, 2))

      expect(_ => expectation.assert(output)).not.toThrow()
    })
  })

})
