/** eslint-env jest */

import { Factory } from '@cedric-demongivert/gl-tool-utils'

import { UnidocCoroutine } from '../../sources/stream/UnidocCoroutine'
import { UnidocConsumer } from '../../sources/stream/UnidocConsumer'
import { UnidocImportExtractor } from '../../sources/postprocess/UnidocImportExtractor'
import { UnidocImport } from '../../sources/context/UnidocImport'
import { UnidocImportScheme } from '../../sources/context/UnidocImportScheme'
import { UnidocEventFlow } from '../../sources/event/UnidocEventFlow'
import { UnidocEvent } from '../../sources/event/UnidocEvent'

/**
 * 
 */
import '../matchers'

/**
 * 
 */
function matchOutput(input: Factory<IterableIterator<UnidocEvent>, [UnidocEventFlow]>, scenario: Factory<UnidocCoroutine.Coroutine<UnidocEvent>, [UnidocEventFlow]>): void {
  const postprocess: UnidocImportExtractor = new UnidocImportExtractor()
  const inputFlow: UnidocEventFlow = new UnidocEventFlow()
  const outputFlow: UnidocEventFlow = new UnidocEventFlow()

  UnidocCoroutine.create<UnidocEvent>(scenario.bind(undefined, outputFlow)).subscribe(postprocess)
  UnidocConsumer.feed(input(inputFlow), postprocess)
}

/**
 * 
 */
function matchOutputOnline(input: Factory<IterableIterator<UnidocEvent>, [UnidocEventFlow]>, scenario: Factory<UnidocCoroutine.Coroutine<UnidocEvent>, [UnidocEventFlow]>): void {
  const postprocess: UnidocImportExtractor = new UnidocImportExtractor()
  const inputFlow: UnidocEventFlow = new UnidocEventFlow()
  const outputFlow: UnidocEventFlow = new UnidocEventFlow()

  const coroutine: UnidocCoroutine<UnidocEvent> = UnidocCoroutine.create<UnidocEvent>(scenario.bind(undefined, outputFlow))
  coroutine.subscribe(postprocess)

  UnidocConsumer.feed.online(input(inputFlow), postprocess)
  coroutine.success()
}

/**
 * 
 */
function matchImports(input: Factory<IterableIterator<UnidocEvent>, [UnidocEventFlow]>, scenario: Factory<UnidocCoroutine.Coroutine<UnidocImport>, [UnidocEventFlow]>): void {
  const postprocess: UnidocImportExtractor = new UnidocImportExtractor()
  const inputFlow: UnidocEventFlow = new UnidocEventFlow()
  const outputFlow: UnidocEventFlow = new UnidocEventFlow()

  UnidocCoroutine.create<UnidocImport>(scenario.bind(undefined, outputFlow)).subscribe(postprocess.imports)
  UnidocConsumer.feed(input(inputFlow), postprocess)
}

/**
 * 
 */
