import { UnidocSink } from '../../sources/stream/UnidocSink'
import { UnidocBufferizer } from '../../sources/stream/UnidocBufferizer'
import { UnidocElement } from '../../sources/stream/UnidocElement'

import '../matchers'
import { UnidocDuplicator } from '../../sources/stream'
import { UnidocSymbol, UnidocSymbols } from '../../sources/symbol'

/**
 * 
 */
describe('UnidocDuplicator', function () {
  /**
   * 
   */
  it('duplicates a stream into an array', function () {
    const sink: UnidocSink<UnidocSymbol> = UnidocSink.create()
    const output: Array<UnidocElement<UnidocSymbol>> = UnidocDuplicator.duplicate(sink)

    expect(output.length).toBe(0)

    sink.start()

    expect(output.length).toBe(1)
    expect(output[0]).toBeStart()

    let lastLength: number = output.length

    for (const symbol of UnidocSymbols.fromString('Some string to parse.')) {
      sink.next(symbol)
      expect(output.length).toBe(lastLength + 1)
      expect(output[lastLength]).toBeNext(symbol)
      expect(output[lastLength].value).not.toBe(symbol)
      lastLength += 1
    }

    sink.success()

    expect(output.length).toBe(lastLength + 1)
    expect(output[lastLength]).toBeSuccess()
  })

  /**
   * 
   */
  it('bufferize failures', function () {
    const sink: UnidocSink<UnidocSymbol> = UnidocSink.create()
    const output: Array<UnidocElement<UnidocSymbol>> = UnidocDuplicator.duplicate(sink)

    sink.start()

    let lastLength: number = output.length

    for (const symbol of UnidocSymbols.fromString('Some string to parse.')) {
      sink.next(symbol)
      lastLength += 1
    }

    const error: Error = new Error('failure')
    sink.failure(error)

    expect(output.length).toBe(lastLength + 1)
    expect(output[lastLength]).toBeFailure(error)
  })
})