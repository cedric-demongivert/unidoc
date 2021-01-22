import * as Benchmark from 'benchmark'

const CARRIAGE_RETURN: number = '\r'.codePointAt(0)!
const NEW_LINE: number = '\n'.codePointAt(0)!
const FORM_FEED: number = '\f'.codePointAt(0)!
const TABULATION: number = '\t'.codePointAt(0)!
const SPACE: number = ' '.codePointAt(0)!
const A: number = 'A'.codePointAt(0)!
const B: number = 'B'.codePointAt(0)!
const C: number = 'C'.codePointAt(0)!
const D: number = 'D'.codePointAt(0)!
const E: number = 'E'.codePointAt(0)!

const chars: number[] = [
  CARRIAGE_RETURN,
  NEW_LINE,
  FORM_FEED,
  TABULATION,
  SPACE,
  A,
  B,
  C,
  D,
  E
]

const suite: Benchmark.Suite = new Benchmark.Suite

function isWhitespaceWithSwitch(symbol: number): boolean {
  switch (symbol) {
    case CARRIAGE_RETURN:
    case NEW_LINE:
    case FORM_FEED:
    case TABULATION:
    case SPACE:
      return true
    default:
      return false
  }
}

function isWhitespaceWithDisjunction(symbol: number): boolean {
  return (
    symbol === CARRIAGE_RETURN ||
    symbol === NEW_LINE ||
    symbol === FORM_FEED ||
    symbol === TABULATION ||
    symbol === SPACE
  )
}

suite.add('#isWhitespaceWithSwitch', function() {
  const symbol: number = chars[Math.floor(Math.random() * chars.length)]
  isWhitespaceWithSwitch(symbol)
})

suite.add('#isWhitespaceWithDisjunction', function() {
  const symbol: number = chars[Math.floor(Math.random() * chars.length)]
  isWhitespaceWithDisjunction(symbol)
})

suite.on('complete', function(this: Benchmark.Suite) {
  this.forEach(function print(value: Benchmark) {
    console.log(value.name + ' executed ' + Benchmark.formatNumber(value.count) + ' times')
    console.log('  average execution time: ' + Benchmark.formatNumber(value.stats.variance))
    console.log('  variance: ' + Benchmark.formatNumber(value.stats.variance))
    console.log('  deviation: ' + Benchmark.formatNumber(value.stats.variance))
  })

  console.log('Fastest is ' + this.filter('fastest').map('name'))
})

suite.run({ async: false })
