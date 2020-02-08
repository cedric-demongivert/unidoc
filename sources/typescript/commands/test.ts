import { Source } from '@library/Source'
import { Context } from '@library/context/Context'

const source : Source = new Source()

source.fromString(require('../../../local/test.unidoc').default)
source.parse().forEach(
  function (context : Context) : void {
    console.log(context.toString())
  }
)
