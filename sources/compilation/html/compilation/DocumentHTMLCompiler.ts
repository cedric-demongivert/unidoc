import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocEventType } from '../../../event/UnidocEventType'

import { Paragraph } from '../../../standard/Paragraph'

import { ListenableHTMLCompiler } from './ListenableHTMLCompiler'
import { HTMLEvent } from '../event/HTMLEvent'

import { ParagraphHTMLCompiler } from './ParagraphHTMLCompiler'

export class DocumentHTMLCompiler extends ListenableHTMLCompiler {
  private _paragraph : ParagraphHTMLCompiler
  private _restream : boolean

  /**
  *
  */
  public constructor () {
    super()

    this.handleNextError = this.handleNextError.bind(this)
    this.handleNextEvent = this.handleNextEvent.bind(this)

    this._paragraph = new ParagraphHTMLCompiler()
    this._paragraph.addEventListener('content', this.handleNextEvent)
    this._paragraph.addEventListener('error', this.handleNextError)

    this._restream = false
  }

  /**
  * @see HTMLCompiler.start
  */
  public start () : void {

  }

  /**
  * @see HTMLCompiler.next
  */
  public next (event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.START_TAG:
        if (event.tag === Paragraph.TAG) {
          this._restream = true
          this._paragraph.start()
          this._paragraph.next(event)
        } else if (this._restream) {
          this._paragraph.next(event)
        }
        return
      case UnidocEventType.END_TAG:
        if (event.tag === Paragraph.TAG) {
          this._restream = false
          this._paragraph.next(event)
          this._paragraph.complete()
        } else if (this._restream) {
          this._paragraph.next(event)
        }
        return
      default:
        if (this._restream) {
          this._paragraph.next(event)
        }
        return
    }
  }

  private handleNextEvent (event : HTMLEvent) : void {
    this.publish(event)
  }

  private handleNextError (error : Error) : void {
    this.publishError(error)
  }

  /**
  * @see HTMLCompiler.complete
  */
  public complete () : void {
    if (this._restream) {
      this._paragraph.complete()
    }

    this.publishCompletion()
  }

  /**
  * @see HTMLCompiler.reset
  */
  public reset () : void {
    this._paragraph.reset()
    this._restream = false
  }

  /**
  * @see HTMLCompiler.clear
  */
  public clear () : void {
    super.clear()
    this._paragraph.reset()
    this._restream = false
  }
}
