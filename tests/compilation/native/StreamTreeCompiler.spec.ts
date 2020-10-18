import { toArray, map } from 'rxjs/operators'

import { stream } from '../../../sources/stream'
import { tokenize } from '../../../sources/tokenize'
import { parse } from '../../../sources/parse'
import { compile } from '../../../sources/compilation/native/compile'
import { StreamTreeCompiler } from '../../../sources/compilation/native/compilation/StreamTreeCompiler'

describe('StreamTreeCompiler', function () {
  it('compile unidoc files into stream tree objects', function (done : Function) {
    stream.string(`
      \\document#first

      \\name { robert }
      \\age { 20 }
      \\address.home.smart-home {
        \\number { 10 }
        \\city { lorem }
        \\state { florida }
      }
    `).pipe(tokenize())
      .pipe(parse())
      .pipe(map(x => x.event))
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
                 content: '\n\n      '
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
                 content: '\n      '
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
                 content: '\n      '
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
                       content: '\n        '
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
                       content: '\n        '
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
                       content: '\n        '
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
                       content: '\n      '
                    }
                 ]
              },
              {
                 tag: 'whitespace',
                 identifier: '',
                 classes: [],
                 content: '\n    '
              }
           ]
        })
        done()
      })
  })
})
