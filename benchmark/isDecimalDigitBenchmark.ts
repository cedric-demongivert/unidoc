import * as Benchmark from 'benchmark'

const ZERO: number = '0'.codePointAt(0)!
const ONE: number = '1'.codePointAt(0)!
const TWO: number = '2'.codePointAt(0)!
const THREE: number = '3'.codePointAt(0)!
const FOUR: number = '4'.codePointAt(0)!
const FIVE: number = '5'.codePointAt(0)!
const SIX: number = '6'.codePointAt(0)!
const SEVEN: number = '7'.codePointAt(0)!
const EIGHT: number = '8'.codePointAt(0)!
const NINE: number = '9'.codePointAt(0)!
const A: number = 'A'.codePointAt(0)!
const B: number = 'B'.codePointAt(0)!
const C: number = 'C'.codePointAt(0)!
const D: number = 'D'.codePointAt(0)!
const E: number = 'E'.codePointAt(0)!
const F: number = 'F'.codePointAt(0)!
const G: number = 'G'.codePointAt(0)!
const H: number = 'H'.codePointAt(0)!
const I: number = 'I'.codePointAt(0)!
const J: number = 'J'.codePointAt(0)!

const chars: number[] = [
  ZERO, ONE, TWO, THREE, FOUR,
  FIVE, SIX, SEVEN, EIGHT, NINE,
  A, B, C, D, E,
  F, G, H, I, J
]

const suite: Benchmark.Suite = new Benchmark.Suite

function isDecimalDigitWithSwitch(symbol: number): boolean {
  switch (symbol) {
    case ZERO:
    case ONE:
    case TWO:
    case THREE:
    case FOUR:
    case FIVE:
    case SIX:
    case SEVEN:
    case EIGHT:
    case NINE:
      return true
    default:
      return false
  }
}

function isDecimalDigitWithRange(symbol: number): boolean {
  return symbol >= ZERO && symbol <= NINE
}

suite.add('#isDigitWithSwitch', function() {
  const symbol: number = chars[Math.floor(Math.random() * chars.length)]
  isDecimalDigitWithSwitch(symbol)
})

suite.add('#isDigitWithRange', function() {
  const symbol: number = chars[Math.floor(Math.random() * chars.length)]
  isDecimalDigitWithRange(symbol)
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
