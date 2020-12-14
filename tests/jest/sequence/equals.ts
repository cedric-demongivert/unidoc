export function equals(a: any, b: any): boolean {
  if (a === b) {
    return true
  } else if (a != null && typeof a === 'object' && a.equals) {
    return a.equals(b)
  } else if (b != null && typeof b === 'object' && b.equals) {
    return b.equals(a)
  } else {
    return false
  }
}
