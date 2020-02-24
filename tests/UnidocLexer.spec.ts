/** eslint-env jest */

import { UnidocLexer } from '../sources/typescript/lexer/UnidocLexer'
import { UnidocLexerState } from '../sources/typescript/lexer/UnidocLexerState'
import { CodePoint } from '../sources/typescript/CodePoint'
import { UnidocLocation } from '../sources/typescript/UnidocLocation'
import { UnidocToken } from '../sources/typescript/token/UnidocToken'
import { UnidocTokenBuffer } from '../sources/typescript/token/UnidocTokenBuffer'


describe('UnidocLexer', function () {
  describe('#constructor', function () {
    it('instantiate a new lexer', function () {
      const lexer : UnidocLexer = new UnidocLexer()

      expect(lexer.state).toBe(UnidocLexerState.START)
      expect(lexer.location.equals(UnidocLocation.ZERO)).toBeTruthy()
    })
  })

  describe('space recognition', function () {
    it ('recognize spaces', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = UnidocTokenBuffer.fromLexer(lexer)

      lexer.nextString(' \f\t\t ')
      lexer.complete()

      expect(output.isSpace(UnidocLocation.ZERO, ' \f\t\t ')).toBeTruthy()
    })

    it ('compute the next location after a space', function () {
      const lexer : UnidocLexer = new UnidocLexer()

      expect(lexer.location.equals(UnidocLocation.ZERO)).toBeTruthy()

      lexer.nextCodePoint(CodePoint.SPACE)

      expect(lexer.location.equals(new UnidocLocation(0, 1, 1))).toBeTruthy()
    })

    it ('compute the next location after a tabulation', function () {
      const lexer : UnidocLexer = new UnidocLexer()

      expect(lexer.location.equals(UnidocLocation.ZERO)).toBeTruthy()

      lexer.nextCodePoint(CodePoint.TABULATION)

      expect(lexer.location.equals(new UnidocLocation(0, 1, 1))).toBeTruthy()
    })

    it ('compute the next location after a form feed', function () {
      const lexer : UnidocLexer = new UnidocLexer()

      expect(lexer.location.equals(UnidocLocation.ZERO)).toBeTruthy()

      lexer.nextCodePoint(CodePoint.FORM_FEED)

      expect(lexer.location.equals(new UnidocLocation(0, 1, 1))).toBeTruthy()
    })
  })
})
