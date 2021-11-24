import { Copiable } from '../sources/Copiable'
import { Random } from '../sources/Random'

/**
 * 
 */
describe('Copiable', function () {
  /**
   * 
   */
  class CopiableImplementation implements Copiable {
    /**
     * 
     */
    public value: number

    /**
     *
     */
    public constructor(value: number) {
      this.value = value
    }

    /**
     * @see Copiable.copy
     */
    public copy(toCopy: this): this {
      this.value = toCopy.value
      return this
    }

    /**
     * @see Copiable.equals
     */
    public equals(other: any): boolean {
      if (other == null) return false
      if (other === this) return true

      if (other instanceof CopiableImplementation) {
        return other.value === this.value
      }

      return false
    }
  }

  /**
   * 
   */
  describe('#move', function () {
    /**
     * 
     */
    it('move the origin state to the destination', function () {
      for (let index = 0; index < 20; ++index) {
        const origin: CopiableImplementation = new CopiableImplementation(Random.nextInteger())
        const destination: CopiableImplementation = new CopiableImplementation(Random.nextInteger())

        while (destination.equals(origin)) {
          destination.value = Random.nextInteger()
        }

        expect(origin).not.toBe(destination)
        expect(origin.equals(destination)).toBeFalsy()

        const output: CopiableImplementation = Copiable.move(origin, destination)

        expect(origin).not.toBe(destination)
        expect(output).toBe(destination)
        expect(origin.equals(destination)).toBeTruthy()
      }
    })
  })
})