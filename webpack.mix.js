const mix = require('laravel-mix')
const pckg = require('./package.json')

const externals = []

for (const name in pckg.dependencies) {
  externals.push(new RegExp(`^${name}(\\/.+)?$`))
}

mix.ts('./sources/index.ts', 'distribution')
   .copy('LICENSE.md', 'distribution')
   .copy('package.json', 'distribution')
   .copy('README.md', 'distribution')
   .setPublicPath('distribution')
   .disableNotifications()
   .webpackConfig({
     'externals': externals,
     'optimization': {
    		'minimize': false
     },
     'output': {
       'library': pckg.name,
       'libraryTarget': 'umd',
       'globalObject': 'this' // webpack bug
     }
   })