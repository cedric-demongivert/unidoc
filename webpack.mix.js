const mix = require('laravel-mix')
const TypedocWebpackPlugin = require('typedoc-webpack-plugin')
const package = require('./package.json')

const fileSystem = require('fs')

for (const file of fileSystem.readdirSync('./sources/typescript/commands')) {
  mix.ts('./sources/typescript/commands/' + file, 'dist')
}

const externals = []

for (const name in package.dependencies) {
  externals.push(new RegExp(`^${name}(\\/.+)?$`))
}

mix.ts('./sources/typescript/index.ts', 'dist')
   .copy('LICENSE.md', 'dist')
   .copy('package.json', 'dist')
   .copy('README.md', 'dist')
   .setPublicPath('dist')
   .disableNotifications()
   .webpackConfig({
     'externals': externals,
     'optimization': {
    		'minimize': false
     },
     'output': {
       'library': package.name,
       'libraryTarget': 'umd',
       'globalObject': 'this' // webpack bug
     },
     'plugins': [
       new TypedocWebpackPlugin(
         { 'target': 'es6', 'mode': 'file' },
         './sources/typescript'
       )
     ]
   })
