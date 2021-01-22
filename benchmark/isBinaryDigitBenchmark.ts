import * as Benchmark from 'benchmark'

const ZERO: number = '0'.codePointAt(0)!
const ONE: number = '1'.codePointAt(0)!
const A: number = 'A'.codePointAt(0)!
const B: number = 'B'.codePointAt(0)!

const chars: number[] = [
  ZERO, ONE, A, B
]

const suite: Benchmark.Suite = new Benchmark.Suite

function isBinaryDigitWithSwitch(symbol: number): boolean {
  switch (symbol) {
    case ZERO:
    case ONE:
      return true
    default:
      return false
  }
}

function isBinaryDigitWithRange(symbol: number): boolean {
  return symbol === ZERO || symbol === ONE
}

suite.add('#isBinaryDigitWithSwitch', function() {
  const symbol: number = chars[Math.floor(Math.random() * chars.length)]
  isBinaryDigitWithSwitch(symbol)
})

suite.add('#isBinaryDigitWithRange', function() {
  const symbol: number = chars[Math.floor(Math.random() * chars.length)]
  isBinaryDigitWithRange(symbol)
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