describe('UnidocImportExtractor', function () {
  /**
   * 
   */
  it('emit mundane event stream', function () {
    matchOutput(
      function* (input: UnidocEventFlow) {
        yield input.thenTagStart('first.test', '\\first.test')
        yield input.thenTagStart('second#identifier', '\\second#identifier')
        yield input.thenWhitespace('  \t\t\r\n')
        yield input.thenWord('someword')
        yield input.thenTagStart('third', '\\third')
        yield input.thenTagEnd()
      },
      function* (output: UnidocEventFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(output.thenTagStart('first.test', '\\first.test'))
        expect(yield).toBeNext(output.thenTagStart('second#identifier', '\\second#identifier'))
        expect(yield).toBeNext(output.thenWhitespace('  \t\t\r\n'))
        expect(yield).toBeNext(output.thenWord('someword'))
        expect(yield).toBeNext(output.thenTagStart('third', '\\third'))
        expect(yield).toBeNext(output.thenTagEnd())
        expect(yield).toBeSuccess()
      }
    )
  })

  /**
   * 
   */
  it('filter simple import tags', function () {
    matchOutput(
      function* (input: UnidocEventFlow) {
        yield input.thenTagStart('first.test', '\\first.test {')
        yield input.thenTagStart('second#identifier', '\\second#identifier {')
        yield input.thenTagStart('import', '\\import {')
        yield input.thenWhitespace('  \t')
        yield input.thenWord('./next/file')
        yield input.thenWhitespace(' \f\t\r\n')
        yield input.thenTagEnd()
        yield input.thenWhitespace('  \t\t\r\n')
        yield input.thenWord('someword')
        yield input.thenTagStart('third', '\\third {')
        yield input.thenTagEnd()
      },
      function* (output: UnidocEventFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(output.thenTagStart('first.test', '\\first.test {'))
        expect(yield).toBeNext(output.thenTagStart('second#identifier', '\\second#identifier {'))
        output.skip('\\import {  \t./next/file \f\t\r\n}')
        expect(yield).toBeNext(output.thenWhitespace('  \t\t\r\n'))
        expect(yield).toBeNext(output.thenWord('someword'))
        expect(yield).toBeNext(output.thenTagStart('third', '\\third {'))
        expect(yield).toBeNext(output.thenTagEnd())
        expect(yield).toBeSuccess()
      }
    )
  })

  /**
   * 
   */
  it('filter aliased import tag', function () {
    matchOutput(
      function* (input: UnidocEventFlow) {
        yield input.thenTagStart('first.test', '\\first.test {')
        yield input.thenTagStart('second#identifier', '\\second#identifier {')
        yield input.thenTagStart('import', '\\import {')
        yield input.thenWhitespace('  \t')
        yield input.thenWord('./next/file')
        yield input.thenWhitespace(' ')
        yield input.thenWord('as')
        yield input.thenWhitespace(' ')
        yield input.thenWord('png')
        yield input.thenWhitespace(' \f\t\r\n')
        yield input.thenTagEnd()
        yield input.thenWhitespace('  \t\t\r\n')
        yield input.thenWord('someword')
        yield input.thenTagStart('third', '\\third {')
        yield input.thenTagEnd()
      },
      function* (output: UnidocEventFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(output.thenTagStart('first.test', '\\first.test {'))
        expect(yield).toBeNext(output.thenTagStart('second#identifier', '\\second#identifier {'))
        output.skip('\\import {  \t./next/file as png \f\t\r\n}')
        expect(yield).toBeNext(output.thenWhitespace('  \t\t\r\n'))
        expect(yield).toBeNext(output.thenWord('someword'))
        expect(yield).toBeNext(output.thenTagStart('third', '\\third {'))
        expect(yield).toBeNext(output.thenTagEnd())
        expect(yield).toBeSuccess()
      }
    )
  })

  /**
   * 
   */
  it('emit malformed import tag', function () {
    matchOutput(
      function* (input: UnidocEventFlow) {
        yield input.thenTagStart('first.test', '\\first.test {')
        yield input.thenTagStart('second#identifier', '\\second#identifier {')
        yield input.thenTagStart('import', '\\import {')
        yield input.thenWhitespace('  \t')
        yield input.thenWord('./next/file')
        yield input.thenWhitespace(' ')
        yield input.thenWord('asPT')
        yield input.thenWhitespace(' ')
        yield input.thenWord('png')
        yield input.thenWhitespace(' \f\t\r\n')
        yield input.thenTagEnd()
        yield input.thenWhitespace('  \t\t\r\n')
        yield input.thenWord('someword')
        yield input.thenTagStart('third', '\\third {')
        yield input.thenTagEnd()
      },
      function* (output: UnidocEventFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(output.thenTagStart('first.test', '\\first.test {'))
        expect(yield).toBeNext(output.thenTagStart('second#identifier', '\\second#identifier {'))
        expect(yield).toBeNext(output.thenTagStart('import', '\\import {'))
        expect(yield).toBeNext(output.thenWhitespace('  \t'))
        expect(yield).toBeNext(output.thenWord('./next/file'))
        expect(yield).toBeNext(output.thenWhitespace(' '))
        expect(yield).toBeNext(output.thenWord('asPT'))
        expect(yield).toBeNext(output.thenWhitespace(' '))
        expect(yield).toBeNext(output.thenWord('png'))
        expect(yield).toBeNext(output.thenWhitespace(' \f\t\r\n'))
        expect(yield).toBeNext(output.thenTagEnd())
        expect(yield).toBeNext(output.thenWhitespace('  \t\t\r\n'))
        expect(yield).toBeNext(output.thenWord('someword'))
        expect(yield).toBeNext(output.thenTagStart('third', '\\third {'))
        expect(yield).toBeNext(output.thenTagEnd())
        expect(yield).toBeSuccess()
      }
    )
  })

  /**
   * 
   */
  it('emits simple import tags', function () {
    matchImports(
      function* (input: UnidocEventFlow) {
        yield input.thenTagStart('first.test', '\\first.test {')
        yield input.thenTagStart('second#identifier', '\\second#identifier {')
        yield input.thenTagStart('import', '\\import {')
        yield input.thenWhitespace('  \t')
        yield input.thenWord('./next/file')
        yield input.thenWhitespace(' \f\t\r\n')
        yield input.thenTagEnd()
        yield input.thenWhitespace('  \t\t\r\n')
        yield input.thenWord('someword')
        yield input.thenTagStart('third', '\\third {')
        yield input.thenTagEnd()
      },
      function* (output: UnidocEventFlow) {
        expect(yield).toBeStart()
        output.skip('\\first.test {\\second#identifier {')

        const result: UnidocImport = new UnidocImport()
        result.origin.concat(output.thenTagStart('import', '\\import {').origin)
        result.origin.concat(output.thenWhitespace('  \t').origin)
        result.origin.concat(output.thenWord('./next/file').origin)
        result.origin.concat(output.thenWhitespace(' \f\t\r\n').origin)
        result.origin.concat(output.thenTagEnd().origin)
        result.identifier = './next/file'

        expect(yield).toBeNext(result)
        expect(yield).toBeSuccess()
      }
    )
  })

  /**
   * 
   */
  it('emits simple import tags with scheme', function () {
    matchImports(
      function* (input: UnidocEventFlow) {
        yield input.thenTagStart('first.test', '\\first.test {')
        yield input.thenTagStart('second#identifier', '\\second#identifier {')
        yield input.thenTagStart('import', '\\import {')
        yield input.thenWhitespace('  \t')
        yield input.thenWord('http://localhost/content.html')
        yield input.thenWhitespace(' \f\t\r\n')
        yield input.thenTagEnd()
        yield input.thenWhitespace('  \t\t\r\n')
        yield input.thenWord('someword')
        yield input.thenTagStart('third', '\\third {')
        yield input.thenTagEnd()
      },
      function* (output: UnidocEventFlow) {
        expect(yield).toBeStart()
        output.skip('\\first.test {\\second#identifier {')

        const result: UnidocImport = new UnidocImport()
        result.origin.concat(output.thenTagStart('import', '\\import {').origin)
        result.origin.concat(output.thenWhitespace('  \t').origin)
        result.origin.concat(output.thenWord('http://localhost/content.html').origin)
        result.origin.concat(output.thenWhitespace(' \f\t\r\n').origin)
        result.origin.concat(output.thenTagEnd().origin)
        result.scheme = UnidocImportScheme.HTTP
        result.identifier = 'localhost/content.html'

        expect(yield).toBeNext(result)
        expect(yield).toBeSuccess()
      }
    )
  })

  /**
   * 
   */
  it('emits typed imports', function () {
    matchImports(
      function* (input: UnidocEventFlow) {
        yield input.thenTagStart('first.test', '\\first.test {')
        yield input.thenTagStart('second#identifier', '\\second#identifier {')
        yield input.thenTagStart('import', '\\import {')
        yield input.thenWhitespace('  \t')
        yield input.thenWord('./next/file')
        yield input.thenWhitespace(' ')
        yield input.thenWord('as')
        yield input.thenWhitespace(' ')
        yield input.thenWord('image/png')
        yield input.thenWhitespace(' \f\t\r\n')
        yield input.thenTagEnd()
        yield input.thenWhitespace('  \t\t\r\n')
        yield input.thenWord('someword')
        yield input.thenTagStart('third', '\\third {')
        yield input.thenTagEnd()
      },
      function* (output: UnidocEventFlow) {
        expect(yield).toBeStart()
        output.skip('\\first.test {\\second#identifier {')

        const result: UnidocImport = new UnidocImport()
        result.origin.concat(output.thenTagStart('import', '\\import {').origin)
        result.origin.concat(output.thenWhitespace('  \t').origin)
        result.origin.concat(output.thenWord('./next/file').origin)
        result.origin.concat(output.thenWhitespace(' ').origin)
        result.origin.concat(output.thenWord('as').origin)
        result.origin.concat(output.thenWhitespace(' ').origin)
        result.origin.concat(output.thenWord('image/png').origin)
        result.origin.concat(output.thenWhitespace(' \f\t\r\n').origin)
        result.origin.concat(output.thenTagEnd().origin)
        result.identifier = './next/file'
        result.mime = 'image/png'

        expect(yield).toBeNext(result)
        expect(yield).toBeSuccess()
      }
    )
  })

  /**
   * 
   */
  it('emits typed imports with extension', function () {
    matchImports(
      function* (input: UnidocEventFlow) {
        yield input.thenTagStart('first.test', '\\first.test {')
        yield input.thenTagStart('second#identifier', '\\second#identifier {')
        yield input.thenTagStart('import', '\\import {')
        yield input.thenWhitespace('  \t')
        yield input.thenWord('./next/file')
        yield input.thenWhitespace(' ')
        yield input.thenWord('as')
        yield input.thenWhitespace(' ')
        yield input.thenWord('png')
        yield input.thenWhitespace(' \f\t\r\n')
        yield input.thenTagEnd()
        yield input.thenWhitespace('  \t\t\r\n')
        yield input.thenWord('someword')
        yield input.thenTagStart('third', '\\third {')
        yield input.thenTagEnd()
      },
      function* (output: UnidocEventFlow) {
        expect(yield).toBeStart()
        output.skip('\\first.test {\\second#identifier {')

        const result: UnidocImport = new UnidocImport()
        result.origin.concat(output.thenTagStart('import', '\\import {').origin)
        result.origin.concat(output.thenWhitespace('  \t').origin)
        result.origin.concat(output.thenWord('./next/file').origin)
        result.origin.concat(output.thenWhitespace(' ').origin)
        result.origin.concat(output.thenWord('as').origin)
        result.origin.concat(output.thenWhitespace(' ').origin)
        result.origin.concat(output.thenWord('png').origin)
        result.origin.concat(output.thenWhitespace(' \f\t\r\n').origin)
        result.origin.concat(output.thenTagEnd().origin)
        result.identifier = './next/file'
        result.mime = 'image/png'

        expect(yield).toBeNext(result)
        expect(yield).toBeSuccess()
      }
    )
  })
})
