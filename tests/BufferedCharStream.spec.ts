import { Interval } from 'antlr4ts/misc/Interval'

import { BufferedCharStream } from '@library/antlr/BufferedCharStream'

describe('#BufferedCharStream', function () {
  describe('#constructor', function () {
    it('instantiate an empty buffered char stream of the requested capacity', function () {
      const buffer : BufferedCharStream = new BufferedCharStream(128)

      expect(buffer.capacity).toBe(128)
      expect(buffer.size).toBe(0)
      expect(buffer.toString()).toBe('')
    })
  })

  describe('#push', function () {
    it('push a code point into the buffer', function () {
      const buffer : BufferedCharStream = new BufferedCharStream(128)

      expect(buffer.capacity).toBe(128)
      expect(buffer.size).toBe(0)
      expect(buffer.toString()).toBe('')

      const token : string = 'happy'

      for (let index = 0; index < token.length; ++index) {
        buffer.push(token.codePointAt(index))
      }

      expect(buffer.capacity).toBe(128)
      expect(buffer.size).toBe(5)
      expect(buffer.toString()).toBe('happy')
    })

    it('expand the underlying buffer capacity if necessary', function () {
      const buffer : BufferedCharStream = new BufferedCharStream(2)

      expect(buffer.capacity).toBe(2)
      expect(buffer.size).toBe(0)
      expect(buffer.toString()).toBe('')

      const token : string = 'happy'

      for (let index = 0; index < token.length; ++index) {
        buffer.push(token.codePointAt(index))
      }

      expect(buffer.capacity).toBe(8)
      expect(buffer.size).toBe(5)
      expect(buffer.toString()).toBe('happy')
    })
  })

  describe('#pushString', function () {
    it('push a string into the buffer', function () {
      const buffer : BufferedCharStream = new BufferedCharStream(128)

      expect(buffer.capacity).toBe(128)
      expect(buffer.size).toBe(0)
      expect(buffer.toString()).toBe('')

      buffer.pushString('happy')
      buffer.pushString(' ')
      buffer.pushString('is happy')

      expect(buffer.capacity).toBe(128)
      expect(buffer.size).toBe(14)
      expect(buffer.toString()).toBe('happy is happy')
    })

    it('expand the underlying buffer capacity if necessary', function () {
      const buffer : BufferedCharStream = new BufferedCharStream(2)

      expect(buffer.capacity).toBe(2)
      expect(buffer.size).toBe(0)
      expect(buffer.toString()).toBe('')

      const token : string = 'happy'

      buffer.pushString('happy')
      buffer.pushString(' ')
      buffer.pushString('is happy')

      expect(buffer.capacity).toBe(16)
      expect(buffer.size).toBe(14)
      expect(buffer.toString()).toBe('happy is happy')
    })
  })

  describe('#getText', function () {
    it('return the text at the given interval', function () {
      const buffer : BufferedCharStream = new BufferedCharStream(128)

      buffer.pushString('happy')

      expect(buffer.getText(new Interval(2, 3))).toBe('ap')
    })
  })

  describe('#consume', function () {
    it('consume the next symbol', function () {
      const buffer : BufferedCharStream = new BufferedCharStream(128)

      buffer.pushString('happy')

      expect(buffer.index).toBe(0)
      expect(buffer.toString()).toBe('happy')

      buffer.consume()

      expect(buffer.index).toBe(1)
      expect(buffer.toString()).toBe('appy')

      buffer.consume()

      expect(buffer.index).toBe(2)
      expect(buffer.toString()).toBe('ppy')
    })

    it('does not destroy symbols in marked ranges', function () {
      const buffer : BufferedCharStream = new BufferedCharStream(128)

      buffer.pushString('happy')

      expect(buffer.index).toBe(0)
      expect(buffer.toString()).toBe('happy')

      buffer.consume()

      expect(buffer.index).toBe(1)
      expect(buffer.toString()).toBe('appy')

      buffer.mark()
      buffer.consume()
      buffer.consume()

      expect(buffer.index).toBe(3)
      expect(buffer.toString()).toBe('appy')
    })

    it('throw an error if there is nothing to consume', function () {
      const buffer : BufferedCharStream = new BufferedCharStream(128)

      buffer.pushString('happy')

      for (let index = 0; index < 5; ++index) {
        buffer.consume()
      }

      expect(_ => buffer.consume()).toThrow()
    })
  })

  describe('#mark', function () {
    it('mark a range for later use', function () {
      const buffer : BufferedCharStream = new BufferedCharStream(128)

      buffer.pushString('happy')

      expect(buffer.index).toBe(0)
      expect(buffer.toString()).toBe('happy')

      buffer.consume()

      expect(buffer.index).toBe(1)
      expect(buffer.toString()).toBe('appy')

      buffer.mark()
      buffer.consume()
      buffer.consume()

      expect(buffer.index).toBe(3)
      expect(buffer.toString()).toBe('appy')
    })
  })

  describe('#release', function () {
    it('release a marked range', function () {
      const buffer : BufferedCharStream = new BufferedCharStream(128)

      buffer.pushString('happy')

      expect(buffer.index).toBe(0)
      expect(buffer.toString()).toBe('happy')

      buffer.consume()

      expect(buffer.index).toBe(1)
      expect(buffer.toString()).toBe('appy')

      const first : number = buffer.mark()
      buffer.consume()
      buffer.consume()

      expect(buffer.index).toBe(3)
      expect(buffer.toString()).toBe('appy')

      const second : number = buffer.mark()
      buffer.consume()

      expect(buffer.index).toBe(4)
      expect(buffer.toString()).toBe('appy')

      buffer.release(first)

      expect(buffer.index).toBe(4)
      expect(buffer.toString()).toBe('py')

      buffer.release(second)

      expect(buffer.index).toBe(4)
      expect(buffer.toString()).toBe('y')
    })
  })

  describe('#LA', function () {
    it('return a value of the buffer', function () {
      const buffer : BufferedCharStream = new BufferedCharStream(128)

      buffer.pushString('happy')

      expect(buffer.LA(1)).toBe('happy'.codePointAt(0))
      expect(buffer.LA(2)).toBe('happy'.codePointAt(1))
      expect(buffer.LA(3)).toBe('happy'.codePointAt(2))
      expect(buffer.LA(4)).toBe('happy'.codePointAt(3))

      buffer.consume()

      expect(buffer.LA(1)).toBe('happy'.codePointAt(1))
      expect(buffer.LA(2)).toBe('happy'.codePointAt(2))
      expect(buffer.LA(3)).toBe('happy'.codePointAt(3))
      expect(buffer.LA(4)).toBe('happy'.codePointAt(4))
    })
  })
})
