export function count(elements: Iterable<any>): number {
  const iterator: Iterator<any> = elements[Symbol.iterator]()
  let result: number = 0

  while (!iterator.next().done) {
    result += 1
  }

  return result
}
