import { TrackedUnidocEventProducer } from '../../../sources/event/TrackedUnidocEventProducer'
import { UnidocEvent } from '../../../sources/event/UnidocEvent'
import { UnidocBuffer } from '../../../sources/buffer/UnidocBuffer'
import { UnidocReductionInput } from '../../../sources/compilation/reduction/UnidocReductionInput'
import { reduce } from '../../../sources/compilation/reduction/common/reduce'
import { UnidocReducer } from '../../../sources/compilation/reduction/UnidocReducer'
import { reduceToken } from '../../../sources/compilation/reduction/common/reduceToken'

describe('reduceToken', function() {
  it('reduce a token', function() {
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

    expect(reduce.iterator(content(), reduceToken())).toBe('Lorem')
  })

  it('can reduce many tokens', function() {
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

    const iterator: Generator<UnidocReductionInput> = content()

    function* reduceTokens(): UnidocReducer<Array<any>> {
      return [
        yield* reduceToken(),
        yield* reduceToken(),
        yield* reduceToken(),
        yield* reduceToken()
      ]
    }

    expect(reduce.iterator(content(), reduceTokens())).toEqual([
      'Lorem', 'ipsum', 'dolor', 'sit'
    ])

    /**
    * Note : we can simplify this to :
    *  expect(reduce.iterator(iterator, reduceToken())).toBe('Lorem')
    *  expect(reduce.iterator(iterator, reduceToken())).toBe('ipsum')
    *  expect(reduce.iterator(iterator, reduceToken())).toBe('dolor')
    *  expect(reduce.iterator(iterator, reduceToken())).toBe('sit')
    *
    * If we propose an upgraded version of the iterator interface that keeps it's current value.
    */
  })

  it('reduce an empty document as an empty token', function() {
    function* content(): Generator<UnidocReductionInput> {
      yield UnidocReductionInput.START
      yield UnidocReductionInput.END
    }

    expect(reduce.iterator(content(), reduceToken())).toEqual('')
  })

  it('reduce a whitespace as an empty token', function() {
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

    expect(reduce.iterator(content(), reduceToken())).toEqual('')
  })

  it('trim the token', function() {
    const eventStream: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
    const eventBuffer: UnidocBuffer<UnidocEvent> = UnidocBuffer.bufferize(eventStream, UnidocEvent.ALLOCATOR)

    eventStream.produceText('  Lorem \t\n\rtest')

    function* content(): Generator<UnidocReductionInput> {
      yield UnidocReductionInput.START
      for (const event of eventBuffer) {
        yield UnidocReductionInput.event(event)
      }
      yield UnidocReductionInput.END
    }

    expect(reduce.iterator(content(), reduceToken())).toBe('Lorem')
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

    expect(reduce.iterator(content(), reduceToken())).toBeUndefined()
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

    expect(reduce.iterator(content(), reduceToken())).toBeUndefined()
  })

  it('reduce end of reduction as undefined', function() {
    function* content(): Generator<UnidocReductionInput> {
      yield UnidocReductionInput.END
    }

    expect(reduce.iterator(content(), reduceToken())).toBeUndefined()
  })
})
