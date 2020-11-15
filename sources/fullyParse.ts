import { UnidocProducer } from './producer/UnidocProducer'
import { UnidocProducerEvent } from './producer/UnidocProducerEvent'
import { UnidocEvent } from './event/UnidocEvent'
import { UnidocParser } from './parser/UnidocParser'
import { UnidocLexer } from './lexer/UnidocLexer'

import { UnidocStream } from './stream/UnidocStream'
import { UnidocImportationFilter } from './stream/UnidocImportationFilter'

export function fullyParse(input: UnidocStream): UnidocProducer<UnidocEvent> {
  const lexer: UnidocLexer = new UnidocLexer()
  const parser: UnidocParser = new UnidocParser()
  const importer: UnidocImportationFilter = new UnidocImportationFilter()

  lexer.subscribe(input)
  parser.subscribe(lexer)
  importer.subscribe(parser)

  importer.importations.addEventListener(
    UnidocProducerEvent.PRODUCTION, input.import.bind(input)
  )

  importer.importations.addEventListener(
    UnidocProducerEvent.FAILURE, input.fail.bind(input)
  )

  return importer
}
