import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocLocation } from '../UnidocLocation'
import { UnidocParser } from '../parser/UnidocParser'
import { UnidocEvent } from './UnidocEvent'

export class UnidocEventBuffer {
  public readonly events : Pack<UnidocEvent>
  public completed : boolean

  /**
  * Instantiate a new empty token buffer with the given capacity.
  *
  * @param [capacity = 32] - Capacity of the buffer to instantiate.
  */
  public constructor (capacity : number = 32) {
    this.events    = Pack.any(capacity)
    this.completed = false

    this.handleNextEvent = this.handleNextEvent.bind(this)
    this.handleCompletion  = this.handleCompletion.bind(this)
  }

  /**
  * Instantiate and append a new starting block event.
  *
  * @param location - Location of the event into the parent document.
  * @param [configuration = ''] - Identifiers and classes of the resulting block.
  */
  public blockStart (location : UnidocLocation, configuration : string = '') : void {
    this.events.push(UnidocEvent.blockStart(location, configuration))
  }

  /**
  * Instantiate and append a new ending block event.
  *
  * @param location - Location of the event into the parent document.
  */
  public blockEnd (location : UnidocLocation) : void {
    this.events.push(UnidocEvent.blockEnd(location))
  }

  /**
  * Instantiate and append a new word event.
  *
  * @param location - Location of the event into the parent document.
  * @param content - Content of the resulting event.
  */
  public word (location : UnidocLocation, content : string) : void {
    this.events.push(UnidocEvent.word(location, content))
  }

  /**
  * Instantiate and append a new whitespace event.
  *
  * @param location - Location of the event into the parent document.
  * @param content - Content of the resulting event.
  */
  public whitespace (location : UnidocLocation, content : string) : void {
    this.events.push(UnidocEvent.whitespace(location, content))
  }

  /**
  * Instantiate and append a new document starting event.
  *
  * @param location - Location of the event into the parent document.
  */
  public documentStart (location : UnidocLocation) : void {
    this.events.push(UnidocEvent.documentStart(location))
  }

  /**
  * Instantiate and append a new document ending event.
  *
  * @param location - Location of the event into the parent document.
  */
  public documentEnd (location : UnidocLocation) : void {
    this.events.push(UnidocEvent.documentEnd(location))
  }

  /**
  * Instantiate and append a new starting tag event.
  *
  * @param location - Location of the event into the parent document.
  * @param configuration - Type, identifiers and classes of the resulting tag.
  */
  public tagStart (location : UnidocLocation, configuration : string) : void {
    this.events.push(UnidocEvent.tagStart(location, configuration))
  }

  /**
  * Instantiate and append a new ending tag event.
  *
  * @param location - Location of the event into the parent document.
  */
  public tagEnd (location : UnidocLocation) : void {
    this.events.push(UnidocEvent.tagEnd(location))
  }


  /**
  * Handle the emission of the given token.
  *
  * @param event - The event that was emitted.
  */
  public handleNextEvent (event : UnidocEvent) : void {
    this.events.push(event.clone())
  }

  /**
  * Handle the emission of the a completion event.
  */
  public handleCompletion () : void {
    this.completed = true
  }

  /**
  * Listen to the given parser.
  *
  * @param parser - A parser to listen to.
  */
  public listen (parser : UnidocParser) : void {
    parser.addEventListener('event', this.handleNextEvent)
    parser.addEventListener('completion', this.handleCompletion)
  }

  /**
  * Reset this event buffer.
  */
  public clear () : void {
    this.events.clear()
    this.completed = false
  }

  public assert (other : UnidocEventBuffer) : void {
    if (other.completed !== this.completed) {
      throw new Error(
        'Buffers ' + this.toString() + ' and ' + other.toString() + ' are ' +
        'not equals because one is marked as completed and the other not.'
      )
    }

    if (other.events.size !== this.events.size) {
      throw new Error(
        'Buffers ' + this.toString() + ' and ' + other.toString() + ' are ' +
        'not equals because thay contains a different amount of events ' +
        this.events.size + ' !== ' + other.events.size + '.'
      )
    }

    for (let index = 0, size = this.events.size; index < size; ++index) {
      const oldTimestamp : number = this.events.get(index).timestamp
      this.events.get(index).timestamp = other.events.get(index).timestamp

      if (!other.events.get(index).equals(this.events.get(index))) {
        this.events.get(index).timestamp = oldTimestamp

        throw new Error(
          'Buffers ' + this.toString() + ' and ' + other.toString() + ' are ' +
          'not equals because their #' + index + ' event are not equal ' +
          this.events.get(index).toString() + ' !== ' +
          other.events.get(index).toString() + '.'
        )
      } else {
        this.events.get(index).timestamp = oldTimestamp
      }
    }
  }

  /**
  * @see Object.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocEventBuffer) {
      if (other.completed !== this.completed) return false
      if (other.events.size !== this.events.size) return false

      for (let index = 0, size = this.events.size; index < size; ++index) {
        const oldTimestamp : number = this.events.get(index).timestamp
        this.events.get(index).timestamp = other.events.get(index).timestamp

        if (!other.events.get(index).equals(this.events.get(index))) {
          this.events.get(index).timestamp = oldTimestamp

          return false
        } else {
          this.events.get(index).timestamp = oldTimestamp
        }
      }

      return true
    }

    return false
  }
}

export namespace UnidocEventBuffer {
}
