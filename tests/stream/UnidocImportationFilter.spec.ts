/** eslint-env jest */

import { fullyParse } from '../../sources/fullyParse'
import { UnidocStream } from '../../sources/stream/UnidocStream'
import { UnidocFragmentResolver } from '../../sources/stream/UnidocFragmentResolver'
import { UnidocSymbolReader } from '../../sources/reader/UnidocSymbolReader'
import { UnidocBuffer } from '../../sources/buffer/UnidocBuffer'
import { bufferize } from '../../sources/buffer/bufferize'
import { UnidocEvent } from '../../sources/event/UnidocEvent'
import { UnidocProducer } from '../../sources/producer/UnidocProducer'
import { UnidocProducerEvent } from '../../sources/producer/UnidocProducerEvent'

describe('UnidocImportationFilter', function() {
  it('allow to make importations with \\import tags', function(callback) {
    const resolver: UnidocFragmentResolver = new UnidocFragmentResolver()
    resolver.set('fragment', '\\label { pweet }')

    const stream: UnidocStream = new UnidocStream(
      UnidocSymbolReader.fromString(
        '\\import { fragment }\r\n' +
        '\\import { fragment}\r\n' +
        '\\import {fragment }\r\n' +
        '\\import {\t fragment \t\t }\r\n' +
        '\\import {fragment}'
      ), resolver
    )

    const output: UnidocProducer<UnidocEvent> = fullyParse(stream)
    const buffer: UnidocBuffer<UnidocEvent> = bufferize(output, UnidocEvent.ALLOCATOR)

    output.addEventListener(UnidocProducerEvent.COMPLETION, function() {
      console.log(UnidocBuffer.toString(buffer))
      callback()
    })

    stream.stream()
  })

  it('ignore ill-formed importation tags', function() {
    const resolver: UnidocFragmentResolver = new UnidocFragmentResolver()
    resolver.set('fragment', '\\label { pweet }')

    const stream: UnidocStream = new UnidocStream(
      UnidocSymbolReader.fromString(
        '\\import {  }\r\n' +
        '\\import {}\r\n' +
        '\\import { fragment fragment }\r\n' +
        '\\import {\\import{ fragment }}\r\n' +
        '\\import {\\pwet}'
      ), resolver
    )

    const output: UnidocBuffer<UnidocEvent> = bufferize(fullyParse(stream), UnidocEvent.ALLOCATOR)

    stream.stream()

    console.log(UnidocBuffer.toString(output))
  })
})
