export function toSequenceString(sequence: Iterable<any>): string {
  let result = '['

  const iterator: Iterator<any> = sequence[Symbol.iterator]()
  let iteration: IteratorResult<any>
  let index: number = 0

  while (!(iteration = iterator.next()).done) {
    result += '\r\n'
    result += '  #'
    result += index
    result += ' - '
    result += iteration.value.toString()
    index += 1
  }

  if (index > 0) {
    result += '\r\n'
  }

  result += ']'

  return result
}
