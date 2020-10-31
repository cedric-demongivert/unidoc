import { toArray } from 'rxjs/operators'

import { stream } from '../../../sources/producer/stream'
import { compile } from '../../../sources/compilation/native/compile'

import { UnidocEventProducer } from '../../../sources/event/UnidocEventProducer'
import { StreamTreeCompiler } from '../../../sources/compilation/native/compilation/StreamTreeCompiler'

describe('StreamTreeCompiler', function () {
  it('compile unidoc files into stream tree objects', function (done : Function) {
    const document : UnidocEventProducer = new UnidocEventProducer()

    stream(document)
      .pipe(compile(new StreamTreeCompiler()))
      .pipe(toArray())
      .forEach(function (value : any[]) : void {
        expect(value.length).toBe(1)
        expect(value[0]).toEqual({
           tag: 'document',
           identifier: 'first',
           classes: [],
           content: [
              {
                 tag: 'whitespace',
                 identifier: '',
                 classes: [],
                 content: '\r\n\r\n\t'
              },
              {
                 tag: 'name',
                 identifier: '',
                 classes: [],
                 content: [
                    {
                       tag: 'whitespace',
                       identifier: '',
                       classes: [],
                       content: ' '
                    },
                    {
                       tag: 'word',
                       identifier: '',
                       classes: [],
                       content: 'robert'
                    },
                    {
                       tag: 'whitespace',
                       identifier: '',
                       classes: [],
                       content: ' '
                    }
                 ]
              },
              {
                 tag: 'whitespace',
                 identifier: '',
                 classes: [],
                 content: '\r\n\t'
              },
              {
                 tag: 'age',
                 identifier: '',
                 classes: [],
                 content: [
                    {
                       tag: 'whitespace',
                       identifier: '',
                       classes: [],
                       content: ' '
                    },
                    {
                       tag: 'word',
                       identifier: '',
                       classes: [],
                       content: '20'
                    },
                    {
                       tag: 'whitespace',
                       identifier: '',
                       classes: [],
                       content: ' '
                    }
                 ]
              },
              {
                 tag: 'whitespace',
                 identifier: '',
                 classes: [],
                 content: '\r\n\t'
              },
              {
                 tag: 'address',
                 identifier: '',
                 classes: [
                    'home',
                    'smart-home'
                 ],
                 content: [
                    {
                       tag: 'whitespace',
                       identifier: '',
                       classes: [],
                       content: '\r\n\t\t'
                    },
                    {
                       tag: 'number',
                       identifier: '',
                       classes: [],
                       content: [
                          {
                             tag: 'whitespace',
                             identifier: '',
                             classes: [],
                             content: ' '
                          },
                          {
                             tag: 'word',
                             identifier: '',
                             classes: [],
                             content: '10'
                          },
                          {
                             tag: 'whitespace',
                             identifier: '',
                             classes: [],
                             content: ' '
                          }
                       ]
                    },
                    {
                       tag: 'whitespace',
                       identifier: '',
                       classes: [],
                       content: '\r\n\t\t'
                    },
                    {
                       tag: 'city',
                       identifier: '',
                       classes: [],
                       content: [
                          {
                             tag: 'whitespace',
                             identifier: '',
                             classes: [],
                             content: ' '
                          },
                          {
                             tag: 'word',
                             identifier: '',
                             classes: [],
                             content: 'lorem'
                          },
                          {
                             tag: 'whitespace',
                             identifier: '',
                             classes: [],
                             content: ' '
                          }
                       ]
                    },
                    {
                       tag: 'whitespace',
                       identifier: '',
                       classes: [],
                       content: '\r\n\t\t'
                    },
                    {
                       tag: 'state',
                       identifier: '',
                       classes: [],
                       content: [
                          {
                             tag: 'whitespace',
                             identifier: '',
                             classes: [],
                             content: ' '
                          },
                          {
                             tag: 'word',
                             identifier: '',
                             classes: [],
                             content: 'florida'
                          },
                          {
                             tag: 'whitespace',
                             identifier: '',
                             classes: [],
                             content: ' '
                          }
                       ]
                    },
                    {
                       tag: 'whitespace',
                       identifier: '',
                       classes: [],
                       content: '\r\n\t'
                    }
                 ]
              },
              {
                 tag: 'whitespace',
                 identifier: '',
                 classes: [],
                 content: '\r\n\t'
              }
           ]
        })
        done()
      })

    document.tag('document#first', function () {
      document.produceString('\r\n\r\n\t')
      document.tag('name', function () {
        document.produceString(' robert ')
      })
      document.produceString('\r\n\t')
      document.tag('age', function () {
        document.produceString(' 20 ')
      })
      document.produceString('\r\n\t')
      document.tag('address.home.smart-home', function () {
        document.produceString('\r\n\t\t')
        document.tag('number', function () {
          document.produceString(' 10 ')
        })
        document.produceString('\r\n\t\t')
        document.tag('city', function () {
          document.produceString(' lorem ')
        })
        document.produceString('\r\n\t\t')
        document.tag('state', function () {
          document.produceString(' florida ')
        })
        document.produceString('\r\n\t')
      })
      document.produceString('\r\n\t')
      document.complete()
    })
  })
})
