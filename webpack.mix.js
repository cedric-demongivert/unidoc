const mix = require('laravel-mix')
const TypedocWebpackPlugin = require('typedoc-webpack-plugin')
const package = require('./package.json')

const fileSystem = require('fs')

for (const file of fileSystem.readdirSync('./sources/commands')) {
  mix.ts('./sources/commands/' + file, 'distribution')
}

const externals = ['fs']

for (const name in package.dependencies) {
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
       'library': package.name,
       'libraryTarget': 'umd',
       'globalObject': 'this' // webpack bug
     },
     'module': {
       'rules': [
         { 'test': /\.unidoc$/i, 'use': 'raw-loader' },
       ]
     },
     'plugins': [
       /*new TypedocWebpackPlugin(
         { 'target': 'es6', 'mode': 'file' },
         './sources/typescript'
       )*/
     ]
   })
