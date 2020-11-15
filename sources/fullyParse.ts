import { UnidocProducer } from './producer/UnidocProducer'
import { UnidocEvent } from './event/UnidocEvent'
import { UnidocParser } from './parser/UnidocParser'
import { UnidocLexer } from './lexer/UnidocLexer'

import { UnidocStream } from './stream/UnidocStream'
import { UnidocImportationFilter } from './stream/UnidocImportationFilter'

export function fullyParse(input: UnidocStream): UnidocProducer<UnidocEvent> {
  const lexer: UnidocLexer = new UnidocLexer()
  const parser: UnidocParser = new UnidocParser()
  const importer: UnidocImportationFilter = new UnidocImportationFilter(input)

  lexer.subscribe(input)
  parser.subscribe(lexer)
  importer.subscribe(parser)

  return importer
}
