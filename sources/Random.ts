import { Chance } from 'chance'

const BOOLEAN_CONFIGURATION = { likelihood: 50 }
const FLOAT_CONFIGURATION = { min: 0, max: 1 }
const FIXED_FLOAT_CONFIGURATION = { min: 0, max: 1, fixed: 0 }
const INTEGER_CONFIGURATION = { min: -2147483648, max: 2147483647 }

/**
 * Utilities for manipulating random values or instances.
 */
export class Random {
  /**
   * 
   */
  private readonly generator: Chance.Chance

  /**
   * 
   */
  private seed: number

  /**
   * 
   */
  public constructor(seed: number = Date.now()) {
    this.generator = new Chance(seed)
    this.seed = seed
  }

  /**
   * 
   */
  public getSeed(): number {
    return this.seed
  }

  /**
   * 
   */
  public setSeed(seed: number): void {
    this.generator.seed = seed
    this.seed = seed
  }

  /**
   * 
   */
  public nextBoolean(likelihood: number = 50): boolean {
    BOOLEAN_CONFIGURATION.likelihood = likelihood
    return this.generator.bool(BOOLEAN_CONFIGURATION)
  }

  /**
   * 
   */
  public nextFloat(minimum: number = 0, maximum: number = 1, decimals?: number | undefined): number {
    if (decimals == null) {
      FLOAT_CONFIGURATION.min = minimum
      FLOAT_CONFIGURATION.max = maximum
      return this.generator.floating(FLOAT_CONFIGURATION)
    } else {
      FIXED_FLOAT_CONFIGURATION.min = minimum
      FIXED_FLOAT_CONFIGURATION.max = maximum
      FIXED_FLOAT_CONFIGURATION.fixed = decimals
      return this.generator.floating(FIXED_FLOAT_CONFIGURATION)
    }
  }

  /**
   * 
   */
  public nextInteger(minimum: number = -2147483648, maximum: number = 2147483647): number {
    INTEGER_CONFIGURATION.min = minimum
    INTEGER_CONFIGURATION.max = maximum
    return this.generator.integer(INTEGER_CONFIGURATION)
  }

  /**
   * 
   */
  public nextPositiveInteger(maximum: number = 2147483647): number {
    return this.nextInteger(0, maximum)
  }
}

/**
 * 
 */
export namespace Random {
  /**
   * 
   */
  export const CURRENT: Random = new Random()

  /**
   * 
   */
  export function singleton(seed: number = Date.now()): Random {
    CURRENT.setSeed(seed)
    return CURRENT
  }

  /**
   * 
   */
  export const nextBoolean = CURRENT.nextBoolean.bind(CURRENT)

  /**
   * 
   */
  export const nextFloat = CURRENT.nextFloat.bind(CURRENT)

  /**
   * 
   */
  export const nextInteger = CURRENT.nextInteger.bind(CURRENT)

  /**
   * 
   */
  export const nextPositiveInteger = CURRENT.nextPositiveInteger.bind(CURRENT)

  /**
   * A factory that returns random instances of a given class.
   */
  export interface Factory<Value> {
    /**
     * Return a random instance of a given class.
     * 
     * A random factory must comply to the following rules :
     * 
     * - If two calls to a random factory are made with different seeds, the 
     *   resulting instances MUST be different.
     * 
     * - If two calls to a random factory are made with the same seeds, the 
     *   resulting instances MUST be equivalent.
     * 
     * - Each call to a random factory MUST return a different instance.
     * 
     * - The seed parameter of a random factory MAY be equal to null or undefined, 
     *   and, in this situation, the factory MUST choose a seed randomly. The method 
     *   used to select a seed is implementation itself MAY differ from one implementation
     *   to another.
     * 
     * Random factories are designed for testing purposes and the non-respect of the preceding
     * rules may nullify some tests.
     * 
     * @param [seed] - A seed to use for the generation.
     * 
     * @return A random instance of a given class in accordance with the seed.
     */
    (random?: Random): Value
  }
}