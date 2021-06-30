import { UnidocProducer } from './stream/UnidocProducer'
import { UnidocProducerEvent } from './stream/UnidocProducerEvent'
import { UnidocEvent } from './event/UnidocEvent'
import { UnidocParser } from './parser/UnidocParser'
import { UnidocLexer } from './lexer/UnidocLexer'

import { UnidocContext } from './context/UnidocContext'
import { UnidocImportationFilter } from './context/UnidocImportationFilter'

export function fullyParse(input: UnidocContext): UnidocProducer<UnidocEvent> {
  const lexer: UnidocLexer = new UnidocLexer()
  const parser: UnidocParser = new UnidocParser()
  const importer: UnidocImportationFilter = new UnidocImportationFilter()

  lexer.subscribe(input)
  parser.subscribe(lexer)
  importer.subscribe(parser)

  importer.importations.on(
    UnidocProducerEvent.NEXT, input.import.bind(input)
  )

  importer.importations.on(
    UnidocProducerEvent.FAILURE, input.fail.bind(input)
  )

  return importer
}
