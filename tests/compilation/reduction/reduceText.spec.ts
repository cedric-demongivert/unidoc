import { TrackedUnidocEventProducer } from '../../../sources/event/TrackedUnidocEventProducer'
import { UnidocEvent } from '../../../sources/event/UnidocEvent'
import { UnidocBuffer } from '../../../sources/buffer/UnidocBuffer'
import { UnidocReductionInput } from '../../../sources/compilation/reduction/UnidocReductionInput'
import { reduce } from '../../../sources/compilation/reduction/reduce'
import { reduceText } from '../../../sources/compilation/reduction/reduceText'

describe('reduceText', function() {
  it('reduce a sequence of words and whitespaces to a text', function() {
    const eventStream: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
    const eventBuffer: UnidocBuffer<UnidocEvent> = UnidocBuffer.bufferize(eventStream, UnidocEvent.ALLOCATOR)

    eventStream.produceText('Lorem ipsum dolor sit amet consequetur.')

    function* content(): Generator<UnidocReductionInput> {
      yield UnidocReductionInput.START
      for (const event of eventBuffer) {
        yield UnidocReductionInput.event(event)
      }
      yield UnidocReductionInput.END
    }

    expect(
      reduce.iterator(content(), reduceText())
    ).toBe('Lorem ipsum dolor sit amet consequetur.')
  })

  it('reduce an empty document as an empty text', function() {
    function* content(): Generator<UnidocReductionInput> {
      yield UnidocReductionInput.START
      yield UnidocReductionInput.END
    }

    expect(reduce.iterator(content(), reduceText())).toBe('')
  })

  it('reduce a whitespace as an empty text', function() {
    const eventStream: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
    const eventBuffer: UnidocBuffer<UnidocEvent> = UnidocBuffer.bufferize(eventStream, UnidocEvent.ALLOCATOR)

    eventStream.produceWhitespace('\t\n\r     \t')

    function* content(): Generator<UnidocReductionInput> {
      yield UnidocReductionInput.START
      for (const event of eventBuffer) {
        yield UnidocReductionInput.event(event)
      }
      yield UnidocReductionInput.END
    }

    expect(reduce.iterator(content(), reduceText())).toBe('')
  })

  it('trim the resulting text and minimize it\'s inner whitespace', function() {
    const eventStream: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
    const eventBuffer: UnidocBuffer<UnidocEvent> = UnidocBuffer.bufferize(eventStream, UnidocEvent.ALLOCATOR)

    eventStream.produceText(
      '  Lorem  ipsum\t dolor sit amet \n\rconsequetur.\t   '
    )

    function* content(): Generator<UnidocReductionInput> {
      yield UnidocReductionInput.START
      for (const event of eventBuffer) {
        yield UnidocReductionInput.event(event)
      }
      yield UnidocReductionInput.END
    }

    expect(
      reduce.iterator(content(), reduceText())
    ).toBe('Lorem ipsum dolor sit amet consequetur.')
  })

  it('reduce tag starts to undefined', function() {
    const eventStream: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
    const eventBuffer: UnidocBuffer<UnidocEvent> = UnidocBuffer.bufferize(eventStream, UnidocEvent.ALLOCATOR)

    eventStream.produceTagStart('test')

    function* content(): Generator<UnidocReductionInput> {
      yield UnidocReductionInput.START
      for (const event of eventBuffer) {
        yield UnidocReductionInput.event(event)
      }
      yield UnidocReductionInput.END
    }

    expect(reduce.iterator(content(), reduceText())).toBeUndefined()
  })

  it('reduce tag ends to undefined', function() {
    const eventStream: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
    const eventBuffer: UnidocBuffer<UnidocEvent> = UnidocBuffer.bufferize(eventStream, UnidocEvent.ALLOCATOR)

    eventStream.produceTagEnd('test')

    function* content(): Generator<UnidocReductionInput> {
      yield UnidocReductionInput.START
      for (const event of eventBuffer) {
        yield UnidocReductionInput.event(event)
      }
      yield UnidocReductionInput.END
    }

    expect(reduce.iterator(content(), reduceText())).toBeUndefined()
  })

  it('reduce end of reduction as undefined', function() {
    function* content(): Generator<UnidocReductionInput> {
      yield UnidocReductionInput.END
    }

    expect(reduce.iterator(content(), reduceText())).toBeUndefined()
  })
})
