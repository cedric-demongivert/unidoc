/** eslint-env jest */

import { fullyParse } from '../../sources/fullyParse'
import { UnidocContext } from '../../sources/context/UnidocContext'
import { UnidocFragmentResolver } from '../../sources/context/UnidocFragmentResolver'
import { UnidocBuffer } from '../../sources/buffer/UnidocBuffer'
import { UnidocEvent } from '../../sources/event/UnidocEvent'
import { UnidocProducer } from '../../sources/stream/UnidocProducer'
import { UnidocProducerEvent } from '../../sources/stream/UnidocProducerEvent'

describe('UnidocImportationFilter', function () {
  it('allow to make importations with \\import tags', function (callback) {
    const resolver: UnidocFragmentResolver = new UnidocFragmentResolver()

    resolver.set('fragment', '\\label { pweet }')

    resolver.set(
      'main',
      '\\import { fragment }\r\n' +
      '\\import { fragment}\r\n' +
      '\\import {fragment }\r\n' +
      '\\import {\t fragment \t\t }\r\n' +
      '\\import {fragment}'
    )

    const stream: UnidocContext = new UnidocContext(resolver)

    const output: UnidocProducer<UnidocEvent> = fullyParse(stream)
    const buffer: UnidocBuffer<UnidocEvent> = UnidocBuffer.bufferize(output, UnidocEvent.ALLOCATOR)

    output.on(UnidocProducerEvent.SUCCESS, function () {
      console.log(UnidocBuffer.toString(buffer))
      callback()
    })

    stream.import('main')
  })

  it('ignore ill-formed importation tags', function (callback) {
    const resolver: UnidocFragmentResolver = new UnidocFragmentResolver()
    resolver.set('fragment', '\\label { pweet }')
    resolver.set(
      'main',
      '\\import { }\r\n' +
      '\\import { fragment fragment }\r\n' +
      '\\import {\\import}\r\n' +
      '\\import { fragment \\import}'
    )

    const stream: UnidocContext = new UnidocContext(resolver)

    const output: UnidocProducer<UnidocEvent> = fullyParse(stream)
    const buffer: UnidocBuffer<UnidocEvent> = UnidocBuffer.bufferize(output, UnidocEvent.ALLOCATOR)

    output.on(UnidocProducerEvent.SUCCESS, function () {
      console.log(UnidocBuffer.toString(buffer))
      callback()
    })

    stream.import('main')
  })
})
